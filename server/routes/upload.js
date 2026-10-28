const express = require('express');
const router = express.Router();
const { uploadImages, uploadVideo } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const { uploadImages: multerImages, uploadVideo: multerVideo } = require('../middleware/upload');

router.post('/images', protect, multerImages, uploadImages);
router.post('/video', protect, multerVideo, uploadVideo);

module.exports = router;
