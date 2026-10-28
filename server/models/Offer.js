const mongoose = require('mongoose');

/**
 * Offer Schema for KisanMitra Marketplace
 * Represents negotiations/bids made by buyers on farmer/seller listings.
 */
const offerSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'Offer must be linked to a listing'],
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Offer must have a buyer'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Offer must specify the listing seller'],
    },
    price: {
      type: Number,
      required: [true, 'Please specify offered price per unit'],
      min: [0, 'Price must be a positive number'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please specify desired quantity'],
      min: [0, 'Quantity must be greater than zero'],
    },
    unit: {
      type: String,
      trim: true,
      default: 'KG',
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'rejected', 'countered', 'withdrawn', 'expired'],
        message: '{VALUE} is not a valid offer status',
      },
      default: 'pending',
    },
    counterOffer: {
      price: {
        type: Number,
        min: 0,
      },
      quantity: {
        type: Number,
        min: 0,
      },
      message: {
        type: String,
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes to speed up queries by listing, buyer, seller, and status
offerSchema.index({ listing: 1 });
offerSchema.index({ buyer: 1 });
offerSchema.index({ seller: 1 });
offerSchema.index({ status: 1 });
offerSchema.index({ listing: 1, status: 1 });
offerSchema.index({ buyer: 1, status: 1 });
offerSchema.index({ seller: 1, status: 1 });
offerSchema.index({ listing: 1, buyer: 1 });

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
