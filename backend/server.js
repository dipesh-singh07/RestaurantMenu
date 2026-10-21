const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));

// Health check endpoint for Render
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Restaurant API is running...',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting/disconnected'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting/disconnected'
  });
});

const PORT = process.env.PORT || 5001;

// Bind to 0.0.0.0 for Render compatibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB
connectDB();

