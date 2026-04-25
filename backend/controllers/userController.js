const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password').populate('friends', 'name email avatar');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio, interests, avatar, phone, collegeName } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name,
        bio,
        interests,
        avatar,
        phone,
        collegeName,
        updatedAt: Date.now(),
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

// Get all users (for friend discovery)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } })
      .select('name email avatar bio interests class -password')
      .limit(50);

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { class: { $regex: query, $options: 'i' } },
        { collegeName: { $regex: query, $options: 'i' } },
      ],
      _id: { $ne: req.userId },
    }).select('name email avatar bio class collegeName -password').limit(20);

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching users',
      error: error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  getAllUsers,
  searchUsers,
};
