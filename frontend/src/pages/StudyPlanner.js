import React, { useState, useEffect } from 'react';
import { studyAPI } from '../services/api';
import '../styles/App.css';

const StudyPlanner = () => {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    subjects: [{ name: '', chapters: [], hoursPerWeek: 0, priority: 'medium' }],
    startDate: '',
    endDate: '',
    targetScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await studyAPI.getPlans();
      setPlans(response.data.studyPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studyAPI.createPlan(formData);
      setFormData({
        title: '',
        subjects: [{ name: '', chapters: [], hoursPerWeek: 0, priority: 'medium' }],
        startDate: '',
        endDate: '',
        targetScore: 0,
      });
      fetchPlans();
      alert('Study plan created successfully!');
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  const deletePlan = async (planId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await studyAPI.deletePlan(planId);
        fetchPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  return (
    <div className="container">
      <h1>📚 Study Planner</h1>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="card">
            <h2>Create Study Plan</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Plan Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Board Exam Preparation"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject Name</label>
                <input
                  type="text"
                  value={formData.subjects[0]?.name || ''}
                  onChange={(e) => {
                    const newSubjects = [...formData.subjects];
                    newSubjects[0].name = e.target.value;
                    setFormData({ ...formData, subjects: newSubjects });
                  }}
                  placeholder="e.g., Mathematics"
                />
              </div>

              <div className="form-group">
                <label>Hours per Week</label>
                <input
                  type="number"
                  value={formData.subjects[0]?.hoursPerWeek || 0}
                  onChange={(e) => {
                    const newSubjects = [...formData.subjects];
                    newSubjects[0].hoursPerWeek = parseInt(e.target.value);
                    setFormData({ ...formData, subjects: newSubjects });
                  }}
                />
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  value={formData.subjects[0]?.priority || 'medium'}
                  onChange={(e) => {
                    const newSubjects = [...formData.subjects];
                    newSubjects[0].priority = e.target.value;
                    setFormData({ ...formData, subjects: newSubjects });
                  }}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Target Score</label>
                <input
                  type="number"
                  value={formData.targetScore}
                  onChange={(e) => setFormData({ ...formData, targetScore: parseInt(e.target.value) })}
                  min="0"
                  max="100"
                />
              </div>

              <button type="submit" className="btn btn-success">
                Create Plan
              </button>
            </form>
          </div>

          <div className="card">
            <h2>Study Plans ({plans.length})</h2>
            {plans.length === 0 ? (
              <p>No study plans yet. Create your first plan!</p>
            ) : (
              <div>
                {plans.map((plan) => (
                  <div
                    key={plan._id}
                    style={{
                      marginBottom: '1rem',
                      padding: '1rem',
                      backgroundColor: '#f7f7f7',
                      borderRadius: '4px',
                      borderLeft: '4px solid #667eea',
                    }}
                  >
                    <h4>{plan.title}</h4>
                    {plan.subjects.map((subject) => (
                      <div key={subject._id || Math.random()}>
                        <p><strong>{subject.name}</strong></p>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>
                          {subject.hoursPerWeek} hrs/week | Target: {plan.targetScore}/100
                        </p>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#ddd', borderRadius: '4px', marginBottom: '0.5rem' }}>
                          <div
                            style={{
                              width: `${subject.progress || 0}%`,
                              height: '100%',
                              backgroundColor: '#667eea',
                              borderRadius: '4px',
                              transition: 'width 0.3s',
                            }}
                          ></div>
                        </div>
                        <p style={{ fontSize: '0.85rem' }}>{subject.progress || 0}% complete</p>
                      </div>
                    ))}
                    <button
                      onClick={() => deletePlan(plan._id)}
                      className="btn btn-danger"
                      style={{ marginTop: '0.5rem' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
