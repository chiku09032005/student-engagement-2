const Meetup = require('../models/Meetup');
const User = require('../models/User');

// Create a new meetup
const createMeetup = async (req, res) => {
  try {
    const { title, description, category, city, location, dateTime, maxParticipants, tags } = req.body;

    const meetup = new Meetup({
      organizerId: req.userId,
      title,
      description,
      category,
      city,
      location,
      dateTime,
      maxParticipants,
      tags,
    });

    await meetup.save();

    const populatedMeetup = await Meetup.findById(meetup._id)
      .populate('organizerId', 'name collegeName avatar')
      .populate('participants.userId', 'name collegeName avatar');

    res.status(201).json({
      success: true,
      message: 'Meetup created successfully',
      meetup: populatedMeetup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating meetup',
      error: error.message,
    });
  }
};

// Get all meetups with filters
const getMeetups = async (req, res) => {
  try {
    const { city, category, status = 'active', limit = 20 } = req.query;

    const filter = { status };
    if (city) filter.city = new RegExp(city, 'i');
    if (category) filter.category = category;

    const meetups = await Meetup.find(filter)
      .populate('organizerId', 'name collegeName avatar')
      .populate('participants.userId', 'name collegeName avatar')
      .sort({ dateTime: 1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      meetups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching meetups',
      error: error.message,
    });
  }
};

// Get meetup by ID
const getMeetupById = async (req, res) => {
  try {
    const { meetupId } = req.params;

    const meetup = await Meetup.findById(meetupId)
      .populate('organizerId', 'name collegeName avatar')
      .populate('participants.userId', 'name collegeName avatar');

    if (!meetup) {
      return res.status(404).json({
        success: false,
        message: 'Meetup not found',
      });
    }

    res.json({
      success: true,
      meetup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching meetup',
      error: error.message,
    });
  }
};

// Join a meetup
const joinMeetup = async (req, res) => {
  try {
    const { meetupId } = req.params;

    const meetup = await Meetup.findById(meetupId);
    if (!meetup) {
      return res.status(404).json({
        success: false,
        message: 'Meetup not found',
      });
    }

    // Check if user is already a participant
    const existingParticipant = meetup.participants.find(p => p.userId.toString() === req.userId);
    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        message: 'Already joined this meetup',
      });
    }

    // Check if meetup is full
    if (meetup.participants.length >= meetup.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Meetup is full',
      });
    }

    meetup.participants.push({
      userId: req.userId,
      status: 'confirmed',
    });

    await meetup.save();

    const updatedMeetup = await Meetup.findById(meetupId)
      .populate('organizerId', 'name collegeName avatar')
      .populate('participants.userId', 'name collegeName avatar');

    res.json({
      success: true,
      message: 'Successfully joined meetup',
      meetup: updatedMeetup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error joining meetup',
      error: error.message,
    });
  }
};

// Leave a meetup
const leaveMeetup = async (req, res) => {
  try {
    const { meetupId } = req.params;

    const meetup = await Meetup.findById(meetupId);
    if (!meetup) {
      return res.status(404).json({
        success: false,
        message: 'Meetup not found',
      });
    }

    // Remove user from participants
    meetup.participants = meetup.participants.filter(p => p.userId.toString() !== req.userId);

    await meetup.save();

    res.json({
      success: true,
      message: 'Successfully left meetup',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error leaving meetup',
      error: error.message,
    });
  }
};

