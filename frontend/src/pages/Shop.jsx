import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { motion } from 'framer-motion';

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
    
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-tertiary border-t-transparent rounded-full"
      />
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-error-container text-on-error-container p-6 border border-error/20 flex flex-col items-center gap-4">
        <span className="material-symbols-outlined text-4xl">error</span>
        <p className="font-headline font-bold uppercase tracking-widest">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-surface min-h-screen pb-32">
      <div className="relative pt-32 pb-20 px-8 bg-surface-container-low border-b border-outline/10">
        <div className="max-w-screen-2xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-label text-tertiary text-sm tracking-[0.3em] uppercase mb-4 block"
          >
            Boutique
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-headline font-black text-5xl md:text-7xl tracking-tighter uppercase mb-6"
          >
            PERFORMANCE <br/> RETAIL.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-body text-xl italic text-on-surface/60 max-w-2xl leading-relaxed"
          >
            Curated high-end cycling and running gear, apparel, and performance nutrition from niche international brands.
          </motion.p>
          
          {/* Controls */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
              <input
                type="text"
                className="w-full bg-surface border border-outline/20 pl-12 pr-4 py-4 font-label text-xs uppercase tracking-widest outline-none focus:border-on-surface transition-colors"
                placeholder="Search momentum..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:col-span-4">
              <select 
                className="w-full bg-surface border border-outline/20 px-4 py-4 font-label text-xs uppercase tracking-widest outline-none focus:border-on-surface transition-colors appearance-none cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="CYCLING_GEAR">Cycling Gear</option>
                <option value="APPAREL">Apparel</option>
                <option value="NUTRITION">Nutrition</option>
              </select>
            </div>
            <div className="md:col-span-2 flex items-center justify-center bg-tertiary text-on-tertiary font-label text-xs tracking-widest uppercase">
              {filteredProducts.length} Results
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 mt-20">
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredProducts.map((p, idx) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
        
        {filteredProducts.length === 0 && (
          <div className="py-40 text-center border-2 border-dashed border-outline/10">
            <p className="text-outline font-body italic text-2xl">No performance matches found for your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
