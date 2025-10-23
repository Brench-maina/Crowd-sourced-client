// Tabs/Profile.js
import React, { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: "January 2024",
    level: 4,
    xp: 2450,
    nextLevelXp: 3000,
    bio: "Passionate learner exploring mathematics and science. Always curious!",
    interests: ["Mathematics", "Science", "Technology", "Problem Solving"]
  };

  const learningStats = [
    { label: "Courses Completed", value: 5 },
    { label: "Total Study Hours", value: 42 },
    { label: "Current Streak", value: 7 },
    { label: "Quizzes Passed", value: 12 }
  ];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">JD</div>
          <div className="level-badge">Lvl {userData.level}</div>
        </div>
        
        <div className="profile-info">
          <h2>{userData.name}</h2>
          <p className="profile-email">{userData.email}</p>
          <p className="profile-join">Joined {userData.joinDate}</p>
          
          <div className="xp-progress">
            <div className="progress-header">
              <span>Level {userData.level}</span>
              <span>{userData.xp} / {userData.nextLevelXp} XP</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${(userData.xp / userData.nextLevelXp) * 100}%`}}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button 
          className={activeTab === "achievements" ? "active" : ""}
          onClick={() => setActiveTab("achievements")}
        >
          Achievements
        </button>
        <button 
          className={activeTab === "settings" ? "active" : ""}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="bio-section">
              <h3>About Me</h3>
              <p>{userData.bio}</p>
            </div>

            <div className="interests-section">
              <h3>Interests</h3>
              <div className="interests-list">
                {userData.interests.map((interest, index) => (
                  <span key={index} className="interest-tag">{interest}</span>
                ))}
              </div>
            </div>

            <div className="stats-section">
              <h3>Learning Statistics</h3>
              <div className="stats-grid">
                {learningStats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="achievements-tab">
            <h3>Recent Achievements</h3>
            <div className="achievements-list">
              <div className="achievement-item">
                <span className="achievement-icon">🏆</span>
                <div className="achievement-info">
                  <h4>Math Master</h4>
                  <p>Completed 5 mathematics courses</p>
                  <span className="achievement-date">Earned Jan 15, 2024</span>
                </div>
              </div>
              <div className="achievement-item">
                <span className="achievement-icon">⭐</span>
                <div className="achievement-info">
                  <h4>Perfect Score</h4>
                  <p>Got 100% on a challenging quiz</p>
                  <span className="achievement-date">Earned Jan 10, 2024</span>
                </div>
              </div>
              <div className="achievement-item">
                <span className="achievement-icon">🔥</span>
                <div className="achievement-info">
                  <h4>7-Day Streak</h4>
                  <p>Learned for 7 consecutive days</p>
                  <span className="achievement-date">Earned Jan 8, 2024</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-tab">
            <h3>Account Settings</h3>
            <div className="settings-form">
              <div className="form-group">
                <label>Display Name</label>
                <input type="text" defaultValue={userData.name} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue={userData.email} />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea defaultValue={userData.bio} rows="3"></textarea>
              </div>
              <div className="form-group">
                <label>Learning Goals</label>
                <select defaultValue="intermediate">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <button className="save-btn">Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;