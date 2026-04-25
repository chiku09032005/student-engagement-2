const express = require('express');
const router = express.Router();
const timeManagementController = require('../controllers/timeManagementController');
const { authenticate } = require('../middleware/auth');

router.post('/workout', authenticate, timeManagementController.createWorkout);
router.get('/workouts', authenticate, timeManagementController.getWorkouts);
router.post('/schedule', authenticate, timeManagementController.createSchedule);
router.get('/schedules', authenticate, timeManagementController.getSchedules);
router.put('/schedule/slot', authenticate, timeManagementController.updateScheduleSlot);

module.exports = router;
