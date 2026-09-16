const Product = require('../models/Product');
const Store = require('../models/Store');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      rating,
      discount,
      sort,
      store,
      popular,
      bestseller,
      page = 1,
      limit = 12
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (store) query.store = store;
    if (popular === 'true') query.isPopular = true;
    if (bestseller === 'true') query.isBestSeller = true;

    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    if (minPrice || maxPrice) {
      query.sellingPrice = {};
      if (minPrice) query.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (discount === 'true') {
      query.discountPercentage = { $gt: 0 };
    }

    // Sort order
    let sortOptions = { createdAt: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };
    else if (sort === 'price_low') sortOptions = { sellingPrice: 1 };
    else if (sort === 'price_high') sortOptions = { sellingPrice: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };
    else if (sort === 'discount') sortOptions = { discountPercentage: -1 };
    else if (sort === 'popular') sortOptions = { isPopular: -1, reviewCount: -1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('store', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum);

    return sendSuccess(res, 200, 'Products fetched successfully', { products }, {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    let product = null;

    if (isObjectId) {
      product = await Product.findById(req.params.id)
        .populate('category', 'name slug')
        .populate('store', 'name slug address phone openingTime closingTime deliveryFee');
    }

    if (!product) {
      product = await Product.findOne({ slug: req.params.id })
        .populate('category', 'name slug')
        .populate('store', 'name slug address phone openingTime closingTime deliveryFee');
    }

    if (!product) {
      const keyword = req.params.id.split('-')[0];
      product = await Product.findOne({
        $or: [
          { slug: new RegExp(keyword, 'i') },
          { name: new RegExp(keyword, 'i') }
        ]
      })
        .populate('category', 'name slug')
        .populate('store', 'name slug address phone openingTime closingTime deliveryFee');
    }

    if (!product) return sendError(res, 404, 'Product not found');

    return sendSuccess(res, 200, 'Product details fetched', { product });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (STORE_OWNER / ADMIN)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      weight,
      description,
      mrp,
      sellingPrice,
      stock,
      lowStockThreshold,
      sku,
      specifications,
      isPopular,
      isBestSeller,
      images
    } = req.body;

    if (!name || !sellingPrice) {
      return sendError(res, 400, 'Please provide product name and selling price');
    }

    const isValidObjectId = (id) => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/);

    // Determine store ID
    let storeId = req.body.store;
    if (!isValidObjectId(storeId)) {
      let mainStore = await Store.findOne();
      if (!mainStore) {
        mainStore = await Store.create({
          name: 'APK Main Grocery Store',
          slug: `apk-main-store-${Date.now()}`,
          phone: '+91 9876543210',
          status: 'APPROVED',
          description: 'Official APK Grocery Store'
        });
      }
      storeId = mainStore._id;
    }

    // Determine Category ID
    let categoryId = category;
    const Category = require('../models/Category');
    if (!isValidObjectId(categoryId)) {
      let mainCategory = await Category.findOne();
      if (!mainCategory) {
        mainCategory = await Category.create({
          name: 'Staples & Groceries',
          slug: `staples-groceries-${Date.now()}`,
          description: 'Daily essential food items'
        });
      }
      categoryId = mainCategory._id;
    }

    const productBrand = brand || 'APK Select';
    const productWeight = weight || '1 kg';
    const productMrp = Number(mrp) || Number(sellingPrice);
    const generatedSku = sku || `SKU-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString().slice(-4)}`;

    const productImages = Array.isArray(images) && images.length > 0
      ? images
      : [
          {
            url: `https://images.unsplash.com/photo-1542838132-92c53300491e?w=600`,
            publicId: `mock_${Date.now()}`,
            isPrimary: true
          }
        ];

    const product = new Product({
      store: storeId,
      category: categoryId,
      name,
      slug,
      description: description || '',
      brand: productBrand,
      weight: productWeight,
      mrp: productMrp,
      sellingPrice: Number(sellingPrice),
      stock: Number(stock) || 50,
      lowStockThreshold: Number(lowStockThreshold) || 10,
      sku: generatedSku,
      specifications: specifications || [],
      isPopular: !!isPopular,
      isBestSeller: !!isBestSeller,
      images: productImages
    });

    await product.save();
    await product.populate('category', 'name slug');
    await product.populate('store', 'name slug');

    return sendSuccess(res, 201, 'Product created successfully', { product });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (STORE_OWNER / ADMIN)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 404, 'Product not found');

    // Verify ownership if store owner
    if (req.user.role === 'STORE_OWNER') {
      const userStore = await Store.findOne({ owner: req.user._id });
      if (!userStore || product.store.toString() !== userStore._id.toString()) {
        return sendError(res, 403, 'Not authorized to edit this product');
      }
    }

    const updatableFields = [
      'name',
      'category',
      'brand',
      'weight',
      'description',
      'mrp',
      'sellingPrice',
      'stock',
      'lowStockThreshold',
      'sku',
      'specifications',
      'isActive',
      'isPopular',
      'isBestSeller',
      'images'
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();
    await product.populate('category', 'name slug');
    await product.populate('store', 'name slug');

    return sendSuccess(res, 200, 'Product updated successfully', { product });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (STORE_OWNER / ADMIN)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 404, 'Product not found');

    if (req.user.role === 'STORE_OWNER') {
      const userStore = await Store.findOne({ owner: req.user._id });
      if (!userStore || product.store.toString() !== userStore._id.toString()) {
        return sendError(res, 403, 'Not authorized');
      }
    }

    // Delete product images from Cloudinary
    for (const img of product.images) {
      if (img.publicId) {
        await deleteFromCloudinary(img.publicId);
      }
    }

    await product.deleteOne();
    return sendSuccess(res, 200, 'Product deleted successfully');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Upload product images (multiple)
// @route   POST /api/products/:id/images
// @access  Private (STORE_OWNER / ADMIN)
const uploadProductImages = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 404, 'Product not found');

    if (req.user.role === 'STORE_OWNER') {
      const userStore = await Store.findOne({ owner: req.user._id });
      if (!userStore || product.store.toString() !== userStore._id.toString()) {
        return sendError(res, 403, 'Not authorized');
      }
    }

    if (!req.files || req.files.length === 0) {
      return sendError(res, 400, 'Please select at least one image to upload');
    }

    const uploadedImages = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const result = await uploadToCloudinary(file.buffer, 'apk_grocery/products');
      uploadedImages.push({
        url: result.url,
        publicId: result.publicId,
        isPrimary: product.images.length === 0 && i === 0
      });
    }

    product.images.push(...uploadedImages);
    await product.save();

    return sendSuccess(res, 200, 'Images uploaded successfully', { images: product.images });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Delete single product image
// @route   DELETE /api/products/:id/images/:imageId
// @access  Private (STORE_OWNER / ADMIN)
const deleteProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 404, 'Product not found');

    const imageIndex = product.images.findIndex((img) => img._id.toString() === req.params.imageId);
    if (imageIndex === -1) return sendError(res, 404, 'Image not found');

    const [deletedImg] = product.images.splice(imageIndex, 1);
    if (deletedImg.publicId) {
      await deleteFromCloudinary(deletedImg.publicId);
    }

    if (deletedImg.isPrimary && product.images.length > 0) {
      product.images[0].isPrimary = true;
    }

    await product.save();
    return sendSuccess(res, 200, 'Product image deleted', { images: product.images });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Fix & repair missing/broken product images catalog wide
// @route   POST /api/products/fix-images
// @access  Public / Admin
const fixProductImages = async (req, res) => {
  try {
    const { repairProductImages } = require('../utils/imageRepair');
    const result = await repairProductImages();
    return sendSuccess(res, 200, `Successfully processed product image repairs. Updated ${result.count || 0} products.`, result);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
  fixProductImages
};
