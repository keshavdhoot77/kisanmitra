const mongoose = require('mongoose');

/**
 * PriceReference Schema for KisanMitra Marketplace
 * Provides benchmark APMC mandi prices and platform aggregated fair price references.
 */
const priceReferenceSchema = new mongoose.Schema(
  {
    commodity: {
      type: String,
      required: [true, 'Please specify the commodity name'],
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify the commodity category'],
      trim: true,
      lowercase: true,
    },
    market: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    minPrice: {
      type: Number,
      required: [true, 'Minimum price is required'],
      min: [0, 'Minimum price must be positive'],
    },
    maxPrice: {
      type: Number,
      required: [true, 'Maximum price is required'],
      min: [0, 'Maximum price must be positive'],
    },
    modalPrice: {
      type: Number,
      min: [0, 'Modal price must be positive'],
    },
    unit: {
      type: String,
      default: 'Quintal',
      trim: true,
    },
    confidence: {
      type: String,
      enum: {
        values: ['high', 'medium', 'low'],
        message: 'Confidence must be high, medium, or low',
      },
      default: 'medium',
    },
    trend: {
      type: String,
      enum: {
        values: ['up', 'down', 'flat'],
        message: 'Trend must be up, down, or flat',
      },
      default: 'flat',
    },
    source: {
      type: String,
      default: 'platform',
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for price discovery queries by commodity, state, district, and time
priceReferenceSchema.index({ commodity: 1, category: 1, state: 1, district: 1, date: -1 });
priceReferenceSchema.index({ commodity: 1, state: 1, date: -1 });
priceReferenceSchema.index({ commodity: 1, date: -1 });
priceReferenceSchema.index({ date: -1 });

const PriceReference = mongoose.model('PriceReference', priceReferenceSchema);

module.exports = PriceReference;
