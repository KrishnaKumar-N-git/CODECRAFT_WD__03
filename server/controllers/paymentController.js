const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { createRazorpayOrder, verifyRazorpaySignature } = require('../services/paymentService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return sendError(res, 404, 'Order not found');

    const razorpayOrder = await createRazorpayOrder(order.totalAmount, order.orderNumber);

    const payment = await Payment.create({
      order: order._id,
      user: req.user._id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      status: 'PENDING'
    });

    return sendSuccess(res, 200, 'Razorpay order created', {
      razorpayOrder,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo12345678',
      amount: order.totalAmount,
      currency: 'INR',
      orderId: order._id,
      orderNumber: order.orderNumber
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !orderId) {
      return sendError(res, 400, 'Missing payment parameters');
    }

    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'FAILED';
        await order.save();
      }
      return sendError(res, 400, 'Payment verification failed. Signature mismatch.');
    }

    const order = await Order.findById(orderId);
    if (!order) return sendError(res, 404, 'Order not found');

    order.paymentStatus = 'PAID';
    order.orderStatus = 'CONFIRMED';
    await order.save();

    // Record payment details
    await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature: razorpaySignature || 'mock_sig',
        status: 'PAID'
      },
      { upsert: true }
    );

    // Deduct stock & clear cart
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.store = null;
      cart.subtotal = 0;
      await cart.save();
    }

    return sendSuccess(res, 200, 'Payment verified and order confirmed!', { order });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment
};
