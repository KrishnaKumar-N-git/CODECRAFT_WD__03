const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Store name is required'],
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
    logo: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    banner: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      street: { type: String, required: true },
      area: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    location: {
      latitude: { type: Number, default: 12.9716 },
      longitude: { type: Number, default: 77.5946 }
    },
    openingTime: { type: String, default: '07:00 AM' },
    closingTime: { type: String, default: '10:00 PM' },
    deliveryFee: { type: Number, default: 30 },
    minimumOrder: { type: Number, default: 100 },
    deliveryRadius: { type: Number, default: 10 }, // km
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'SUSPENDED'],
      default: 'ACTIVE'
    },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Store', storeSchema);
