const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route to view menu
router.get('/', getMenuItems);

// Protected Admin routes to manage menu items
router.post('/', protect, adminOnly, addMenuItem);
router.put('/:id', protect, adminOnly, updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);

module.exports = router;
