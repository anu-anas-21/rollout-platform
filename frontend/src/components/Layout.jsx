import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();

  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active fw-semibold' : ''}`;

  return (
    <>
      {/* HEADER / NAVBAR */}
      <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container-fluid px-4 px-lg-5">
          <Link className="navbar-brand" to="/">
            <span className="brand-kicker">THE</span>
            <span className="rollout">
              R<span className="o-special" />LL<span className="o-special" />UT
            </span>
            <small className="d-block brand-subtitle">Cycle Cafe & Boutique</small>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#nav"
            aria-controls="nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="nav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className={linkClass} to="/" end>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={linkClass} to="/shop">
                  Shop
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={linkClass} to="/cafe">
                  Café
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={linkClass} to="/events">
                  Events
                </NavLink>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <NavLink className={linkClass} to="/admin">
                    Admin
                  </NavLink>
                </li>
              )}
            </ul>
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              <li className="nav-item">
                <NavLink className={linkClass} to="/cart">
                  Cart {itemCount > 0 && <span className="badge bg-orange ms-1" style={{ backgroundColor: '#ff914d' }}>{itemCount}</span>}
                </NavLink>
              </li>
              {user ? (
                <>
                  <li className="nav-item">
                    <span className="navbar-text small text-white-50 d-block py-2">
                      {user.email}
                    </span>
                  </li>
                  <li className="nav-item">
                    <button type="button" className="btn btn-orange-outline btn-sm-premium" onClick={logout}>
                      Log out
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <NavLink className="btn btn-orange-outline btn-sm-premium" to="/login">
                    Log in
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {/* MAIN CONTENT AREA */}
      <main className="container-fluid px-4 px-lg-5 py-4">
        <Outlet />
      </main>
      {/* FOOTER */}
      <footer className="mt-auto py-5 rollout-footer">
        <div className="container-fluid px-4 px-lg-5">
          <div className="footer-grid">
            <div>
              <h5 className="footer-title">THE ROLLOUT</h5>
              <p className="small mb-0 text-footer">
                A performance-led cafe, boutique, and community hub for cycling and active lifestyles.
              </p>
            </div>
            <div>
              <h6 className="footer-heading">Location</h6>
              <p className="small mb-0 text-footer">Shop 6, The Walk, Al Forzan, Khalifa City, Abu Dhabi</p>
            </div>
            <div>
              <h6 className="footer-heading">Explore</h6>
              <div className="small d-flex flex-column gap-1">
                <Link to="/shop">Shop</Link>
                <Link to="/cafe">Cafe</Link>
                <Link to="/events">Events</Link>
              </div>
            </div>
          </div>
          <div className="small text-center text-footer mt-4 pt-3 border-top border-light-subtle">
            THE ROLLOUT Cycle Cafe & Boutique - Designed for flow, performance, and community.
          </div>
        </div>
      </footer>
    </>
  );
}
