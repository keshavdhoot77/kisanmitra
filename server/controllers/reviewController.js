const Review = require('../models/Review');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const { getIO } = require('../config/socket');

const emitSocket = (userId, event, data) => {
  try {
    const io = getIO();
    if (io) io.to(`user_${userId}`).emit(event, data);
  } catch (e) { /* socket not ready */ }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { targetUser, order, rating, comment } = req.body;

    if (!targetUser || !order) {
      return res.status(400).json({ success: false, message: 'A completed order and review target are required.' });
    }

    if (targetUser.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot review yourself' });
    }

    const completedOrder = await Order.findById(order);
    if (!completedOrder || completedOrder.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Reviews are only allowed for completed orders.' });
    }
    const isOrderParticipant = [completedOrder.buyer, completedOrder.seller]
      .some((participant) => participant.toString() === req.user._id.toString());
    const isOrderCounterparty = [completedOrder.buyer, completedOrder.seller]
      .some((participant) => participant.toString() === targetUser.toString());
    if (!isOrderParticipant || !isOrderCounterparty || completedOrder.buyer.toString() === completedOrder.seller.toString()) {
      return res.status(403).json({ success: false, message: 'You can only review the other party in your completed order.' });
    }

    // Check for duplicate review on same order
    if (order) {
      const existing = await Review.findOne({ reviewer: req.user._id, order });
      if (existing) {
        return res.status(400).json({ success: false, message: 'You have already reviewed this order' });
      }
    }

    const review = await Review.create({
      reviewer: req.user._id,
      targetUser,
      order,
      rating,
      comment
    });

    // Post-save hook in Review model handles rating recalculation

    const populated = await Review.findById(review._id)
      .populate('reviewer', 'name avatar');

    // Notify the reviewed user
    emitSocket(targetUser, 'review_received', { review: populated });
    await Notification.create({
      recipient: targetUser,
      type: 'review_received',
      title: 'New Review',
      message: `${req.user.name} left a ${rating}-star review`,
      relatedModel: 'Review',
      relatedId: review._id
    });

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ targetUser: req.params.userId })
      .populate('reviewer', 'name avatar')
      .populate('order', 'orderNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to a review
// @route   POST /api/reviews/:id/respond
// @access  Private (reviewed user only)
const respondToReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.targetUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the reviewed user can respond' });
    }

    review.response = req.body.response;
    await review.save();

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getUserReviews, respondToReview };
