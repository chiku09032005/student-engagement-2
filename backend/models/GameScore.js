const mongoose = require('mongoose');

const gameScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  score: Number,
  correctAnswers: Number,
  totalQuestions: Number,
  timeTaken: Number, // in seconds
  completedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Create compound index for leaderboard
gameScoreSchema.index({ gameId: 1, score: -1 });

module.exports = mongoose.model('GameScore', gameScoreSchema);
