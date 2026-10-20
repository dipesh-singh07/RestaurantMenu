import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Components & Pages
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const navigate = useNavigate();

  // 1. Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // 2. Auth State (Persisted in localStorage)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  // Cart Handlers
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci._id === item._id);
      if (existing) {
        return prevCart.map((ci) =>
          ci._id === item._id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((ci) => (ci._id === itemId ? { ...ci, quantity: newQty } : ci))
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((ci) => ci._id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // Auth Handlers
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <Navbar cartCount={totalCartCount} user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<MenuPage onAddToCart={addToCart} />} />
        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              user={user}
            />
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute user={user}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/register"
          element={<RegisterPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
