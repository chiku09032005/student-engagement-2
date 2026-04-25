import React, { useState, useEffect } from 'react';
import { aiBotAPI } from '../services/api';
import '../styles/App.css';

const AIBot = () => {
  const [doubts, setDoubts] = useState([]);
  const [communityDoubts, setCommunityDoubts] = useState([]);
  const [communityCategory, setCommunityCategory] = useState('all');
  const [replyText, setReplyText] = useState({});
  const [formData, setFormData] = useState({
    question: '',
    category: 'academic',
    subject: 'mathematics',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [faq, setFaq] = useState([]);
  const [tips, setTips] = useState([]);
  const [quote, setQuote] = useState('');
  const [streakMessage, setStreakMessage] = useState('');
  const [streakDays, setStreakDays] = useState(7);
  const [aiAnswer, setAiAnswer] = useState('');
  const [portalTab, setPortalTab] = useState('my-doubts');

  useEffect(() => {
    fetchDoubts();
    fetchCommunityDoubts();
    fetchQuote();
    fetchFAQ(formData.category);
    fetchQuickTips(formData.category);
  }, []);

  useEffect(() => {
    fetchFAQ(formData.category);
    fetchQuickTips(formData.category);
  }, [formData.category]);

  useEffect(() => {
    fetchCommunityDoubts(communityCategory);
  }, [communityCategory]);

  const fetchDoubts = async () => {
    try {
      setLoading(true);
      const response = await aiBotAPI.getDoubts();
      setDoubts(response.data.doubts);
    } catch (error) {
      console.error('Error fetching doubts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFAQ = async (category) => {
    try {
      const response = await aiBotAPI.getFAQ(category);
      setFaq(response.data.faq || []);
    } catch (error) {
      console.error('Error fetching FAQ:', error);
    }
  };

  const fetchQuickTips = async (category) => {
    try {
      const response = await aiBotAPI.getQuickTips(category);
      setTips(response.data.tips || []);
    } catch (error) {
      console.error('Error fetching quick tips:', error);
    }
  };

  const fetchQuote = async () => {
    try {
      const response = await aiBotAPI.getMotivationalQuote();
      setQuote(response.data.quote || '');
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  const fetchCommunityDoubts = async (category = communityCategory) => {
    try {
      const response = await aiBotAPI.getAllDoubts(category === 'all' ? undefined : category);
      setCommunityDoubts(response.data.doubts);
    } catch (error) {
      console.error('Error fetching community doubts:', error);
    }
  };

  const replyToDoubt = async (doubtId) => {
    try {
      if (!replyText[doubtId] || !replyText[doubtId].trim()) return;

      await aiBotAPI.replyToDoubt({
        doubtId,
        reply: replyText[doubtId].trim(),
      });

      setReplyText((prev) => ({ ...prev, [doubtId]: '' }));
      fetchCommunityDoubts();
    } catch (error) {
      console.error('Error replying to doubt:', error);
    }
  };

  const fetchStreakMessage = async (days) => {
    try {
      const response = await aiBotAPI.getStudyStreakMessage(days);
      setStreakMessage(response.data.message || 'Keep going!');
    } catch (error) {
      console.error('Error fetching streak message:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await aiBotAPI.askDoubt(formData);
      const questionResult = response.data.doubt;
      setAiAnswer(questionResult.aiResponse || '');
      setDoubts([questionResult, ...doubts]);
      setCommunityDoubts([questionResult, ...communityDoubts]);
      setFormData({
        question: '',
        category: 'academic',
        subject: 'mathematics',
        description: '',
      });
    } catch (error) {
      console.error('Error asking doubt:', error);
    }
  };

  const rateAnswer = async (doubtId, rating) => {
    try {
      await aiBotAPI.rateAnswer({
        doubtId,
        rating,
        helpful: rating >= 4,
        isResolved: rating >= 4,
      });
      fetchDoubts();
    } catch (error) {
      console.error('Error rating answer:', error);
    }
  };

  return (
    <div className="container">
      <h1>🤖 AI Doubt Solver</h1>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="card">
            <h2>Ask Your Question</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Question</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Ask any question..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="academic">Academic</option>
                  <option value="social">Social</option>
                  <option value="personal">Personal</option>
                  <option value="mental">Mental Health</option>
                  <option value="physical">Physical Health</option>
                  <option value="health">Health</option>
                  <option value="study">Study</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Mathematics, Science"
                />
              </div>

              <div className="form-group">
                <label>Additional Details</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide more context..."
                  rows="4"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Ask AI Bot
              </button>
            </form>

            {aiAnswer && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
                <h3>AI Answer</h3>
                <p>{aiAnswer}</p>
              </div>
            )}
          </div>

          <div className="card">
            <h2>Questions History ({doubts.length})</h2>
            {doubts.length === 0 ? (
              <p>No questions asked yet. Ask something!</p>
            ) : (
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {doubts.map((doubt) => (
                  <div
                    key={doubt._id}
                    style={{
                      marginBottom: '1rem',
                      padding: '1rem',
                      backgroundColor: '#f7f7f7',
                      borderRadius: '4px',
                      borderLeft: `4px solid ${doubt.isResolved ? '#48bb78' : '#ed8936'}`,
                    }}
                  >
                    <h4>{doubt.question}</h4>
                    <span className="badge badge-primary">{doubt.category}</span>
                    {doubt.subject && (
                      <span className="badge badge-warning" style={{ marginLeft: '0.5rem' }}>
                        {doubt.subject}
                      </span>
                    )}

                    <div
                      style={{
                        marginTop: '0.75rem',
                        padding: '0.75rem',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <strong>AI Response:</strong>
                      <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        {doubt.aiResponse?.substring(0, 150)}...
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => rateAnswer(doubt._id, 5)}
                        className="btn btn-success"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        👍 Helpful
                      </button>
                      <button
                        onClick={() => rateAnswer(doubt._id, 2)}
                        className="btn btn-danger"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                      >
                        👎 Not Helpful
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card">
            <h2>AI Learning Boosters</h2>
            {quote && (
              <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
                <strong>Motivation:</strong>
                <p style={{ marginTop: '0.5rem' }}>{quote}</p>
              </div>
            )}

            <div className="form-group">
              <label>Study Streak Days</label>
              <input
                type="number"
                value={streakDays}
                onChange={(e) => setStreakDays(Number(e.target.value))}
                min="1"
                style={{ width: '100px' }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: '0.5rem' }}
                onClick={() => fetchStreakMessage(streakDays)}
              >
                Get Streak Message
              </button>
            </div>

            {streakMessage && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fff7ed', borderRadius: '8px' }}>
                <strong>Streak Message</strong>
                <p style={{ marginTop: '0.5rem' }}>{streakMessage}</p>
              </div>
            )}

            <div style={{ marginTop: '1rem' }}>
              <h3>FAQ</h3>
              {faq.length > 0 ? (
                <ul style={{ paddingLeft: '1rem' }}>
                  {faq.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '0.75rem' }}>
                      <strong>{item.question}</strong>
                      <p style={{ margin: '0.25rem 0 0' }}>{item.answer}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No FAQ available for this category yet.</p>
              )}
            </div>

            <div style={{ marginTop: '1rem' }}>
              <h3>Quick Tips</h3>
              {tips.length > 0 ? (
                <ul>
                  {tips.map((tip, idx) => (
                    <li key={idx} style={{ marginBottom: '0.5rem' }}>{tip}</li>
                  ))}
                </ul>
              ) : (
                <p>Try selecting a category to see quick tips.</p>
              )}
            </div>
          </div>

          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <h2>Community Doubt Portal</h2>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <button
                className={`btn ${communityCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCommunityCategory('all')}
              >
                All
              </button>
              <button
                className={`btn ${communityCategory === 'academic' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCommunityCategory('academic')}
              >
                Academic
              </button>
              <button
                className={`btn ${communityCategory === 'social' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCommunityCategory('social')}
              >
                Social
              </button>
              <button
                className={`btn ${communityCategory === 'personal' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCommunityCategory('personal')}
              >
                Personal
              </button>
              <button
                className={`btn ${communityCategory === 'mental' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCommunityCategory('mental')}
              >
                Mental
              </button>
              <button
                className={`btn ${communityCategory === 'physical' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCommunityCategory('physical')}
              >
                Physical
              </button>
              <button
                className={`btn ${communityCategory === 'study' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCommunityCategory('study')}
              >
                Study
              </button>
            </div>
            {communityDoubts.length === 0 ? (
              <p>No community doubts yet. Ask your question to start the conversation.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {communityDoubts.map((doubt) => (
                  <div
                    key={doubt._id}
                    style={{
                      padding: '1rem',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div>
                        <strong>{doubt.question}</strong>
                        <div style={{ fontSize: '0.85rem', color: '#555' }}>
                          {doubt.category} • {doubt.subject || 'General'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div>{doubt.userId?.name || 'Anonymous'}</div>
                        {doubt.userId?.collegeName && <small>🎓 {doubt.userId.collegeName}</small>}
                      </div>
                    </div>

                    {doubt.description && <p style={{ marginBottom: '0.75rem' }}>{doubt.description}</p>}

                    {doubt.aiResponse && (
                      <div style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '6px', marginBottom: '0.75rem' }}>
                        <strong>AI Response</strong>
                        <p style={{ marginTop: '0.5rem' }}>{doubt.aiResponse}</p>
                      </div>
                    )}

                    {doubt.replies?.length > 0 && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <strong>Replies</strong>
                        {doubt.replies.map((reply) => (
                          <div key={reply._id || reply.createdAt} style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#f0f4ff', borderRadius: '6px' }}>
                            <div style={{ fontSize: '0.85rem', color: '#333' }}>
                              {reply.userId?.name || 'Community'}
                              {reply.userId?.collegeName && ` • ${reply.userId.collegeName}`}
                            </div>
                            <p style={{ margin: '0.25rem 0 0' }}>{reply.reply}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div>
                      <textarea
                        rows="2"
                        value={replyText[doubt._id] || ''}
                        onChange={(e) => setReplyText((prev) => ({ ...prev, [doubt._id]: e.target.value }))}
                        placeholder="Write a reply to help this student..."
                        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
                      />
                      <button
                        onClick={() => replyToDoubt(doubt._id)}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                      >
                        Post Reply
                      </button>
                    </div>
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

export default AIBot;
