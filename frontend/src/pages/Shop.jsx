import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/api.js';
import ProductCard from '../components/ProductCard.jsx';

const SHOP_CATEGORIES = ['CYCLING_GEAR', 'APPAREL', 'NUTRITION'];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all = await fetchProducts();
        if (!cancelled) {
          const shopProducts = all.filter((p) => SHOP_CATEGORIES.includes(p.category));
          setProducts(shopProducts);
          setFilteredProducts(shopProducts);
        }
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || e.message || 'Failed to load products');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let filtered = products;
    
    // Filter by category
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  if (loading) return <p className="text-muted">Loading shop…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <section className="section-shell mb-4">
        <div className="section-kicker">BOUTIQUE</div>
        <h1 className="section-title mb-2">Performance Retail</h1>
        <p className="text-muted-premium mb-3">
          Curated high-end cycling and running gear, apparel, and performance nutrition from niche international brands.
        </p>
        
        {/* Search and Filter Controls */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select 
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="CYCLING_GEAR">Cycling Gear</option>
              <option value="APPAREL">Apparel</option>
              <option value="NUTRITION">Nutrition</option>
            </select>
          </div>
          <div className="col-md-2">
            <div className="badge bg-orange text-white d-block h-100 d-flex align-items-center justify-content-center">
              {filteredProducts.length} Products
            </div>
          </div>
        </div>
      </section>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredProducts.map((p) => (
          <div key={p.id} className="col">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      {filteredProducts.length === 0 && <p className="text-muted">No products found matching your criteria.</p>}
    </div>
  );
}
