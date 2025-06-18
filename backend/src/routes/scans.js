const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMyScans, deleteScan } = require('../controllers/scanController');

// Routes protégées
router.get('/my-scans', protect, getMyScans);
router.delete('/:id', protect, deleteScan);

module.exports = router; 