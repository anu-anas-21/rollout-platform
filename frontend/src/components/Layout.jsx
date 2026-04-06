import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Cafe', path: '/cafe' },
    { name: 'Events', path: '/events' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  const linkClass = ({ isActive }) =>
    `text-sm tracking-widest uppercase font-headline transition-colors ${
      isActive 
        ? 'text-on-surface font-bold' 
        : 'text-outline hover:text-on-surface'
    }`;

  return (
    <div className="min-h-screen flex flex-col font-body">
      {/* Top Navigation Shell */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'py-4 bg-surface/80 glass-nav shadow-lg' : 'py-6 bg-transparent'
        }`}
      >
        <div className="flex justify-between items-center w-full px-8 max-w-screen-2xl mx-auto">
          <Link to="/" className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-on-surface uppercase font-headline leading-none">THE ROLLOUT</span>
            <span className="text-[10px] font-label tracking-[0.2em] text-outline uppercase mt-0.5">Cycle Cafe & Boutique</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.path} className={linkClass}>
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-outline hover:text-on-surface transition-colors" data-icon="search">search</button>
            <Link 
              to="/cart" 
              className="relative text-outline hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-accent text-on-accent text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-label"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden lg:block text-[10px] font-label text-outline uppercase tracking-[0.2em]">{user.email}</span>
                <button 
                  onClick={logout}
                  className="bg-accent text-white px-6 py-2 rounded-lg font-headline text-[10px] tracking-widest uppercase hover:opacity-80 transition-all duration-300 shadow-md"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="border border-accent/40 text-accent px-6 py-2 rounded-lg font-headline text-[10px] tracking-widest uppercase hover:bg-accent hover:text-white transition-all duration-300"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 text-white w-full border-t border-white/5 py-16 px-8 md:px-12">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-white uppercase font-headline leading-none">THE ROLLOUT</span>
              <span className="text-[10px] font-label tracking-[0.2em] text-zinc-500 uppercase mt-1">Cycle Cafe & Boutique</span>
            </div>
            <p className="font-body text-zinc-400 text-sm leading-relaxed max-w-sm">
              A performance-led café, boutique, and community hub for cycling and active lifestyles.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h5 className="font-headline font-bold text-[10px] tracking-[0.3em] uppercase text-tertiary mb-2">Location</h5>
              <p className="text-zinc-400 text-xs leading-relaxed font-label uppercase tracking-wider">
                Shop 6, The Walk,<br/>
                Al Forzan, Khalifa City,<br/>
                Abu Dhabi
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h5 className="font-headline font-bold text-[10px] tracking-[0.3em] uppercase text-tertiary mb-2">Explore</h5>
              <Link className="text-zinc-400 hover:text-white transition-colors font-label text-xs uppercase tracking-widest" to="/shop">Shop</Link>
              <Link className="text-zinc-400 hover:text-white transition-colors font-label text-xs uppercase tracking-widest" to="/cafe">Cafe</Link>
              <Link className="text-zinc-400 hover:text-white transition-colors font-label text-xs uppercase tracking-widest" to="/events">Events</Link>
            </div>
          </div>

          <div>
            <h5 className="font-headline font-bold text-[10px] tracking-[0.3em] uppercase text-tertiary mb-6">Designed for flow, performance, and community.</h5>
            <div className="flex border-b border-white/10 py-2">
              <input 
                className="bg-transparent border-none focus:ring-0 w-full font-label text-[10px] uppercase tracking-[0.3em] text-white placeholder-zinc-700 outline-none" 
                placeholder="JOIN THE PELOTON" 
                type="email"
              />
              <button className="material-symbols-outlined text-tertiary hover:text-white transition-colors">arrow_forward</button>
            </div>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-label tracking-[0.4em] uppercase text-zinc-600 italic">
          <div>THE ROLLOUT Cycle Cafe & Boutique - Designed for flow, performance, and community.</div>
          <div className="mt-4 md:mt-0">Abu Dhabi © 2026</div>
        </div>
      </footer>
    </div>
  );
}
