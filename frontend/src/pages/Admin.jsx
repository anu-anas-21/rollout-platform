import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  createGalleryImage,
  createProductForm,
  deleteGalleryImage,
  deleteProduct,
  fetchGallery,
  fetchOrders,
  fetchProducts,
  updateOrder,
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
    stock: '',
    category: 'COFFEE',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [gallerySaving, setGallerySaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderSavingId, setOrderSavingId] = useState(null);

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

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
      loadGallery();
      loadOrders();
    } else {
      setLoading(false);
      setGalleryLoading(false);
      setOrdersLoading(false);
    }
  }, [isAdmin]);

  const resetProductForm = () => {
    setForm({ name: '', description: '', price: '', stock: '', category: 'COFFEE' });
    setSelectedImage(null);
    setEditingId(null);
  };

  const buildProductFormData = () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description || '');
    formData.append('price', String(form.price));
    formData.append('stock', String(form.stock));
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
      stock: product.stock ?? 0,
      category: product.category,
    });
    setSelectedImage(null);
  };

  const handleOrderStatusChange = (orderId, status) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const handleOrderItemQtyChange = (orderId, itemId, quantity) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id !== orderId
          ? o
          : {
              ...o,
              items: (o.items || []).map((item) => (item.id === itemId ? { ...item, quantity: Number(quantity || 1) } : item)),
            }
      )
    );
  };

  const saveOrder = async (order) => {
    setOrderSavingId(order.id);
    setError('');
    try {
      await updateOrder(order.id, {
        status: order.status,
        items: (order.items || []).map((item) => ({ itemId: item.id, quantity: Number(item.quantity) })),
      });
      await loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not update order');
    } finally {
      setOrderSavingId(null);
    }
  };

  const galleryGridClass =
    products.length >= 12
      ? 'row row-cols-1 row-cols-md-3 row-cols-xl-4 g-3'
      : products.length >= 6
        ? 'row row-cols-1 row-cols-md-3 g-3'
        : 'row row-cols-1 row-cols-md-2 g-3';

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
        <p className="text-muted-premium mb-0">Add and manage catalog items, stock levels, orders, and community gallery.</p>
        <div className="mt-3 d-flex flex-wrap gap-2">
          <span className="badge text-bg-light">Products: {products.length}</span>
          <span className="badge text-bg-light">Gallery images: {gallery.length}</span>
          <span className="badge text-bg-light">Orders: {orders.length}</span>
        </div>
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
                <label className="form-label">Current stock</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="form-control"
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
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
                    <th>Stock</th>
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
                        <span className={Number(p.stock) > 0 ? 'badge text-bg-success' : 'badge text-bg-danger'}>
                          {Number(p.stock) || 0}
                        </span>
                      </td>
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

      {/* ORDER MANAGEMENT */}
      <section className="section-shell mt-5">
        <div className="section-kicker">ORDER MANAGEMENT</div>
        <h2 className="section-title mb-3">View and Edit Orders</h2>
        {ordersLoading ? (
          <p className="text-muted">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="text-muted">No orders yet.</p>
        ) : (
          <div className="d-grid gap-3">
            {orders.map((order) => (
              <div key={order.id} className="card-premium p-3">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                  <div>
                    <strong>Order #{order.id}</strong> <span className="text-muted">User: {order.userId}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <label className="small text-muted mb-0">Status</label>
                    <select
                      className="form-select form-select-sm"
                      value={order.status}
                      onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                    <button
                      type="button"
                      className="btn btn-sm btn-orange"
                      disabled={orderSavingId === order.id}
                      onClick={() => saveOrder(order)}
                    >
                      {orderSavingId === order.id ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-sm mb-2">
                    <thead>
                      <tr>
                        <th>Item ID</th>
                        <th>Product ID</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(order.items || []).map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.productId}</td>
                          <td>{formatAED(item.unitPrice)}</td>
                          <td style={{ maxWidth: 120 }}>
                            <input
                              type="number"
                              min="1"
                              className="form-control form-control-sm"
                              value={item.quantity}
                              onChange={(e) => handleOrderItemQtyChange(order.id, item.id, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-end fw-semibold">Total: {formatAED(order.total)}</div>
              </div>
            ))}
          </div>
        )}
      </section>

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
              <div className={galleryGridClass}>
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
