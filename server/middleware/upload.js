const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

// Directory for uploaded media files (server/uploads)
const uploadDir = path.join(__dirname, '../uploads');

// Create uploads/ directory if it doesn't exist using fs.mkdirSync
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const randomHex = crypto.randomBytes(4).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    // Filename format: fieldname-Date.now()-randomhex.ext
    cb(null, `${file.fieldname}-${Date.now()}-${randomHex}${ext}`);
  },
});

// Allowed MIME types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4'];
const ALL_ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

/**
 * Filter for verifying image uploads (JPEG, PNG, WEBP)
 */
const imageFileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(
      `Invalid file type '${file.mimetype}'. Only image/jpeg, image/png, and image/webp are allowed.`
    );
    error.statusCode = 400;
    cb(error, false);
  }
};

/**
 * Filter for verifying video uploads (MP4)
 */
const videoFileFilter = (req, file, cb) => {
  if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(
      `Invalid file type '${file.mimetype}'. Only video/mp4 is allowed.`
    );
    error.statusCode = 400;
    cb(error, false);
  }
};

/**
 * General file filter allowing image/jpeg, image/png, image/webp, video/mp4
 */
const generalFileFilter = (req, file, cb) => {
  if (ALL_ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(
      `Invalid file type '${file.mimetype}'. Only image/jpeg, image/png, image/webp, and video/mp4 are allowed.`
    );
    error.statusCode = 400;
    cb(error, false);
  }
};

/**
 * Upload multiple images middleware: multer.array('images', 5)
 * Allows up to 5 images, maximum 5MB each.
 */
const uploadImages = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for images
  },
}).array('images', 5);

/**
 * Upload single video middleware: multer.single('video')
 * Allows 1 video, maximum 50MB.
 */
const uploadVideo = multer({
  storage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for video
  },
}).single('video');

/**
 * Generic multer instance configured with combined file filter
 */
const upload = multer({
  storage,
  fileFilter: generalFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

module.exports = {
  uploadImages,
  uploadVideo,
  upload,
  storage,
};
