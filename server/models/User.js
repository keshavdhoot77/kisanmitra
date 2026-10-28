const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema for KisanMitra Marketplace
 * Supports multiple user personas: farmers, buyers, traders, machinery/service providers, etc.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9+\-\s()]{7,15}$/, 'Please provide a valid phone number'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    userType: {
      type: String,
      enum: {
        values: [
          'farmer',
          'buyer',
          'trader',
          'machinery_owner',
          'service_provider',
          'nursery_owner',
          'input_dealer',
          'transport_provider',
          'storage_provider',
          'business',
        ],
        message: '{VALUE} is not a valid user type',
      },
      default: 'farmer',
    },
    location: {
      state: {
        type: String,
        trim: true,
      },
      district: {
        type: String,
        trim: true,
      },
      taluka: {
        type: String,
        trim: true,
      },
      village: {
        type: String,
        trim: true,
      },
      coordinates: {
        lat: {
          type: Number,
        },
        lng: {
          type: Number,
        },
      },
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    avatar: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    ratingsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    transactionsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    verifiedPhone: {
      type: Boolean,
      default: false,
    },
    verifiedIdentity: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    suspended: {
      type: Boolean,
      default: false,
    },
    preferredLanguage: {
      type: String,
      default: 'en',
      enum: ['en', 'hi', 'mr'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast lookup by location and userType (email index auto-created by unique:true)
userSchema.index({ 'location.state': 1, 'location.district': 1 });
userSchema.index({ userType: 1 });

/**
 * Pre-save hook to hash password with bcryptjs (10 salt rounds) if modified
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method to verify entered password against hashed password
 * @param {string} enteredPassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
