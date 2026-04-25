const mongoose = require('mongoose');

const meetupSchema = new mongoose.Schema({
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  category: {
    type: String,
    enum: ['study', 'social', 'academic', 'sports', 'cultural', 'general'],
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  location: {
    name: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    suggestedBy: {
      type: String,
      enum: ['user', 'website'],
      default: 'user',
    },
    commission: {
      type: Number,
      default: 0,
    },
  },
  dateTime: {
    type: Date,
    required: true,
  },
  maxParticipants: {
    type: Number,
    default: 10,
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'declined'],
      default: 'pending',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active',
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Index for location-based queries
meetupSchema.index({ city: 1, category: 1, dateTime: 1 });

module.exports = mongoose.model('Meetup', meetupSchema);