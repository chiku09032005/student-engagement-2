const StudyPlan = require('../models/StudyPlan');

// Create study plan
const createStudyPlan = async (req, res) => {
  try {
    const { title, subjects, startDate, endDate, targetScore, notes } = req.body;

    const studyPlan = new StudyPlan({
      userId: req.userId,
      title,
      subjects,
      startDate,
      endDate,
      targetScore,
      notes,
    });

    await studyPlan.save();

    res.status(201).json({
      success: true,
      message: 'Study plan created successfully',
      studyPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating study plan',
      error: error.message,
    });
  }
};

// Get user's study plans
const getStudyPlans = async (req, res) => {
  try {
    const studyPlans = await StudyPlan.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      studyPlans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching study plans',
      error: error.message,
    });
  }
};

// Get study plan by ID
const getStudyPlanById = async (req, res) => {
  try {
    const { planId } = req.params;

    const studyPlan = await StudyPlan.findById(planId);

    if (!studyPlan || studyPlan.userId.toString() !== req.userId) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
      });
    }

    res.json({
      success: true,
      studyPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching study plan',
      error: error.message,
    });
  }
};

// Update study plan
const updateStudyPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { title, subjects, startDate, endDate, targetScore, notes } = req.body;

    const studyPlan = await StudyPlan.findByIdAndUpdate(
      planId,
      {
        title,
        subjects,
        startDate,
        endDate,
        targetScore,
        notes,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Study plan updated successfully',
      studyPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating study plan',
      error: error.message,
    });
  }
};

// Update subject progress
const updateSubjectProgress = async (req, res) => {
  try {
    const { planId, subjectIndex, progress } = req.body;

    const studyPlan = await StudyPlan.findById(planId);
    
    if (studyPlan.subjects[subjectIndex]) {
      studyPlan.subjects[subjectIndex].progress = progress;
      await studyPlan.save();
    }

    res.json({
      success: true,
      message: 'Progress updated successfully',
      studyPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating progress',
      error: error.message,
    });
  }
};

// Delete study plan
const deleteStudyPlan = async (req, res) => {
  try {
    const { planId } = req.params;

    await StudyPlan.findByIdAndDelete(planId);

    res.json({
      success: true,
      message: 'Study plan deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting study plan',
      error: error.message,
    });
  }
};

module.exports = {
  createStudyPlan,
  getStudyPlans,
  getStudyPlanById,
  updateStudyPlan,
  updateSubjectProgress,
  deleteStudyPlan,
};
