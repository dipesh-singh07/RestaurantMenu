import React from 'react';

function MenuCard({ item, onAddToCart }) {
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

      <button
        onClick={() => onAddToCart(item)}
        disabled={!item.isAvailable}
        className="btn-primary"
      >
        {item.isAvailable ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}

export default MenuCard;
