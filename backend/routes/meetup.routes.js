const express = require('express');
const router = express.Router();
const meetupController = require('../controllers/meetupController');
const { authenticate } = require('../middleware/auth');

// Create a new meetup
router.post('/', authenticate, meetupController.createMeetup);

// Get all meetups with optional filters
router.get('/', authenticate, meetupController.getMeetups);

// Get suggested meeting places
router.get('/places/suggested', authenticate, meetupController.getSuggestedPlaces);

// Get user's meetups
router.get('/user/meetups', authenticate, meetupController.getUserMeetups);

// Get meetup by ID
router.get('/:meetupId', authenticate, meetupController.getMeetupById);

// Join a meetup
router.post('/:meetupId/join', authenticate, meetupController.joinMeetup);

// Leave a meetup
router.post('/:meetupId/leave', authenticate, meetupController.leaveMeetup);

// Update meetup (organizer only)
router.put('/:meetupId', authenticate, meetupController.updateMeetup);

// Delete meetup (organizer only)
router.delete('/:meetupId', authenticate, meetupController.deleteMeetup);

module.exports = router;