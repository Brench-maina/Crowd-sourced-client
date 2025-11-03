import React, { useState, useEffect } from "react";
import "./Leaderboard.css";

const API_URL = import.meta.env.VITE_API_URL; 
const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState("allTime");
  const [leaderboardData, setLeaderboardData] = useState({
    leaderboard: [],
    current_user: null,
    page: 1,
    total_pages: 1,
    total_players: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLeaderboard = async (timeframeType, page = 1) => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Please login to view the leaderboard");
      }
      
      const baseUrl = `${API_URL}/leaderboard`;  

      const response = await fetch(`${baseUrl}/${timeframeType}?page=${page}&per_page=20`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setLeaderboardData({
        leaderboard: data.leaderboard || [],
        current_user: data.current_user || null,
        page: data.page || 1,
        total_pages: data.total_pages || 1,
        total_players: data.total_players || 0
      });
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message || 'Failed to fetch leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(timeframe);
  }, [timeframe]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= leaderboardData.total_pages) {
      fetchLeaderboard(timeframe, newPage);
    }
  };

  const getProgressPercentage = (points, maxPoints) => {
    if (maxPoints === 0) return 0;
    return Math.min((points / maxPoints) * 100, 100);
  };

  const maxPoints = leaderboardData.leaderboard[0]?.points || 1;
  const currentUser = leaderboardData.current_user;

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2 className="leaderboard-title">🏆 Learning Leaderboard</h2>
        <div className="timeframe-selector">
          <button 
            className={timeframe === "weekly" ? "active" : ""}
            onClick={() => handleTimeframeChange("weekly")}
          >
            Weekly
          </button>
          <button 
            className={timeframe === "monthly" ? "active" : ""}
            onClick={() => handleTimeframeChange("monthly")}
          >
            Monthly
          </button>
          <button 
            className={timeframe === "allTime" ? "active" : ""}
            onClick={() => handleTimeframeChange("allTime")}
          >
            All Time
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button onClick={() => fetchLeaderboard(timeframe)} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      <div className="leaderboard-content">
        <div className="leaderboard-list">
          {loading ? (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p>Loading leaderboard...</p>
            </div>
          ) : leaderboardData.leaderboard.length === 0 ? (
            <div className="empty-state">
              <p>No learners on the leaderboard yet. Start learning to be the first!</p>
            </div>
          ) : (
            <>
              {leaderboardData.leaderboard.map((user) => (
                <div 
                  key={user.rank} 
                  className={`leaderboard-item ${user.is_current_user ? 'current-user' : ''} ${user.rank <= 3 ? 'top-three' : ''}`}
                >
                  <div className="rank-section">
                    <span className={`rank ${user.rank === 1 ? 'gold' : user.rank === 2 ? 'silver' : user.rank === 3 ? 'bronze' : ''}`}>
                      {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                    </span>
                    <span className="avatar">
                      {user.is_current_user ? '😊' : '👤'}
                    </span>
                    <div className="user-info">
                      <span className="username">
                        {user.username} {user.is_current_user && '(You)'}
                      </span>
                      <span className="user-meta">
                        Level {user.level}
                      </span>
                    </div>
                  </div>
                  
                  <div className="progress-section">
                    <div className="points-display">
                      <div className="points-amount">{user.points} pts</div>
                      <div className="xp-amount">{user.xp} XP</div>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: `${getProgressPercentage(user.points, maxPoints)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Pagination Controls */}
              {leaderboardData.total_pages > 1 && (
                <div className="pagination-controls">
                  <button 
                    onClick={() => handlePageChange(leaderboardData.page - 1)}
                    disabled={leaderboardData.page <= 1}
                    className="pagination-btn"
                  >
                    ← Previous
                  </button>
                  <span className="page-info">
                    Page {leaderboardData.page} of {leaderboardData.total_pages}
                  </span>
                  <button 
                    onClick={() => handlePageChange(leaderboardData.page + 1)}
                    disabled={leaderboardData.page >= leaderboardData.total_pages}
                    className="pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Current User Stats - Only show if user data is available */}
        {currentUser && (
          <div className="leaderboard-stats">
            <div className="stats-card highlight">
              <h3>Your Position</h3>
              <div className="stat-value">
                #{currentUser.rank}
              </div>
              <p>Out of {currentUser.total_learners} learners</p>
            </div>
            
            <div className="stats-card">
              <h3>Your Points</h3>
              <div className="stat-value">
                {currentUser.points}
              </div>
              <p>Leaderboard ranking</p>
            </div>
            
            <div className="stats-card">
              <h3>Your XP</h3>
              <div className="stat-value">
                {currentUser.xp}
              </div>
              <p>Level {currentUser.level || Math.floor(currentUser.xp / 500) + 1}</p>
            </div>

            <div className="stats-card">
              <h3>Next Goal</h3>
              <div className="stat-value">
                {currentUser.points_to_next_rank ? 
                  `+${currentUser.points_to_next_rank}` : 
                  '🏆'}
              </div>
              <p>
                {currentUser.points_to_next_rank ? 
                  'Points to advance' : 
                  'Top rank!'}
              </p>
            </div>

            <div className="stats-card">
              <h3>Timeframe</h3>
              <div className="stat-value">
                {timeframe === 'weekly' && '7 Days'}
                {timeframe === 'monthly' && '30 Days'}
                {timeframe === 'allTime' && 'All Time'}
              </div>
              <p>Leaderboard period</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;