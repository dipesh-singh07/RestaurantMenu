import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';
import mockData from '../data/mockData.json';

function CartPage({ cart, updateQuantity, removeFromCart, clearCart, user }) {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await API.get('/tables');
      if (res.data && res.data.length > 0) {
        setTables(res.data);
        setSelectedTable(res.data[0].tableNumber);
      } else {
        setTables(mockData.tables);
        setSelectedTable(mockData.tables[0].tableNumber);
      }
    } catch (err) {
      setTables(mockData.tables);
      setSelectedTable(mockData.tables[0].tableNumber);
    }
  };

  // Cart calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
  const total = Math.round((subtotal + tax) * 100) / 100;

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!selectedTable) {
      setError('Please select a table');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderPayload = {
        tableNumber: Number(selectedTable),
        items: cart.map((item) => ({
          menuItem: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      await API.post('/orders', orderPayload);
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Your Cart is Empty</h2>
        <p style={{ margin: '12px 0 20px', color: '#718096' }}>Add some delicious food from our menu!</p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '10px 20px', textDecoration: 'none' }}>
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</h2>

      {error && <div className="alert-box" style={{ marginTop: '16px' }}>{error}</div>}

      <div className="cart-layout" style={{ marginTop: '20px' }}>
        {/* Cart Item List */}
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item._id} className="cart-item-row">
              <div>
                <h4 style={{ marginBottom: '4px' }}>
                  {item.name}
                  <span style={{ fontSize: '12px', fontWeight: 'normal', color: item.isVeg ? '#2e7d32' : '#c62828', marginLeft: '6px' }}>
                    ({item.isVeg ? 'Veg' : 'Non-Veg'})
                  </span>
                </h4>
                <p style={{ color: '#718096', fontSize: '14px' }}>
                  ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn-danger"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Table Selection */}
        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label>Select Table</label>
            <select
              className="form-control"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              {tables.map((t) => (
                <option key={t._id || t.tableNumber} value={t.tableNumber}>
                  Table {t.tableNumber} ({t.capacity} Seats)
                </option>
              ))}
            </select>
          </div>

          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="summary-row">
            <span>GST (5%):</span>
            <span>₹{tax}</span>
          </div>

          <div className="summary-total">
            <span>Grand Total:</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: '18px', padding: '12px' }}
          >
            {loading ? 'Placing Order...' : user ? 'Confirm & Place Order' : 'Login to Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
