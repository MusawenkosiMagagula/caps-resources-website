const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const paymentService = require('../services/paymentService');
const pdfService = require('../services/pdfService');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body; // Array of product IDs
    const userId = req.userId;

    // Get product details
    const products = await Product.find({ _id: { $in: items } });
    if (products.length !== items.length) {
      return res.status(400).json({ message: 'Some products not found' });
    }

    // Calculate total
    const totalAmount = products.reduce((sum, product) => sum + product.price, 0);

    // Create order
    const order = new Order({
      user: userId,
      items: products.map(product => ({
        product: product._id,
        price: product.price
      })),
      totalAmount,
      paymentMethod: 'payfast'
    });

    await order.save();

    // Get user details
    const user = await User.findById(userId);

    // Create payment request
    const paymentData = await paymentService.createPayment(order, user);

    res.json({
      orderId: order._id,
      payment: paymentData
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

// Handle PayFast webhook
exports.handlePaymentWebhook = async (req, res) => {
  try {
    const paymentData = req.body;

    // Verify payment signature
    const isValid = paymentService.verifyPayment(paymentData);
    if (!isValid) {
      console.error('Invalid payment signature');
      return res.status(400).send('Invalid signature');
    }

    // Validate with PayFast servers
    const isValidated = await paymentService.validatePayment(paymentData);
    if (!isValidated) {
      console.error('Payment validation failed');
      return res.status(400).send('Validation failed');
    }

    const orderId = paymentData.m_payment_id;
    const paymentStatus = paymentData.payment_status;

    // Update order
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) {
      return res.status(404).send('Order not found');
    }

    order.paymentStatus = paymentStatus === 'COMPLETE' ? 'completed' : 'failed';
    order.paymentId = paymentData.pf_payment_id;
    order.paymentDetails = paymentData;

    if (paymentStatus === 'COMPLETE') {
      // Generate download links
      order.downloadLinks = await pdfService.generateDownloadLinks(order);
      
      // Send email with PDFs
      await pdfService.sendPurchaseEmail(order);
      order.emailSent = true;

      // Update user purchases
      const user = await User.findById(order.user);
      order.items.forEach(item => {
        user.purchases.push({
          product: item.product._id,
          purchaseDate: new Date()
        });
      });
      await user.save();

      // Update product download counts
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { downloads: 1 }
        });
      }
    }

    await order.save();

    res.status(200).send('OK');
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(500).send('Server error');
  }
};

// Get order details
exports.getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate('items.product')
      .populate('user', '-password');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user._id.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
