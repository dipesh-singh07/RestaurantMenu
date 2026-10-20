const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items
// @route   GET /api/menu
const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new menu item
// @route   POST /api/menu
const addMenuItem = async (req, res) => {
  try {
    const { name, category, price, isVeg, isAvailable } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const item = await MenuItem.create({
      name,
      category: category || 'Main Course',
      price: Number(price),
      isVeg: isVeg !== undefined ? isVeg : true,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const { name, category, price, isVeg, isAvailable } = req.body;
    if (name !== undefined) item.name = name;
    if (category !== undefined) item.category = category;
    if (price !== undefined) item.price = Number(price);
    if (isVeg !== undefined) item.isVeg = isVeg;
    if (isAvailable !== undefined) item.isAvailable = isAvailable;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
