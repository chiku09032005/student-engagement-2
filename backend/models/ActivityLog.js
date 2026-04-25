const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'create-study-plan',
      'complete-game',
      'send-message',
      'add-friend',
      'ask-doubt',
      'update-workout',
      'update-schedule',
    ],
  },
  description: String,
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 7776000, // Auto-delete after 90 days
  },
}, { timestamps: false });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
