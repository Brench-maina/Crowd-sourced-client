import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default function StatsCards() {
  const [stats, setStats] = useState({
    pendingReviews: 0,
    activeUsers: 0,
    newUsersThisWeek: 0,
    activeChallenges: 0,
    upcomingChallenges: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      let pendingReviews = 0;
      let activeUsers = 0;
      let newUsersThisWeek = 0;
      let activeChallenges = 0;
      let upcomingChallenges = 0;

      // Fetch pending reviews from learning paths
      try {
        const reviewsData = await fetchAPI('/learning-paths/admin/paths/pending?page=1&per_page=1');
        pendingReviews = reviewsData.total_items || 0;
      } catch (error) {
        console.error("Failed to fetch pending reviews:", error);
      }

      // Fetch active users statistics
      try {
        const usersData = await fetchAPI('/user/stats');
        activeUsers = usersData.total_users || 0;
        newUsersThisWeek = usersData.new_users_week || 0;
      } catch (error) {
        console.error("Failed to fetch users stats:", error);
      }

      // Fetch challenges data
      try {
        const challengesData = await fetchAPI('/challenges/active');
        const allChallenges = challengesData.active_challenges || [];
        
        // Count active and upcoming challenges based on days_remaining
        activeChallenges = allChallenges.filter(c => c.days_remaining > 0).length;
        upcomingChallenges = allChallenges.filter(c => c.days_remaining > 7).length;
      } catch (error) {
        console.error("Failed to fetch challenges stats:", error);
      }

      setStats({
        pendingReviews,
        activeUsers,
        newUsersThisWeek,
        activeChallenges,
        upcomingChallenges,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stats-container">
        {[1, 2, 3].map(i => (
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
        <div className="stat-icon">📋</div>
        <div className="stat-content">
          <h2>{stats.pendingReviews}</h2>
          <p>Pending Reviews</p>
          <span>Learning Paths</span>
        </div>
      </div>
      
      <div className="stat-card courses">
        <div className="stat-icon">👥</div>
        <div className="stat-content">
          <h2>{stats.activeUsers}</h2>
          <p>Active Users</p>
          <span>+{stats.newUsersThisWeek} this week</span>
        </div>
      </div>
      
      <div className="stat-card completion">
        <div className="stat-icon">🎯</div>
        <div className="stat-content">
          <h2 style={{ color: "#8a2be2" }}>{stats.activeChallenges}</h2>
          <p>Active Challenges</p>
          <span>{stats.upcomingChallenges} upcoming</span>
        </div>
      </div>
    </div>
  );
}