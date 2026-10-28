const express = require('express');
const router = express.Router();
const { createReview, getUserReviews, respondToReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/user/:userId', getUserReviews);
router.post('/:id/respond', protect, respondToReview);

module.exports = router;