// Get suggested meeting places with commission
const getSuggestedPlaces = async (req, res) => {
  try {
    const { city, category } = req.query;

    // Mock data for suggested places (in real app, this would come from a places API)
    const suggestedPlaces = {
      'study': [
        {
          name: 'Central Library',
          address: '123 Main St, City Center',
          type: 'Library',
          commission: 5.00,
          rating: 4.5,
        },
        {
          name: 'Study Cafe',
          address: '456 College Ave',
          type: 'Cafe',
          commission: 3.50,
          rating: 4.2,
        },
      ],
      'social': [
        {
          name: 'City Park Pavilion',
          address: '789 Park Rd',
          type: 'Park',
          commission: 2.00,
          rating: 4.0,
        },
        {
          name: 'Downtown Coffee House',
          address: '321 Downtown Blvd',
          type: 'Cafe',
          commission: 4.00,
          rating: 4.3,
        },
      ],
      'academic': [
        {
          name: 'University Campus Center',
          address: '654 University Dr',
          type: 'Campus',
          commission: 1.50,
          rating: 4.1,
        },
        {
          name: 'Tech Hub Coworking',
          address: '987 Innovation St',
          type: 'Coworking',
          commission: 6.00,
          rating: 4.6,
        },
      ],
      'sports': [
        {
          name: 'City Sports Complex',
          address: '147 Sports Ave',
          type: 'Sports Facility',
          commission: 8.00,
          rating: 4.4,
        },
        {
          name: 'Riverside Park',
          address: '258 River Rd',
          type: 'Park',
          commission: 2.50,
          rating: 4.2,
        },
      ],
      'cultural': [
        {
          name: 'Art Gallery Cafe',
          address: '369 Culture St',
          type: 'Gallery',
          commission: 4.50,
          rating: 4.3,
        },
        {
          name: 'Community Center',
          address: '741 Civic Plaza',
          type: 'Community Center',
          commission: 3.00,
          rating: 4.0,
        },
      ],
      'general': [
        {
          name: 'Central Mall Food Court',
          address: '852 Shopping Center',
          type: 'Mall',
          commission: 7.00,
          rating: 4.1,
        },
        {
          name: 'Rooftop Lounge',
          address: '963 Sky High Tower',
          type: 'Lounge',
          commission: 5.50,
          rating: 4.4,
        },
      ],
    };

    const places = suggestedPlaces[category] || suggestedPlaces['general'];

    res.json({
      success: true,
      places,
      city,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching suggested places',
      error: error.message,
    });
  }
};

// Get user's meetups
const getUserMeetups = async (req, res) => {
  try {
    const meetups = await Meetup.find({
      $or: [
        { organizerId: req.userId },
        { 'participants.userId': req.userId }
      ]
    })
      .populate('organizerId', 'name collegeName avatar')
      .populate('participants.userId', 'name collegeName avatar')
      .sort({ dateTime: 1 });

    res.json({
      success: true,
      meetups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user meetups',
      error: error.message,
    });
  }
};

// Update meetup
const updateMeetup = async (req, res) => {
  try {
    const { meetupId } = req.params;
    const updates = req.body;

    const meetup = await Meetup.findOneAndUpdate(
      { _id: meetupId, organizerId: req.userId },
      updates,
      { new: true }
    )
      .populate('organizerId', 'name collegeName avatar')
      .populate('participants.userId', 'name collegeName avatar');

    if (!meetup) {
      return res.status(404).json({
        success: false,
        message: 'Meetup not found or not authorized',
      });
    }

    res.json({
      success: true,
      message: 'Meetup updated successfully',
      meetup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating meetup',
      error: error.message,
    });
  }
};

// Delete meetup
const deleteMeetup = async (req, res) => {
  try {
    const { meetupId } = req.params;

    const meetup = await Meetup.findOneAndDelete({
      _id: meetupId,
      organizerId: req.userId
    });

    if (!meetup) {
      return res.status(404).json({
        success: false,
        message: 'Meetup not found or not authorized',
      });
    }

    res.json({
      success: true,
      message: 'Meetup deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting meetup',
      error: error.message,
    });
  }
};

module.exports = {
  createMeetup,
  getMeetups,
  getMeetupById,
  joinMeetup,
  leaveMeetup,
  getSuggestedPlaces,
  getUserMeetups,
  updateMeetup,
  deleteMeetup,
};