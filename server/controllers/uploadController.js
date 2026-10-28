// @desc    Upload product images
// @route   POST /api/upload/images
// @access  Private
const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image' });
    }

    const urls = req.files.map(file => `/uploads/${file.filename}`);
    res.status(200).json({ success: true, data: { urls } });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product video
// @route   POST /api/upload/video
// @access  Private
const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a video' });
    }

    const url = `/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, data: { url } });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImages, uploadVideo };
