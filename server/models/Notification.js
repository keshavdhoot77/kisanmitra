const mongoose = require('mongoose');

/**
 * Notification Schema for KisanMitra Marketplace
 * Stores user notifications for offers, orders, chats, reviews, and admin alerts.
 */
const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification must have a recipient'],
    },
    type: {
      type: String,
      required: [true, 'Notification type is required'],
      enum: {
        values: [
          'offer_received',
          'offer_accepted',
          'offer_rejected',
          'offer_countered',
          'order_update',
          'new_message',
          'review_received',
          'listing_approved',
          'listing_suspended',
          'system',
        ],
        message: '{VALUE} is not a valid notification type',
      },
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    relatedModel: {
      type: String,
      trim: true,
      enum: ['Offer', 'Order', 'Listing', 'Conversation', 'Review', 'User', null],
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes on recipient, read status, and creation date for fast notification feed loading
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
