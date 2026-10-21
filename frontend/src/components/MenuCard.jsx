function MenuCard({ item }) {
  return (
    <div className="menu-card">
      <div>
        <div className="card-top">
          <span className={item.isVeg ? 'badge-veg' : 'badge-nonveg'}>
            {item.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
          <span className="card-category">{item.category}</span>
        </div>

        <h3 className="card-title">{item.name}</h3>
        <p className="card-price">₹{item.price}</p>
      </div>

      <p style={{ color: item.isAvailable ? '#2e7d32' : '#c62828', fontSize: '14px' }}>
        {item.isAvailable ? 'Available' : 'Out of Stock'}
      </p>
    </div>
  );
}

export default MenuCard;
