const express = require('express');
const router = express.Router();
const studyController = require('../controllers/studyController');
const { authenticate } = require('../middleware/auth');

router.post('/plan', authenticate, studyController.createStudyPlan);
router.get('/plans', authenticate, studyController.getStudyPlans);
router.get('/plan/:planId', authenticate, studyController.getStudyPlanById);
router.put('/plan/:planId', authenticate, studyController.updateStudyPlan);
router.put('/plan/progress', authenticate, studyController.updateSubjectProgress);
router.delete('/plan/:planId', authenticate, studyController.deleteStudyPlan);

module.exports = router;
