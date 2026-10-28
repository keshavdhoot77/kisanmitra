const Order = require('../models/Order');
const Notification = require('../models/Notification');
const { getIO } = require('../config/socket');

const emitSocket = (userId, event, data) => {
  try {
    const io = getIO();
    if (io) io.to(`user_${userId}`).emit(event, data);
  } catch (e) { /* socket not ready */ }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { listing: listingId, agreedPrice, quantity, unit } = req.body;
    if (!listingId || !Number.isFinite(Number(agreedPrice)) || Number(agreedPrice) <= 0 ||
        !Number.isFinite(Number(quantity)) || Number(quantity) <= 0 || !unit) {
      return res.status(400).json({ success: false, message: 'Listing, positive price, positive quantity, and unit are required.' });
    }

    const Listing = require('../models/Listing');
    const listing = await Listing.findById(listingId);
    if (!listing || listing.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Active listing not found.' });
    }
    if (listing.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot order your own listing.' });
    }
    if (Number(quantity) > listing.quantity || unit !== listing.unit) {
      return res.status(400).json({ success: false, message: 'Order quantity or unit is not available for this listing.' });
    }

    const order = await Order.create({
      listing: listing._id,
      buyer: req.user._id,
      seller: listing.seller,
      agreedPrice: Number(agreedPrice),
      quantity: Number(quantity),
      unit: listing.unit,
      totalAmount: Number(agreedPrice) * Number(quantity),
      status: 'created',
      statusHistory: [{ status: 'created', timestamp: new Date(), note: 'Order created' }],
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my orders (as buyer or seller)
// @route   GET /api/orders/me
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const { role, status } = req.query;
    const filter = {};

    if (role === 'buyer') filter.buyer = req.user._id;
    else if (role === 'seller') filter.seller = req.user._id;
    else filter.$or = [{ buyer: req.user._id }, { seller: req.user._id }];

    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('listing', 'title images price unit category')
      .populate('buyer', 'name avatar')
      .populate('seller', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order detail
// @route   GET /api/orders/:id
// @access  Private (buyer or seller)
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('listing', 'title images price unit category description location')
      .populate('buyer', 'name avatar email phone location')
      .populate('seller', 'name avatar email phone location')
      .populate('offer');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const buyerId = order.buyer?._id?.toString() || order.buyer?.toString();
    const sellerId = order.seller?._id?.toString() || order.seller?.toString();
    const isOrderParticipant = buyerId === req.user._id.toString() || sellerId === req.user._id.toString();
    if (!isOrderParticipant && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const { status, note } = req.body;

    const isBuyer = order.buyer.toString() === req.user._id.toString();
    const isSeller = order.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Validate transitions
    const validTransitions = {
      created: ['confirmed', 'cancelled'],
      confirmed: ['dispatched', 'cancelled'],
      dispatched: ['delivered'],
      delivered: ['completed'],
    };

    if (!validTransitions[order.status] || !validTransitions[order.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from '${order.status}' to '${status}'`
      });
    }

    const allowedActor = isAdmin ||
      ((status === 'confirmed' || status === 'dispatched') && isSeller) ||
      ((status === 'delivered' || status === 'completed') && isBuyer);
    if (!allowedActor) {
      return res.status(403).json({ success: false, message: 'Only the seller can confirm or dispatch, and only the buyer can confirm delivery or completion.' });
    }

    order.status = status;
    order.statusHistory.push({ status, timestamp: new Date(), note: note || `Status updated to ${status}` });

    if (status === 'completed') {
      // Increment transaction counts for both parties
      const User = require('../models/User');
      await Promise.all([
        User.findByIdAndUpdate(order.buyer, { $inc: { transactionsCount: 1 } }),
        User.findByIdAndUpdate(order.seller, { $inc: { transactionsCount: 1 } })
      ]);
    }

    await order.save();

    // Notify the other party
    const otherParty = req.user._id.toString() === order.buyer.toString() ? order.seller : order.buyer;
    emitSocket(otherParty, 'order_update', { orderId: order._id, status });
    await Notification.create({
      recipient: otherParty,
      type: 'order_update',
      title: 'Order Updated',
      message: `Order ${order.orderNumber} status changed to ${status}`,
      relatedModel: 'Order',
      relatedId: order._id
    });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   POST /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.buyer.toString() !== req.user._id.toString() &&
        order.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!['created', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }

    order.status = 'cancelled';
    order.cancellationReason = req.body.reason || 'No reason provided';
    order.statusHistory.push({ status: 'cancelled', timestamp: new Date(), note: order.cancellationReason });
    await order.save();

    // Notify the other party
    const otherParty = req.user._id.toString() === order.buyer.toString() ? order.seller : order.buyer;
    emitSocket(otherParty, 'order_update', { orderId: order._id, status: 'cancelled' });
    await Notification.create({
      recipient: otherParty,
      type: 'order_update',
      title: 'Order Cancelled',
      message: `Order ${order.orderNumber} has been cancelled`,
      relatedModel: 'Order',
      relatedId: order._id
    });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrder, updateOrderStatus, cancelOrder };
