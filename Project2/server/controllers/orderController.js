const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const mockStore = require('../data/mockStore');

/**
 * @desc    Create new order after payment
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod = 'Stripe',
      paymentResult,
      itemsPrice,
      taxPrice = 0,
      shippingPrice = 0,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided',
      });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid shipping address',
      });
    }

    // In-memory fallback if MongoDB is offline
    if (mongoose.connection.readyState !== 1) {
      const order = mockStore.createOrder(
        {
          orderItems,
          shippingAddress,
          paymentMethod,
          paymentResult: paymentResult || {
            id: `mock_trans_${Date.now()}`,
            status: 'succeeded',
            update_time: new Date().toISOString(),
          },
          itemsPrice: Number(itemsPrice),
          taxPrice: Number(taxPrice),
          shippingPrice: Number(shippingPrice),
          totalPrice: Number(totalPrice),
        },
        req.user
      );

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully (Preview Mode)',
        order,
      });
    }

    // MongoDB
    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map((item) => ({
        name: item.name,
        quantity: item.quantity || item.qty || 1,
        image: item.image,
        price: item.price,
        product: item.product || item._id,
      })),
      shippingAddress,
      paymentMethod,
      paymentResult: paymentResult || {
        id: `mock_trans_${Date.now()}`,
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: req.user.email,
      },
      itemsPrice: Number(itemsPrice),
      taxPrice: Number(taxPrice),
      shippingPrice: Number(shippingPrice),
      totalPrice: Number(totalPrice),
      isPaid: true,
      paidAt: Date.now(),
    });

    const savedOrder = await order.save();

    for (const item of orderItems) {
      const productId = item.product || item._id;
      const qty = item.quantity || item.qty || 1;
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: -qty },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: savedOrder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in user's order history
 * @route   GET /api/orders/myorders
 * @access  Private
 */
const getMyOrders = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const orders = mockStore.getUserOrders(req.user._id);
      return res.json({
        success: true,
        count: orders.length,
        orders,
      });
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const order = mockStore.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }
      return res.json({
        success: true,
        order,
      });
    }

    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const orders = mockStore.getAllOrders();
      return res.json({
        success: true,
        count: orders.length,
        orders,
      });
    }

    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order to delivered (Admin only)
 * @route   PUT /api/orders/:id/deliver
 * @access  Private/Admin
 */
const updateOrderToDelivered = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const order = mockStore.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }
      order.isDelivered = true;
      return res.json({
        success: true,
        message: 'Order marked as delivered',
        order,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: 'Order marked as delivered',
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderToDelivered,
};
