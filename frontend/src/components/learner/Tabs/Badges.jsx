// Tabs/Badges.js
import React from "react";
import "./Badges.css";

const Badges = () => {
  const badges = [
    {
      id: 1,
      name: "Math Whiz",
      description: "Complete 5 math courses",
      icon: "🔢",
      earned: true,
      progress: 100,
      date: "2024-01-15"
    },
    {
      id: 2,
      name: "Science Explorer",
      description: "Complete 3 science courses",
      icon: "🔬",
      earned: false,
      progress: 66,
      date: null
    },
    {
      id: 3,
      name: "Perfect Score",
      description: "Get 100% on any quiz",
      icon: "⭐",
      earned: true,
      progress: 100,
      date: "2024-01-10"
    },
    {
      id: 4,
      name: "Weekend Warrior",
      description: "Complete 5 lessons on weekends",
      icon: "🏆",
      earned: false,
      progress: 40,
      date: null
    },
    {
      id: 5,
      name: "Quick Learner",
      description: "Complete a course in 3 days",
      icon: "⚡",
      earned: false,
      progress: 0,
      date: null
    },
    {
      id: 6,
      name: "Community Helper",
      description: "Help 10 other learners",
      icon: "🤝",
      earned: true,
      progress: 100,
      date: "2024-01-08"
    }
  ];

  const earnedBadges = badges.filter(badge => badge.earned);
  const inProgressBadges = badges.filter(badge => !badge.earned && badge.progress > 0);
  const lockedBadges = badges.filter(badge => !badge.earned && badge.progress === 0);

  return (
    <div className="badges-container">
      <h2 className="badges-title">Your Badges</h2>
      
      <div className="badges-summary">
        <div className="summary-card">
          <h3>{earnedBadges.length}</h3>
          <p>Badges Earned</p>
        </div>
        <div className="summary-card">
          <h3>{inProgressBadges.length}</h3>
          <p>In Progress</p>
        </div>
        <div className="summary-card">
          <h3>{lockedBadges.length}</h3>
          <p>Locked</p>
        </div>
      </div>

      <div className="badges-section">
        <h3>🏆 Earned Badges</h3>
        <div className="badges-grid">
          {earnedBadges.map(badge => (
            <div key={badge.id} className="badge-card earned">
              <div className="badge-icon">{badge.icon}</div>
              <h4>{badge.name}</h4>
              <p>{badge.description}</p>
              <span className="badge-date">Earned: {badge.date}</span>
            </div>
          ))}
        </div>
      </div>

      {inProgressBadges.length > 0 && (
        <div className="badges-section">
          <h3>🔄 In Progress</h3>
          <div className="badges-grid">
            {inProgressBadges.map(badge => (
              <div key={badge.id} className="badge-card in-progress">
                <div className="badge-icon">{badge.icon}</div>
                <h4>{badge.name}</h4>
                <p>{badge.description}</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${badge.progress}%`}}
                  ></div>
                </div>
                <span className="progress-text">{badge.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="badges-section">
        <h3>🔒 Locked Badges</h3>
        <div className="badges-grid">
          {lockedBadges.map(badge => (
            <div key={badge.id} className="badge-card locked">
              <div className="badge-icon">❓</div>
              <h4>???</h4>
              <p>Complete challenges to unlock</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Badges;