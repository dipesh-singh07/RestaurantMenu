const Table = require('../models/Table');

// @desc    Get all tables
// @route   GET /api/tables
const getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTables };
