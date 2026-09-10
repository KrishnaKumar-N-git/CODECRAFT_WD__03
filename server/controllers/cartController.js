const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// Recalculate subtotal
const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('store', 'name slug deliveryFee minimumOrder')
      .populate({
        path: 'items.product',
        select: 'name slug brand weight images mrp sellingPrice stock lowStockThreshold category'
      });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], subtotal: 0 });
    }

    return sendSuccess(res, 200, 'Cart fetched successfully', { cart });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, forceClear = false } = req.body;

    if (!productId) return sendError(res, 400, 'Product ID is required');

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return sendError(res, 404, 'Product not available');
    }

    if (product.stock < quantity) {
      return sendError(res, 400, `Only ${product.stock} items available in stock`);
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [], subtotal: 0 });
    }

    // Check single store rule
    if (cart.store && cart.store.toString() !== product.store.toString() && cart.items.length > 0) {
      if (!forceClear) {
        return res.status(400).json({
          success: false,
          differentStore: true,
          message: 'Your cart contains products from another store. Do you want to clear your cart and add this product?'
        });
      } else {
        // Clear old store items
        cart.items = [];
      }
    }

    cart.store = product.store;

    // Check if item already in cart
    const existingIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + quantity;
      if (product.stock < newQty) {
        return sendError(res, 400, `Only ${product.stock} items available in stock`);
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = product.sellingPrice;
    } else {
      cart.items.push({
        product: product._id,
        quantity: Number(quantity),
        price: product.sellingPrice
      });
    }

    cart.subtotal = calculateSubtotal(cart.items);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('store', 'name slug deliveryFee minimumOrder')
      .populate('items.product', 'name slug brand weight images mrp sellingPrice stock category');

    return sendSuccess(res, 200, 'Product added to cart', { cart: populatedCart });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartQty = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || Number(quantity) < 0) {
      return sendError(res, 400, 'Invalid quantity');
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return sendError(res, 404, 'Cart not found');

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex === -1) return sendError(res, 404, 'Item not found in cart');

    if (Number(quantity) === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(productId);
      if (product && product.stock < Number(quantity)) {
        return sendError(res, 400, `Only ${product.stock} items available in stock`);
      }
      cart.items[itemIndex].quantity = Number(quantity);
      if (product) cart.items[itemIndex].price = product.sellingPrice;
    }

    if (cart.items.length === 0) {
      cart.store = null;
    }

    cart.subtotal = calculateSubtotal(cart.items);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('store', 'name slug deliveryFee minimumOrder')
      .populate('items.product', 'name slug brand weight images mrp sellingPrice stock category');

    return sendSuccess(res, 200, 'Cart updated', { cart: populatedCart });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return sendError(res, 404, 'Cart not found');

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    if (cart.items.length === 0) cart.store = null;

    cart.subtotal = calculateSubtotal(cart.items);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('store', 'name slug deliveryFee minimumOrder')
      .populate('items.product', 'name slug brand weight images mrp sellingPrice stock category');

    return sendSuccess(res, 200, 'Item removed from cart', { cart: populatedCart });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.store = null;
      cart.subtotal = 0;
      await cart.save();
    }
    return sendSuccess(res, 200, 'Cart cleared');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartQty,
  removeFromCart,
  clearCart
};
