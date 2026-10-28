const mongoose = require('mongoose');

/**
 * Review Schema for KisanMitra Marketplace
 * Allows buyers and sellers to review each other after transactions.
 */
const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must have a reviewer'],
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must have a target user'],
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    response: {
      type: String,
      trim: true,
      maxlength: [1000, 'Seller response cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes on targetUser and reviewer
reviewSchema.index({ targetUser: 1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ order: 1 });
// Ensure one review per reviewer per order (if order provided) or targetUser
reviewSchema.index({ targetUser: 1, reviewer: 1, order: 1 });

/**
 * Static method to recalculate targetUser's average rating and ratingsCount
 * @param {mongoose.Types.ObjectId} targetUserId
 */
reviewSchema.statics.calculateAverageRating = async function (targetUserId) {
  try {
    const stats = await this.aggregate([
      {
        $match: {
          targetUser: new mongoose.Types.ObjectId(targetUserId),
        },
      },
      {
        $group: {
          _id: '$targetUser',
          ratingsCount: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    const User = mongoose.model('User');

    if (stats.length > 0) {
      await User.findByIdAndUpdate(targetUserId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        ratingsCount: stats[0].ratingsCount,
      });
    } else {
      await User.findByIdAndUpdate(targetUserId, {
        rating: 0,
        ratingsCount: 0,
      });
    }
  } catch (error) {
    console.error('Error calculating average rating:', error);
  }
};

/**
 * Post-save hook: recalculate targetUser's average rating and ratingsCount and save to User model
 */
reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.targetUser);
});

/**
 * Post-delete hook: update user rating after deletion
 */
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.targetUser);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
