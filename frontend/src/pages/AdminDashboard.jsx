import React, { useState, useEffect } from 'react';
import API from '../api/api';

const CATEGORIES = ['Starters', 'Main Course', 'Desserts', 'Beverages'];
const STATUSES = ['Placed', 'Preparing', 'Served', 'Paid'];

function AdminDashboard() {
  // Tabs: 'orders' or 'menu'
  const [activeTab, setActiveTab] = useState('orders');

  // Dashboard Stats
  const [stats, setStats] = useState({
    todayOrderCount: 0,
    todayRevenue: 0,
    totalOrdersCount: 0,
    totalLifetimeRevenue: 0,
  });

  // Orders State
  const [orders, setOrders] = useState([]);

  // Menu Items State
  const [menuItems, setMenuItems] = useState([]);

  // Shared Add/Edit Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Main Course',
    price: '',
    isVeg: true,
    isAvailable: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsRes, ordersRes, menuRes] = await Promise.all([
        API.get('/orders/stats'),
        API.get('/orders'),
        API.get('/menu'),
      ]);

      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setMenuItems(menuRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  // Status Updater
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      // Refresh stats
      const statsRes = await API.get('/orders/stats');
      setStats(statsRes.data);
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  // Form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Start editing menu item
  const handleStartEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Main Course',
      price: '',
      isVeg: true,
      isAvailable: true,
    });
  };

  // Submit Menu Item (Add or Update)
  const handleSubmitMenuItem = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Name and price are required');
      return;
    }

    try {
      if (editingId) {
        // Update existing item
        const res = await API.put(`/menu/${editingId}`, formData);
        setMenuItems((prev) =>
          prev.map((item) => (item._id === editingId ? res.data : item))
        );
        setMessage('Menu item updated successfully!');
      } else {
        // Add new item
        const res = await API.post('/menu', formData);
        setMenuItems((prev) => [...prev, res.data]);
        setMessage('New menu item added successfully!');
      }
      handleCancelEdit();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving menu item');
    }
  };

  // Delete Menu Item
  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await API.delete(`/menu/${id}`);
      setMenuItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting menu item');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Staff / Admin Dashboard</h2>
          <p style={{ color: '#718096' }}>Live table orders, revenue stats, and menu management</p>
        </div>
        <button onClick={loadDashboardData} className="btn-secondary">
          Refresh Data
        </button>
      </div>

      {error && <div className="alert-box">{error}</div>}
      {message && <div style={{ background: '#f0fff4', color: '#276749', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>{message}</div>}

      {/* 1. Dashboard Metrics Summary */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Today's Orders</h4>
          <p className="stat-value">{stats.todayOrderCount}</p>
        </div>
        <div className="stat-card">
          <h4>Today's Revenue</h4>
          <p className="stat-value">₹{stats.todayRevenue}</p>
        </div>
        <div className="stat-card">
          <h4>All-Time Orders</h4>
          <p className="stat-value">{stats.totalOrdersCount}</p>
        </div>
        <div className="stat-card">
          <h4>All-Time Revenue</h4>
          <p className="stat-value">₹{stats.totalLifetimeRevenue}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
        <button
          className={`filter-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Manage Table Orders ({orders.length})
        </button>
        <button
          className={`filter-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          Manage Menu Items ({menuItems.length})
        </button>
      </div>

      {loading && <p>Loading data...</p>}

      {/* 2. TAB: Orders Management */}
      {activeTab === 'orders' && (
        <div>
          <h3>All Customer Orders</h3>
          {orders.length === 0 ? (
            <p style={{ marginTop: '12px' }}>No orders placed yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Table</th>
                  <th>Customer</th>
                  <th>Items Ordered</th>
                  <th>Total</th>
                  <th>Current Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-5).toUpperCase()}</td>
                    <td><strong>Table {order.tableNumber}</strong></td>
                    <td>{order.customer?.name || 'Customer'}</td>
                    <td>
                      {order.items.map((i, idx) => (
                        <div key={idx} style={{ fontSize: '13px' }}>
                          {i.name} × {i.quantity}
                        </div>
                      ))}
                    </td>
                    <td><strong>₹{order.total}</strong></td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 3. TAB: Menu Management */}
      {activeTab === 'menu' && (
        <div>
          {/* Shared Add / Edit Menu Form */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <h3>{editingId ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
            <form onSubmit={handleSubmitMenuItem} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '12px', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500' }}>Item Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Masala Dosa"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '500' }}>Category</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '500' }}>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  placeholder="150"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', paddingBottom: '10px' }}>
                <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="checkbox"
                    name="isVeg"
                    checked={formData.isVeg}
                    onChange={handleInputChange}
                  />
                  Veg?
                </label>

                <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                  />
                  In Stock?
                </label>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>
                  {editingId ? 'Update Item' : 'Add Item'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Menu Items Table */}
          <h3>Menu Items List</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.isVeg ? 'Veg' : 'Non-Veg'}</td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.category}</td>
                  <td>₹{item.price}</td>
                  <td>{item.isAvailable ? 'In Stock' : 'Out of Stock'}</td>
                  <td>
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="btn-secondary"
                      style={{ fontSize: '12px', padding: '3px 8px', marginRight: '6px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item._id)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
