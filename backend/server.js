require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

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

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/social', require('./routes/social.routes'));
app.use('/api/games', require('./routes/games.routes'));
app.use('/api/time-management', require('./routes/timeManagement.routes'));
app.use('/api/study', require('./routes/study.routes'));
app.use('/api/ai-bot', require('./routes/aiBot.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/meetups', require('./routes/meetup.routes'));

// Socket.IO Events for Real-time Chat
io.on('connection', (socket) => {
  console.log('📱 User connected:', socket.id);

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
