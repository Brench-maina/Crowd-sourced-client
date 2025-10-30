import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import LandingPage from "./components/landing/LandingPage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ContributorDashboard from "./components/ContributorDashboard/ContributorDashboard";
import LearnerDashboard from "./components/learner/LearnerDashboard";

import AdminDashboard from "./components/admin/AdminDashboard";
import Users from "./components/admin/Users";
import Resources from "./components/admin/Resources";
import Challenges from "./components/admin/Challenges";

import "./App.css";

function AppContent() {
  const { user, logout, loading } = useAuth();
  const [currentView, setCurrentView] = useState("landing");

  if (loading) return <div>Loading...</div>;

  // Not logged in → show Landing/Login/Signup
  if (!user) {
    switch (currentView) {
      case "login":
        return (
          <Login
            switchToSignup={() => setCurrentView("signup")}
            onBackToLanding={() => setCurrentView("landing")}
          />
        );
      case "signup":
        return (
          <Signup
            switchToLogin={() => setCurrentView("login")}
            onBackToLanding={() => setCurrentView("landing")}
          />
        );
      default:
        return (
          <LandingPage
            onShowLogin={() => setCurrentView("login")}
            onShowSignup={() => setCurrentView("signup")}
          />
        );
    }
  }

  // Logged in → route by role
  return (
    <div className="app">
      <div className="app-header">
        <span>
          Welcome, {user.name || "User"} ({user.role})
        </span>
        <button onClick={logout}>Logout</button>
      </div>

      <Routes>
        {user.role === "admin" && (
          <Route path="/admin/*" element={<AdminDashboard />}>
            <Route path="users" element={<Users />} />
            <Route path="resources" element={<Resources />} />
            <Route path="challenges" element={<Challenges />} />
          </Route>
        )}

        {user.role === "contributor" && (
          <Route path="*" element={<ContributorDashboard />} />
        )}
        {user.role === "learner" && (
          <Route path="*" element={<LearnerDashboard />} />
        )}

        <Route
          path="/"
          element={<Navigate to={user.role === "admin" ? "/admin" : "/"} replace />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
