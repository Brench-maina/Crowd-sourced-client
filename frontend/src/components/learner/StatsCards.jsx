// StatsCards.jsx
import React, { useState, useEffect } from "react";

export default function StatsCards() {
  const [stats, setStats] = useState({
    xp: 0,
    enrolledCourses: 0,
    completedCourses: 0,
    avgCompletion: 0,
    badgesCount: 0,
    level: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatsData();
  }, []);

  const fetchStatsData = async () => {
    try {
      const token = localStorage.getItem("token");
      const baseURL = "http://localhost:5555";
      
      // Fetch user data for XP, level, and progress
      const userResponse = await fetch(`${baseURL}/user/profile`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      // Fetch user badges count - FIXED: Use correct endpoint
      const badgesResponse = await fetch(`${baseURL}/badges/my-badges`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log("User Data:", userData);
        
        let badgesArray = [];

        if (badgesResponse.ok) {
          const badgesData = await badgesResponse.json();
          console.log("Badges Data:", badgesData);
          
          // The endpoint returns earned_badges count directly
          badgesArray = badgesData.badges?.filter(b => b.is_earned) || [];
        } else {
          console.error("Failed to fetch badges:", await badgesResponse.text());
        }

        // Get progress from user profile data
        const progressArray = userData.progress || [];
        console.log("Progress Data:", progressArray);

        // Calculate stats from backend data
        const completedCourses = progressArray.filter(p => p.completion_percent === 100).length;
        const totalCourses = progressArray.length;
        const avgCompletion = totalCourses > 0 
          ? Math.round(progressArray.reduce((sum, p) => sum + (p.completion_percent || 0), 0) / totalCourses)
          : 0;

        // Calculate level based on XP (simplified: every 500 XP = 1 level)
        const xp = userData.xp || 0;
        const level = Math.floor(xp / 500) + 1;

        setStats({
          xp: xp,
          enrolledCourses: totalCourses,
          completedCourses: completedCourses,
          avgCompletion: avgCompletion,
          badgesCount: badgesArray.length,
          level: level
        });
      } else {
        console.error("Failed to fetch user profile:", await userResponse.text());
      }
    } catch (error) {
      console.error("Error fetching stats data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stats-container">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="stat-card loading">
            <div className="loading-placeholder"></div>
            <div className="loading-placeholder small"></div>
            <div className="loading-placeholder small"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stats-container">
      <div className="stat-card xp">
        <div className="stat-icon">⭐</div>
        <div className="stat-content">
          <h2>{stats.xp.toLocaleString()}</h2>
          <p>Learning XP</p>
          <span>Level {stats.level}</span>
        </div>
      </div>
      
      <div className="stat-card courses">
        <div className="stat-icon">📚</div>
        <div className="stat-content">
          <h2>{stats.enrolledCourses}</h2>
          <p>Courses Enrolled</p>
          <span>{stats.completedCourses} completed</span>
        </div>
      </div>
      
      <div className="stat-card completion">
        <div className="stat-icon">📈</div>
        <div className="stat-content">
          <h2 style={{ color: stats.avgCompletion >= 70 ? "#10b981" : stats.avgCompletion >= 50 ? "#f59e0b" : "#ef4444" }}>
            {stats.avgCompletion}%
          </h2>
          <p>Avg Completion</p>
          <span>{stats.avgCompletion >= 70 ? "Great progress!" : stats.avgCompletion >= 50 ? "Keep going!" : "Let's start!"}</span>
        </div>
      </div>
      
      <div className="stat-card badges">
        <div className="stat-icon">🏆</div>
        <div className="stat-content">
          <h2>{stats.badgesCount}</h2>
          <p>Badges Earned</p>
          <span>{stats.badgesCount > 0 ? "Achiever!" : "Earn your first!"}</span>
        </div>
      </div>
    </div>
  );
}