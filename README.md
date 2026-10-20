# Restaurant Menu & Table Order System

A full-stack restaurant ordering application built with the MERN stack. It lets customers browse the menu, add items to a cart, place table orders, and track their status, while admins can manage menu items, view order analytics, and update order progress.

This project is designed to be easy to understand and suitable for a college or portfolio demonstration.

## Overview

The app is split into two main parts:

- Backend: Node.js + Express + MongoDB + JWT authentication
- Frontend: React + Vite + React Router

Customers can place orders from a table-specific flow, and admins can manage the restaurant operations from a dashboard.

## Features

### Customer features
- Browse menu items by category
- Filter vegetarian-only dishes
- Add, remove, and adjust cart quantities
- Select a table number before checkout
- Place an order with automatic subtotal, GST, and total calculation
- Track order status: Placed, Preparing, Served, Paid
- View past orders

### Admin features
- Secure login with role-based access control
- Dashboard with total orders and revenue summary
- View all orders submitted by customers
- Update order status through the workflow
- Add, edit, and delete menu items using a shared form

### Security and authentication
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes for customer and admin-only actions
- Demo accounts for quick testing

## Tech stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT + bcryptjs
- API: RESTful endpoints

## Project structure

```text
Restaurant/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .gitignore
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+ installed
- MongoDB running locally or a MongoDB Atlas connection string
- A terminal with access to both project folders

## Getting started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Restaurant
```

### 2. Set up the backend environment

Create a `.env` file inside the `backend` folder:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Example:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/restaurant_meals
JWT_SECRET=myrestaurantsecret123
```

Then install dependencies and start the backend:

```bash
cd backend
npm install
npm run dev
```

The API should run at:

- http://localhost:5001

### 3. Set up the frontend

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend should run at:

- http://localhost:5173

## Demo accounts

The app includes preconfigured demo users for quick testing:

- Admin: `admin@restaurant.com` / `admin123`
- Customer: `customer@test.com` / `customer123`

## How the app works

### Customer flow
1. Sign in as a customer.
2. Browse the menu and add food items to the cart.
3. Choose a table number.
4. Place the order.
5. Check the status of the order from the order history page.

### Admin flow
1. Sign in as admin.
2. View the dashboard summary.
3. Open the orders list.
4. Update order status from one stage to the next.
5. Manage menu items through the admin interface.

## Key API endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Menu
- `GET /api/menu`
- `POST /api/menu`
- `PUT /api/menu/:id`
- `DELETE /api/menu/:id`

### Orders
- `POST /api/orders`
- `GET /api/orders/myorders`
- `GET /api/orders`
- `GET /api/orders/stats`
- `PUT /api/orders/:id/status`

## Notes

- The total price is calculated on the backend to keep billing logic centralized.
- The cart is managed in the frontend state and can be persisted in browser storage if needed.
- The project is structured to be beginner-friendly and easy to extend for academic use.

## Future improvements

Possible enhancements for later versions:

- Payment integration
- Real-time order updates using WebSockets
- Image upload for menu items
- Search and sorting for menu data
- Better admin analytics with charts

## License

This project is intended for educational and demo purposes.
