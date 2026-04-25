const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subjects: [
    {
      name: String,
      chapters: [String],
      hoursPerWeek: Number,
      priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium',
      },
      progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
  ],
  startDate: Date,
  endDate: Date,
  targetScore: Number,
  notes: String,
  completed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
