const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Starters', 'Main Course', 'Desserts', 'Beverages'],
      default: 'Main Course',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isVeg: {
      type: Boolean,
      required: true,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
