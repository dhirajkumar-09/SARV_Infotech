const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderToDelivered,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Logged-in user routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin-only routes
router.get('/', protect, admin, getAllOrders);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

module.exports = router;
