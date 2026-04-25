const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.get('/profile', authenticate, userController.getUserProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.get('/all', authenticate, userController.getAllUsers);
router.get('/search', authenticate, userController.searchUsers);

module.exports = router;
