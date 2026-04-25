const express = require('express');
const router = express.Router();
const aiBotController = require('../controllers/aiBotController');
const { authenticate } = require('../middleware/auth');

router.post('/ask', authenticate, aiBotController.askDoubt);
router.get('/doubts', authenticate, aiBotController.getDoubts);
router.get('/all', authenticate, aiBotController.getAllDoubts);
router.post('/doubt/reply', authenticate, aiBotController.replyToDoubt);
router.get('/doubt/:doubtId', authenticate, aiBotController.getDoubtById);
router.put('/doubt/rate', authenticate, aiBotController.rateDoubtAnswer);
router.delete('/doubt/:doubtId', authenticate, aiBotController.deleteDoubt);

// Enhanced AI Bot features
router.get('/faq/:category?', aiBotController.getFAQ);
router.get('/tips/:category', aiBotController.getQuickTips);
router.get('/quote', aiBotController.getMotivationalQuote);
router.get('/streak/:streak', aiBotController.getStudyStreakMessage);

module.exports = router;
