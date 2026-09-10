const Category = require('../models/Category');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    return sendSuccess(res, 200, 'Categories fetched successfully', { categories });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) return sendError(res, 400, 'Category name is required');

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString().slice(-4)}`;

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || { url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500' }
    });

    return sendSuccess(res, 201, 'Category created successfully', { category });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (STORE_OWNER / ADMIN)
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return sendError(res, 404, 'Category not found');

    const { name, description, isActive } = req.body;
    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    return sendSuccess(res, 200, 'Category updated successfully', { category });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Upload category image
// @route   POST /api/categories/:id/image
// @access  Private (STORE_OWNER / ADMIN)
const uploadCategoryImage = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return sendError(res, 404, 'Category not found');

    if (!req.file) return sendError(res, 400, 'Please upload an image file');

    if (category.image && category.image.publicId) {
      await deleteFromCloudinary(category.image.publicId);
    }

    const uploaded = await uploadToCloudinary(req.file.buffer, 'apk_grocery/categories');
    category.image = { url: uploaded.url, publicId: uploaded.publicId };
    await category.save();

    return sendSuccess(res, 200, 'Category image uploaded', { image: category.image });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (ADMIN)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return sendError(res, 404, 'Category not found');

    if (category.image && category.image.publicId) {
      await deleteFromCloudinary(category.image.publicId);
    }

    await category.deleteOne();
    return sendSuccess(res, 200, 'Category deleted successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  uploadCategoryImage,
  deleteCategory
};
