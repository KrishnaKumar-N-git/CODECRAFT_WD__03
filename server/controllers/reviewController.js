const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Add or Update product review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return sendError(res, 400, 'Please provide productId, rating and comment');
    }

    const product = await Product.findById(productId);
    if (!product) return sendError(res, 404, 'Product not found');

    // Find optional order reference for this customer & product
    let order = await Order.findOne({
      customer: req.user._id,
      'items.product': productId
    });
    if (!order) {
      order = await Order.findOne({ customer: req.user._id });
    }

    // Check if review exists for this customer & product (Update existing vs Create new)
    let review = await Review.findOne({
      customer: req.user._id,
      product: productId
    });

    if (review) {
      review.rating = Number(rating);
      review.comment = comment;
      if (order && !review.order) review.order = order._id;
      if (product.store && !review.store) review.store = product.store;
      await review.save();
    } else {
      review = await Review.create({
        customer: req.user._id,
        product: productId,
        store: product.store || order?.store,
        order: order?._id || null,
        rating: Number(rating),
        comment
      });
    }

    // Recalculate average rating & review count for the product
    const stats = await Review.aggregate([
      { $match: { product: product._id } },
      { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
      product.rating = Math.round(stats[0].avgRating * 10) / 10;
      product.reviewCount = stats[0].count;
      await product.save();
    }

    return sendSuccess(res, 200, 'Review posted successfully', { review });
  } catch (error) {
    console.error('Error in createReview:', error);
    return sendError(res, 500, error.message);
  }
};

// @desc    Get reviews for product
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('customer', 'name avatar')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Product reviews fetched', { reviews });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  createReview,
  getProductReviews
};
