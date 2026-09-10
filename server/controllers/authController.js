const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Store = require('../models/Store');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'apk_grocery_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user (Customer or Store Owner)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return sendError(res, 400, 'Please provide name, email, password and phone');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendError(res, 400, 'User with this email already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'CUSTOMER',
      isApproved: true,
      isActive: true
    });

    const token = generateToken(user._id);

    return sendSuccess(res, 201, 'Customer account registered successfully', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isApproved: user.isApproved
      },
      token
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Register a new Super Admin account
// @route   POST /api/auth/admin-register
// @access  Public (Secret Admin Gateway)
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, adminPin } = req.body;

    if (!name || !email || !password || !phone) {
      return sendError(res, 400, 'Please fill in name, email, password, and phone number');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendError(res, 400, 'An account with this email address already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      adminPin: adminPin || '',
      role: 'ADMIN',
      isApproved: true,
      isActive: true
    });

    const token = generateToken(user._id);

    return sendSuccess(res, 201, 'Super Admin account registered successfully!', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isApproved: true,
        hasAdminPin: Boolean(user.adminPin)
      },
      token
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Login user (Handles Customer, Shop Owner, and Dedicated Admin Login)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password, isAdminLogin } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Role-based route enforcement
    if (isAdminLogin && user.role !== 'ADMIN') {
      return sendError(res, 403, 'Access Denied. Only authorized Super Administrators can log in here.');
    }

    if (!isAdminLogin && user.role === 'ADMIN') {
      return sendError(
        res,
        400,
        'Super Admin accounts must log in via the secure Admin Access URL (/admin-secret-access).'
      );
    }

    // Account active check
    if (!user.isActive) {
      return sendError(res, 403, 'Your account has been blocked or suspended by Admin.');
    }

    // Shop Owner Approval check
    if (user.role === 'STORE_OWNER' && user.isApproved === false) {
      return sendError(
        res,
        403,
        'Your Store Owner account is currently pending Admin approval. Please wait for Admin to approve your application.'
      );
    }

    const token = generateToken(user._id);

    return sendSuccess(res, 200, 'Login successful', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isApproved: user.isApproved,
        avatar: user.avatar
      },
      token
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Manage Admin Security PIN
// @route   POST /api/auth/admin-pin
// @access  Private (ADMIN)
const manageAdminPin = async (req, res) => {
  try {
    const { action, pin, currentPin } = req.body;
    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'ADMIN') {
      return sendError(res, 403, 'Admin access required');
    }

    if (action === 'VERIFY') {
      if (user.adminPin && user.adminPin !== pin) {
        return sendError(res, 400, 'Invalid Security Access PIN');
      }
      return sendSuccess(res, 200, 'Security PIN verified successfully', { valid: true });
    }

    if (action === 'SET' || action === 'CHANGE') {
      if (action === 'CHANGE' && user.adminPin && user.adminPin !== currentPin) {
        return sendError(res, 400, 'Current Security PIN is incorrect');
      }
      user.adminPin = pin;
      await user.save();
      return sendSuccess(res, 200, 'Security Access PIN saved successfully!', { hasPin: true });
    }

    return sendError(res, 400, 'Invalid action');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Request Password Reset (Sends OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return sendError(res, 400, 'Please enter your registered email address');

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 404, 'No account registered with this email address');
    }

    // Generate 6-digit verification code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = expires;
    await user.save();

    return sendSuccess(res, 200, `Verification OTP code generated: ${otp}`, {
      email,
      otp,
      message: `A 6-digit verification code has been dispatched to ${email}`
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Verify OTP Code
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return sendError(res, 400, 'Please provide email and verification OTP');

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return sendError(res, 400, 'Invalid or expired verification OTP code');
    }

    return sendSuccess(res, 200, 'OTP code verified successfully!', { valid: true });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return sendError(res, 400, 'Please provide email, verification OTP and new password');
    }

    if (newPassword.length < 6) {
      return sendError(res, 400, 'New password must be at least 6 characters long');
    }

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return sendError(res, 400, 'Invalid or expired verification code');
    }

    // Update password (pre-save hook will hash it with bcrypt)
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return sendSuccess(res, 200, 'Password reset successful! You can now log in with your new password.', {
      success: true
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return sendSuccess(res, 200, 'User profile fetched', { user });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  register,
  registerAdmin,
  login,
  manageAdminPin,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getMe
};
