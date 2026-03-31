import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createEvent, fetchEvents } from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

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
    <div>
      <section className="section-shell mb-4">
        <div className="section-kicker">COMMUNITY</div>
        <h1 className="section-title mb-2">Rides, Runs, Workshops</h1>
        <p className="text-muted-premium mb-0">
          The RollOut exists to build connection through shared movement, education, and culture.
        </p>
      </section>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p className="text-muted">Loading events…</p>
      ) : (
        <ul className="list-group mb-4 list-group-rollout">
          {events.map((ev) => (
            <li key={ev.id} className="list-group-item">
              <div className="fw-semibold">{ev.title}</div>
              <div className="small text-muted">{formatDate(ev.date)} — {ev.location}</div>
              {ev.description && <p className="mb-0 mt-2 small">{ev.description}</p>}
            </li>
          ))}
          {events.length === 0 && <li className="list-group-item text-muted">No events scheduled yet.</li>}
        </ul>
      )}

      {isAdmin && (
        <div className="card-premium p-4">
          <h2 className="h5 mb-3">Add event (admin)</h2>
          {!user && (
            <p className="small text-muted">
              <Link to="/login">Log in</Link> as admin to add events.
            </p>
          )}
          <form onSubmit={handleCreate}>
            <div className="mb-2">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Date &amp; time</label>
              <input
                type="datetime-local"
                className="form-control"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                className="form-control"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                required
              />
            </div>
            <button type="submit" className="btn btn-orange" disabled={saving}>
              {saving ? 'Saving…' : 'Post event'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
