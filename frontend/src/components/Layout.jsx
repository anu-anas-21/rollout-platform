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
    { name: 'Shop', path: '/shop' },
    { name: 'Home', path: '/' },
    { name: 'Cafe', path: '/cafe' },
    { name: 'Events', path: '/events' },
    { name: 'Cart', path: '/cart' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Partner Portal', path: '/admin' });
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
          <Link to="/" className="text-2xl font-black tracking-tighter text-on-surface uppercase font-headline">
            THE ROLLOUT
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
                <span className="hidden lg:block text-xs font-label text-outline uppercase tracking-wider">{user.email.split('@')[0]}</span>
                <button 
                  onClick={logout}
                  className="bg-accent text-on-accent px-6 py-2 font-headline text-xs tracking-widest uppercase hover:opacity-80 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-accent text-on-accent px-6 py-2 font-headline text-xs tracking-widest uppercase hover:opacity-80 transition-all duration-300"
              >
                Login
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
      <footer className="bg-surface-container-highest/20 dark:bg-zinc-950 w-full border-t border-outline/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-24 max-w-screen-2xl mx-auto">
          <div className="md:col-span-1">
            <div className="text-xl font-black text-on-surface uppercase font-headline mb-8 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-accent to-outline">
              THE ROLLOUT
            </div>
            <p className="font-body text-outline italic text-lg leading-relaxed mb-6">
              Join the peloton. Be the first to know when we open our doors in Abu Dhabi.
            </p>
            <div className="flex gap-4">
              <a className="text-outline hover:text-tertiary transition-colors" href="#"><span className="material-symbols-outlined">share</span></a>
              <a className="text-outline hover:text-tertiary transition-colors" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <h5 className="font-headline font-bold text-sm tracking-widest uppercase mb-4 text-on-surface">Explore</h5>
            <Link className="text-outline hover:text-accent transition-colors font-label text-sm uppercase tracking-wider" to="/shop">Shop</Link>
            <Link className="text-outline hover:text-accent transition-colors font-label text-sm uppercase tracking-wider" to="/cafe">Cafe</Link>
            <Link className="text-outline hover:text-accent transition-colors font-label text-sm uppercase tracking-wider" to="/events">Events</Link>
            <Link className="text-outline hover:text-accent transition-colors font-label text-sm uppercase tracking-wider" to="/cart">Cart</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h5 className="font-headline font-bold text-sm tracking-widest uppercase mb-4 text-on-surface">Legal</h5>
            <a className="text-outline hover:text-accent transition-colors font-label text-sm uppercase tracking-wider" href="#">Privacy</a>
            <a className="text-outline hover:text-accent transition-colors font-label text-sm uppercase tracking-wider" href="#">Terms</a>
          </div>

          <div>
            <h5 className="font-headline font-bold text-sm tracking-widest uppercase mb-4 text-on-surface">Newsletter</h5>
            <div className="flex border-b border-outline/30 py-2">
              <input 
                className="bg-transparent border-none focus:ring-0 w-full font-label text-xs uppercase tracking-widest outline-none" 
                placeholder="EMAIL ADDRESS" 
                type="email"
              />
              <button className="material-symbols-outlined text-accent hover:text-on-surface transition-colors">arrow_forward</button>
            </div>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-12 py-8 flex flex-col md:flex-row justify-between items-center border-t border-outline/10">
          <div className="text-outline font-label text-[10px] tracking-[0.3em] uppercase mb-4 md:mb-0">
            © 2026 THE ROLLOUT. ABU DHABI. COMING MARCH 2026.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="font-label text-[10px] tracking-[0.3em] uppercase text-outline">Launch Countdown: 114 Days</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
