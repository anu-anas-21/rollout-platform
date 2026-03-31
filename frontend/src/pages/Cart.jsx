import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { placeOrder } from '../api/api.js';
import { formatAED } from '../utils/money.js';

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
      <div className="section-shell">
        <h1 className="section-title mb-2">Cart</h1>
        <p className="text-muted-premium">Your cart is empty.</p>
        <Link to="/shop" className="btn btn-orange me-2">
          Go to shop
        </Link>
        <Link to="/cafe" className="btn btn-orange-outline bg-white">
          Cafe menu
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="section-shell mb-4">
        <div className="section-kicker">CHECKOUT</div>
        <h1 className="section-title mb-0">Cart</h1>
      </section>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!message && (
        <>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.product.id}>
                    <td>
                      <strong>{line.product.name}</strong>
                      <div className="small text-muted">{line.product.category}</div>
                    </td>
                    <td>{formatAED(line.product.price)}</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        className="form-control form-control-sm"
                        style={{ width: '4.5rem' }}
                        value={line.quantity}
                        onChange={(e) => setQuantity(line.product.id, Number(e.target.value))}
                      />
                    </td>
                    <td>{formatAED(Number(line.product.price) * line.quantity)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeLine(line.product.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fs-5">
            Total: <strong>{formatAED(total)}</strong>
          </p>
          {!user && (
            <p className="text-muted small">
              <Link to="/login">Log in</Link> to place your order.
            </p>
          )}
          <button
            type="button"
            className="btn btn-orange"
            disabled={submitting || lines.length === 0}
            onClick={handleCheckout}
          >
            {submitting ? 'Placing order…' : 'Checkout'}
          </button>
        </>
      )}
    </div>
  );
}
