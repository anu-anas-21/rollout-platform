import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login, register } from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await login({ email, password });
        loginUser(user);
      } else {
        const user = await register({ email, password, role: 'USER' });
        loginUser(user);
      }
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        err.message ||
        'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface">
      {/* Visual Side */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-zinc-900 items-center justify-center p-20">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy-5nRYQ1toHnnNC7UDbqA5ytB6yrdkq-chYIAqqMpfq5HGy99aaCh4XTMnTCExflZrmb_6tsZfLAFYN2erCyegB5wgR6aYjdTx30qIRHOYLZ2ZRpL7IhkpbWcM60GKqOaWUVVbjYW4WKXAQWFvyGQbwKb5hvnHyjlbQ3csRCG6akcV6OD_1zFFYGITNmoGZLWNRmoG0crtuRxZ7u3QEElNyrfzhyqlcufNBvWUqKEJh1L2VyOgcsqMPIGSG26ggdrVhL3I3IQKF63"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-60" />
        <div className="relative z-10 text-center">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white font-headline font-black text-6xl uppercase tracking-tighter mb-4"
          >
            THE <br/> PARTNER <br/> PORTAL
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-zinc-400 font-body italic text-xl"
          >
            Access the high-performance network.
          </motion.p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-20 pt-32 md:pt-20">
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h1 className="font-headline font-black text-4xl uppercase tracking-tighter mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Join the Peloton'}
            </h1>
            <p className="font-body text-outline italic">
              Please enter your credentials to access the platform.
            </p>
          </div>

          <div className="flex gap-8 mb-10 border-b border-outline/10">
            <button 
              onClick={() => setMode('login')}
              className={`pb-4 font-label text-xs tracking-widest uppercase transition-all relative ${mode === 'login' ? 'text-on-surface' : 'text-outline hover:text-on-surface'}`}
            >
              Login
              {mode === 'login' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-tertiary" />}
            </button>
            <button 
              onClick={() => setMode('register')}
              className={`pb-4 font-label text-xs tracking-widest uppercase transition-all relative ${mode === 'register' ? 'text-on-surface' : 'text-outline hover:text-on-surface'}`}
            >
              Register
              {mode === 'register' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-tertiary" />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-error-container text-on-error-container p-4 mb-8 font-label text-[10px] tracking-widest uppercase border border-error/20 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">warning</span>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-2 block">Email Address</label>
              <input
                type="email"
                className="w-full bg-surface-container-low border border-outline/20 px-4 py-4 font-body text-on-surface outline-none focus:border-on-surface transition-colors"
                placeholder="admin@rollout.cafe"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-2 block">Security Token</label>
              <input
                type="password"
                className="w-full bg-surface-container-low border border-outline/20 px-4 py-4 font-body text-on-surface outline-none focus:border-on-surface transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 bg-on-surface text-surface py-5 font-headline text-xs tracking-widest uppercase hover:bg-tertiary transition-all disabled:opacity-50"
            >
              {loading ? 'Transmitting...' : mode === 'login' ? 'Authorize Session' : 'Create Credentials'}
            </button>
          </form>

          <div className="mt-12 p-6 bg-surface-container-lowest border border-outline/10 text-center">
            <p className="font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-2">Technical Support</p>
            <p className="font-body text-sm italic text-outline">
              Demo Admin: admin@rollout.cafe / admin123
            </p>
          </div>
          
          <Link to="/" className="inline-block mt-8 font-label text-[10px] tracking-widest uppercase text-tertiary hover:text-on-surface transition-colors">
            ← Return to Hub
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
