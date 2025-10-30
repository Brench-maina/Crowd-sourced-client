import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./Admin.css";

const DashboardHome = () => {
  const stats = [
    { title: "Flagged Items", value: 4, color: "#ef4444", icon: "🚩" },
    { title: "Total Courses", value: 87, color: "#22c55e", icon: "📚" },
    { title: "Active Users", value: "1,243", color: "#3b82f6", icon: "👥" },
    { title: "Reviews", value: 39, color: "#f59e0b", icon: "⭐" },
  ];

  return (
    <div className="dashboard-home">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p className="subtitle">Monitor and manage platform activities</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
                <span style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <div className="stat-info">
                <h3 className="stat-title">{stat.title}</h3>
                <p className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reviews Section */}
      <div className="reviews-section">
        <div className="section-header">
          <h2>Recent Reviews</h2>
        </div>
        <div className="reviews-content">
          <div className="empty-state">
            <p>No pending reviews available.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/admin" || location.pathname === "/admin/";

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h1>Admin</h1>
          <h2>Panel</h2>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            👥 Users
          </NavLink>
          <NavLink to="/admin/resources" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            📚 Resources
          </NavLink>
          <NavLink to="/admin/challenges" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            🏆 Challenges
          </NavLink>
        </nav>

        <div className="sidebar-divider"></div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {isRoot ? <DashboardHome /> : <Outlet />}
      </main>
    </div>
  );
};

export default AdminDashboard;