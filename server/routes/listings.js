const express = require('express');
const router = express.Router();
const {
  getListings, getListing, createListing, updateListing,
  deleteListing, getMyListings, getSimilarListings
} = require('../controllers/listingController');
const { protect } = require('../middleware/auth');

// IMPORTANT: specific routes before param routes
router.get('/me', protect, getMyListings);
router.get('/', getListings);
router.post('/', protect, createListing);
router.get('/:id/similar', getSimilarListings);
router.get('/:id', getListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;
