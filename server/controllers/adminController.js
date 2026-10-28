const User = require('../models/User');
const Listing = require('../models/Listing');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalListings, activeListings, totalOrders] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Listing.countDocuments({ status: 'active' }),
      Order.countDocuments()
    ]);

    // Revenue from completed orders
    const revenueResult = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      data: { totalUsers, totalListings, activeListings, totalOrders, revenue }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, userType, role } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (userType) filter.userType = userType;
    if (role) filter.role = role;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: { users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (admin)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res, next) => {
  try {
    const { role, suspended } = req.body;
    const updates = {};
    if (role) updates.role = role;
    if (suspended !== undefined) updates.suspended = suspended;

    if (req.params.id === req.user._id.toString() && suspended === true) {
      return res.status(400).json({ success: false, message: 'You cannot suspend your own admin account.' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all listings (admin)
// @route   GET /api/admin/listings
// @access  Private/Admin
const getAdminListings = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Listing.countDocuments(filter);

    const listings = await Listing.find(filter)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: { listings, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing status (admin)
// @route   PUT /api/admin/listings/:id/status
// @access  Private/Admin
const updateListingStatus = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    listing.status = req.body.status;
    await listing.save();

    // Notify seller if suspended
    if (req.body.status === 'suspended') {
      await Notification.create({
        recipient: listing.seller,
        type: 'listing_suspended',
        title: 'Listing Suspended',
        message: `Your listing "${listing.title}" has been suspended by admin`,
        relatedModel: 'Listing',
        relatedId: listing._id
      });
    }

    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getUsers, updateUserStatus, getAdminListings, updateListingStatus };
