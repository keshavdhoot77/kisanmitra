const User = require('../models/User');
const Listing = require('../models/Listing');
const Review = require('../models/Review');

// @desc    Get user by ID (public profile)
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get listing count and review count
const [listings, reviews] = await Promise.all([
      Listing.find({ seller: user._id, status: 'active' }).sort({ createdAt: -1 }).limit(20),
      Review.find({ targetUser: user._id }).populate('reviewer', 'name avatar').sort({ createdAt: -1 }).limit(20),
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        listingCount: listings.length,
        reviewCount: reviews.length,
        listings,
        reviews,
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserById };
