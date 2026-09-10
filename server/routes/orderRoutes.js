const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getStoreOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Customer routes
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

// Store owner & Admin routes
router.get('/store/all', protect, requireRole('STORE_OWNER', 'ADMIN'), getStoreOrders);
router.put('/store/:id/status', protect, requireRole('STORE_OWNER', 'ADMIN'), updateOrderStatus);

module.exports = router;
