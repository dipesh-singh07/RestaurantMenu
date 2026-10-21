function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <span className="nav-brand">QuickBite Cafe</span>
      <div className="nav-links">
        {user && (
          <div className="nav-user">
            <span>Hi, {user.name}</span>
            <button onClick={onLogout} className="btn-secondary" style={{ padding: '4px 10px' }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
