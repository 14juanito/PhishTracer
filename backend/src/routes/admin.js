const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getAllScans,
  deleteUser,
  deleteScan,
  getStats
} = require('../controllers/adminController');

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .delete(deleteUser);

router.route('/scans')
  .get(getAllScans);

router.route('/scans/:id')
  .delete(deleteScan);

router.route('/stats')
  .get(getStats);

module.exports = router; 