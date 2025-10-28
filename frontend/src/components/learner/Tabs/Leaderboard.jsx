// // Tabs/Leaderboard.js
// import React, { useState } from "react";
// import "./Leaderboard.css";

// const Leaderboard = () => {
//   const [timeframe, setTimeframe] = useState("weekly");

//   const leaderboardData = {
//     weekly: [
//       { rank: 1, name: "Alex Johnson", xp: 1250, avatar: "👨‍🎓", progress: 100 },
//       { rank: 2, name: "Sarah Miller", xp: 980, avatar: "👩‍🎓", progress: 78 },
//       { rank: 3, name: "Mike Chen", xp: 875, avatar: "👨‍💼", progress: 70 },
//       { rank: 4, name: "You", xp: 750, avatar: "😊", progress: 60, isCurrentUser: true },
//       { rank: 5, name: "Emma Davis", xp: 720, avatar: "👩‍🏫", progress: 58 },
//       { rank: 6, name: "Tom Wilson", xp: 680, avatar: "👨‍🔬", progress: 54 },
//       { rank: 7, name: "Lisa Brown", xp: 620, avatar: "👩‍💻", progress: 50 }
//     ],
//     monthly: [
//       { rank: 1, name: "Sarah Miller", xp: 4850, avatar: "👩‍🎓", progress: 100 },
//       { rank: 2, name: "Alex Johnson", xp: 4250, avatar: "👨‍🎓", progress: 88 },
//       { rank: 3, name: "You", xp: 3750, avatar: "😊", progress: 77, isCurrentUser: true },
//       { rank: 4, name: "Mike Chen", xp: 3675, avatar: "👨‍💼", progress: 76 },
//       { rank: 5, name: "Emma Davis", xp: 3120, avatar: "👩‍🏫", progress: 64 }
//     ],
//     allTime: [
//       { rank: 1, name: "Alex Johnson", xp: 15850, avatar: "👨‍🎓", progress: 100 },
//       { rank: 2, name: "Sarah Miller", xp: 14200, avatar: "👩‍🎓", progress: 90 },
//       { rank: 3, name: "Mike Chen", xp: 12875, avatar: "👨‍💼", progress: 81 },
//       { rank: 4, name: "Emma Davis", xp: 10120, avatar: "👩‍🏫", progress: 64 },
//       { rank: 5, name: "You", xp: 8750, avatar: "😊", progress: 55, isCurrentUser: true }
//     ]
//   };

//   const currentData = leaderboardData[timeframe];

//   return (
//     <div className="leaderboard-container">
//       <div className="leaderboard-header">
//         <h2 className="leaderboard-title">Learning Leaderboard</h2>
//         <div className="timeframe-selector">
//           <button 
//             className={timeframe === "weekly" ? "active" : ""}
//             onClick={() => setTimeframe("weekly")}
//           >
//             Weekly
//           </button>
//           <button 
//             className={timeframe === "monthly" ? "active" : ""}
//             onClick={() => setTimeframe("monthly")}
//           >
//             Monthly
//           </button>
//           <button 
//             className={timeframe === "allTime" ? "active" : ""}
//             onClick={() => setTimeframe("allTime")}
//           >
//             All Time
//           </button>
//         </div>
//       </div>

//       <div className="leaderboard-content">
//         <div className="leaderboard-list">
//           {currentData.map(user => (
//             <div 
//               key={user.rank} 
//               className={`leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}`}
//             >
//               <div className="rank-section">
//                 <span className="rank">#{user.rank}</span>
//                 <span className="avatar">{user.avatar}</span>
//                 <span className="name">{user.name}</span>
//               </div>
              
//               <div className="progress-section">
//                 <div className="xp-amount">{user.xp} XP</div>
//                 <div className="progress-bar">
//                   <div 
//                     className="progress-fill" 
//                     style={{width: `${user.progress}%`}}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="leaderboard-stats">
//           <div className="stats-card">
//             <h3>Your Position</h3>
//             <div className="stat-value">
//               #{currentData.find(u => u.isCurrentUser)?.rank || 'N/A'}
//             </div>
//             <p>Out of {currentData.length} learners</p>
//           </div>
          
//           <div className="stats-card">
//             <h3>Your XP</h3>
//             <div className="stat-value">
//               {currentData.find(u => u.isCurrentUser)?.xp || 0}
//             </div>
//             <p>Total points earned</p>
//           </div>
          
//           <div className="stats-card">
//             <h3>Next Goal</h3>
//             <div className="stat-value">
//               +{Math.max(0, (currentData[Math.max(0, (currentData.find(u => u.isCurrentUser)?.rank || 1) - 2)]?.xp || 0) - (currentData.find(u => u.isCurrentUser)?.xp || 0) + 1)} XP
//             </div>
//             <p>To advance rank</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Leaderboard;



