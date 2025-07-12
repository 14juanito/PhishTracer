const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getAllScans,
  deleteUser,
  deleteScan,
  getStats,
  createUser,
  updateUser,
  getApiStats
} = require('../controllers/adminController');

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

router.route('/users')
  .get(getUsers)
  .post(createUser);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

router.route('/scans')
  .get(getAllScans);

router.route('/scans/:id')
  .delete(deleteScan);

router.route('/stats')
  .get(getStats);

router.route('/api-stats')
  .get(getApiStats);

module.exports = router; 