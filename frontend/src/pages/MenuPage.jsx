import React, { useState, useEffect } from 'react';
import API from '../api/api';
import MenuCard from '../components/MenuCard';
import mockData from '../data/mockData.json';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages'];

function MenuPage({ onAddToCart }) {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await API.get('/menu');
      setItems(res.data);
    } catch (err) {
      console.warn('Backend not running yet, falling back to mockData:', err.message);
      setItems(mockData.menuItems);
    } finally {
      setLoading(false);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesVeg = vegOnly ? item.isVeg : true;
    return matchesCategory && matchesVeg;
  });

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <h2>Explore Our Menu</h2>
        <p style={{ color: '#718096' }}>Freshly prepared delicious food for your table</p>
      </div>

      {/* Filter controls */}
      <div className="filter-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}

        <label className="veg-toggle">
          <input
            type="checkbox"
            checked={vegOnly}
            onChange={(e) => setVegOnly(e.target.checked)}
          />
          <span>Veg Only</span>
        </label>
      </div>

      {loading ? (
        <p>Loading menu...</p>
      ) : filteredItems.length === 0 ? (
        <p>No food items found matching your filter.</p>
      ) : (
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <MenuCard key={item._id} item={item} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuPage;
