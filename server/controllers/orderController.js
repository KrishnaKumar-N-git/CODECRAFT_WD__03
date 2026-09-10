const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Store = require('../models/Store');
const generateOrderNumber = require('../utils/generateOrderNumber');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { createRazorpayOrder } = require('../services/paymentService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { deliveryAddress, deliveryMethod, paymentMethod } = req.body;

    if (!deliveryAddress || !deliveryMethod || !paymentMethod) {
      return sendError(res, 400, 'Please provide delivery address, delivery method, and payment method');
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return sendError(res, 400, 'Your cart is empty');
    }

    let store = cart.store ? await Store.findById(cart.store) : null;
    if (!store) {
      store = await Store.findOne();
      if (!store) {
        store = await Store.create({
          name: 'APK Grocery Main Store',
          slug: `apk-main-store-${Date.now()}`,
          phone: '+91 9876543210',
          status: 'ACTIVE',
          description: 'Official APK Grocery Store'
        });
      }
    }
    if (store.status !== 'ACTIVE') {
      store.status = 'ACTIVE';
      await store.save();
    }

    // Verify stock & calculate server-side totals
    let serverSubtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id || item.product);
      if (!product || !product.isActive) {
        return sendError(res, 400, `Product "${item.product?.name || 'Item'}" is no longer available`);
      }

      if (product.stock < item.quantity) {
        return sendError(res, 400, `Only ${product.stock} units of "${product.name}" available`);
      }

      const itemSubtotal = product.sellingPrice * item.quantity;
      serverSubtotal += itemSubtotal;

      const primaryImg = product.images?.find((img) => img.isPrimary) || product.images?.[0];
      orderItems.push({
        product: product._id,
        name: product.name,
        image: primaryImg ? primaryImg.url : '',
        quantity: item.quantity,
        price: product.sellingPrice,
        mrp: product.mrp,
        weight: product.weight,
        subtotal: itemSubtotal
      });
    }

    const deliveryFee = deliveryMethod === 'STORE_PICKUP' ? 0 : store.deliveryFee || 30;
    const totalAmount = serverSubtotal + deliveryFee;

    const orderNumber = generateOrderNumber();

    const order = new Order({
      orderNumber,
      customer: req.user._id,
      store: store._id,
      items: orderItems,
      deliveryAddress,
      deliveryMethod,
      paymentMethod,
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
      subtotal: serverSubtotal,
      deliveryFee,
      totalAmount
    });

    await order.save();

    // Decrement product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    cart.items = [];
    cart.store = null;
    cart.subtotal = 0;
    await cart.save();

    // If COD or PAY_AT_STORE: finalize order
    if (paymentMethod === 'COD' || paymentMethod === 'PAY_AT_STORE') {
      return sendSuccess(res, 201, 'Order placed successfully', { order });
    }

    // If ONLINE: return order for UPI QR Code modal
    if (paymentMethod === 'ONLINE') {
      let razorpayOrder;
      try {
        razorpayOrder = await createRazorpayOrder(totalAmount, order.orderNumber);
      } catch (err) {
        razorpayOrder = {
          id: `qr_ord_${Date.now()}`,
          amount: totalAmount * 100,
          currency: 'INR'
        };
      }

      return sendSuccess(res, 201, 'Order initialized for online payment', {
        order,
        razorpayOrder
      });
    }

    return sendError(res, 400, 'Invalid payment method');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get customer orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('store', 'name phone address')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Orders fetched successfully', { orders });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('store', 'name phone address openingTime closingTime');

    if (!order) return sendError(res, 404, 'Order not found');

    // Access check
    if (
      order.customer._id.toString() !== req.user._id.toString() &&
      req.user.role === 'CUSTOMER'
    ) {
      return sendError(res, 403, 'Not authorized to view this order');
    }

    return sendSuccess(res, 200, 'Order details fetched', { order });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Cancel order by customer
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return sendError(res, 404, 'Order not found');

    if (order.customer.toString() !== req.user._id.toString() && req.user.role === 'CUSTOMER') {
      return sendError(res, 403, 'Not authorized to cancel this order');
    }

    if (!['PENDING', 'CONFIRMED'].includes(order.orderStatus)) {
      return sendError(
        res,
        400,
        `Cannot cancel order with current status "${order.orderStatus}". Orders already in packing or delivery cannot be cancelled.`
      );
    }

    // Restore stock if previously deducted
    if (order.paymentMethod === 'COD' || order.paymentMethod === 'PAY_AT_STORE' || order.paymentStatus === 'PAID') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    order.orderStatus = 'CANCELLED';
    await order.save();

    return sendSuccess(res, 200, 'Order cancelled successfully', { order });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get store orders for Store Owner
// @route   GET /api/store/orders
// @access  Private (STORE_OWNER / ADMIN)
const getStoreOrders = async (req, res) => {
  try {
    let storeId = req.query.storeId;

    if (req.user.role === 'STORE_OWNER') {
      const userStore = await Store.findOne({ owner: req.user._id });
      if (!userStore) return sendError(res, 404, 'No store found for this store owner');
      storeId = userStore._id;
    }

    const query = storeId ? { store: storeId } : {};
    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Store orders fetched', { orders });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Update order status by Store Owner / Admin
// @route   PUT /api/store/orders/:id/status
// @access  Private (STORE_OWNER / ADMIN)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return sendError(res, 404, 'Order not found');

    if (req.user.role === 'STORE_OWNER') {
      const userStore = await Store.findOne({ owner: req.user._id });
      if (!userStore || order.store.toString() !== userStore._id.toString()) {
        return sendError(res, 403, 'Not authorized for this store order');
      }
    }

    const validStatuses = [
      'PENDING',
      'CONFIRMED',
      'PACKING',
      'PREPARING',
      'READY_FOR_PICKUP',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED'
    ];

    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return sendError(res, 400, 'Invalid order status');
    }

    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (orderStatus === 'DELIVERED' && (order.paymentMethod === 'COD' || !order.paymentStatus || order.paymentStatus === 'PENDING')) {
      updateData.paymentStatus = 'PAID';
      updateData.deliveredAt = new Date();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: false }
    );

    return sendSuccess(res, 200, 'Order status updated', { order: updatedOrder });
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getStoreOrders,
  updateOrderStatus
};
