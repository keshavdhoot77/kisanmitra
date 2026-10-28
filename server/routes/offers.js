const express = require('express');
const router = express.Router();
const {
  createOffer, getOffersForListing, getMyOffers,
  acceptOffer, acceptCounterOffer, rejectOffer, counterOffer, withdrawOffer
} = require('../controllers/offerController');
const { protect } = require('../middleware/auth');

// All routes protected
router.use(protect);

// Specific before param
router.get('/listing/:listingId', getOffersForListing);
router.get('/me', getMyOffers);
router.post('/', createOffer);
router.post('/:id/accept', acceptOffer);
router.post('/:id/accept-counter', acceptCounterOffer);
router.post('/:id/reject', rejectOffer);
router.post('/:id/counter', counterOffer);
router.post('/:id/withdraw', withdrawOffer);

module.exports = router;
