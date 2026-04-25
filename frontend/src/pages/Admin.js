import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import '../styles/App.css';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [aiAnalytics, setAiAnalytics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, metricsRes, aiRes, logsRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getEngagementMetrics(),
        adminAPI.getAIAnalytics(),
        adminAPI.getActivityLogs(null, null, null, 50),
      ]);

      setStats(statsRes.data.stats);
      setMetrics(metricsRes.data.metrics);
      setAiAnalytics(aiRes.data.analytics);
      setLogs(logsRes.data.logs);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>📊 Admin Dashboard</h1>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          {/* Statistics */}
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="value">{stats?.totalUsers}</div>
              <div className="label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="value">{stats?.activeUsers}</div>
              <div className="label">Active Users</div>
            </div>
            <div className="stat-card">
              <div className="value">{stats?.totalDoubts}</div>
              <div className="label">Total Questions</div>
            </div>
            <div className="stat-card">
              <div className="value">{stats?.resolutionRate}%</div>
              <div className="label">Resolution Rate</div>
            </div>
            <div className="stat-card">
              <div className="value">{stats?.totalGamePlays}</div>
              <div className="label">Games Played</div>
            </div>
            <div className="stat-card">
              <div className="value">{stats?.totalMessages}</div>
              <div className="label">Messages Sent</div>
            </div>
          </div>

          {/* AI Analytics */}
          {aiAnalytics && (
            <div className="grid" style={{ marginTop: '2rem' }}>
              <div className="card">
                <h2>AI Bot Analytics</h2>
                <p><strong>Total Questions:</strong> {aiAnalytics.totalQuestions}</p>
                <p><strong>Average Rating:</strong> {aiAnalytics.avgRating} / 5</p>
                <p><strong>Helpful Responses:</strong> {aiAnalytics.helpfulPercentage}%</p>
                <div style={{ marginTop: '1rem' }}>
                  <h4>Questions by Category:</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiAnalytics.byCategory?.map((cat) => (
                        <tr key={cat._id}>
                          <td>{cat._id}</td>
                          <td>{cat.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Engaged Users */}
              <div className="card">
                <h2>Top Engaged Users</h2>
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Engagement Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics?.slice(0, 10).map((metric) => (
                      <tr key={metric.userId}>
                        <td>{metric.name}</td>
                        <td>
                          <strong>{metric.engagementScore}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Activity Logs */}
          <div className="grid" style={{ marginTop: '2rem', gridTemplateColumns: '1fr' }}>
            <div className="card">
              <h2>Recent Activity Logs</h2>
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Description</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs?.slice(0, 20).map((log) => (
                    <tr key={log._id}>
                      <td>{log.userId?.name || 'System'}</td>
                      <td><span className="badge badge-primary">{log.action}</span></td>
                      <td>{log.description || '-'}</td>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed User Metrics */}
          <div className="grid" style={{ marginTop: '2rem', gridTemplateColumns: '1fr' }}>
            <div className="card">
              <h2>Detailed User Engagement Metrics</h2>
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Activities</th>
                    <th>Doubts Asked</th>
                    <th>Games Played</th>
                    <th>Messages</th>
                    <th>Workouts</th>
                    <th>Study Plans</th>
                    <th>Total Score</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics?.map((metric) => (
                    <tr key={metric.userId}>
                      <td><strong>{metric.name}</strong></td>
                      <td>{metric.activities}</td>
                      <td>{metric.doubts}</td>
                      <td>{metric.gameScores}</td>
                      <td>{metric.messages}</td>
                      <td>{metric.workouts}</td>
                      <td>{metric.studyPlans}</td>
                      <td><strong>{metric.engagementScore}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;
