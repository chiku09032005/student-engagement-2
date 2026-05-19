require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);

// CORS Configuration — allow frontend origin in production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in development; restrict in production if needed
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const io = socketIO(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling']
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsOptions));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student-engagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB error:', err);
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/social', require('./routes/social.routes'));
app.use('/api/games', require('./routes/games.routes'));
app.use('/api/time-management', require('./routes/timeManagement.routes'));
app.use('/api/study', require('./routes/study.routes'));
app.use('/api/ai-bot', require('./routes/aiBot.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/meetups', require('./routes/meetup.routes'));

// Health check endpoint (useful for Render/Railway)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend build in production (if deploying full-stack on one server)
if (process.env.NODE_ENV === 'production') {
  const frontendBuild = path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(frontendBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

// Socket.IO Events for Real-time Chat
io.on('connection', (socket) => {
  console.log('📱 User connected:', socket.id);

  // Join a personal room for targeted messages
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined their room`);
  });

  socket.on('send-message', (data) => {
    console.log('💬 Message:', data);
    io.to(data.recipientId).emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error('Please stop the other process or set PORT=5001 and restart.');
    process.exit(1);
  } else {
    throw err;
  }
});

module.exports = { app, io };
