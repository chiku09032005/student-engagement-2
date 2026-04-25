const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['academic', 'social', 'personal', 'mental', 'physical', 'health', 'study', 'general'],
    required: true,
  },
  subject: String,
  description: String,
  aiResponse: String,
  replies: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reply: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }
  ],
  userRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  helpful: Boolean,
  isResolved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Doubt', doubtSchema);