// components/learner/Tabs/Leaderboard.jsx
import React, { useState, useEffect } from "react";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState("weekly");
  const [leaderboardData, setLeaderboardData] = useState({
    leaderboard: [],
    page: 1,
    total_pages: 1,
    total_players: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock current user data (replace with actual user data from context/auth)
  const currentUser = {
    id: 4,
    username: "You",
    avatar: "😊"
  };

  const fetchLeaderboard = async (timeframeType, page = 1) => {
    setLoading(true);
    setError("");
    
    try {
      // Replace with your actual backend URL
      const baseUrl = "http://localhost:5555/leaderboard"; // Adjust to your backend URL
      const response = await fetch(`${baseUrl}/${timeframeType}?page=${page}&per_page=20`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setLeaderboardData({
        leaderboard: data.leaderboard || [],
        page: data.page || 1,
        total_pages: data.total_pages || 1,
        total_players: data.total_players || 0
      });
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message || 'Failed to fetch leaderboard data');
      
      // Fallback to mock data if API fails
      setLeaderboardData(getMockLeaderboardData(timeframeType));
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback (matches your backend structure)
  const getMockLeaderboardData = (timeframeType) => {
    const mockData = {
      weekly: [
        { rank: 1, user_id: 1, username: "Alex Johnson", points: 1250 },
        { rank: 2, user_id: 2, username: "Sarah Miller", points: 980 },
        { rank: 3, user_id: 3, username: "Mike Chen", points: 875 },
        { rank: 4, user_id: 4, username: "You", points: 750 },
        { rank: 5, user_id: 5, username: "Emma Davis", points: 720 },
        { rank: 6, user_id: 6, username: "Tom Wilson", points: 680 },
        { rank: 7, user_id: 7, username: "Lisa Brown", points: 620 }
      ],
      monthly: [
        { rank: 1, user_id: 2, username: "Sarah Miller", points: 4850 },
        { rank: 2, user_id: 1, username: "Alex Johnson", points: 4250 },
        { rank: 3, user_id: 4, username: "You", points: 3750 },
        { rank: 4, user_id: 3, username: "Mike Chen", points: 3675 },
        { rank: 5, user_id: 5, username: "Emma Davis", points: 3120 }
      ],
      allTime: [
        { rank: 1, user_id: 1, username: "Alex Johnson", points: 15850 },
        { rank: 2, user_id: 2, username: "Sarah Miller", points: 14200 },
        { rank: 3, user_id: 3, username: "Mike Chen", points: 12875 },
        { rank: 4, user_id: 5, username: "Emma Davis", points: 10120 },
        { rank: 5, user_id: 4, username: "You", points: 8750 }
      ]
    };

    return {
      leaderboard: mockData[timeframeType] || [],
      page: 1,
      total_pages: 1,
      total_players: mockData[timeframeType]?.length || 0
    };
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

  const getCurrentUserRank = () => {
    return leaderboardData.leaderboard.find(user => user.user_id === currentUser.id);
  };

  const getProgressPercentage = (points, maxPoints) => {
    if (maxPoints === 0) return 0;
    return Math.min((points / maxPoints) * 100, 100);
  };

  const currentUserRank = getCurrentUserRank();
  const maxPoints = leaderboardData.leaderboard[0]?.points || 1;

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2 className="leaderboard-title">Learning Leaderboard</h2>
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
          ) : (
            <>
              {leaderboardData.leaderboard.map((user) => (
                <div 
                  key={user.rank} 
                  className={`leaderboard-item ${user.user_id === currentUser.id ? 'current-user' : ''}`}
                >
                  <div className="rank-section">
                    <span className="rank">#{user.rank}</span>
                    <span className="avatar">
                      {user.user_id === currentUser.id ? currentUser.avatar : '👤'}
                    </span>
                    <span className="username">{user.username}</span>
                  </div>
                  
                  <div className="progress-section">
                    <div className="points-amount">{user.points} XP</div>
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
                    Previous
                  </button>
                  <span className="page-info">
                    Page {leaderboardData.page} of {leaderboardData.total_pages}
                  </span>
                  <button 
                    onClick={() => handlePageChange(leaderboardData.page + 1)}
                    disabled={leaderboardData.page >= leaderboardData.total_pages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="leaderboard-stats">
          <div className="stats-card">
            <h3>Your Position</h3>
            <div className="stat-value">
              {currentUserRank ? `#${currentUserRank.rank}` : 'Not Ranked'}
            </div>
            <p>Out of {leaderboardData.total_players} learners</p>
          </div>
          
          <div className="stats-card">
            <h3>Your XP</h3>
            <div className="stat-value">
              {currentUserRank ? currentUserRank.points : 0}
            </div>
            <p>Total points earned</p>
          </div>
          
          <div className="stats-card">
            <h3>Next Goal</h3>
            <div className="stat-value">
              {currentUserRank && currentUserRank.rank > 1 ? 
                `+${Math.max(1, leaderboardData.leaderboard[currentUserRank.rank - 2]?.points - currentUserRank.points + 1)} XP` : 
                '🏆 Top Rank!'}
            </div>
            <p>To advance rank</p>
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
      </div>
    </div>
  );
};

export default Leaderboard;