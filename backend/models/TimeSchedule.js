const mongoose = require('mongoose');

const timeScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: Date,
  slots: [
    {
      time: String, // HH:MM format
      activity: String,
      duration: Number, // in minutes
      priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium',
      },
      alarm: {
        type: Boolean,
        default: false,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  totalHours: Number,
  reminder: Boolean,
}, { timestamps: true });

module.exports = mongoose.model('TimeSchedule', timeScheduleSchema);
