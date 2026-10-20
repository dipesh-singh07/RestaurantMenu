const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// @desc    Create a new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { tableNumber, items } = req.body;

    if (!tableNumber) {
      return res.status(400).json({ message: 'Table number is required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart items cannot be empty' });
    }

    // Verify items and prices from database to ensure price integrity
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const dbItem = await MenuItem.findById(item.menuItem || item._id);
      if (!dbItem) {
        return res.status(404).json({ message: `Menu item not found: ${item.name || item._id}` });
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      const itemTotal = dbItem.price * qty;
      subtotal += itemTotal;

      verifiedItems.push({
        menuItem: dbItem._id,
        name: dbItem.name,
        price: dbItem.price,
        quantity: qty,
      });
    }

    // 5% GST
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    const order = await Order.create({
      customer: req.user._id,
      tableNumber: Number(tableNumber),
      items: verifiedItems,
      subtotal,
      tax,
      total,
      status: 'Placed',
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in customer's orders
// @route   GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Placed', 'Preparing', 'Served', 'Paid'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard metrics: today's order count and revenue
// @route   GET /api/orders/stats
const getDashboardStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayOrders = await Order.find({ createdAt: { $gte: startOfDay } });

    const todayOrderCount = todayOrders.length;
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || 0), 0);

    const totalOrdersCount = await Order.countDocuments();
    const allOrders = await Order.find();
    const totalLifetimeRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);

    res.json({
      todayOrderCount,
      todayRevenue: Math.round(todayRevenue * 100) / 100,
      totalOrdersCount,
      totalLifetimeRevenue: Math.round(totalLifetimeRevenue * 100) / 100,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
};
