const Address = require('../models/Address');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Get all addresses for user
// @route   GET /api/addresses
// @access  Private
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    return sendSuccess(res, 200, 'Addresses fetched', { addresses });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Add new address
// @route   POST /api/addresses
// @access  Private
const createAddress = async (req, res) => {
  try {
    const { name, phone, street, area, city, state, pincode, isDefault } = req.body;

    if (!name || !phone || !street || !area || !city || !state || !pincode) {
      return sendError(res, 400, 'Please fill in all address fields');
    }

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    // If first address, make it default
    const count = await Address.countDocuments({ user: req.user._id });
    const makeDefault = isDefault || count === 0;

    const address = await Address.create({
      user: req.user._id,
      name,
      phone,
      street,
      area,
      city,
      state,
      pincode,
      isDefault: makeDefault
    });

    return sendSuccess(res, 201, 'Address added successfully', { address });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) return sendError(res, 404, 'Address not found');

    if (address.user.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Not authorized');
    }

    const { name, phone, street, area, city, state, pincode, isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    if (name) address.name = name;
    if (phone) address.phone = phone;
    if (street) address.street = street;
    if (area) address.area = area;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pincode) address.pincode = pincode;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();
    return sendSuccess(res, 200, 'Address updated', { address });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) return sendError(res, 404, 'Address not found');

    if (address.user.toString() !== req.user._id.toString()) {
      return sendError(res, 403, 'Not authorized');
    }

    await address.deleteOne();
    return sendSuccess(res, 200, 'Address deleted successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
};
