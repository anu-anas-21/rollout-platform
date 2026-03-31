import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login, register } from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

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
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <h1 className="h2 mb-3">{mode === 'login' ? 'Log in' : 'Create account'}</h1>
        <p className="text-muted small">
          Demo: <code>admin@rollout.cafe</code> / <code>admin123</code> (admin) or{' '}
          <code>demo@rollout.cafe</code> / <code>demo123</code>
        </p>
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${mode === 'login' ? 'active' : ''}`}
              onClick={() => setMode('login')}
            >
              Log in
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${mode === 'register' ? 'active' : ''}`}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </li>
        </ul>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="card p-4">
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Register'}
          </button>
        </form>
        <p className="mt-3 small text-muted text-center">
          <Link to="/">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
