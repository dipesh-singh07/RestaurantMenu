import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import MenuCard from './components/MenuCard';

const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages'];

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });
  const [menuItems, setMenuItems] = useState([]);
  const [category, setCategory] = useState('All');
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let isActive = true;

    fetch('/data.json')
      .then((response) => {
        if (!response.ok) throw new Error(`Menu request failed: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (isActive) {
          setMenuItems(data);
          setError('');
        }
      })
      .catch((error) => {
        console.error('Could not load menu data:', error);
        if (isActive) setError('Could not load menu data. Check data.json and try again.');
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [reloadCount]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const visibleItems = menuItems.filter((item) =>
    (category === 'All' || item.category === category) &&
    (!vegetarianOnly || item.isVeg)
  );

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="container">
        <h1>Explore Our Menu</h1>
        <p style={{ color: '#718096', marginBottom: 20 }}>Browse dishes from QuickBite Cafe.</p>

        <div className="filter-bar">
          {categories.map((name) => (
            <button
              key={name}
              className={`filter-btn ${category === name ? 'active' : ''}`}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
          <label className="veg-toggle">
            <input
              type="checkbox"
              checked={vegetarianOnly}
              onChange={(event) => setVegetarianOnly(event.target.checked)}
            />
            Veg only
          </label>
        </div>

        {loading ? (
          <p>Loading menu...</p>
        ) : error ? (
          <div className="alert-box">
            {error}{' '}
            <button
              className="btn-secondary"
              onClick={() => {
                setLoading(true);
                setReloadCount((count) => count + 1);
              }}
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {visibleItems.length ? (
              <div className="menu-grid">
                {visibleItems.map((item) => <MenuCard key={item._id} item={item} />)}
              </div>
            ) : (
              <p>No menu items match these filters.</p>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default App;
