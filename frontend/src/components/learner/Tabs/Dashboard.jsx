// // Tabs/Dashboard.jsx
// import React from "react";
// import "./Dashboard.css";

// const Dashboard = () => {
//   return (
//     <div className="dashboard-container">
//       <h2 className="dashboard-title">Your Learning Overview</h2>

//       <div className="dashboard-grid">
//         {/* Continue Learning */}
//         <div className="dashboard-card continue-learning">
//           <h3>Continue Learning</h3>
//           <div className="course-item">
//             <h4>Introduction to Fractions</h4>
//             <p>Mathematics • 65% completed</p>
//             <div className="progress-bar">
//               <div className="progress-fill" style={{width: '65%'}}></div>
//             </div>
//             <button className="resume-btn">Resume</button>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="dashboard-card recent-activity">
//           <h3>Recent Activity</h3>
//           <ul className="activity-list">
//             <li>✅ Completed "Basic Algebra" quiz</li>
//             <li>🏆 Earned "Math Whiz" badge</li>
//             <li>📚 Started "Geometry Basics"</li>
//             <li>⭐ Rated "Science Experiments" 5 stars</li>
//           </ul>
//         </div>

//         {/* Recommended Courses */}
//         <div className="dashboard-card recommended-courses">
//           <h3>Recommended For You</h3>
//           <div className="course-grid">
//             <div className="course-preview">
//               <h4>Advanced Mathematics</h4>
//               <p>Build on your current skills</p>
//               <span className="difficulty intermediate">Intermediate</span>
//             </div>
//             <div className="course-preview">
//               <h4>Science Fundamentals</h4>
//               <p>Explore basic concepts</p>
//               <span className="difficulty beginner">Beginner</span>
//             </div>
//           </div>
//         </div>

