const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');

exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getChatList = async (req, res) => {
  try {
    const currentUserId = req.userId;
    if (!mongoose.Types.ObjectId.isValid(currentUserId)) {
        return res.status(400).json({ message: 'Invalid User ID' });
    }

    const currentObjectId = new mongoose.Types.ObjectId(currentUserId);
    
    // Find all messages involving the current user
    const messages = await Message.find({
      $or: [{ senderId: currentObjectId }, { receiverId: currentObjectId }],
    }).sort({ createdAt: -1 });

    const contactIds = new Set();
    messages.forEach((msg) => {
      if (msg.senderId && msg.senderId.toString() !== currentUserId.toString()) {
        contactIds.add(msg.senderId.toString());
      }
      if (msg.receiverId && msg.receiverId.toString() !== currentUserId.toString()) {
        contactIds.add(msg.receiverId.toString());
      }
    });

    const idsArray = Array.from(contactIds);
    if (idsArray.length === 0) {
      return res.status(200).json([]);
    }

    // Populate user info for these IDs
    const contacts = await User.find(
      { _id: { $in: idsArray } },
      'name email role avatar'
    );

    res.status(200).json(contacts);
  } catch (error) {
    console.error('--- Error in getChatList:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
