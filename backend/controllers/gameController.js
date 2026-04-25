const Game = require('../models/Game');
const GameScore = require('../models/GameScore');

// Get all games
const getAllGames = async (req, res) => {
  try {
    const games = await Game.find().select('-questions');

    res.json({
      success: true,
      games,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching games',
      error: error.message,
    });
  }
};

// Get game by ID with questions
const getGameById = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }

    res.json({
      success: true,
      game,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching game',
      error: error.message,
    });
  }
};

// Submit game score
const submitGameScore = async (req, res) => {
  try {
    const { gameId, score, correctAnswers, totalQuestions, timeTaken } = req.body;

    const gameScore = new GameScore({
      userId: req.userId,
      gameId,
      score,
      correctAnswers,
      totalQuestions,
      timeTaken,
    });

    await gameScore.save();

    res.status(201).json({
      success: true,
      message: 'Score submitted successfully',
      data: gameScore,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting score',
      error: error.message,
    });
  }
};

// Get leaderboard for a game
const getLeaderboard = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { limit = 10 } = req.query;

    const leaderboard = await GameScore.find({ gameId })
      .populate('userId', 'name avatar')
      .sort({ score: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message,
    });
  }
};

// Get user's game scores
const getUserGameScores = async (req, res) => {
  try {
    const scores = await GameScore.find({ userId: req.userId })
      .populate('gameId', 'name type')
      .sort({ completedAt: -1 });

    res.json({
      success: true,
      scores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching scores',
      error: error.message,
    });
  }
};

// Create new game (admin only)
const createGame = async (req, res) => {
  try {
    const { name, description, type, questions, difficulty } = req.body;

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    const game = new Game({
      name,
      description,
      type,
      questions,
      difficulty,
      totalPoints,
    });

    await game.save();

    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      game,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating game',
      error: error.message,
    });
  }
};

module.exports = {
  getAllGames,
  getGameById,
  submitGameScore,
  getLeaderboard,
  getUserGameScores,
  createGame,
};
