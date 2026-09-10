const Store = require('../models/Store');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');

// @desc    Get all active stores
// @route   GET /api/stores
// @access  Public
const getStores = async (req, res) => {
  try {
    const stores = await Store.find({ status: 'ACTIVE' }).populate('owner', 'name email phone');
    return sendSuccess(res, 200, 'Stores fetched successfully', { stores });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get single store by ID or slug
// @route   GET /api/stores/:id
// @access  Public
const getStoreById = async (req, res) => {
  try {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: req.params.id } : { slug: req.params.id };

    const store = await Store.findOne(query).populate('owner', 'name email phone');
    if (!store) return sendError(res, 404, 'Store not found');

    return sendSuccess(res, 200, 'Store details fetched', { store });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Create or update store for store owner
// @route   POST /api/stores
// @access  Private (STORE_OWNER / ADMIN)
const createStore = async (req, res) => {
  try {
    const existingStore = await Store.findOne({ owner: req.user._id });
    if (existingStore) {
      return sendError(res, 400, 'Store owner already has an associated store');
    }

    const { name, description, phone, address, deliveryFee, minimumOrder, openingTime, closingTime } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const store = await Store.create({
      owner: req.user._id,
      name,
      slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
      description,
      phone,
      address,
      deliveryFee: deliveryFee || 30,
      minimumOrder: minimumOrder || 100,
      openingTime,
      closingTime
    });

    return sendSuccess(res, 201, 'Store created successfully', { store });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Update store details
// @route   PUT /api/stores/:id
// @access  Private (STORE_OWNER / ADMIN)
const updateStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return sendError(res, 404, 'Store not found');

    // Verify ownership or admin role
    if (store.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return sendError(res, 403, 'Not authorized to update this store');
    }

    const fieldsToUpdate = [
      'name',
      'description',
      'phone',
      'address',
      'openingTime',
      'closingTime',
      'deliveryFee',
      'minimumOrder',
      'status'
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        store[field] = req.body[field];
      }
    });

    await store.save();
    return sendSuccess(res, 200, 'Store updated successfully', { store });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Upload store logo
// @route   POST /api/stores/:id/logo
// @access  Private (STORE_OWNER / ADMIN)
const uploadStoreLogo = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return sendError(res, 404, 'Store not found');

    if (store.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return sendError(res, 403, 'Not authorized');
    }

    if (!req.file) return sendError(res, 400, 'Please upload an image file');

    if (store.logo && store.logo.publicId) {
      await deleteFromCloudinary(store.logo.publicId);
    }

    const uploaded = await uploadToCloudinary(req.file.buffer, 'apk_grocery/stores/logos');
    store.logo = { url: uploaded.url, publicId: uploaded.publicId };
    await store.save();

    return sendSuccess(res, 200, 'Store logo uploaded', { logo: store.logo });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Upload store banner
// @route   POST /api/stores/:id/banner
// @access  Private (STORE_OWNER / ADMIN)
const uploadStoreBanner = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return sendError(res, 404, 'Store not found');

    if (store.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return sendError(res, 403, 'Not authorized');
    }

    if (!req.file) return sendError(res, 400, 'Please upload an image file');

    if (store.banner && store.banner.publicId) {
      await deleteFromCloudinary(store.banner.publicId);
    }

    const uploaded = await uploadToCloudinary(req.file.buffer, 'apk_grocery/stores/banners');
    store.banner = { url: uploaded.url, publicId: uploaded.publicId };
    await store.save();

    return sendSuccess(res, 200, 'Store banner uploaded', { banner: store.banner });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  uploadStoreLogo,
  uploadStoreBanner
};
