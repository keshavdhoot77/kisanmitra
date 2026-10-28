const mongoose = require('mongoose');

/**
 * Order Schema for KisanMitra Marketplace
 * Tracks accepted deals, delivery progress, and payment/transaction status.
 */
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'Order must reference a listing'],
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must have a buyer'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must reference the seller'],
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
    },
    agreedPrice: {
      type: Number,
      required: [true, 'Agreed price is required'],
      min: [0, 'Agreed price must be positive'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity must be positive'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be positive'],
    },
    status: {
      type: String,
      enum: {
        values: ['created', 'confirmed', 'dispatched', 'delivered', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid order status',
      },
      default: 'created',
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes (orderNumber index auto-created by unique:true on the field)
orderSchema.index({ buyer: 1 });
orderSchema.index({ seller: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ buyer: 1, status: 1 });
orderSchema.index({ seller: 1, status: 1 });
orderSchema.index({ listing: 1 });

/**
 * Pre-save hook: Generate unique orderNumber if new document
 * Format: 'KM-' + Date.now() + random 4 digits (e.g. KM-17145284920001234)
 */
orderSchema.pre('save', function (next) {
  if (this.isNew) {
    if (!this.orderNumber) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      this.orderNumber = `KM-${Date.now()}${randomSuffix}`;
    }

    // Populate initial status history if empty
    if (!this.statusHistory || this.statusHistory.length === 0) {
      this.statusHistory = [
        {
          status: this.status || 'created',
          timestamp: new Date(),
          note: 'Order created',
        },
      ];
    }
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
