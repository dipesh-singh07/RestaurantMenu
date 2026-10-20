# Restaurant Menu & Table Order System (PS6)

A clean, beginner-friendly MERN stack demo for college project presentation.

---

## 🌟 Features

### Customer Side
* **Explore Menu**: Filter food items by category (*Starters, Main Course, Desserts, Beverages*) and toggle *Veg Only 🟢*.
* **Cart Management**: Add items to cart, adjust quantities (+/-), or remove items. State is persisted in `localStorage`.
* **Table Order Placement**: Select Table 1, 2, or 3 and place order.
* **Server-side Calculation**: Subtotal, 5% GST, and grand total are calculated securely on the backend.
* **Order Tracking**: View past orders and track their live status (*Placed*, *Preparing*, *Served*, *Paid*).

### Admin / Staff Side
* **Dashboard Summary**: Real-time stats showing today's order count and revenue.
* **Order Management**: View all table orders and update their status (*Placed* ➔ *Preparing* ➔ *Served* ➔ *Paid*).
* **Menu Management (CRUD)**: Add new items, update prices or categories, and delete items with a shared form.

### Authentication & Authorization
* Clean JWT-based authentication with bcrypt password hashing.
* Pre-configured demo accounts for instant evaluation:
  * **Admin / Staff**: `admin@restaurant.com` / `admin123`
  * **Customer**: `customer@test.com` / `customer123`

---

## 🚀 How to Run the Project

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev      # Starts server on http://localhost:5000
```

### 2. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

---

## 📁 Project Architecture

```text
Restaurant/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── models/               # User, MenuItem, Table, Order
│   ├── controllers/          # Business logic & 5% GST calculation
│   ├── routes/               # authRoutes, menuRoutes, tableRoutes, orderRoutes
│   ├── middleware/           # authMiddleware (JWT & admin verification)
│   └── server.js             # Express entry point
└── frontend/
    └── src/
        ├── api/api.js        # Axios instance with auth token header
        ├── components/       # Navbar, MenuCard, ProtectedRoute
        ├── pages/            # MenuPage, CartPage, OrdersPage, AdminDashboard, Login, Register
        ├── App.jsx           # Top-level cart state & React router
        └── main.jsx          # Entry point with BrowserRouter
```
# RestaurantMenu
