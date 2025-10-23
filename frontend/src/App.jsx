
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ContributorDashboard from "./components/ContributorDashboard/ContributorDashboard";
import LearnerDashboard from "./components/learner/LearnerDashboard";
// import AdminDashboard from "./components/admin/AdminDashboard"; // You'll need to create this
import './App.css';

// Main App Content
function AppContent() {
  const { user, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (user.role) {
      case 'contributor':
        return <ContributorDashboard />;
      case 'admin':
        return <AdminDashboard />; // You'll need to create this component
      case 'learner':
      default:
        return <LearnerDashboard />;
    }
  };

  // If user is logged in, show their dashboard
  if (user) {
    return (
      <div className="app">
        {/* Optional: Add a logout button */}
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

  // If user is not logged in, show auth pages
  return isLogin ? (
    <Login switchToSignup={() => setIsLogin(false)} />
  ) : (
    <Signup switchToLogin={() => setIsLogin(true)} />
  );
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