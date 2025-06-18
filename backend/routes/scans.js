const express = require('express');
const { getMyScans, deleteScan } = require('../controllers/scanController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Routes protégées par authentification
router.get('/my-scans', protect, getMyScans);
router.delete('/:id', protect, deleteScan);

module.exports = router; 