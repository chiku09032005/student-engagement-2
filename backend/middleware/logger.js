const ActivityLog = require('../models/ActivityLog');

const logActivity = async (req, res, next) => {
  try {
    const activity = new ActivityLog({
      userId: req.userId,
      action: req.body.action || 'api-call',
      description: req.body.description,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
    
    // Don't wait for saving, just log it in background
    activity.save().catch(err => console.error('Error logging activity:', err));
  } catch (error) {
    console.error('Error in logging middleware:', error);
  }
  next();
};

module.exports = logActivity;
