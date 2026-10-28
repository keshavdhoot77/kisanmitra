const { Listing, Offer, Order, Notification } = require('../models');
const { getIO } = require('../config/socket');
const { asyncHandler } = require('../middleware/validate');

/**
 * Helper to emit a socket event to a user's private room.
 * Safely catches exceptions if Socket.IO server is not yet initialized.
 *
 * @param {string|import('mongoose').Types.ObjectId} userId - Target user ID
 * @param {string} event - Socket event name
 * @param {object} payload - Event payload data
 */
const emitSocketNotification = (userId, event, payload) => {
  try {
    const io = getIO();
    if (io) {
      io.to(`user_${userId}`).emit(event, payload);
    }
  } catch (error) {
    console.warn(`[Socket Warning] Could not emit event '${event}' to user_${userId}: ${error.message}`);
  }
};

/**
 * @desc    Create a new offer on a listing
 * @route   POST /api/offers
 * @access  Private (Authenticated buyer)
 */
const createOffer = asyncHandler(async (req, res) => {
  const { listing: listingId, price, quantity, unit, message } = req.body;

  // Validate required inputs
  if (!listingId || price === undefined || quantity === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Listing ID, price, and quantity are required.',
    });
  }

  const numericPrice = Number(price);
  const numericQuantity = Number(quantity);

  if (isNaN(numericPrice) || numericPrice <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Offered price must be a positive number.',
    });
  }

  if (isNaN(numericQuantity) || numericQuantity <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Offered quantity must be a positive number.',
    });
  }

  // Find target listing
  const listing = await Listing.findById(listingId);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: 'Listing not found.',
    });
  }

  // Ensure listing is active
  if (listing.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: `Offers can only be made on active listings. Listing is currently '${listing.status}'.`,
    });
  }

  if (numericQuantity > listing.quantity || (unit && unit !== listing.unit)) {
    return res.status(400).json({ success: false, message: 'Offer quantity or unit is not available for this listing.' });
  }

  // Prevent seller from submitting offers on their own listing
  if (listing.seller.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'You cannot make an offer on your own listing.',
    });
  }

  // Create offer document
  const offer = await Offer.create({
    listing: listing._id,
    buyer: req.user._id,
    seller: listing.seller,
    price: numericPrice,
    quantity: numericQuantity,
    unit: unit || listing.unit || 'KG',
    message: message ? message.trim() : '',
    status: 'pending',
  });

  // Increment listing offersCount by 1
  await Listing.findByIdAndUpdate(listing._id, { $inc: { offersCount: 1 } });

  // Retrieve fully populated offer for response and socket payload
  const populatedOffer = await Offer.findById(offer._id)
    .populate('buyer', 'name rating location avatar')
    .populate('seller', 'name avatar')
    .populate('listing', 'title price unit images category');

  // Emit socket event 'new_offer' to seller's room (user_<sellerId>)
  emitSocketNotification(listing.seller, 'new_offer', {
    offer: populatedOffer,
    message: `You received a new offer of ₹${numericPrice}/${populatedOffer.unit} on "${listing.title}".`,
  });

  // Create a Notification record for the seller
  await Notification.create({
    recipient: listing.seller,
    type: 'offer_received',
    title: 'New Offer Received',
    message: `${req.user.name || 'A buyer'} made an offer of ₹${numericPrice} for ${numericQuantity} ${populatedOffer.unit} on "${listing.title}".`,
    relatedModel: 'Offer',
    relatedId: offer._id,
  });

  return res.status(201).json({
    success: true,
    message: 'Offer submitted successfully.',
    data: populatedOffer,
  });
});

/**
 * @desc    Get all offers for a specific listing (Seller only)
 * @route   GET /api/offers/listing/:listingId
 * @access  Private (Listing seller)
 */
const getOffersForListing = asyncHandler(async (req, res) => {
  const { listingId } = req.params;

  const listing = await Listing.findById(listingId);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: 'Listing not found.',
    });
  }

  // Verify that the authenticated user is the seller of the listing
  if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only the seller can view offers for this listing.',
    });
  }

  // Optional pagination
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
  const skip = (page - 1) * limit;

  // Filter offers by listing and sort by createdAt descending
  const [offers, totalOffers] = await Promise.all([
    Offer.find({ listing: listingId })
      .populate('buyer', 'name rating location avatar')
      .populate('listing', 'title price unit images category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Offer.countDocuments({ listing: listingId }),
  ]);

  return res.status(200).json({
    success: true,
    message: 'Offers retrieved successfully.',
    count: offers.length,
    total: totalOffers,
    page,
    pages: Math.ceil(totalOffers / limit),
    data: offers,
  });
});

/**
 * @desc    Get all offers sent or received by the authenticated user
 * @route   GET /api/offers/me
 * @access  Private
 */
