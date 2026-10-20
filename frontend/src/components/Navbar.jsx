import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ cartCount, user, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">QuickBite Cafe</Link>

      <div className="nav-links">
        <Link to="/">Menu</Link>
        <Link to="/cart">
          Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {user && <Link to="/orders">My Orders</Link>}
        {user && user.role === 'admin' && <Link to="/admin">Admin Dashboard</Link>}

        {user ? (
          <div className="nav-user">
            <span>Hi, {user.name}</span>
            <button onClick={onLogout} className="btn-secondary" style={{ padding: '4px 10px' }}>
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
