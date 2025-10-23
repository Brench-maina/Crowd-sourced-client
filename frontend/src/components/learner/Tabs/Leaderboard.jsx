// Tabs/Leaderboard.js
import React, { useState } from "react";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState("weekly");

  const leaderboardData = {
    weekly: [
      { rank: 1, name: "Alex Johnson", xp: 1250, avatar: "👨‍🎓", progress: 100 },
      { rank: 2, name: "Sarah Miller", xp: 980, avatar: "👩‍🎓", progress: 78 },
      { rank: 3, name: "Mike Chen", xp: 875, avatar: "👨‍💼", progress: 70 },
      { rank: 4, name: "You", xp: 750, avatar: "😊", progress: 60, isCurrentUser: true },
      { rank: 5, name: "Emma Davis", xp: 720, avatar: "👩‍🏫", progress: 58 },
      { rank: 6, name: "Tom Wilson", xp: 680, avatar: "👨‍🔬", progress: 54 },
      { rank: 7, name: "Lisa Brown", xp: 620, avatar: "👩‍💻", progress: 50 }
    ],
    monthly: [
      { rank: 1, name: "Sarah Miller", xp: 4850, avatar: "👩‍🎓", progress: 100 },
      { rank: 2, name: "Alex Johnson", xp: 4250, avatar: "👨‍🎓", progress: 88 },
      { rank: 3, name: "You", xp: 3750, avatar: "😊", progress: 77, isCurrentUser: true },
      { rank: 4, name: "Mike Chen", xp: 3675, avatar: "👨‍💼", progress: 76 },
      { rank: 5, name: "Emma Davis", xp: 3120, avatar: "👩‍🏫", progress: 64 }
    ],
    allTime: [
      { rank: 1, name: "Alex Johnson", xp: 15850, avatar: "👨‍🎓", progress: 100 },
      { rank: 2, name: "Sarah Miller", xp: 14200, avatar: "👩‍🎓", progress: 90 },
      { rank: 3, name: "Mike Chen", xp: 12875, avatar: "👨‍💼", progress: 81 },
      { rank: 4, name: "Emma Davis", xp: 10120, avatar: "👩‍🏫", progress: 64 },
      { rank: 5, name: "You", xp: 8750, avatar: "😊", progress: 55, isCurrentUser: true }
    ]
  };

  const currentData = leaderboardData[timeframe];

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2 className="leaderboard-title">Learning Leaderboard</h2>
        <div className="timeframe-selector">
          <button 
            className={timeframe === "weekly" ? "active" : ""}
            onClick={() => setTimeframe("weekly")}
          >
            Weekly
          </button>
          <button 
            className={timeframe === "monthly" ? "active" : ""}
            onClick={() => setTimeframe("monthly")}
          >
            Monthly
          </button>
          <button 
            className={timeframe === "allTime" ? "active" : ""}
            onClick={() => setTimeframe("allTime")}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="leaderboard-content">
        <div className="leaderboard-list">
          {currentData.map(user => (
            <div 
              key={user.rank} 
              className={`leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}`}
            >
              <div className="rank-section">
                <span className="rank">#{user.rank}</span>
                <span className="avatar">{user.avatar}</span>
                <span className="name">{user.name}</span>
              </div>
              
              <div className="progress-section">
                <div className="xp-amount">{user.xp} XP</div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${user.progress}%`}}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="leaderboard-stats">
          <div className="stats-card">
            <h3>Your Position</h3>
            <div className="stat-value">
              #{currentData.find(u => u.isCurrentUser)?.rank || 'N/A'}
            </div>
            <p>Out of {currentData.length} learners</p>
          </div>
          
          <div className="stats-card">
            <h3>Your XP</h3>
            <div className="stat-value">
              {currentData.find(u => u.isCurrentUser)?.xp || 0}
            </div>
            <p>Total points earned</p>
          </div>
          
          <div className="stats-card">
            <h3>Next Goal</h3>
            <div className="stat-value">
              +{Math.max(0, (currentData[Math.max(0, (currentData.find(u => u.isCurrentUser)?.rank || 1) - 2)]?.xp || 0) - (currentData.find(u => u.isCurrentUser)?.xp || 0) + 1)} XP
            </div>
            <p>To advance rank</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;