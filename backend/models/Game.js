const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  type: {
    type: String,
    enum: ['quiz', 'brain-teaser', 'puzzle', 'memory', 'math', 'word-game'],
    required: true,
  },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number,
      points: Number,
    },
  ],
  totalPoints: Number,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
