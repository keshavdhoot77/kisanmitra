const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const { getIO } = require('../config/socket');

const emitSocket = (userId, event, data) => {
  try {
    const io = getIO();
    if (io) io.to(`user_${userId}`).emit(event, data);
  } catch (e) { /* socket not ready */ }
};

// @desc    Get user's conversations
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'name avatar')
      .populate('listing', 'title images')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/conversations/:id/messages
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Verify user is a participant
    if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Message.countDocuments({ conversation: req.params.id });

    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(Number(limit));

    // Mark messages as read
    await Message.updateMany(
      { conversation: req.params.id, sender: { $ne: req.user._id }, read: false },
      { read: true }
    );

    // Reset unread count for this user
    if (conversation.unreadCount) {
      conversation.unreadCount.set(req.user._id.toString(), 0);
      await conversation.save();
    }

    res.status(200).json({
      success: true,
      data: { messages, total, page: Number(page) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/chat/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    let { conversationId, recipientId, text, listingId } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }
      if (!conversation.participants.some((participant) => participant.toString() === req.user._id.toString())) {
        return res.status(403).json({ success: false, message: 'Not authorized to message in this conversation.' });
      }
    } else if (recipientId) {
      if (recipientId.toString() === req.user._id.toString()) {
        return res.status(400).json({ success: false, message: 'You cannot start a conversation with yourself.' });
      }
      // Find or create conversation between two users
      conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, recipientId], $size: 2 }
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.user._id, recipientId],
          listing: listingId || undefined
        });
      }
    } else {
      return res.status(400).json({ success: false, message: 'conversationId or recipientId required' });
    }

    // Create message
    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      text
    });

    // Update conversation's last message
    conversation.lastMessage = {
      text,
      sender: req.user._id,
      createdAt: new Date()
    };

    // Increment unread count for recipient(s)
    conversation.participants.forEach(p => {
      if (p.toString() !== req.user._id.toString()) {
        const current = conversation.unreadCount?.get(p.toString()) || 0;
        if (!conversation.unreadCount) conversation.unreadCount = new Map();
        conversation.unreadCount.set(p.toString(), current + 1);
      }
    });

    await conversation.save();

    // Populate sender for response
    const populatedMessage = await Message.findById(message._id).populate('sender', 'name avatar');

    // Emit to recipient(s)
    conversation.participants.forEach(p => {
      if (p.toString() !== req.user._id.toString()) {
        emitSocket(p, 'new_message', {
          message: populatedMessage,
          conversationId: conversation._id
        });
      }
    });

    // Create notification for recipient
    const recipientIds = conversation.participants.filter(
      p => p.toString() !== req.user._id.toString()
    );
    for (const rid of recipientIds) {
      await Notification.create({
        recipient: rid,
        type: 'new_message',
        title: 'New Message',
        message: `${req.user.name}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`,
        relatedModel: 'Conversation',
        relatedId: conversation._id
      });
    }

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read
// @route   PUT /api/chat/messages/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.sender.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot mark own message as read' });
    }

    const conversation = await Conversation.findOne({ _id: message.conversation, participants: req.user._id });
    if (!conversation) {
      return res.status(403).json({ success: false, message: 'Not authorized to read this message.' });
    }

    message.read = true;
    await message.save();

    res.status(200).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

module.exports = { getConversations, getMessages, sendMessage, markAsRead };
