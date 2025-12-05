const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

// Protected routes
router.post('/', authenticate, orderController.createOrder);
router.get('/user', authenticate, orderController.getUserOrders);
router.get('/:orderId', authenticate, orderController.getOrder);

// Webhook (no authentication - PayFast will POST to this)
router.post('/webhook', orderController.handlePaymentWebhook);

module.exports = router;
