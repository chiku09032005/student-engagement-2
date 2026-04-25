import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, gameAPI, studyAPI, aiBotAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/App.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userRes, gamesRes, studyRes, doubtsRes] = await Promise.all([
          userAPI.getProfile(),
          gameAPI.getUserScores().catch(() => ({ data: { scores: [] } })),
          studyAPI.getPlans().catch(() => ({ data: { studyPlans: [] } })),
          aiBotAPI.getDoubts().catch(() => ({ data: { doubts: [] } })),
        ]);

        setStats({
          user: userRes.data.user,
          gameScores: gamesRes.data.scores?.length || 0,
          studyPlans: studyRes.data.studyPlans?.length || 0,
          doubts: doubtsRes.data.doubts?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav>
        <div className="logo">🎓 Student Engagement Hub</div>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/social">Social</a></li>
          <li><a href="/games">Games</a></li>
          <li><a href="/time-management">Time Management</a></li>
          <li><a href="/study">Study Planner</a></li>
          <li><a href="/ai-bot">AI Bot</a></li>
          <li><a href="/meetups">Meetups</a></li>
          <li><a href="/admin">Admin</a></li>
          <li><button onClick={handleLogout} className="btn btn-danger">Logout</button></li>
        </ul>
      </nav>

      <div className="container">
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <>
            <h1>Welcome, {stats?.user?.name}!</h1>
            <p>Your personalized learning and social engagement platform</p>

            <div className="dashboard-grid">
              <div className="stat-card">
                <div className="value">{stats?.gameScores}</div>
                <div className="label">Games Played</div>
              </div>
              <div className="stat-card">
                <div className="value">{stats?.studyPlans}</div>
                <div className="label">Study Plans</div>
              </div>
              <div className="stat-card">
                <div className="value">{stats?.doubts}</div>
                <div className="label">Questions Asked</div>
              </div>
              <div className="stat-card">
                <div className="value">100%</div>
                <div className="label">Engagement Score</div>
              </div>
            </div>

            <div className="grid">
              <div className="card">
                <h2>🤝 Social Features</h2>
                <p>Connect with friends, send messages, and build your network.</p>
                <button onClick={() => navigate('/social')} className="btn btn-primary">
                  Go to Social Hub
                </button>
              </div>

              <div className="card">
                <h2>🎮 Games & Challenges</h2>
                <p>Play educational games, brain teasers, and win rewards.</p>
                <button onClick={() => navigate('/games')} className="btn btn-primary">
                  Explore Games
                </button>
              </div>

              <div className="card">
                <h2>⏰ Time Management</h2>
                <p>Plan your daily schedule and track your workouts.</p>
                <button onClick={() => navigate('/time-management')} className="btn btn-primary">
                  Manage Time
                </button>
              </div>

              <div className="card">
                <h2>📚 Study Planning</h2>
                <p>Create study plans and track your academic progress.</p>
                <button onClick={() => navigate('/study')} className="btn btn-primary">
                  Plan Studies
                </button>
              </div>

              <div className="card">
                <h2>🤖 Ask AI Bot</h2>
                <p>Get answers to academic, social, and personal questions.</p>
                <button onClick={() => navigate('/ai-bot')} className="btn btn-primary">
                  Ask Questions
                </button>
              </div>

              <div className="card">
                <h2>📊 Analytics</h2>
                <p>View your engagement metrics and platform statistics.</p>
                <button onClick={() => navigate('/admin')} className="btn btn-primary">
                  View Dashboard
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
