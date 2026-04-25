# 🚀 Quick Start Guide

## Installation & Setup (5 minutes)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure MongoDB

Option A: Local MongoDB
```bash
# Make sure MongoDB is running locally on port 27017
mongod
```

Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update .env file with your connection string

### Step 3: Configure Environment Variables

Create/update `backend/.env`:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/student-engagement
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
OPENAI_API_KEY=your_openai_key_here (optional)
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server will run on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# App will open on http://localhost:3000
```

## 📱 First Time User Flow

1. **Access Application**
   - Open http://localhost:3000

2. **Create Account**
   - Click "Register"
   - Fill in: Name, Email, Password, Class, School
   - Click "Register"

3. **Login**
   - Enter your email and password
   - Click "Login"
   - You'll be redirected to Dashboard

4. **Explore Features**
   - **Social Hub**: Find and add friends, send messages
   - **Games**: Play quiz games and brain teasers
   - **Time Management**: Log workouts and create schedules
   - **Study Planner**: Create study plans and track progress
   - **AI Bot**: Ask academic, social, or personal questions
   - **Admin**: View platform statistics and user engagement

## 🎮 Test Data

### Sample Login Credentials
Create your own by registering, but here's what the system supports:
- Email: any@email.com
- Password: minimum 6 characters

### Sample API Testing

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Student",
    "email": "john@example.com",
    "password": "password123",
    "class": "10th",
    "schoolName": "XYZ School"
  }'
```

**Login User:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Try MongoDB Atlas if local doesn't work

### CORS Issues
- Ensure backend is running on port 5000
- Frontend has correct proxy in package.json

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📊 Features Walkthrough

### 🤝 Social Hub
1. Click "Social" in navigation
2. View friends list on left
3. Select friend to chat
4. Type message and send
5. Real-time updates with Socket.IO

### 🎮 Games
1. Click "Games" in navigation
2. Browse available games
3. Click "Play Now" on any game
4. Complete game and submit score
5. Check leaderboard

### ⏰ Time Management
1. Click "Time Management"
2. **Workouts Tab:**
   - Enter exercise details
   - Log mood and calories
   - View history
3. **Schedule Tab:**
   - Create daily schedule
   - Set time slots and activities
   - Mark completion

### 📚 Study Planner
1. Click "Study Planner"
2. Enter plan details:
   - Title
   - Subjects and hours
   - Target score
   - Dates
3. Track progress with progress bar
4. Update and delete plans

### 🤖 AI Doubt Solver
1. Click "AI Bot"
2. Ask a question:
   - Choose category (Academic/Social/Personal)
   - Type question
   - Add details
3. Get instant AI response
4. Rate helpfulness
5. View history

### 📊 Admin Dashboard
1. Click "Admin"
2. View statistics:
   - Total users, active users
   - Questions asked, resolution rate
   - Games played
3. See user engagement metrics
4. View activity logs
5. Check AI analytics

## 🔄 API Response Format

All APIs return consistent JSON format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details"
}
```

## 🎯 Next Steps

1. **Customize UI** - Modify styles in `frontend/src/styles/App.css`
2. **Add More Games** - Create new games in Games section
3. **Enhance AI Bot** - Add more knowledge to `backend/services/aiBot.js`
4. **Integrate Real AI** - Replace with OpenAI API calls
5. **Deploy** - Use Heroku/AWS for backend, Vercel for frontend

## 📚 Documentation

For detailed API documentation, see:
- [API Endpoints Documentation](API_DOCS.md)
- [Database Schema Documentation](DB_SCHEMA.md)
- [Architecture Guide](ARCHITECTURE.md)

---

**Happy Learning! 🎓**
