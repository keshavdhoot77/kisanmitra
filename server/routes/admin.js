const express = require('express');
const router = express.Router();
const {
  getStats, getUsers, updateUserStatus,
  getAdminListings, updateListingStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/listings', getAdminListings);
router.put('/listings/:id/status', updateListingStatus);

module.exports = router;
