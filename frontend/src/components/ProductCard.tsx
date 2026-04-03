import React from 'react';
import { useStore } from '../context/StoreContext';

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image, description }) => {
  const { addToCart } = useStore();

  return (
    <div className="bg-brand-white border border-[#e2e2e2] rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(26,26,26,0.08)] transition-transform hover:-translate-y-1">
      <div className="bg-[#F5F5F5] p-4 flex justify-center items-center h-[240px]">
        <img 
          src={image} 
          alt={name} 
          className="max-h-full max-w-full object-contain mix-blend-multiply" 
        />
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl uppercase tracking-widest text-[#1a1a1a] mb-2 font-sans" style={{ fontFamily: "'Outfit', 'Montserrat', sans-serif", letterSpacing: "0.1em" }}>
          {name}
        </h3>
        <p className="text-[#6b6b6b] text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">${price.toFixed(2)}</span>
          <button 
            onClick={() => addToCart({ id, name, price, quantity: 1, image })}
            className="btn-primary px-6 py-2 rounded-full cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
