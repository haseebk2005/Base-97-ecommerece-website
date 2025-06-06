const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getDashboardMetrics,
  updateOrderStatus,
  getAllUsers
} = require('../controllers/adminController');
const { getAllReviews } = require('../controllers/adminController');

const router = express.Router();

router.get('/metrics', protect, admin, getDashboardMetrics);
router.get('/users', protect, admin, getAllUsers);
router.get('/reviews', protect, admin, getAllReviews);

// New route:
router.put('/orders/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
