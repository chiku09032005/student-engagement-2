const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, gameController.getAllGames);
router.get('/:gameId', authenticate, gameController.getGameById);
router.post('/score/submit', authenticate, gameController.submitGameScore);
router.get('/:gameId/leaderboard', authenticate, gameController.getLeaderboard);
router.get('/user/scores', authenticate, gameController.getUserGameScores);
router.post('/create', authenticate, gameController.createGame);

module.exports = router;
