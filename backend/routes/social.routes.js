const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const { authenticate } = require('../middleware/auth');

router.post('/message', authenticate, socialController.sendMessage);
router.get('/messages/:userId', authenticate, socialController.getMessages);
router.post('/friend/add', authenticate, socialController.addFriend);
router.post('/friend/remove', authenticate, socialController.removeFriend);
router.get('/friends', authenticate, socialController.getFriends);

module.exports = router;
