import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await API.post('/auth/login', { email, password });
      onLoginSuccess(res.data);
      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2 style={{ marginBottom: '6px', textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: '#718096', marginBottom: '20px', fontSize: '14px' }}>
          Login to manage orders or access admin features
        </p>

        {error && <div className="alert-box">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ padding: '10px', marginTop: '10px' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
          Don't have an account? <Link to="/register" style={{ color: '#e53e3e', fontWeight: 500 }}>Register</Link>
        </p>

        {/* Demo shortcuts box */}
        <div style={{ marginTop: '24px', padding: '12px', background: '#f7fafc', borderRadius: '6px', border: '1px dashed #cbd5e0', fontSize: '13px' }}>
          <strong>Demo Logins (Click to autofill):</strong>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '4px 8px' }}
              onClick={() => fillCredentials('admin@restaurant.com', 'admin123')}
            >
              Fill Admin
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '4px 8px' }}
              onClick={() => fillCredentials('customer@test.com', 'customer123')}
            >
              Fill Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
