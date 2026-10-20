import React, { useState, useEffect } from 'react';
import API from '../api/api';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/orders/myorders');
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>My Orders</h2>
          <p style={{ color: '#718096' }}>Track your table orders and preparation status</p>
        </div>
        <button onClick={fetchOrders} className="btn-secondary">
          Refresh Status
        </button>
      </div>

      {error && <div className="alert-box">{error}</div>}

      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3>No Orders Placed Yet</h3>
          <p style={{ color: '#718096', marginTop: '6px' }}>When you place an order at a table, it will show up here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #edf2f7', paddingBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: 0 }}>Table {order.tableNumber}</h4>
                  <span style={{ fontSize: '12px', color: '#718096' }}>
                    Order #{order._id.slice(-6).toUpperCase()} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <span className={`status-badge status-${order.status}`}>
                  {order.status}
                </span>
              </div>

              <div style={{ margin: '14px 0' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #edf2f7', paddingTop: '10px', fontSize: '14px' }}>
                <span style={{ color: '#718096' }}>Subtotal: ₹{order.subtotal} | GST (5%): ₹{order.tax}</span>
                <strong style={{ fontSize: '16px' }}>Total: ₹{order.total}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
