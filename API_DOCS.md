# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new student account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "class": "10th",
  "schoolName": "XYZ School"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login User
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "class": "10th"
  }
}
```

### Logout
**POST** `/auth/logout`

Logout the user. (Token-based auth, no backend logout needed)

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## User Endpoints

### Get User Profile
**GET** `/users/profile`

Retrieve authenticated user's profile.

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Student",
    "class": "10th",
    "interests": ["Math", "Science"],
    "friends": [...]
  }
}
```

### Update User Profile
**PUT** `/users/profile`

Update user profile information.

**Request Body:**
```json
{
  "name": "John Doe",
  "bio": "Love learning",
  "interests": ["Math", "Science", "Technology"],
  "avatar": "avatar_url",
  "phone": "9876543210"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### Get All Users
**GET** `/users/all`

Get list of all users for friend discovery.

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "507f...",
      "name": "User 1",
      "email": "user1@example.com",
      "avatar": "url",
      "bio": "...",
      "class": "10th"
    }
  ]
}
```

### Search Users
**GET** `/users/search?query=john`

Search for users by name, email, or class.

**Response (200):**
```json
{
  "success": true,
  "users": [ ... ]
}
```

---

## Social Endpoints

### Send Message
**POST** `/social/message`

Send a message to another user.

**Request Body:**
```json
{
  "recipientId": "507f1f77bcf86cd799439011",
  "content": "Hey! How are you?"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "_id": "...",
    "senderId": "...",
    "recipientId": "...",
    "content": "...",
    "isRead": false,
    "createdAt": "2024-04-24T10:30:00Z"
  }
}
```

### Get Messages
**GET** `/social/messages/:userId`

Retrieve conversation with a specific user.

**Response (200):**
```json
{
  "success": true,
  "messages": [
    {
      "_id": "...",
      "senderId": "...",
      "content": "...",
      "isRead": true,
      "createdAt": "2024-04-24T10:30:00Z"
    }
  ]
}
```

### Add Friend
**POST** `/social/friend/add`

Add another user as a friend.

**Request Body:**
```json
{
  "friendId": "507f1f77bcf86cd799439011"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Friend added successfully"
}
```

### Remove Friend
**POST** `/social/friend/remove`

Remove a friend from friend list.

**Request Body:**
```json
{
  "friendId": "507f1f77bcf86cd799439011"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Friend removed successfully"
}
```

### Get Friends
**GET** `/social/friends`

Get user's friend list.

**Response (200):**
```json
{
  "success": true,
  "friends": [
    {
      "_id": "...",
      "name": "Friend Name",
      "email": "friend@example.com",
      "avatar": "url"
    }
  ]
}
```

---

## Games Endpoints

### Get All Games
**GET** `/games`

Get list of all available games.

**Response (200):**
```json
{
  "success": true,
  "games": [
    {
      "_id": "...",
      "name": "Math Quiz",
      "description": "Test your math skills",
      "type": "quiz",
      "difficulty": "medium",
      "totalPoints": 100
    }
  ]
}
```

### Get Game Details
**GET** `/games/:gameId`

Get specific game with all questions.

**Response (200):**
```json
{
  "success": true,
  "game": {
    "_id": "...",
    "name": "Math Quiz",
    "questions": [
      {
        "question": "What is 2+2?",
        "options": ["3", "4", "5", "6"],
        "correctAnswer": 1,
        "points": 10
      }
    ]
  }
}
```

### Submit Game Score
**POST** `/games/score/submit`

Submit score after completing a game.

**Request Body:**
```json
{
  "gameId": "507f1f77bcf86cd799439011",
  "score": 85,
  "correctAnswers": 8,
  "totalQuestions": 10,
  "timeTaken": 180
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Score submitted successfully",
  "data": {
    "_id": "...",
    "score": 85,
    "correctAnswers": 8,
    "totalQuestions": 10,
    "timeTaken": 180,
    "completedAt": "2024-04-24T10:30:00Z"
  }
}
```

### Get Leaderboard
**GET** `/games/:gameId/leaderboard?limit=10`

Get top players for a specific game.

**Response (200):**
```json
{
  "success": true,
  "leaderboard": [
    {
      "_id": "...",
      "userId": {
        "name": "John Doe"
      },
      "score": 95,
      "correctAnswers": 9
    }
  ]
}
```

### Get User Scores
**GET** `/games/user/scores`

Get all game scores for current user.

**Response (200):**
```json
{
  "success": true,
  "scores": [ ... ]
}
```

---

## Time Management Endpoints

### Log Workout
**POST** `/time-management/workout`

Log a completed workout session.

**Request Body:**
```json
{
  "exercises": [
    {
      "name": "Running",
      "duration": 30,
      "reps": 0,
      "calories": 300,
      "completed": true
    }
  ],
  "totalDuration": 30,
  "totalCalories": 300,
  "mood": "excellent",
  "notes": "Great session!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Workout logged successfully",
  "workout": { ... }
}
```

### Get Workouts
**GET** `/time-management/workouts?startDate=2024-04-01&endDate=2024-04-30`

Get user's workout history.

**Response (200):**
```json
{
  "success": true,
  "workouts": [ ... ]
}
```

### Create Schedule
**POST** `/time-management/schedule`

Create a daily schedule.

**Request Body:**
```json
{
  "date": "2024-04-24",
  "slots": [
    {
      "time": "08:00",
      "activity": "Math Study",
      "duration": 60,
      "priority": "high",
      "completed": false
    }
  ],
  "reminder": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Schedule created successfully",
  "schedule": { ... }
}
```

### Get Schedules
**GET** `/time-management/schedules?date=2024-04-24`

Get schedules for a specific date.

**Response (200):**
```json
{
  "success": true,
  "schedules": [ ... ]
}
```

### Update Schedule Slot
**PUT** `/time-management/schedule/slot`

Mark a schedule slot as completed.

**Request Body:**
```json
{
  "scheduleId": "507f1f77bcf86cd799439011",
  "slotIndex": 0,
  "completed": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Slot updated successfully",
  "schedule": { ... }
}
```

---

## Study Endpoints

### Create Study Plan
**POST** `/study/plan`

Create a new study plan.

**Request Body:**
```json
{
  "title": "Board Exam Preparation",
  "subjects": [
    {
      "name": "Mathematics",
      "chapters": ["Algebra", "Geometry"],
      "hoursPerWeek": 8,
      "priority": "high"
    }
  ],
  "startDate": "2024-04-24",
  "endDate": "2024-08-24",
  "targetScore": 90,
  "notes": "Focus on problem solving"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Study plan created successfully",
  "studyPlan": { ... }
}
```

### Get Study Plans
**GET** `/study/plans`

Get all study plans for current user.

**Response (200):**
```json
{
  "success": true,
  "studyPlans": [ ... ]
}
```

### Get Study Plan
**GET** `/study/plan/:planId`

Get specific study plan details.

**Response (200):**
```json
{
  "success": true,
  "studyPlan": { ... }
}
```

### Update Study Plan
**PUT** `/study/plan/:planId`

Update a study plan.

**Request Body:** (Same as create)

**Response (200):**
```json
{
  "success": true,
  "message": "Study plan updated successfully",
  "studyPlan": { ... }
}
```

### Update Progress
**PUT** `/study/plan/progress`

Update subject progress.

**Request Body:**
```json
{
  "planId": "507f1f77bcf86cd799439011",
  "subjectIndex": 0,
  "progress": 75
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Progress updated successfully"
}
```

### Delete Study Plan
**DELETE** `/study/plan/:planId`

Delete a study plan.

**Response (200):**
```json
{
  "success": true,
  "message": "Study plan deleted successfully"
}
```

---

## AI Bot Endpoints

### Ask Doubt
**POST** `/ai-bot/ask`

Submit a question to AI Bot.

**Request Body:**
```json
{
  "question": "How to solve quadratic equations?",
  "category": "academic",
  "subject": "mathematics",
  "description": "I'm struggling with complex equations"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Doubt submitted successfully",
  "doubt": {
    "_id": "...",
    "question": "...",
    "category": "academic",
    "aiResponse": "Step by step solution...",
    "isResolved": false,
    "createdAt": "2024-04-24T10:30:00Z"
  }
}
```

### Get Doubts
**GET** `/ai-bot/doubts?category=academic&isResolved=false`

Get all questions asked by user.

**Response (200):**
```json
{
  "success": true,
  "doubts": [ ... ]
}
```

### Get Doubt Details
**GET** `/ai-bot/doubt/:doubtId`

Get specific question and answer.

**Response (200):**
```json
{
  "success": true,
  "doubt": { ... }
}
```

### Rate Answer
**PUT** `/ai-bot/doubt/rate`

Rate the AI response.

**Request Body:**
```json
{
  "doubtId": "507f1f77bcf86cd799439011",
  "rating": 5,
  "helpful": true,
  "isResolved": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Rating submitted successfully"
}
```

### Delete Doubt
**DELETE** `/ai-bot/doubt/:doubtId`

Delete a question from history.

**Response (200):**
```json
{
  "success": true,
  "message": "Doubt deleted successfully"
}
```

---

## Admin Endpoints

### Get Dashboard Stats
**GET** `/admin/stats`

Get overall platform statistics.

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "activeUsers": 45,
    "totalDoubts": 320,
    "resolvedDoubts": 280,
    "resolutionRate": "87.5",
    "totalGamePlays": 1200,
    "totalMessages": 5600
  }
}
```

### Get Activity Logs
**GET** `/admin/logs?startDate=2024-04-01&endDate=2024-04-30&action=login&limit=100`

Get activity logs with filters.

**Response (200):**
```json
{
  "success": true,
  "logs": [
    {
      "_id": "...",
      "userId": {
        "name": "John Doe"
      },
      "action": "login",
      "description": "User logged in",
      "timestamp": "2024-04-24T10:30:00Z"
    }
  ]
}
```

### Get User Engagement Metrics
**GET** `/admin/engagement`

Get engagement metrics for all users.

**Response (200):**
```json
{
  "success": true,
  "metrics": [
    {
      "userId": "...",
      "name": "John Doe",
      "activities": 45,
      "doubts": 12,
      "gameScores": 25,
      "messages": 120,
      "workouts": 8,
      "studyPlans": 3,
      "engagementScore": 213
    }
  ]
}
```

### Get AI Bot Analytics
**GET** `/admin/ai-analytics`

Get AI bot performance metrics.

**Response (200):**
```json
{
  "success": true,
  "analytics": {
    "totalQuestions": 320,
    "avgRating": "4.2",
    "helpfulPercentage": "78.5",
    "byCategory": [
      {
        "_id": "academic",
        "count": 180
      },
      {
        "_id": "social",
        "count": 90
      },
      {
        "_id": "personal",
        "count": 50
      }
    ]
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details"
}
```

### Common Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

**Last Updated:** April 24, 2024
