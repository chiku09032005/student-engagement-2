import React, { useState, useEffect } from 'react';
import { socialAPI, userAPI } from '../services/api';
import '../styles/App.css';

const Social = () => {
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('friends');
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    interests: [],
    collegeName: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const [friendsRes, profileRes] = await Promise.all([
        socialAPI.getFriends(),
        userAPI.getProfile(),
      ]);
      setFriends(friendsRes.data.friends);
      setProfileData({
        name: profileRes.data.user.name || '',
        bio: profileRes.data.user.bio || '',
        interests: profileRes.data.user.interests || [],
        collegeName: profileRes.data.user.collegeName || '',
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend) return;

    try {
      await socialAPI.sendMessage({
        recipientId: selectedFriend._id,
        content: newMessage,
      });
      setNewMessage('');
      fetchMessages(selectedFriend._id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await socialAPI.getMessages(userId);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const selectFriend = (friend) => {
    setSelectedFriend(friend);
    fetchMessages(friend._id);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateProfile(profileData);
      alert('Profile updated successfully!');
      fetchFriends(); // Refresh data
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await userAPI.searchUsers(searchQuery);
      setAllUsers(response.data.users);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const addFriend = async (friendId) => {
    try {
      await socialAPI.addFriend(friendId);
      alert('Friend request sent!');
      fetchFriends();
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  return (
    <div className="container">
      <h1>🤝 Social Hub</h1>

      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setTab('friends')}
          className={`btn ${tab === 'friends' ? 'btn-primary' : 'btn-danger'}`}
          style={{ marginRight: '1rem' }}
        >
          Friends
        </button>
        <button
          onClick={() => setTab('profile')}
          className={`btn ${tab === 'profile' ? 'btn-primary' : 'btn-danger'}`}
          style={{ marginRight: '1rem' }}
        >
          My Profile
        </button>
        <button
          onClick={() => setTab('search')}
          className={`btn ${tab === 'search' ? 'btn-primary' : 'btn-danger'}`}
        >
          Find People
        </button>
      </div>

      {tab === 'friends' && (
        <div className="grid" style={{ gridTemplateColumns: '300px 1fr' }}>
          {/* Friends List */}
          <div className="card">
            <h2>Friends ({friends.length})</h2>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <div>
                {friends.length === 0 ? (
                  <p>No friends yet. Add friends to get started!</p>
                ) : (
                  <ul style={{ listStyle: 'none' }}>
                    {friends.map((friend) => (
                      <li
                        key={friend._id}
                        onClick={() => selectFriend(friend)}
                        style={{
                          padding: '0.75rem',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          marginBottom: '0.5rem',
                          backgroundColor: selectedFriend?._id === friend._id ? '#f0f4ff' : 'transparent',
                        }}
                      >
                        <strong>{friend.name}</strong>
                        <p style={{ fontSize: '0.85rem', color: '#666' }}>{friend.email}</p>
                        {friend.collegeName && (
                          <p style={{ fontSize: '0.8rem', color: '#888' }}>🎓 {friend.collegeName}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="card">
            {selectedFriend ? (
              <>
                <h2>Chat with {selectedFriend.name}</h2>

                <div
                  style={{
                    backgroundColor: '#f7f7f7',
                    borderRadius: '4px',
                    padding: '1rem',
                    minHeight: '400px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    marginBottom: '1rem',
                  }}
                >
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      style={{
                        marginBottom: '1rem',
                        textAlign: msg.senderId === selectedFriend._id ? 'left' : 'right',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-block',
                          backgroundColor: msg.senderId === selectedFriend._id ? 'white' : '#667eea',
                          color: msg.senderId === selectedFriend._id ? 'black' : 'white',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          maxWidth: '70%',
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={sendMessage}>
                  <div className="form-group">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Send Message
                  </button>
                </form>
              </>
            ) : (
              <p>Select a friend to start chatting</p>
            )}
          </div>
        </div>
      )}

      {tab === 'profile' && (
        <div className="card">
          <h2>Edit Profile</h2>
          <form onSubmit={updateProfile}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell others about yourself..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>College Name</label>
              <input
                type="text"
                value={profileData.collegeName}
                onChange={(e) => setProfileData({ ...profileData, collegeName: e.target.value })}
                placeholder="e.g., MIT, Stanford, IIT Delhi"
              />
            </div>

            <div className="form-group">
              <label>Interests (comma separated)</label>
              <input
                type="text"
                value={profileData.interests.join(', ')}
                onChange={(e) => setProfileData({
                  ...profileData,
                  interests: e.target.value.split(',').map(i => i.trim()).filter(i => i)
                })}
                placeholder="e.g., Mathematics, Sports, Music"
              />
            </div>

            <button type="submit" className="btn btn-success">
              Update Profile
            </button>
          </form>

          <hr style={{ margin: '2rem 0' }} />

          <h3>Share Your Profile</h3>
          <p>Connect with friends on social media!</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const text = `Check out my profile on Student Engagement Hub! I'm studying at ${profileData.collegeName || 'my college'}. ${profileData.bio ? profileData.bio : ''}`;
                const url = encodeURIComponent(window.location.origin);
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
              }}
              className="btn"
              style={{ backgroundColor: '#25D366', color: 'white' }}
            >
              📱 Share on WhatsApp
            </button>

            <button
              onClick={() => {
                const text = `Join me on Student Engagement Hub! I'm ${profileData.name} from ${profileData.collegeName || 'my college'}. #StudentHub #${profileData.collegeName?.replace(/\s+/g, '') || 'Education'}`;
                window.open(`https://www.instagram.com/?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="btn"
              style={{ backgroundColor: '#E4405F', color: 'white' }}
            >
              📸 Share on Instagram
            </button>

            <button
              onClick={() => {
                const text = `Check out Student Engagement Hub - a platform for students to connect, learn, and grow! I'm ${profileData.name} from ${profileData.collegeName || 'my college'}.`;
                const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`;
                window.open(shareUrl, '_blank');
              }}
              className="btn"
              style={{ backgroundColor: '#0077B5', color: 'white' }}
            >
              💼 Share on LinkedIn
            </button>

            <button
              onClick={() => {
                const text = `Check out Student Engagement Hub - a platform for students to connect, learn, and grow! I'm ${profileData.name} from ${profileData.collegeName || 'my college'}.`;
                if (navigator.share) {
                  navigator.share({
                    title: 'Student Engagement Hub',
                    text: text,
                    url: window.location.origin,
                  });
                } else {
                  navigator.clipboard.writeText(text + ' ' + window.location.origin);
                  alert('Link copied to clipboard!');
                }
              }}
              className="btn btn-primary"
            >
              🔗 Share Link
            </button>
          </div>
        </div>
      )}

      {tab === 'search' && (
        <div className="card">
          <h2>Find People</h2>
          <div className="form-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or college..."
              onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
            />
            <button onClick={searchUsers} className="btn btn-primary" style={{ marginLeft: '1rem' }}>
              Search
            </button>
          </div>

          <div style={{ marginTop: '2rem' }}>
            {allUsers.length > 0 ? (
              <div>
                <h3>Search Results</h3>
                {allUsers.map((user) => (
                  <div key={user._id} style={{
                    padding: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <strong>{user.name}</strong>
                      <p style={{ fontSize: '0.9rem', color: '#666' }}>{user.email}</p>
                      {user.collegeName && (
                        <p style={{ fontSize: '0.8rem', color: '#888' }}>🎓 {user.collegeName}</p>
                      )}
                      {user.bio && (
                        <p style={{ fontSize: '0.85rem' }}>{user.bio}</p>
                      )}
                    </div>
                    <button
                      onClick={() => addFriend(user._id)}
                      className="btn btn-success"
                    >
                      Add Friend
                    </button>
                  </div>
                ))}
              </div>
            ) : searchQuery && (
              <p>No users found matching "{searchQuery}"</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Social;
