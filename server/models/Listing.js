const mongoose = require('mongoose');

/**
 * Listing Schema for KisanMitra Marketplace
 * Supports agricultural produce, nursery plants, machinery, rental services, inputs, and storage/transport.
 */
const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a listing title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: [
          'agricultural-produce',
          'plants-nursery',
          'machinery',
          'services',
          'agri-inputs',
          'materials',
          'transportation',
          'storage',
        ],
        message: '{VALUE} is not a valid listing category',
      },
    },
    subCategory: {
      type: String,
      trim: true,
    },
    transactionType: {
      type: String,
      enum: ['sell', 'buy', 'rent'],
      default: 'sell',
    },
    price: {
      type: Number,
      required: [true, 'Please specify the price'],
      min: [0, 'Price must be a positive number'],
    },
    unit: {
      type: String,
      enum: ['KG', 'Quintal', 'Ton', 'Piece', 'Day', 'Acre', 'Hour'],
      default: 'KG',
    },
    quantity: {
      type: Number,
      required: [true, 'Please specify the quantity available'],
      min: [0, 'Quantity cannot be negative'],
    },
    negotiable: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [String],
      default: [],
    },
    video: {
      type: String,
      default: '',
    },
    variety: {
      type: String,
      trim: true,
    },
    harvestDate: {
      type: String,
      trim: true,
    },
    grade: {
      type: String,
      enum: {
        values: ['A', 'B', 'C'],
        message: 'Grade must be A, B, or C',
      },
    },
    organic: {
      type: Boolean,
      default: false,
    },
    location: {
      state: {
        type: String,
        trim: true,
      },
      district: {
        type: String,
        trim: true,
      },
      taluka: {
        type: String,
        trim: true,
      },
      village: {
        type: String,
        trim: true,
      },
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A listing must belong to a seller'],
    },
    status: {
      type: String,
      enum: ['active', 'sold', 'expired', 'draft', 'pending_approval', 'suspended'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    offersCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Full text index on title and description for keyword search
listingSchema.index(
  { title: 'text', description: 'text' },
  { weights: { title: 5, description: 1 } }
);

// Compound and individual indexes for query optimization
listingSchema.index({ category: 1 });
listingSchema.index({ seller: 1 });
listingSchema.index({ status: 1 });
listingSchema.index({ 'location.state': 1 });
listingSchema.index({ 'location.district': 1 });
listingSchema.index({ category: 1, status: 1 });
listingSchema.index({ seller: 1, status: 1 });
listingSchema.index({ status: 1, createdAt: -1 });
listingSchema.index({ 'location.state': 1, 'location.district': 1, status: 1 });
listingSchema.index({ transactionType: 1 });
listingSchema.index({ price: 1 });

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
