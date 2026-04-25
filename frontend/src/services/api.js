import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users/all'),
  searchUsers: (query) => api.get('/users/search', { params: { query } }),
};

// Social APIs
export const socialAPI = {
  sendMessage: (data) => api.post('/social/message', data),
  getMessages: (userId) => api.get(`/social/messages/${userId}`),
  addFriend: (friendId) => api.post('/social/friend/add', { friendId }),
  removeFriend: (friendId) => api.post('/social/friend/remove', { friendId }),
  getFriends: () => api.get('/social/friends'),
};

// Game APIs
export const gameAPI = {
  getAllGames: () => api.get('/games'),
  getGameById: (gameId) => api.get(`/games/${gameId}`),
  submitScore: (data) => api.post('/games/score/submit', data),
  getLeaderboard: (gameId, limit) => api.get(`/games/${gameId}/leaderboard`, { params: { limit } }),
  getUserScores: () => api.get('/games/user/scores'),
};

// Time Management APIs
export const timeManagementAPI = {
  createWorkout: (data) => api.post('/time-management/workout', data),
  getWorkouts: (startDate, endDate) => api.get('/time-management/workouts', { params: { startDate, endDate } }),
  createSchedule: (data) => api.post('/time-management/schedule', data),
  getSchedules: (date) => api.get('/time-management/schedules', { params: { date } }),
  updateScheduleSlot: (data) => api.put('/time-management/schedule/slot', data),
};

// Study APIs
export const studyAPI = {
  createPlan: (data) => api.post('/study/plan', data),
  getPlans: () => api.get('/study/plans'),
  getPlanById: (planId) => api.get(`/study/plan/${planId}`),
  updatePlan: (planId, data) => api.put(`/study/plan/${planId}`, data),
  updateProgress: (data) => api.put('/study/plan/progress', data),
  deletePlan: (planId) => api.delete(`/study/plan/${planId}`),
};

// AI Bot APIs
export const aiBotAPI = {
  askDoubt: (data) => api.post('/ai-bot/ask', data),
  getDoubts: (category, isResolved) => api.get('/ai-bot/doubts', { params: { category, isResolved } }),
  getAllDoubts: (category) => api.get('/ai-bot/all', { params: { category } }),
  getDoubtById: (doubtId) => api.get(`/ai-bot/doubt/${doubtId}`),
  replyToDoubt: (data) => api.post('/ai-bot/doubt/reply', data),
  rateAnswer: (data) => api.put('/ai-bot/doubt/rate', data),
  deleteDoubt: (doubtId) => api.delete(`/ai-bot/doubt/${doubtId}`),
  getFAQ: (category) => api.get(`/ai-bot/faq/${category}`),
  getQuickTips: (category) => api.get(`/ai-bot/tips/${category}`),
  getMotivationalQuote: () => api.get('/ai-bot/quote'),
  getStudyStreakMessage: (streak) => api.get(`/ai-bot/streak/${streak}`),
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/stats'),
  getActivityLogs: (startDate, endDate, action, limit) => 
    api.get('/admin/logs', { params: { startDate, endDate, action, limit } }),
  getEngagementMetrics: () => api.get('/admin/engagement'),
  getAIAnalytics: () => api.get('/admin/ai-analytics'),
};

// Meetup APIs
export const meetupAPI = {
  createMeetup: (data) => api.post('/meetups', data),
  getMeetups: (city, category, status, limit) => api.get('/meetups', { params: { city, category, status, limit } }),
  getMeetupById: (meetupId) => api.get(`/meetups/${meetupId}`),
  joinMeetup: (meetupId) => api.post(`/meetups/${meetupId}/join`),
  leaveMeetup: (meetupId) => api.post(`/meetups/${meetupId}/leave`),
  getSuggestedPlaces: (category, city) => api.get('/meetups/places/suggested', { params: { category, city } }),
  getUserMeetups: () => api.get('/meetups/user/meetups'),
  updateMeetup: (meetupId, data) => api.put(`/meetups/${meetupId}`, data),
  deleteMeetup: (meetupId) => api.delete(`/meetups/${meetupId}`),
};

export default api;
