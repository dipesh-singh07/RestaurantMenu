const express = require('express');
const router = express.Router();
const { getTables } = require('../controllers/tableController');

// Public/Customer route to view available tables
router.get('/', getTables);

module.exports = router;
