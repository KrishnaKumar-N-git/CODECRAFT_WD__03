const express = require('express');
const router = express.Router();
const {
  getAdminAnalytics,
  getStoreAnalytics,
  getUsers,
  approveStoreOwner,
  toggleUserStatus,
  getAllStores,
  updateStoreStatus,
  getAllOrders,
  updateAdminOrderStatus
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/analytics', protect, requireRole('ADMIN'), getAdminAnalytics);
router.get('/store-analytics', protect, requireRole('STORE_OWNER', 'ADMIN'), getStoreAnalytics);
router.get('/users', protect, requireRole('ADMIN'), getUsers);
router.put('/users/:id/approve', protect, requireRole('ADMIN'), approveStoreOwner);
router.put('/users/:id/status', protect, requireRole('ADMIN'), toggleUserStatus);
router.get('/stores', protect, requireRole('ADMIN'), getAllStores);
router.put('/stores/:id/status', protect, requireRole('ADMIN'), updateStoreStatus);
router.get('/orders', protect, requireRole('ADMIN'), getAllOrders);
router.put('/orders/:id/status', protect, requireRole('ADMIN'), updateAdminOrderStatus);

module.exports = router;
