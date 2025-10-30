// App.jsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/landing/LandingPage';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ContributorDashboard from "./components/ContributorDashboard/ContributorDashboard";
import LearnerDashboard from "./components/learner/LearnerDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import './App.css';

// Loading Component
function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

// Main App Content
function AppContent() {
  const { user, logout, loading } = useAuth();
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'signup'

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'contributor':
        return <ContributorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'learner':
      default:
        return <LearnerDashboard />;
    }
  };

  // If user is logged in, show their dashboard
  if (user) {
    return (
      <div className="app">
        <div className="app-header">
          <div className="user-info">
            <span className="user-avatar">{user.avatar}</span>
            <span className="user-name">Welcome, {user.name}!</span>
            <span className="user-role">({user.role})</span>
          </div>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
        {renderDashboard()}
      </div>
    );
  }

  // Render different views based on currentView state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return <Login 
          switchToSignup={() => setCurrentView('signup')}
          onBackToLanding={() => setCurrentView('landing')}
        />;
      case 'signup':
        return <Signup 
          switchToLogin={() => setCurrentView('login')}
          onBackToLanding={() => setCurrentView('landing')}
        />;
      case 'landing':
      default:
        return <LandingPage 
          onShowLogin={() => setCurrentView('login')}
          onShowSignup={() => setCurrentView('signup')}
        />;
    }
  };

  return renderCurrentView();
}

// Main App Component with Auth Provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;