const getMyOffers = asyncHandler(async (req, res) => {
  const { role, status } = req.query;

  // Build filter query: buyer, seller, or both
  const filter = {};

  if (role === 'buyer') {
    filter.buyer = req.user._id;
  } else if (role === 'seller') {
    filter.seller = req.user._id;
  } else {
    filter.$or = [{ buyer: req.user._id }, { seller: req.user._id }];
  }

  if (status) {
    filter.status = status;
  }

  // Pagination parameters
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const [offers, totalOffers] = await Promise.all([
    Offer.find(filter)
      .populate('listing', 'title price unit images category')
      .populate('buyer', 'name avatar')
      .populate('seller', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Offer.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    message: 'My offers retrieved successfully.',
    count: offers.length,
    total: totalOffers,
    page,
    pages: Math.ceil(totalOffers / limit),
    data: offers,
  });
});

/**
 * @desc    Accept an offer on a listing (Seller only)
 *          Automatically marks other pending offers as rejected,
 *          creates an order, and updates listing status to 'sold'.
 * @route   POST /api/offers/:id/accept
 * @access  Private (Listing seller)
 */
const createOrderFromAcceptedOffer = async (offer, listing, agreedPrice, quantity) => {
  const unit = offer.unit || listing.unit || 'KG';
  offer.price = agreedPrice;
  offer.quantity = quantity;
  offer.status = 'accepted';
  await offer.save();

  await Offer.updateMany(
    { listing: offer.listing, _id: { $ne: offer._id }, status: { $in: ['pending', 'countered'] } },
    { $set: { status: 'rejected' } }
  );

  const order = await Order.create({
    listing: offer.listing,
    buyer: offer.buyer,
    seller: offer.seller,
    offer: offer._id,
    agreedPrice,
    quantity,
    unit,
    totalAmount: agreedPrice * quantity,
    status: 'created',
    statusHistory: [{ status: 'created', timestamp: new Date(), note: `Order generated from accepted offer #${offer._id}` }],
  });

  listing.status = 'sold';
  await listing.save();
  emitSocketNotification(offer.buyer, 'offer_accepted', {
    offer, order,
    message: `Your offer of ₹${agreedPrice}/${unit} on "${listing.title}" has been accepted.`,
  });
  await Notification.create({
    recipient: offer.buyer,
    type: 'offer_accepted',
    title: 'Offer Accepted!',
    message: `Your offer for ₹${agreedPrice}/${unit} on "${listing.title}" was accepted. Order #${order.orderNumber} has been generated.`,
    relatedModel: 'Order',
    relatedId: order._id,
  });
  return order;
};

const acceptOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const offer = await Offer.findById(id);
  if (!offer) {
    return res.status(404).json({
      success: false,
      message: 'Offer not found.',
    });
  }

  // Verify that requester is the seller
  if (offer.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only the seller can accept this offer.',
    });
  }

  // Ensure offer is in a state that can be accepted
  if (offer.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: `Cannot accept offer. Current status is '${offer.status}'.`,
    });
  }

  // Retrieve listing to ensure validity and fetch unit if needed
  const listing = await Listing.findById(offer.listing);
  if (!listing) {
    return res.status(404).json({
      success: false,
      message: 'Referenced listing no longer exists.',
    });
  }
  if (listing.status !== 'active' || offer.quantity > listing.quantity || offer.unit !== listing.unit) {
    return res.status(409).json({ success: false, message: 'This listing is no longer available for the requested offer.' });
  }

  const agreedPrice = offer.price;
  const quantity = offer.quantity;
  const unit = offer.unit || listing.unit || 'KG';
  const order = await createOrderFromAcceptedOffer(offer, listing, agreedPrice, quantity);

  return res.status(200).json({
    success: true,
    message: 'Offer accepted successfully. Order has been generated.',
    data: {
      offer,
      order,
    },
  });
});

const acceptCounterOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).json({ success: false, message: 'Offer not found.' });
  if (offer.buyer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Only the buyer who made this offer can accept the counter offer.' });
  }
  if (offer.status !== 'countered' || !offer.counterOffer?.price || !offer.counterOffer?.quantity) {
    return res.status(400).json({ success: false, message: 'This offer has no active counter offer.' });
  }

  const listing = await Listing.findById(offer.listing);
  if (!listing || listing.status !== 'active') {
    return res.status(409).json({ success: false, message: 'This listing is no longer available.' });
  }
  if (offer.counterOffer.quantity > listing.quantity || offer.unit !== listing.unit) {
    return res.status(409).json({ success: false, message: 'The counter offer quantity is no longer available.' });
  }

  const order = await createOrderFromAcceptedOffer(offer, listing, offer.counterOffer.price, offer.counterOffer.quantity);
  return res.status(200).json({ success: true, message: 'Counter offer accepted. Order has been generated.', data: { offer, order } });
});

/**
 * @desc    Reject an offer on a listing (Seller only)
 * @route   POST /api/offers/:id/reject
 * @access  Private (Listing seller)
 */
const rejectOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const offer = await Offer.findById(id).populate('listing', 'title');
  if (!offer) {
    return res.status(404).json({
      success: false,
      message: 'Offer not found.',
    });
  }

  // Verify that requester is the seller
  if (offer.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only the seller can reject this offer.',
    });
  }

  // Check current status
  if (offer.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: `Cannot reject an offer with status '${offer.status}'.`,
    });
  }

  // Update offer status
  offer.status = 'rejected';
  await offer.save();

  const listingTitle = offer.listing ? offer.listing.title : 'the listing';

  // Emit socket event 'offer_rejected' to buyer room
  emitSocketNotification(offer.buyer, 'offer_rejected', {
    offer,
    message: `Your offer on "${listingTitle}" has been declined by the seller.`,
  });

  // Create Notification for buyer
  await Notification.create({
    recipient: offer.buyer,
    type: 'offer_rejected',
    title: 'Offer Declined',
    message: `Your offer of ₹${offer.price} on "${listingTitle}" was declined by the seller.`,
    relatedModel: 'Offer',
    relatedId: offer._id,
  });

  return res.status(200).json({
    success: true,
    message: 'Offer rejected successfully.',
    data: offer,
  });
});

/**
 * @desc    Counter an offer with revised price/quantity/message (Seller only)
 * @route   POST /api/offers/:id/counter
 * @access  Private (Listing seller)
 */
const counterOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { price, quantity, message } = req.body;

  if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid counter offer price.',
    });
  }
  const counterQuantity = quantity === undefined ? undefined : Number(quantity);
  if (counterQuantity !== undefined && (!Number.isFinite(counterQuantity) || counterQuantity <= 0)) {
    return res.status(400).json({ success: false, message: 'Counter offer quantity must be a positive number.' });
  }

  const offer = await Offer.findById(id).populate('listing', 'title');
  if (!offer) {
    return res.status(404).json({
      success: false,
      message: 'Offer not found.',
    });
  }

  // Verify that requester is the seller
  if (offer.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only the seller can make a counter offer.',
    });
  }

  // Check current status
  if (offer.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: `Cannot counter an offer with status '${offer.status}'.`,
    });
  }

  const listing = await Listing.findById(offer.listing._id || offer.listing);
  const finalQuantity = counterQuantity === undefined ? offer.quantity : counterQuantity;
  if (!listing || listing.status !== 'active' || finalQuantity > listing.quantity || offer.unit !== listing.unit) {
    return res.status(400).json({ success: false, message: 'Counter offer quantity or unit is not available for this listing.' });
  }

  // Update status and counterOffer details
  offer.status = 'countered';
  offer.counterOffer = {
    price: Number(price),
    quantity: finalQuantity,
    message: message ? message.trim() : '',
    createdAt: new Date(),
  };

  await offer.save();

  const listingTitle = offer.listing ? offer.listing.title : 'the listing';

  // Emit socket event 'offer_countered' to buyer room
  emitSocketNotification(offer.buyer, 'offer_countered', {
    offer,
    counterOffer: offer.counterOffer,
    message: `Seller proposed a counter offer of ₹${offer.counterOffer.price} for "${listingTitle}".`,
  });

  // Create Notification for buyer
  await Notification.create({
    recipient: offer.buyer,
    type: 'offer_countered',
    title: 'Counter Offer Received',
    message: `The seller countered with ₹${offer.counterOffer.price} for ${offer.counterOffer.quantity} ${offer.unit} on "${listingTitle}".`,
    relatedModel: 'Offer',
    relatedId: offer._id,
  });

  return res.status(200).json({
    success: true,
    message: 'Counter offer submitted successfully.',
    data: offer,
  });
});

/**
 * @desc    Withdraw an offer (Buyer only)
 * @route   POST /api/offers/:id/withdraw
 * @access  Private (Buyer)
 */
const withdrawOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const offer = await Offer.findById(id);
  if (!offer) {
    return res.status(404).json({
      success: false,
      message: 'Offer not found.',
    });
  }

  // Verify that requester is the buyer
  if (offer.buyer.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only the buyer who made the offer can withdraw it.',
    });
  }

  // Disallow withdrawal if offer is already accepted, withdrawn, or rejected
  if (['accepted', 'withdrawn', 'rejected'].includes(offer.status)) {
    return res.status(400).json({
      success: false,
      message: `Cannot withdraw an offer that is already '${offer.status}'.`,
    });
  }

  // Update offer status
  offer.status = 'withdrawn';
  await offer.save();

  // Decrement listing offersCount by 1 (ensuring it doesn't go below 0)
  await Listing.updateOne(
    { _id: offer.listing, offersCount: { $gt: 0 } },
    { $inc: { offersCount: -1 } }
  );

  return res.status(200).json({
    success: true,
    message: 'Offer withdrawn successfully.',
    data: offer,
  });
});

module.exports = {
  createOffer,
  getOffersForListing,
  getMyOffers,
  acceptOffer,
  rejectOffer,
  counterOffer,
  withdrawOffer,
  acceptCounterOffer,
};
