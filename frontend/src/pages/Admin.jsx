import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  createGalleryImage,
  createProductForm,
  deleteGalleryImage,
  deleteProduct,
  fetchGallery,
  fetchProducts,
  updateProductForm,
} from '../api/api.js';
import { formatAED } from '../utils/money.js';
import { getProductImage } from '../utils/productImages.js';

const CATEGORIES = ['COFFEE', 'FOOD', 'CYCLING_GEAR', 'APPAREL', 'NUTRITION'];

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'COFFEE',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [gallerySaving, setGallerySaving] = useState(false);

  const loadProducts = async () => {
    setError('');
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (e) {
      setError(e.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadGallery = async () => {
    try {
      const data = await fetchGallery();
      setGallery(data);
    } catch (e) {
      setError(e.message || 'Failed to load gallery');
    } finally {
      setGalleryLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
      loadGallery();
    } else {
      setLoading(false);
      setGalleryLoading(false);
    }
  }, [isAdmin]);

  const resetProductForm = () => {
    setForm({ name: '', description: '', price: '', category: 'COFFEE' });
    setSelectedImage(null);
    setEditingId(null);
  };

  const buildProductFormData = () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description || '');
    formData.append('price', String(form.price));
    formData.append('category', form.category);
    if (selectedImage) formData.append('image', selectedImage);
    return formData;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const formData = buildProductFormData();
      if (editingId) {
        await updateProductForm(editingId, formData);
      } else {
        await createProductForm(formData);
      }
      resetProductForm();
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not create product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Delete failed');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
    });
    setSelectedImage(null);
  };

  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    if (galleryFiles.length === 0) return;
    setGallerySaving(true);
    setError('');
    try {
      const formData = new FormData();
      galleryFiles.forEach((file) => formData.append('images', file));
      await createGalleryImage(formData);
      setGalleryFiles([]);
      await loadGallery();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not upload gallery image');
    } finally {
      setGallerySaving(false);
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Remove this gallery image?')) return;
    try {
      await deleteGalleryImage(id);
      setGallery((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not remove gallery image');
    }
  };

  if (!user) {
    return (
      <div className="alert alert-warning">
        Please <Link to="/login">log in</Link> as an admin to manage products.
      </div>
    );
  }

  if (!isAdmin) {
    return <div className="alert alert-info">This area is for administrators only.</div>;
  }

  return (
    <div>
      {/* ADMIN HEADER */}
      <section className="section-shell mb-4">
        <div className="section-kicker">ADMIN</div>
        <h1 className="section-title mb-2">Product Management</h1>
        <p className="text-muted-premium mb-0">Add and manage catalog items across cafe and boutique categories.</p>
      </section>
      {error && <div className="alert alert-danger">{error}</div>}
      {/* PRODUCT MANAGEMENT (FORM + TABLE) */}
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card-premium p-4">
            <h2 className="h5 mb-3">Add product</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-2">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Product image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-orange" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Update product' : 'Add product'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline-secondary ms-2" onClick={resetProductForm}>
                  Cancel edit
                </button>
              )}
            </form>
          </div>
        </div>
        <div className="col-lg-7">
          <h2 className="h5 mb-3">All products</h2>
          {loading ? (
            <p className="text-muted">Loading…</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm align-middle bg-white rounded shadow-sm admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={getProductImage(p)} alt={p.name} className="admin-thumb" />
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{p.category}</span>
                      </td>
                      <td>{formatAED(p.price)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => handleEdit(p)}
                        >
                          Edit
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* GALLERY MANAGEMENT DASHBOARD */}
      <section className="section-shell mt-5">
        <div className="section-kicker">GALLERY MANAGEMENT</div>
        <h2 className="section-title mb-3">Community / Lifestyle Images</h2>
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card-premium p-4">
              <h3 className="h5 mb-3">Upload photos</h3>
              <form onSubmit={handleGalleryUpload}>
                <div className="mb-3">
                  <label className="form-label">Images</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    multiple
                    required
                    onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
                  />
                </div>
                <button type="submit" className="btn btn-orange" disabled={gallerySaving || galleryFiles.length === 0}>
                  {gallerySaving ? 'Uploading…' : `Upload ${galleryFiles.length || ''} photos`}
                </button>
              </form>
            </div>
          </div>
          <div className="col-lg-7">
            <h3 className="h5 mb-3">Current gallery</h3>
            {galleryLoading ? (
              <p className="text-muted">Loading…</p>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 g-3">
                {gallery.map((g) => (
                  <div className="col" key={g.id}>
                    <div className="card-premium p-2 h-100">
                      <img src={g.imageUrl} alt="Gallery" className="gallery-thumb" />
                      <div className="p-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteGallery(g.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {gallery.length === 0 && <p className="text-muted">No gallery images uploaded yet.</p>}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
