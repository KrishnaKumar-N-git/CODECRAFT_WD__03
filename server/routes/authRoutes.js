const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  register,
  registerAdmin,
  login,
  manageAdminPin,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getMe,
  seedDatabase
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 30, // 30 requests per window
  message: { success: false, message: 'Too many auth attempts. Please try again after 15 minutes.' }
});

router.post('/register', authLimiter, register);
router.post('/admin-register', authLimiter, registerAdmin);
router.post('/login', authLimiter, login);
router.post('/admin-pin', protect, manageAdminPin);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/verify-otp', authLimiter, verifyOTP);
router.post('/reset-password', authLimiter, resetPassword);
router.get('/me', protect, getMe);
router.post('/seed-database', seedDatabase);
router.get('/seed-database', seedDatabase);

module.exports = router;

