const mongoose = require('mongoose');

/**
 * Message Schema for KisanMitra Marketplace
 * Stores individual chat messages between users inside a conversation.
 */
const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Message must belong to a conversation'],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Message must have a sender'],
    },
    text: {
      type: String,
      required: [true, 'Message text cannot be empty'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes on conversation and sender for optimized message history queries
messageSchema.index({ conversation: 1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ conversation: 1, createdAt: 1 });
messageSchema.index({ conversation: 1, read: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
