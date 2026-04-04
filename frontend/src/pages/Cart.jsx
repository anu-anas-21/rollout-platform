import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { placeOrder } from '../api/api.js';
import { formatAED } from '../utils/money.js';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { lines, total, setQuantity, removeLine, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setMessage('');
    setError('');
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    if (lines.length === 0) return;
    setSubmitting(true);
    try {
      const payload = {
        userId: user.id,
        items: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
      };
      const order = await placeOrder(payload);
      clearCart();
      setMessage(`Order #${order.id} placed. Total ${formatAED(order.total)}.`);
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (lines.length === 0 && !message) {
    return (
      <div className="bg-surface min-h-screen pt-32 px-8 flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <span className="material-symbols-outlined text-8xl text-outline/20 mb-8">shopping_bag</span>
          <h1 className="font-headline font-black text-5xl uppercase tracking-tighter mb-4">Your bag is empty</h1>
          <p className="font-body text-outline italic text-lg mb-12">Performance begins with the right kit. Start your selection.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="bg-on-surface text-surface px-8 py-4 font-headline text-xs tracking-widest uppercase hover:bg-tertiary transition-all">Shop Collection</Link>
            <Link to="/cafe" className="border border-outline/30 text-on-surface px-8 py-4 font-headline text-xs tracking-widest uppercase hover:bg-on-surface hover:text-surface transition-all">Fuel Menu</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pb-32">
       <div className="relative pt-32 pb-20 px-8 bg-surface-container-low border-b border-outline/10">
        <div className="max-w-6xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-label text-tertiary text-sm tracking-[0.3em] uppercase mb-4 block"
          >
            Checkout
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-headline font-black text-5xl md:text-7xl tracking-tighter uppercase mb-6"
          >
            YOUR SELECTION.
          </motion.h1>
          <AnimatePresence>
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-tertiary-container text-on-tertiary-container p-6 border border-tertiary/20 flex items-center gap-4 mt-8"
              >
                <span className="material-symbols-outlined">check_circle</span>
                <p className="font-headline font-bold uppercase tracking-widest">{message}</p>
              </motion.div>
            )}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-error-container text-on-error-container p-6 border border-error/20 flex items-center gap-4 mt-8"
              >
                <span className="material-symbols-outlined">warning</span>
                <p className="font-headline font-bold uppercase tracking-widest">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {!message && (
        <div className="max-w-6xl mx-auto px-8 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <div className="flex flex-col gap-12">
              <AnimatePresence>
                {lines.map((line) => (
                  <motion.div 
                    key={line.product.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col sm:flex-row gap-8 pb-12 border-b border-outline/10 group"
                  >
                    <div className="w-full sm:w-40 aspect-square bg-surface-container-low overflow-hidden">
                      <img 
                        src={line.product.imageUrl || 'https://via.placeholder.com/150'} 
                        alt={line.product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-label text-[10px] tracking-widest uppercase text-tertiary mb-2 block">{line.product.category}</span>
                          <h3 className="font-headline font-black text-2xl uppercase tracking-tighter">{line.product.name}</h3>
                        </div>
                        <button 
                          onClick={() => removeLine(line.product.id)}
                          className="material-symbols-outlined text-outline hover:text-error transition-colors"
                        >
                          close
                        </button>
                      </div>
                      <p className="font-body text-outline italic text-sm mb-8">{line.product.description}</p>
                      
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center border border-outline/20">
                          <button 
                            onClick={() => setQuantity(line.product.id, Math.max(1, line.quantity - 1))}
                            className="px-4 py-2 hover:bg-surface-container-low transition-colors"
                          >
                            -
                          </button>
                          <span className="px-6 py-2 font-label text-sm border-x border-outline/20">{line.quantity}</span>
                          <button 
                            onClick={() => setQuantity(line.product.id, line.quantity + 1)}
                            className="px-4 py-2 hover:bg-surface-container-low transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="font-label text-xs tracking-widest uppercase text-outline mb-1">Subtotal</div>
                          <div className="font-label text-xl font-black">{formatAED(Number(line.product.price) * line.quantity)}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <aside className="lg:col-span-4 self-start sticky top-32">
            <div className="bg-surface-container-low p-8 border border-outline/10">
              <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-8 pb-4 border-b border-outline/10">Summary</h3>
              
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between font-label text-xs tracking-widest uppercase text-outline">
                  <span>Subtotal</span>
                  <span>{formatAED(total)}</span>
                </div>
                <div className="flex justify-between font-label text-xs tracking-widest uppercase text-outline">
                  <span>Shipping</span>
                  <span className="text-tertiary">Complimentary</span>
                </div>
                <div className="pt-4 mt-4 border-t border-outline/10 flex justify-between items-end">
                  <span className="font-headline font-black text-xl uppercase tracking-tighter">Total</span>
                  <span className="font-label text-3xl font-black">{formatAED(total)}</span>
                </div>
              </div>

              {!user && (
                <div className="bg-on-surface/5 p-4 mb-6 text-center border border-on-surface/10">
                  <p className="font-body text-xs italic text-outline">Authentication required to finalize momentum.</p>
                </div>
              )}

              <button
                disabled={submitting || lines.length === 0}
                onClick={handleCheckout}
                className="w-full bg-on-surface text-surface py-5 font-headline text-xs tracking-widest uppercase hover:bg-tertiary transition-all disabled:opacity-50"
              >
                {submitting ? 'Transmitting...' : user ? 'Finalize Order' : 'Identify to Checkout'}
              </button>
              
              <Link to="/shop" className="block text-center mt-6 font-label text-[10px] tracking-widest uppercase text-outline hover:text-on-surface transition-colors">
                Continue Selection
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
