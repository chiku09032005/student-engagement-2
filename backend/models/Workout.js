const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  exercises: [
    {
      name: String,
      duration: Number, // in minutes
      reps: Number,
      calories: Number,
      completed: Boolean,
    },
  ],
  totalDuration: Number,
  totalCalories: Number,
  startTime: String,
  alarm: {
    type: Boolean,
    default: false,
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'average', 'poor'],
  },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
