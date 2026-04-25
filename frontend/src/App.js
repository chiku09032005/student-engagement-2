import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Social from './pages/Social';
import Games from './pages/Games';
import TimeManagement from './pages/TimeManagement';
import StudyPlanner from './pages/StudyPlanner';
import AIBot from './pages/AIBot';
import Admin from './pages/Admin';
import Meetup from './pages/Meetup';
import './styles/App.css';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/social"
        element={
          <PrivateRoute>
            <Social />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/games"
        element={
          <PrivateRoute>
            <Games />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/time-management"
        element={
          <PrivateRoute>
            <TimeManagement />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/study"
        element={
          <PrivateRoute>
            <StudyPlanner />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/ai-bot"
        element={
          <PrivateRoute>
            <AIBot />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/meetups"
        element={
          <PrivateRoute>
            <Meetup />
          </PrivateRoute>
        }
      />
      
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
