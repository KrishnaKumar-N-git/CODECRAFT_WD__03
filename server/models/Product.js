const mongoose = require('mongoose');
const calculateDiscount = require('../utils/calculateDiscount');

const productSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    description: {
      type: String,
      default: ''
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true
    },
    weight: {
      type: String,
      required: [true, 'Weight/Pack size is required'], // e.g. "5 kg", "1 L", "500 g"
      trim: true
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false }
      }
    ],
    mrp: {
      type: Number,
      required: [true, 'MRP is required'],
      min: [0, 'MRP must be non-negative']
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling Price is required'],
      min: [0, 'Selling price must be non-negative']
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    discountPercentage: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 50
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true }
      }
    ],
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    isBestSeller: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Pre-save middleware to calculate discount automatically on backend
productSchema.pre('save', function (next) {
  const { discountAmount, discountPercentage } = calculateDiscount(this.mrp, this.sellingPrice);
  this.discountAmount = discountAmount;
  this.discountPercentage = discountPercentage;
  next();
});

productSchema.index({ name: 'text', brand: 'text', description: 'text' });
productSchema.index({ store: 1, category: 1, sellingPrice: 1 });

module.exports = mongoose.model('Product', productSchema);
