const express = require('express');
const router = express.Router();
const {
  getPaymentConfig,
  createPaymentIntent,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Get publishable key / config
router.get('/config', getPaymentConfig);

// Create payment intent (requires user authentication)
router.post('/create-payment-intent', protect, createPaymentIntent);

module.exports = router;
