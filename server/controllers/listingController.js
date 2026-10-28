const Listing = require('../models/Listing');

// @desc    Get all listings with filters, search, pagination
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res, next) => {
  try {
    const {
      category, subCategory, transactionType,
      minPrice, maxPrice, search,
      state, district,
      sort = 'newest', page = 1, limit = 12
    } = req.query;

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    if (!Number.isInteger(pageNumber) || pageNumber < 1 || !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
      return res.status(400).json({ success: false, message: 'Page must be positive and limit must be between 1 and 100.' });
    }

    const filter = { status: 'active' };

    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (transactionType) filter.transactionType = transactionType;
    if (state) filter['location.state'] = state;
    if (district) filter['location.district'] = district;

    if (minPrice || maxPrice) {
      const min = minPrice === undefined ? undefined : Number(minPrice);
      const max = maxPrice === undefined ? undefined : Number(maxPrice);
      if ((min !== undefined && (!Number.isFinite(min) || min < 0)) ||
          (max !== undefined && (!Number.isFinite(max) || max < 0)) ||
          (min !== undefined && max !== undefined && min > max)) {
        return res.status(400).json({ success: false, message: 'Price range is invalid.' });
      }
      filter.price = {};
      if (min !== undefined) filter.price.$gte = min;
      if (max !== undefined) filter.price.$lte = max;
    }

    if (search) {
      const safeSearch = String(search).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } }
      ];
    }

    // Sort mapping
    const sortOptions = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      popular: { views: -1 }
    };

    const skip = (pageNumber - 1) * pageSize;
    const total = await Listing.countDocuments(filter);

    const listings = await Listing.find(filter)
      .populate('seller', 'name rating verifiedIdentity location avatar')
      .sort(sortOptions[sort] || sortOptions.newest)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      data: {
        listings,
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single listing by ID
// @route   GET /api/listings/:id
// @access  Public
const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name rating ratingsCount verifiedIdentity verifiedPhone location avatar bio userType transactionsCount createdAt');

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Increment views
    await Listing.updateOne({ _id: listing._id }, { $inc: { views: 1 } });
    listing.views += 1;

    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Create listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res, next) => {
  try {
    req.body.seller = req.user._id;
    if (req.user.location) {
      req.body.location = req.body.location || req.user.location;
    }

    const listing = await Listing.create({ ...req.body, seller: req.user._id });
    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private (owner or admin)
const updateListing = async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this listing' });
    }

    const editableFields = [
      'title', 'description', 'category', 'subCategory', 'transactionType',
      'price', 'unit', 'quantity', 'negotiable', 'images', 'video',
      'variety', 'harvestDate', 'grade', 'organic', 'location',
    ];
    if (req.user.role === 'admin') editableFields.push('status');
    const updates = Object.fromEntries(
      editableFields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]])
    );

    listing = await Listing.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true
    });

    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private (owner or admin)
const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's listings
// @route   GET /api/listings/me
// @access  Private
const getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: listings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get similar listings
// @route   GET /api/listings/:id/similar
// @access  Public
const getSimilarListings = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const similar = await Listing.find({
      _id: { $ne: listing._id },
      category: listing.category,
      status: 'active'
    })
      .populate('seller', 'name rating location avatar')
      .limit(6)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: similar });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListings, getListing, createListing, updateListing,
  deleteListing, getMyListings, getSimilarListings
};
