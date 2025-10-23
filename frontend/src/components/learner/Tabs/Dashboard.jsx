// Tabs/Dashboard.jsx
import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Your Learning Overview</h2>

      <div className="dashboard-grid">
        {/* Continue Learning */}
        <div className="dashboard-card continue-learning">
          <h3>Continue Learning</h3>
          <div className="course-item">
            <h4>Introduction to Fractions</h4>
            <p>Mathematics • 65% completed</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '65%'}}></div>
            </div>
            <button className="resume-btn">Resume</button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card recent-activity">
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            <li>✅ Completed "Basic Algebra" quiz</li>
            <li>🏆 Earned "Math Whiz" badge</li>
            <li>📚 Started "Geometry Basics"</li>
            <li>⭐ Rated "Science Experiments" 5 stars</li>
          </ul>
        </div>

        {/* Recommended Courses */}
        <div className="dashboard-card recommended-courses">
          <h3>Recommended For You</h3>
          <div className="course-grid">
            <div className="course-preview">
              <h4>Advanced Mathematics</h4>
              <p>Build on your current skills</p>
              <span className="difficulty intermediate">Intermediate</span>
            </div>
            <div className="course-preview">
              <h4>Science Fundamentals</h4>
              <p>Explore basic concepts</p>
              <span className="difficulty beginner">Beginner</span>
            </div>
          </div>
        </div>

        {/* Weekly Goals */}
        <div className="dashboard-card weekly-goals">
          <h3>Weekly Goals</h3>
          <div className="goal-item">
            <p>Complete 2 chapters</p>
            <span className="goal-progress">1/2</span>
          </div>
          <div className="goal-item">
            <p>Earn 100 XP</p>
            <span className="goal-progress">75/100</span>
          </div>
          <div className="goal-item">
            <p>Spend 5 hours learning</p>
            <span className="goal-progress">3/5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;