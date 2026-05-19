import React, { useState, useEffect } from 'react';
import { meetupAPI } from '../services/api';
import './Meetup.css';

const Meetup = () => {
  const [meetups, setMeetups] = useState([]);
  const [userMeetups, setUserMeetups] = useState([]);
  const [suggestedPlaces, setSuggestedPlaces] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPlaces, setShowPlaces] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    category: '',
    status: 'active'
  });

  const [newMeetup, setNewMeetup] = useState({
    title: '',
    description: '',
    category: 'study',
    city: '',
    location: '',
    dateTime: '',
    maxParticipants: 10,
    tags: []
  });

  const categories = [
    { value: 'study', label: 'Study Group' },
    { value: 'social', label: 'Social Meetup' },
    { value: 'academic', label: 'Academic Discussion' },
    { value: 'sports', label: 'Sports & Fitness' },
    { value: 'cultural', label: 'Cultural Event' },
    { value: 'general', label: 'General Meetup' }
  ];

  useEffect(() => {
    fetchMeetups();
    fetchUserMeetups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchMeetups = async () => {
    try {
      setLoading(true);
      const response = await meetupAPI.getMeetups(filters.city, filters.category, filters.status, 20);
      setMeetups(response.data.meetups);
    } catch (error) {
      console.error('Error fetching meetups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMeetups = async () => {
    try {
      const response = await meetupAPI.getUserMeetups();
      setUserMeetups(response.data.meetups);
    } catch (error) {
      console.error('Error fetching user meetups:', error);
    }
  };

  const fetchSuggestedPlaces = async (category) => {
    try {
      const response = await meetupAPI.getSuggestedPlaces(category, filters.city);
      setSuggestedPlaces(response.data.places);
      setShowPlaces(true);
    } catch (error) {
      console.error('Error fetching suggested places:', error);
    }
  };

  const handleCreateMeetup = async (e) => {
    e.preventDefault();
    try {
      const response = await meetupAPI.createMeetup(newMeetup);

      setMeetups([response.data.meetup, ...meetups]);
      setNewMeetup({
        title: '',
        description: '',
        category: 'study',
        city: '',
        location: '',
        dateTime: '',
        maxParticipants: 10,
        tags: []
      });
      setShowCreateForm(false);
      alert('Meetup created successfully!');
    } catch (error) {
      console.error('Error creating meetup:', error);
      alert('Error creating meetup. Please try again.');
    }
  };

  const handleJoinMeetup = async (meetupId) => {
    try {
      const response = await meetupAPI.joinMeetup(meetupId);

      // Update the meetup in the list
      setMeetups(meetups.map(meetup =>
        meetup._id === meetupId ? response.data.meetup : meetup
      ));

      alert('Successfully joined the meetup!');
    } catch (error) {
      console.error('Error joining meetup:', error);
      alert(error.response?.data?.message || 'Error joining meetup');
    }
  };

  const handleLeaveMeetup = async (meetupId) => {
    try {
      await meetupAPI.leaveMeetup(meetupId);

      // Remove from user meetups and update main list
      setUserMeetups(userMeetups.filter(meetup => meetup._id !== meetupId));
      fetchMeetups(); // Refresh main list
      alert('Successfully left the meetup!');
    } catch (error) {
      console.error('Error leaving meetup:', error);
      alert('Error leaving meetup');
    }
  };

  const selectPlace = (place) => {
    setNewMeetup({
      ...newMeetup,
      location: `${place.name} - ${place.address}`,
      city: filters.city || place.address.split(',')[1]?.trim() || ''
    });
    setShowPlaces(false);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  const isUserJoined = (meetup) => {
    return meetup.participants.some(p => p.userId._id === JSON.parse(localStorage.getItem('user'))._id);
  };

  const isUserOrganizer = (meetup) => {
    return meetup.organizerId._id === JSON.parse(localStorage.getItem('user'))._id;
  };

  return (
    <div className="meetup-container">
      <div className="meetup-header">
        <h1>Offline Meetups</h1>
        <p>Connect with fellow students in your city for study groups, social events, and more!</p>
        <button
          className="create-meetup-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create Meetup'}
        </button>
      </div>

      {/* Create Meetup Form */}
      {showCreateForm && (
        <div className="create-meetup-form">
          <h2>Create New Meetup</h2>
          <form onSubmit={handleCreateMeetup}>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newMeetup.title}
                  onChange={(e) => setNewMeetup({...newMeetup, title: e.target.value})}
                  required
                  placeholder="e.g., Study Group for Math Exam"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newMeetup.category}
                  onChange={(e) => setNewMeetup({...newMeetup, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newMeetup.description}
                onChange={(e) => setNewMeetup({...newMeetup, description: e.target.value})}
                required
                placeholder="Describe what the meetup is about..."
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={newMeetup.city}
                  onChange={(e) => setNewMeetup({...newMeetup, city: e.target.value})}
                  required
                  placeholder="e.g., Mumbai"
                />
              </div>
              <div className="form-group">
                <label>Date & Time</label>
                <input
                  type="datetime-local"
                  value={newMeetup.dateTime}
                  onChange={(e) => setNewMeetup({...newMeetup, dateTime: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Max Participants</label>
                <input
                  type="number"
                  min="2"
                  max="50"
                  value={newMeetup.maxParticipants}
                  onChange={(e) => setNewMeetup({...newMeetup, maxParticipants: parseInt(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <div className="location-input">
                  <input
                    type="text"
                    value={newMeetup.location}
                    onChange={(e) => setNewMeetup({...newMeetup, location: e.target.value})}
                    required
                    placeholder="Enter location or select from suggestions"
                  />
                  <button
                    type="button"
                    className="suggest-places-btn"
                    onClick={() => fetchSuggestedPlaces(newMeetup.category)}
                  >
                    Suggest Places
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn">Create Meetup</button>
          </form>
        </div>
      )}

      {/* Suggested Places Modal */}
      {showPlaces && (
        <div className="places-modal">
          <div className="places-content">
            <h3>Suggested Meeting Places</h3>
            <div className="places-list">
              {suggestedPlaces.map((place, index) => (
                <div key={index} className="place-item" onClick={() => selectPlace(place)}>
                  <div className="place-info">
                    <h4>{place.name}</h4>
                    <p>{place.address}</p>
                    <span className="place-type">{place.type}</span>
                  </div>
                  <div className="place-details">
                    <span className="rating">⭐ {place.rating}</span>
                    <span className="commission">Commission: ₹{place.commission}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="close-btn" onClick={() => setShowPlaces(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="meetup-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Filter by city"
            value={filters.city}
            onChange={(e) => setFilters({...filters, city: e.target.value})}
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Meetups List */}
      <div className="meetups-section">
        <h2>Available Meetups</h2>
        {loading ? (
          <div className="loading">Loading meetups...</div>
        ) : (
          <div className="meetups-grid">
            {meetups.map(meetup => (
              <div key={meetup._id} className="meetup-card">
                <div className="meetup-header">
                  <h3>{meetup.title}</h3>
                  <span className={`category-badge ${meetup.category}`}>
                    {categories.find(cat => cat.value === meetup.category)?.label}
                  </span>
                </div>

                <p className="meetup-description">{meetup.description}</p>

                <div className="meetup-details">
                  <div className="detail-item">
                    <span className="icon">📍</span>
                    <span>{meetup.city} - {meetup.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">📅</span>
                    <span>{formatDateTime(meetup.dateTime)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">👥</span>
                    <span>{meetup.participants.length}/{meetup.maxParticipants} participants</span>
                  </div>
                </div>

                <div className="meetup-organizer">
                  <span>Organized by: {meetup.organizerId.name}</span>
                  {meetup.organizerId.collegeName && (
                    <span className="college"> ({meetup.organizerId.collegeName})</span>
                  )}
                </div>

                <div className="meetup-actions">
                  {isUserOrganizer(meetup) ? (
                    <span className="organizer-badge">You are the organizer</span>
                  ) : isUserJoined(meetup) ? (
                    <button
                      className="leave-btn"
                      onClick={() => handleLeaveMeetup(meetup._id)}
                    >
                      Leave Meetup
                    </button>
                  ) : (
                    <button
                      className="join-btn"
                      onClick={() => handleJoinMeetup(meetup._id)}
                      disabled={meetup.participants.length >= meetup.maxParticipants}
                    >
                      {meetup.participants.length >= meetup.maxParticipants ? 'Full' : 'Join Meetup'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User's Meetups */}
      {userMeetups.length > 0 && (
        <div className="user-meetups-section">
          <h2>My Meetups</h2>
          <div className="meetups-grid">
            {userMeetups.map(meetup => (
              <div key={meetup._id} className="meetup-card user-meetup">
                <div className="meetup-header">
                  <h3>{meetup.title}</h3>
                  <span className={`category-badge ${meetup.category}`}>
                    {categories.find(cat => cat.value === meetup.category)?.label}
                  </span>
                  {isUserOrganizer(meetup) && (
                    <span className="organizer-indicator">Organizer</span>
                  )}
                </div>

                <p className="meetup-description">{meetup.description}</p>

                <div className="meetup-details">
                  <div className="detail-item">
                    <span className="icon">📍</span>
                    <span>{meetup.city} - {meetup.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">📅</span>
                    <span>{formatDateTime(meetup.dateTime)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">👥</span>
                    <span>{meetup.participants.length}/{meetup.maxParticipants} participants</span>
                  </div>
                </div>

                {meetup.participants.length > 0 && (
                  <div className="participants-list">
                    <h4>Participants:</h4>
                    <div className="participants">
                      {meetup.participants.map(participant => (
                        <div key={participant.userId._id} className="participant">
                          <span>{participant.userId.name}</span>
                          {participant.userId.collegeName && (
                            <span className="college">({participant.userId.collegeName})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Meetup;