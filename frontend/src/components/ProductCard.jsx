import { useCart } from '../context/CartContext.jsx';
import { formatAED } from '../utils/money.js';
import { getProductImage } from '../utils/productImages.js';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const stock = Number(product.stock ?? 0);
  const inStock = stock > 0;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-surface-container-lowest border border-outline/10 h-full flex flex-col group transition-shadow hover:shadow-xl p-4"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-container-low mb-6">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
          src={getProductImage(product)}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-surface/90 backdrop-blur-sm text-on-surface text-[10px] font-label font-bold tracking-widest uppercase px-3 py-1 border border-outline/10">
            {product.category.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="flex flex-grow flex-col">
        <h3 className="font-headline font-bold text-lg uppercase tracking-tight mb-2 group-hover:text-tertiary transition-colors">
          {product.name}
        </h3>
        <p className="font-body text-outline text-sm italic mb-6 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-auto pt-6 border-t border-outline/10 flex justify-between items-end">
          <div>
            <div className="font-label text-xl font-black text-on-surface mb-1">
              {formatAED(product.price)}
            </div>
            <div className={`text-[10px] font-label tracking-widest uppercase ${inStock ? 'text-tertiary' : 'text-error'}`}>
              {inStock ? `${stock} AVAILABLE` : 'SOLD OUT'}
            </div>
          </div>
          
          <button
            onClick={() => addToCart(product)}
            disabled={!inStock}
            className={`p-3 transition-all duration-300 flex items-center justify-center ${
              inStock 
                ? 'bg-on-surface text-surface hover:bg-tertiary hover:text-on-tertiary' 
                : 'bg-outline/10 text-outline cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {inStock ? 'shopping_bag' : 'block'}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
