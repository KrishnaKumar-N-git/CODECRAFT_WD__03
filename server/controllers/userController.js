const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return sendError(res, 404, 'User not found');

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    return sendSuccess(res, 200, 'Profile updated successfully', { user });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Upload user avatar
// @route   POST /api/users/avatar
// @access  Private
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'Please upload an image file');
    }

    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 404, 'User not found');

    if (user.avatar && user.avatar.publicId) {
      await deleteFromCloudinary(user.avatar.publicId);
    }

    const uploaded = await uploadToCloudinary(req.file.buffer, 'apk_grocery/avatars');
    user.avatar = {
      url: uploaded.url,
      publicId: uploaded.publicId
    };

    await user.save();

    return sendSuccess(res, 200, 'Avatar uploaded successfully', { avatar: user.avatar });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  updateProfile,
  uploadAvatar
};
