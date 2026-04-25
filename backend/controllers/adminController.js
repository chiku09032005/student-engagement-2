const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const Doubt = require('../models/Doubt');
const GameScore = require('../models/GameScore');
const Message = require('../models/Message');
const Workout = require('../models/Workout');
const StudyPlan = require('../models/StudyPlan');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await ActivityLog.distinct('userId');
    const totalDoubts = await Doubt.countDocuments();
    const resolvedDoubts = await Doubt.countDocuments({ isResolved: true });
    const totalGames = await GameScore.countDocuments();
    const totalMessages = await Message.countDocuments();

    const stats = {
      totalUsers,
      activeUsers: activeUsers.length,
      totalDoubts,
      resolvedDoubts,
      resolutionRate: totalDoubts > 0 ? ((resolvedDoubts / totalDoubts) * 100).toFixed(2) : 0,
      totalGamePlays: totalGames,
      totalMessages,
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};

// Get activity logs
const getActivityLogs = async (req, res) => {
  try {
    const { startDate, endDate, action, limit = 100 } = req.query;

    const query = {};

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    if (action) query.action = action;

    const logs = await ActivityLog.find(query)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activity logs',
      error: error.message,
    });
  }
};

// Get user engagement metrics
const getUserEngagementMetrics = async (req, res) => {
  try {
    const users = await User.find().select('_id name');

    const metrics = await Promise.all(
      users.map(async (user) => {
        const activities = await ActivityLog.countDocuments({ userId: user._id });
        const doubts = await Doubt.countDocuments({ userId: user._id });
        const gameScores = await GameScore.countDocuments({ userId: user._id });
        const messages = await Message.countDocuments({ senderId: user._id });
        const workouts = await Workout.countDocuments({ userId: user._id });
        const studyPlans = await StudyPlan.countDocuments({ userId: user._id });

        return {
          userId: user._id,
          name: user.name,
          activities,
          doubts,
          gameScores,
          messages,
          workouts,
          studyPlans,
          engagementScore: activities + doubts + gameScores + messages + workouts + studyPlans,
        };
      })
    );

    const sortedMetrics = metrics.sort((a, b) => b.engagementScore - a.engagementScore);

    res.json({
      success: true,
      metrics: sortedMetrics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching engagement metrics',
      error: error.message,
    });
  }
};

// Get AI bot analytics
const getAIBotAnalytics = async (req, res) => {
  try {
    const totalQuestions = await Doubt.countDocuments();
    const byCategory = await Doubt.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    const avgRating = await Doubt.aggregate([
      {
        $match: { userRating: { $exists: true } },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$userRating' },
        },
      },
    ]);

    const helpfulCount = await Doubt.countDocuments({ helpful: true });

    res.json({
      success: true,
      analytics: {
        totalQuestions,
        byCategory,
        avgRating: avgRating.length > 0 ? avgRating[0].avgRating.toFixed(2) : 0,
        helpfulPercentage: totalQuestions > 0 ? ((helpfulCount / totalQuestions) * 100).toFixed(2) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching AI analytics',
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getActivityLogs,
  getUserEngagementMetrics,
  getAIBotAnalytics,
};
