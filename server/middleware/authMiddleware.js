const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'apk_grocery_super_secret_jwt_key_2026');

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return sendError(res, 401, 'User no longer exists.');
      }
      if (!req.user.isActive) {
        return sendError(res, 403, 'Your account has been deactivated.');
      }

      return next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return sendError(res, 401, 'Not authorized, token invalid or expired');
    }
  }

  if (!token) {
    return sendError(res, 401, 'Not authorized, no token provided');
  }
};

module.exports = { protect };
