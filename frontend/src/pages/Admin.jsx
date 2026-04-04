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
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['COFFEE', 'FOOD', 'CYCLING_GEAR', 'APPAREL', 'NUTRITION'];

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');
  
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
    // Auto-scroll to form top if needed, but we probably just want to show the form
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

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-8">
        <div className="max-w-md w-full bg-surface-container-high border border-outline/10 p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-error mb-6">lock</span>
          <h1 className="font-headline font-black text-3xl uppercase tracking-tighter mb-4">Access Restricted</h1>
          <p className="font-body text-outline italic mb-8">You are attempting to access the high-performance partner portal without proper authorization.</p>
          <Link to="/login" className="btn-orange w-full">Authenticate Session</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pb-32">
       <div className="relative pt-32 pb-20 px-8 bg-surface-container-low border-b border-outline/10">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="font-label text-tertiary text-sm tracking-[0.3em] uppercase mb-4 block">Operation Dashboard</span>
            <h1 className="font-headline font-black text-5xl md:text-7xl tracking-tighter uppercase mb-2">PARTNER PORTAL.</h1>
            <p className="font-body text-outline italic">Integrated management system for THE ROLLOUT infrastructure.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-surface-container-high px-6 py-4 border border-outline/10 text-center">
              <div className="font-label text-[10px] tracking-widest uppercase text-outline mb-1">Catalog</div>
              <div className="font-label text-2xl font-black">{products.length}</div>
            </div>
            <div className="bg-surface-container-high px-6 py-4 border border-outline/10 text-center">
              <div className="font-label text-[10px] tracking-widest uppercase text-outline mb-1">Orders</div>
              <div className="font-label text-2xl font-black">{orders.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 mt-12">
        <div className="flex gap-8 border-b border-outline/10 mb-12">
          {[
            { id: 'inventory', label: 'Inventory', icon: 'inventory' },
            { id: 'orders', label: 'Order Flow', icon: 'list_alt' },
            { id: 'gallery', label: 'Life Cycle', icon: 'camera' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 flex items-center gap-2 font-label text-xs tracking-widest uppercase transition-all relative ${activeTab === tab.id ? 'text-on-surface' : 'text-outline hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-[2px] bg-tertiary" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-error-container text-on-error-container p-4 mb-8 font-label text-[10px] tracking-widest uppercase border border-error/20"
            >
              System Error: {error}
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div 
              key="inventory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-4">
                <div className="bg-surface-container-low p-8 border border-outline/10 sticky top-32">
                  <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-8 pb-4 border-b border-outline/10">
                    {editingId ? 'Edit Configuration' : 'Sync New Asset'}
                  </h3>
                  <form onSubmit={handleCreate} className="flex flex-col gap-6">
                    <div>
                      <label className="font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-2 block">Asset Name</label>
                      <input
                        className="w-full bg-surface border border-outline/20 px-4 py-3 font-body text-on-surface outline-none focus:border-on-surface transition-colors"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-2 block">Category</label>
                        <select
                          className="w-full bg-surface border border-outline/20 px-4 py-3 font-label text-[10px] tracking-widest uppercase outline-none focus:border-on-surface transition-colors appearance-none"
                          value={form.category}
                          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-2 block">Initial Stock</label>
                        <input
                          type="number"
                          className="w-full bg-surface border border-outline/20 px-4 py-3 font-body text-on-surface outline-none focus:border-on-surface transition-colors"
                          value={form.stock}
                          onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-2 block">Base Price (AED)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full bg-surface border border-outline/20 px-4 py-3 font-body text-on-surface outline-none focus:border-on-surface transition-colors"
                        value={form.price}
                        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-2 block">Technical Notes</label>
                      <textarea
                        className="w-full bg-surface border border-outline/20 px-4 py-3 font-body text-on-surface outline-none focus:border-on-surface transition-colors"
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-2 block">Visual Asset</label>
                      <input
                        type="file"
                        className="w-full text-[10px] font-label uppercase tracking-widest"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                      />
                    </div>
                    
                    <div className="flex gap-4 mt-4">
                      <button 
                        type="submit" 
                        disabled={saving}
                        className="flex-grow bg-on-surface text-surface py-4 font-headline text-xs tracking-widest uppercase hover:bg-tertiary transition-all"
                      >
                        {saving ? 'Transmitting...' : editingId ? 'Commit Update' : 'Sync Asset'}
                      </button>
                      {editingId && (
                        <button 
                          type="button" 
                          onClick={resetProductForm}
                          className="px-6 border border-outline/20 text-outline hover:text-on-surface transition-all"
                        >
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="bg-surface-container-low border border-outline/10 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-high border-b border-outline/10">
                      <tr>
                        <th className="px-6 py-4 font-label text-[10px] tracking-widest uppercase text-outline">Reference</th>
                        <th className="px-6 py-4 font-label text-[10px] tracking-widest uppercase text-outline">Category</th>
                        <th className="px-6 py-4 font-label text-[10px] tracking-widest uppercase text-outline text-right">Price</th>
                        <th className="px-6 py-4 font-label text-[10px] tracking-widest uppercase text-outline text-center">Status</th>
                        <th className="px-6 py-4 font-label text-[10px] tracking-widest uppercase text-outline text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline/5">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-on-surface/[0.02] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img src={getProductImage(p)} alt="" className="w-10 h-10 object-cover bg-surface-container-high" />
                              <span className="font-headline font-bold text-sm uppercase tracking-tight">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-label text-[10px] tracking-widest uppercase text-outline">{p.category}</td>
                          <td className="px-6 py-4 font-label text-sm text-right">{formatAED(p.price)}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block px-2 py-1 font-label text-[8px] tracking-[0.2em] uppercase border ${Number(p.stock) > 0 ? 'bg-tertiary-container/30 border-tertiary/20 text-tertiary' : 'bg-error-container/30 border-error/20 text-error'}`}>
                              {Number(p.stock) > 0 ? `${p.stock} Units` : 'Depleted'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleEdit(p)} className="text-outline hover:text-on-surface transition-colors p-2">
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="text-outline hover:text-error transition-colors p-2">
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-8"
            >
              {ordersLoading ? (
                <div className="py-20 flex justify-center">
                  <div className="w-8 h-8 border-2 border-tertiary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="py-40 text-center border-2 border-dashed border-outline/10">
                  <p className="text-outline font-body italic text-xl">No order flow detected.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-surface-container-low border border-outline/10 p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-outline/10">
                      <div>
                        <span className="font-label text-[10px] tracking-widest uppercase text-outline mb-1 block">Reference Flow</span>
                        <h4 className="font-headline font-black text-2xl tracking-tighter uppercase">ID #{order.id}</h4>
                        <span className="font-body text-xs text-outline italic">Origin point: {order.userId}</span>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="font-label text-[10px] tracking-widest uppercase text-outline mb-1 block">Accumulated Total</span>
                          <span className="font-headline font-bold text-xl">{formatAED(order.total)}</span>
                        </div>
                        <div className="h-10 w-px bg-outline/10" />
                        <div className="flex items-center gap-3">
                          <select
                            className="bg-surface border border-outline/20 px-4 py-2 font-label text-[10px] tracking-widest uppercase outline-none focus:border-on-surface"
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                          </select>
                          <button
                            onClick={() => saveOrder(order)}
                            disabled={orderSavingId === order.id}
                            className="bg-on-surface text-surface px-6 py-2 font-headline font-bold text-[10px] tracking-widest uppercase hover:bg-tertiary transition-all disabled:opacity-50"
                          >
                            {orderSavingId === order.id ? 'Syncing...' : 'Update'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr>
                            <th className="font-label text-[10px] tracking-widest uppercase text-outline pb-4">Asset ID</th>
                            <th className="font-label text-[10px] tracking-widest uppercase text-outline pb-4">Price Point</th>
                            <th className="font-label text-[10px] tracking-widest uppercase text-outline pb-4">Quantity</th>
                            <th className="font-label text-[10px] tracking-widest uppercase text-outline pb-4 text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="font-body divide-y divide-outline/5">
                          {(order.items || []).map(item => (
                            <tr key={item.id}>
                              <td className="py-4 text-sm font-bold uppercase tracking-tight">{item.productId}</td>
                              <td className="py-4 text-sm">{formatAED(item.unitPrice)}</td>
                              <td className="py-4">
                                <input
                                  type="number"
                                  min="1"
                                  className="bg-transparent border border-outline/10 px-3 py-1 w-20 text-sm focus:border-on-surface outline-none"
                                  value={item.quantity}
                                  onChange={(e) => handleOrderItemQtyChange(order.id, item.id, e.target.value)}
                                />
                              </td>
                              <td className="py-4 text-sm font-bold text-right">{formatAED(item.unitPrice * item.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div 
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              <div className="lg:col-span-4">
                 <div className="bg-surface-container-low p-8 border border-outline/10 sticky top-32">
                  <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-8 pb-4 border-b border-outline/10">Capture Influx</h3>
                  <form onSubmit={handleGalleryUpload} className="flex flex-col gap-6">
                    <div>
                      <label className="font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-2 block">Multicast Upload</label>
                      <input
                        type="file"
                        className="w-full text-[10px] font-label uppercase tracking-widest"
                        accept="image/*"
                        multiple
                        required
                        onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
                      />
                      <p className="mt-2 text-[10px] text-outline italic">Select high-performance assets for the lifestyle sequence.</p>
                    </div>
                    <button 
                      type="submit" 
                      disabled={gallerySaving || galleryFiles.length === 0}
                      className="bg-on-surface text-surface py-4 font-headline text-xs tracking-widest uppercase hover:bg-tertiary transition-all disabled:opacity-50"
                    >
                      {gallerySaving ? 'Propagating...' : `Upload ${galleryFiles.length || ''} Assets`}
                    </button>
                  </form>
                </div>
              </div>
              <div className="lg:col-span-8">
                {galleryLoading ? (
                  <div className="py-20 flex justify-center">
                    <div className="w-8 h-8 border-2 border-tertiary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {gallery.map(g => (
                      <motion.div 
                        layout
                        key={g.id} 
                        className="group relative aspect-square bg-surface-container-low overflow-hidden border border-outline/10"
                      >
                        <img src={g.imageUrl} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                        <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => handleDeleteGallery(g.id)}
                            className="bg-error text-white p-3 rounded-full hover:scale-110 transition-transform"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    {gallery.length === 0 && (
                      <div className="col-span-full py-40 text-center border-2 border-dashed border-outline/10">
                        <p className="text-outline font-body italic text-xl">No visual feedback assets found.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
