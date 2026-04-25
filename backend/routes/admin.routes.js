const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/stats', authenticate, adminController.getDashboardStats);
router.get('/logs', authenticate, adminController.getActivityLogs);
router.get('/engagement', authenticate, adminController.getUserEngagementMetrics);
router.get('/ai-analytics', authenticate, adminController.getAIBotAnalytics);

module.exports = router;
