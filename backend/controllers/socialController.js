const User = require('../models/User');
const Message = require('../models/Message');

// Send message
const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;

    const message = new Message({
      senderId: req.userId,
      recipientId,
      content,
    });

    await message.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message,
    });
  }
};

// Get messages with a user
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.userId, recipientId: userId },
        { senderId: userId, recipientId: req.userId },
      ],
    }).sort({ createdAt: 1 }).limit(100);

    // Mark as read
    await Message.updateMany(
      {
        senderId: userId,
        recipientId: req.userId,
        isRead: false,
      },
      { isRead: true }
    );

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message,
    });
  }
};

// Add friend
const addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;

    const user = await User.findById(req.userId);
    
    if (user.friends.includes(friendId)) {
      return res.status(400).json({
        success: false,
        message: 'Already friends',
      });
    }

    user.friends.push(friendId);
    await user.save();

    res.json({
      success: true,
      message: 'Friend added successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding friend',
      error: error.message,
    });
  }
};

// Remove friend
const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;

    await User.findByIdAndUpdate(
      req.userId,
      { $pull: { friends: friendId } }
    );

    res.json({
      success: true,
      message: 'Friend removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing friend',
      error: error.message,
    });
  }
};

// Get friends list
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends', 'name email avatar bio');

    res.json({
      success: true,
      friends: user.friends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching friends',
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  addFriend,
  removeFriend,
  getFriends,
};