//         {/* Weekly Goals */}
//         <div className="dashboard-card weekly-goals">
//           <h3>Weekly Goals</h3>
//           <div className="goal-item">
//             <p>Complete 2 chapters</p>
//             <span className="goal-progress">1/2</span>
//           </div>
//           <div className="goal-item">
//             <p>Earn 100 XP</p>
//             <span className="goal-progress">75/100</span>
//           </div>
//           <div className="goal-item">
//             <p>Spend 5 hours learning</p>
//             <span className="goal-progress">3/5</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// Tabs/Dashboard.jsx
import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch user profile (contains XP, streak, points)
      const userResponse = await fetch("/user/profile", {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      
      // Fetch user progress (completed modules, progress percentage)
      const progressResponse = await fetch("/progress/user-progress", {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      // Fetch all learning paths for recommendations
      const pathsResponse = await fetch("/learning-paths", {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      // Fetch user badges
      const badgesResponse = await fetch("/badges/user-badges", {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      // Fetch active challenges
      const challengesResponse = await fetch("/challenges/active", {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      // Fetch leaderboard for user ranking
      const leaderboardResponse = await fetch("/leaderboard", {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      // Set data from responses
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserData(userData);
      }

      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setUserProgress(progressData.progress || progressData); // Handle different response structures
      }

      if (pathsResponse.ok) {
        const pathsData = await pathsResponse.json();
        setLearningPaths(pathsData.paths || pathsData); // Handle different response structures
      }

      if (badgesResponse.ok) {
        const badgesData = await badgesResponse.json();
        setUserBadges(badgesData.badges || badgesData); // Handle different response structures
      }

      if (challengesResponse.ok) {
        const challengesData = await challengesResponse.json();
        setActiveChallenges(challengesData.challenges || challengesData); // Handle different response structures
      }

      if (leaderboardResponse.ok) {
        const leaderboardData = await leaderboardResponse.json();
        setLeaderboardData(leaderboardData.leaderboard || leaderboardData); // Handle different response structures
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats based on backend data
  const calculateStats = () => {
    if (!userData) return {};
    
    // Calculate completed modules from progress data
    const completedModules = Array.isArray(userProgress) 
      ? userProgress.filter(p => p.completion_percent === 100).length 
      : 0;
    
    // Get data from user profile
    const totalXP = userData.xp || 0;
    const currentStreak = userData.streak_days || 0;
    const badgesCount = Array.isArray(userBadges) ? userBadges.length : 0;
    const userPoints = userData.points || 0;

    return { completedModules, totalXP, currentStreak, badgesCount, userPoints };
  };

  // Get active progress (incomplete modules)
  const getActiveProgress = () => {
    if (!Array.isArray(userProgress)) return [];
    return userProgress
      .filter(p => p.completion_percent < 100)
      .slice(0, 2);
  };

  // Get recommended paths (not started by user or popular ones)
  const getRecommendedPaths = () => {
    if (!Array.isArray(learningPaths)) return [];
    
    // Get paths user hasn't started (simplified logic)
    const userPathIds = Array.isArray(userProgress) 
      ? userProgress.map(p => p.learning_path_id || p.module?.learning_path_id).filter(Boolean)
      : [];
    
    const recommended = learningPaths
      .filter(path => !userPathIds.includes(path.id))
      .slice(0, 2);
    
    // If no recommendations, show some popular paths
    return recommended.length > 0 ? recommended : learningPaths.slice(0, 2);
  };

  // Generate recent activities from user data
  const getRecentActivities = () => {
    const activities = [];
    
    // Add badge activities
    if (Array.isArray(userBadges) && userBadges.length > 0) {
      userBadges.slice(0, 2).forEach(badge => {
        activities.push(`🏆 Earned "${badge.name || badge.badge_name}" badge`);
      });
    }
    
    // Add completed modules
    if (Array.isArray(userProgress)) {
      userProgress
        .filter(p => p.completion_percent === 100)
        .slice(0, 2)
        .forEach(p => {
          activities.push(`✅ Completed "${p.module?.title || 'a module'}"`);
        });
    }
    
    // Add streak activity
    if (userData?.streak_days > 0) {
      activities.push(`🔥 ${userData.streak_days} day streak!`);
    }
    
    // Add points activity
    if (userData?.points > 0) {
      activities.push(`⭐ ${userData.points} total points earned`);
    }
    
    // Add challenge activities
    if (Array.isArray(activeChallenges) && activeChallenges.length > 0) {
      activeChallenges.slice(0, 1).forEach(challenge => {
        activities.push(`🎯 Joined "${challenge.title}" challenge`);
      });
    }
    
    // Fill with default activities if needed
    while (activities.length < 4) {
      const defaultActivities = [
        "📚 Started new learning path",
        "⭐ Rated a course 5 stars",
        "💬 Posted in community",
        "👥 Helped other learners"
      ];
      activities.push(defaultActivities[activities.length]);
    }
    
    return activities.slice(0, 4);
  };

  // Get user rank from leaderboard
  const getUserRank = () => {
    if (!Array.isArray(leaderboardData) || !userData) return null;
    
    const userEntry = leaderboardData.find(entry => entry.user_id === userData.id);
    return userEntry ? userEntry.rank : null;
  };

  const { completedModules, totalXP, currentStreak, badgesCount, userPoints } = calculateStats();
  const activeProgress = getActiveProgress();
  const recommendedPaths = getRecommendedPaths();
  const recentActivities = getRecentActivities();
  const userRank = getUserRank();

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">Loading your learning overview...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">
        {userData ? `Welcome back, ${userData.username || 'Learner'}! 👋` : "Your Learning Overview"}
      </h2>

      {/* Stats Overview Cards - Aligned with backend models */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Courses Completed</h3>
            <p className="stat-number">{completedModules}</p>
            <span className="stat-subtitle">From your progress</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>Total XP</h3>
            <p className="stat-number">{totalXP}</p>
            <span className="stat-subtitle">Learning experience</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>Current Streak</h3>
            <p className="stat-number">{currentStreak} days</p>
            <span className="stat-subtitle">Daily learning</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3>Badges Earned</h3>
            <p className="stat-number">{badgesCount}</p>
            <span className="stat-subtitle">Achievements</span>
          </div>
        </div>
      </div>

      {/* Additional user stats */}
      {userPoints > 0 && (
        <div className="user-points-banner">
          <span>🎯 Total Points: {userPoints}</span>
          {userRank && <span>🏅 Your Rank: #{userRank}</span>}
        </div>
      )}

      <div className="dashboard-grid">
        {/* Continue Learning - From UserProgress model */}
        <div className="dashboard-card continue-learning">
          <h3>Continue Learning</h3>
          {activeProgress.length > 0 ? (
            activeProgress.map(progress => (
              <div key={progress.id} className="course-item">
                <h4>{progress.module?.title || "Continue Learning"}</h4>
                <p>
                  {progress.module?.learning_path?.title || "Learning Path"} • 
                  {progress.completion_percent || 0}% completed
                </p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${progress.completion_percent || 0}%`}}
                  ></div>
                </div>
                <button className="resume-btn">Resume</button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No active courses. Start a new learning path!</p>
              <button 
                className="explore-btn"
                onClick={() => window.location.href = '/learning-paths'}
              >
                Explore Courses
              </button>
            </div>
          )}
        </div>

        {/* Recent Activity - Generated from user data */}
        <div className="dashboard-card recent-activity">
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            {recentActivities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
          <button 
            className="view-all-btn"
            onClick={() => window.location.href = '/progress'}
          >
            View All Activity
          </button>
        </div>

        {/* Recommended Courses - From LearningPath model */}
        <div className="dashboard-card recommended-courses">
          <h3>Recommended For You</h3>
          <div className="course-grid">
            {recommendedPaths.length > 0 ? (
              recommendedPaths.map(path => (
                <div key={path.id} className="course-preview">
                  <h4>{path.title}</h4>
                  <p>{path.description ? `${path.description.substring(0, 80)}...` : "Start your learning journey"}</p>
                  <div className="course-meta">
                    <span className="difficulty beginner">Beginner</span>
                    <span className="followers">{path.followers_count || 0} learners</span>
                  </div>
                  <button className="start-btn">Start Learning</button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>Loading recommendations...</p>
              </div>
            )}
          </div>
        </div>

        {/* Active Challenges - From ChallengeParticipation model */}
        <div className="dashboard-card weekly-goals">
          <h3>Active Challenges</h3>
          {activeChallenges.length > 0 ? (
            activeChallenges.map(challenge => (
              <div key={challenge.id} className="goal-item">
                <div className="goal-info">
                  <p className="goal-title">{challenge.title}</p>
                  <p className="goal-description">{challenge.description}</p>
                </div>
                <span className="goal-progress">
                  {challenge.progress_percent || 0}%
                </span>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No active challenges right now</p>
              <button 
                className="explore-btn"
                onClick={() => window.location.href = '/challenges'}
              >
                Browse Challenges
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;