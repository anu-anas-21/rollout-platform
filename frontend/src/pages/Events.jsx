import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createEvent, fetchEvents } from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function Events() {
  const { user, isAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setError('');
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (e) {
      setError(e.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.date) return;
    setSaving(true);
    setError('');
    try {
      let dateStr = form.date;
      if (dateStr && dateStr.length === 16) dateStr = `${dateStr}:00`;
      await createEvent({
        title: form.title,
        description: form.description,
        date: dateStr,
        location: form.location,
      });
      setForm({ title: '', description: '', date: '', location: '' });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not create event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen pb-32">
      <div className="relative pt-32 pb-20 px-8 bg-surface-container-low border-b border-outline/10">
        <div className="max-w-screen-2xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-label text-tertiary text-sm tracking-[0.3em] uppercase mb-4 block"
          >
            Community
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-headline font-black text-5xl md:text-7xl tracking-tighter uppercase mb-6"
          >
            RIDES, RUNS <br/> & WORKSHOPS.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-body text-xl italic text-on-surface/60 max-w-2xl leading-relaxed"
          >
            The RollOut exists to build connection through shared movement, education, and culture. Join the peloton.
          </motion.p>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-8 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-error-container text-on-error-container p-4 mb-8 font-label text-xs tracking-widest uppercase border border-error/20"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-2 border-tertiary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {events.map((ev, idx) => (
                <motion.div 
                  key={ev.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-surface-container-lowest border border-outline/10 p-8 group hover:border-tertiary transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h2 className="font-headline font-black text-2xl uppercase tracking-tighter group-hover:text-tertiary transition-colors">
                      {ev.title}
                    </h2>
                    <div className="font-label text-xs tracking-widest uppercase text-tertiary bg-tertiary-container px-3 py-1">
                      {formatDate(ev.date)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-outline font-label text-[10px] tracking-widest uppercase mb-4">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {ev.location}
                  </div>
                  {ev.description && (
                    <p className="font-body text-on-surface/70 leading-relaxed max-w-3xl italic border-l-2 border-outline/10 pl-6 py-2">
                      {ev.description}
                    </p>
                  )}
                </motion.div>
              ))}
              {events.length === 0 && (
                <div className="py-32 text-center border-2 border-dashed border-outline/10">
                  <p className="text-outline font-body italic text-xl">No tracks found. Launching soon.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="lg:col-span-4">
          {isAdmin ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container-high p-8 sticky top-32"
            >
              <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mb-8 pb-4 border-b border-outline/10">
                Post Momentum
              </h3>
              <form onSubmit={handleCreate} className="flex flex-col gap-6">
                <div>
                  <label className="font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-2 block">Event Title</label>
                  <input
                    className="w-full bg-surface border border-outline/20 px-4 py-3 font-body text-on-surface outline-none focus:border-on-surface transition-colors"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-2 block">Description</label>
                  <textarea
                    className="w-full bg-surface border border-outline/20 px-4 py-3 font-body text-on-surface outline-none focus:border-on-surface transition-colors"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-2 block">Moment</label>
                    <input
                      type="datetime-local"
                      className="w-full bg-surface border border-outline/20 px-4 py-3 font-body text-sm outline-none focus:border-on-surface transition-colors"
                      value={form.date}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="font-label text-[10px] tracking-[0.2em] uppercase text-outline mb-2 block">Launch Point</label>
                    <input
                      className="w-full bg-surface border border-outline/20 px-4 py-3 font-body text-on-surface outline-none focus:border-on-surface transition-colors"
                      value={form.location}
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-on-surface text-surface py-4 font-headline text-xs tracking-widest uppercase hover:bg-tertiary transition-all"
                >
                  {saving ? 'Transmitting...' : 'Post Event'}
                </button>
              </form>
            </motion.div>
          ) : (
            <div className="bg-surface-container-high p-12 text-center border border-outline/10">
              <span className="material-symbols-outlined text-4xl text-outline mb-6">info</span>
              <h4 className="font-headline font-bold uppercase tracking-widest mb-4">Partner Portal</h4>
              <p className="font-body text-outline text-sm italic mb-8">
                Login via the partner portal to contribute to the community momentum.
              </p>
              <Link to="/login" className="btn-orange-outline w-full">Access Portal</Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
