const Doubt = require('../models/Doubt');
const AIBotService = require('../services/aiBot');

// Ask doubt / Ask AI bot
const askDoubt = async (req, res) => {
  try {
    const { question, category, subject, description } = req.body;

    // Create doubt record
    const doubt = new Doubt({
      userId: req.userId,
      question,
      category,
      subject,
      description,
    });

    // Get AI response
    const aiResponse = await AIBotService.processQuestion(question, category, subject);

    doubt.aiResponse = aiResponse;
    await doubt.save();

    res.status(201).json({
      success: true,
      message: 'Doubt submitted successfully',
      doubt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing doubt',
      error: error.message,
    });
  }
};

// Get user's doubts
const getDoubts = async (req, res) => {
  try {
    const { category, isResolved } = req.query;

    const query = { userId: req.userId };
    if (category) query.category = category;
    if (isResolved !== undefined) query.isResolved = isResolved === 'true';

    const doubts = await Doubt.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      doubts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching doubts',
      error: error.message,
    });
  }
};

// Get doubt by ID (public portal access allowed)
const getDoubtById = async (req, res) => {
  try {
    const { doubtId } = req.params;

    const doubt = await Doubt.findById(doubtId)
      .populate('userId', 'name collegeName avatar')
      .populate('replies.userId', 'name collegeName avatar');

    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: 'Doubt not found',
      });
    }

    res.json({
      success: true,
      doubt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching doubt',
      error: error.message,
    });
  }
};

// Get all public doubts for the community portal
const getAllDoubts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const doubts = await Doubt.find(filter)
      .populate('userId', 'name collegeName avatar')
      .populate('replies.userId', 'name collegeName avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      doubts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching doubts',
      error: error.message,
    });
  }
};

// Add a reply to a public doubt
const replyToDoubt = async (req, res) => {
  try {
    const { doubtId, reply } = req.body;

    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: 'Doubt not found',
      });
    }

    doubt.replies.push({
      userId: req.userId,
      reply,
    });
    doubt.updatedAt = Date.now();
    await doubt.save();

    const updatedDoubt = await Doubt.findById(doubtId)
      .populate('userId', 'name collegeName avatar')
      .populate('replies.userId', 'name collegeName avatar');

    res.json({
      success: true,
      message: 'Reply added successfully',
      doubt: updatedDoubt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding reply',
      error: error.message,
    });
  }
};

// Rate doubt answer
const rateDoubtAnswer = async (req, res) => {
  try {
    const { doubtId, rating, helpful, isResolved } = req.body;

    const doubt = await Doubt.findByIdAndUpdate(
      doubtId,
      {
        userRating: rating,
        helpful,
        isResolved,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      doubt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rating answer',
      error: error.message,
    });
  }
};

// Delete doubt
const deleteDoubt = async (req, res) => {
  try {
    const { doubtId } = req.params;

    await Doubt.findByIdAndDelete(doubtId);

    res.json({
      success: true,
      message: 'Doubt deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting doubt',
      error: error.message,
    });
  }
};

// Get FAQ by category
const getFAQ = async (req, res) => {
  try {
    const { category } = req.params;
    const faq = AIBotService.getFAQ();

    res.json({
      success: true,
      faq: category ? faq[category] : faq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching FAQ',
      error: error.message,
    });
  }
};

// Get quick tips
const getQuickTips = async (req, res) => {
  try {
    const { category } = req.params;
    const tips = AIBotService.getQuickTips(category);

    res.json({
      success: true,
      tips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tips',
      error: error.message,
    });
  }
};

// Get motivational quote
const getMotivationalQuote = async (req, res) => {
  try {
    const quote = AIBotService.getMotivationalQuote();

    res.json({
      success: true,
      quote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching quote',
      error: error.message,
    });
  }
};

// Get study streak message
const getStudyStreakMessage = async (req, res) => {
  try {
    const { streak } = req.params;
    const message = AIBotService.getStudyStreakMessage(parseInt(streak) || 0);

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating streak message',
      error: error.message,
    });
  }
};

module.exports = {
  askDoubt,
  getDoubts,
  getAllDoubts,
  getDoubtById,
  replyToDoubt,
  rateDoubtAnswer,
  deleteDoubt,
  getFAQ,
  getQuickTips,
  getMotivationalQuote,
  getStudyStreakMessage,
};
