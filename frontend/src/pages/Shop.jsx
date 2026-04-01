import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/api.js';
import ProductCard from '../components/ProductCard.jsx';

const SHOP_CATEGORIES = ['CYCLING_GEAR', 'APPAREL', 'NUTRITION'];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all = await fetchProducts();
        if (!cancelled) {
          setProducts(all.filter((p) => SHOP_CATEGORIES.includes(p.category)));
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

  if (loading) return <p className="text-muted">Loading shop…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <section className="section-shell mb-4">
        <div className="section-kicker">BOUTIQUE</div>
        <h1 className="section-title mb-2">Performance Retail</h1>
        <p className="text-muted-premium mb-2">
          Curated high-end cycling and running gear, apparel, and performance nutrition from niche international brands.
        </p>
        <div className="badge bg-orange text-white mb-3">{products.length} Products Available</div>
      </section>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {products.map((p) => (
          <div key={p.id} className="col">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      {products.length === 0 && <p className="text-muted">No products in this category yet.</p>}
    </div>
  );
}
