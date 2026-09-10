const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Get admin analytics overview
// @route   GET /api/admin/analytics
// @access  Private (ADMIN)
const getAdminAnalytics = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'CUSTOMER' });
    const totalStoreOwners = await User.countDocuments({ role: 'STORE_OWNER' });
    const totalStores = await Store.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    const revenueData = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Recent 7 days sales
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesOverTime = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, orderStatus: { $ne: 'CANCELLED' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const orderStatusBreakdown = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    return sendSuccess(res, 200, 'Admin analytics fetched', {
      metrics: {
        totalCustomers,
        totalStoreOwners,
        totalStores,
        totalProducts,
        totalOrders,
        totalRevenue
      },
      salesOverTime,
      orderStatusBreakdown
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get store owner / single store analytics
// @route   GET /api/store/analytics
// @access  Private (STORE_OWNER / ADMIN)
const getStoreAnalytics = async (req, res) => {
  try {
    let storeId = req.query.storeId;
    if (req.user.role === 'STORE_OWNER') {
      const userStore = await Store.findOne({ owner: req.user._id });
      if (!userStore) return sendError(res, 404, 'Store not found');
      storeId = userStore._id;
    }

    const query = storeId ? { store: storeId } : {};

    const totalOrders = await Order.countDocuments(query);
    const totalProducts = await Product.countDocuments(query);
    const lowStockProducts = await Product.countDocuments({
      ...query,
      $expr: { $lte: ['$stock', '$lowStockThreshold'] }
    });

    const revenueResult = await Order.aggregate([
      { $match: { ...query, orderStatus: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, avgOrderValue: { $avg: '$totalAmount' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    const avgOrderValue = revenueResult.length > 0 ? Math.round(revenueResult[0].avgOrderValue) : 0;

    // 7 days sales graph
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesGraph = await Order.aggregate([
      { $match: { ...query, createdAt: { $gte: sevenDaysAgo }, orderStatus: { $ne: 'CANCELLED' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%b %d', date: '$createdAt' } },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      }
    ]);

    return sendSuccess(res, 200, 'Store analytics fetched', {
      metrics: {
        totalOrders,
        totalProducts,
        lowStockProducts,
        totalRevenue,
        avgOrderValue
      },
      salesGraph
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private (ADMIN)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Users fetched', { users });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Approve Store Owner Application
// @route   PUT /api/admin/users/:id/approve
// @access  Private (ADMIN)
const approveStoreOwner = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');

    user.isApproved = true;
    user.isActive = true;
    await user.save();

    // Also update associated store status to ACTIVE
    await Store.findOneAndUpdate({ owner: user._id }, { status: 'ACTIVE' });

    return sendSuccess(res, 200, `Shop Owner "${user.name}" approved successfully!`, { user });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Toggle user status (activate/deactivate)
// @route   PUT /api/admin/users/:id/status
// @access  Private (ADMIN)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, 'User not found');

    user.isActive = !user.isActive;
    await user.save();

    // If deactivating owner, suspend store
    if (!user.isActive && user.role === 'STORE_OWNER') {
      await Store.findOneAndUpdate({ owner: user._id }, { status: 'SUSPENDED' });
    }

    return sendSuccess(res, 200, `User ${user.isActive ? 'activated' : 'deactivated'}`, { user });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get all stores for admin
// @route   GET /api/admin/stores
// @access  Private (ADMIN)
const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find({}).populate('owner', 'name email phone isApproved isActive');
    return sendSuccess(res, 200, 'All stores fetched', { stores });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Update store status (ACTIVE / SUSPENDED)
// @route   PUT /api/admin/stores/:id/status
// @access  Private (ADMIN)
const updateStoreStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const store = await Store.findById(req.params.id);
    if (!store) return sendError(res, 404, 'Store not found');

    if (!['PENDING', 'ACTIVE', 'SUSPENDED'].includes(status)) {
      return sendError(res, 400, 'Invalid status');
    }

    store.status = status;
    await store.save();

    if (status === 'ACTIVE') {
      await User.findByIdAndUpdate(store.owner, { isApproved: true, isActive: true });
    }

    return sendSuccess(res, 200, `Store status set to ${status}`, { store });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get all customer orders for admin delivery management
// @route   GET /api/admin/orders
// @access  Private (ADMIN)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('customer', 'name email phone')
      .populate('items.product', 'name brand weight images')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'All customer orders fetched for delivery', { orders });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Update order status by admin for delivery
// @route   PUT /api/admin/orders/:id/status
// @access  Private (ADMIN)
const updateAdminOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const updateData = {};

    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    if (orderStatus === 'DELIVERED') {
      updateData.paymentStatus = 'PAID';
      updateData.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: false }
    );

    if (!order) return sendError(res, 404, 'Order not found');

    return sendSuccess(res, 200, `Order status updated to ${order.orderStatus}`, { order });
  } catch (error) {
    console.error('Error in updateAdminOrderStatus:', error);
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getAdminAnalytics,
  getStoreAnalytics,
  getUsers,
  approveStoreOwner,
  toggleUserStatus,
  getAllStores,
  updateStoreStatus,
  getAllOrders,
  updateAdminOrderStatus
};
