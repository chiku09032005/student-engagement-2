const Workout = require('../models/Workout');
const TimeSchedule = require('../models/TimeSchedule');

// Create workout
const createWorkout = async (req, res) => {
  try {
    const { exercises, totalDuration, totalCalories, mood, notes, startTime, alarm } = req.body;

    const workout = new Workout({
      userId: req.userId,
      exercises,
      totalDuration,
      totalCalories,
      startTime,
      alarm,
      mood,
      notes,
      date: new Date(),
    });

    await workout.save();

    res.status(201).json({
      success: true,
      message: 'Workout logged successfully',
      workout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging workout',
      error: error.message,
    });
  }
};

// Get user's workouts
const getWorkouts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { userId: req.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const workouts = await Workout.find(query).sort({ date: -1 });

    res.json({
      success: true,
      workouts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching workouts',
      error: error.message,
    });
  }
};

// Create time schedule
const createSchedule = async (req, res) => {
  try {
    const { date, slots } = req.body;
    const reminder = slots.some((slot) => slot.alarm);

    const totalHours = slots.reduce((sum, slot) => sum + slot.duration, 0) / 60;

    const schedule = new TimeSchedule({
      userId: req.userId,
      date,
      slots,
      totalHours,
      reminder,
    });

    await schedule.save();

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating schedule',
      error: error.message,
    });
  }
};

// Get user's schedules
const getSchedules = async (req, res) => {
  try {
    const { date } = req.query;
    
    const query = { userId: req.userId };
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const schedules = await TimeSchedule.find(query).sort({ date: -1 });

    res.json({
      success: true,
      schedules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching schedules',
      error: error.message,
    });
  }
};

// Update schedule slot
const updateScheduleSlot = async (req, res) => {
  try {
    const { scheduleId, slotIndex, completed } = req.body;

    const schedule = await TimeSchedule.findById(scheduleId);
    
    if (schedule.slots[slotIndex]) {
      schedule.slots[slotIndex].completed = completed;
      await schedule.save();
    }

    res.json({
      success: true,
      message: 'Slot updated successfully',
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating slot',
      error: error.message,
    });
  }
};

module.exports = {
  createWorkout,
  getWorkouts,
  createSchedule,
  getSchedules,
  updateScheduleSlot,
};
