// export default function StatsCards() {
//   return (
//     <div className="stats-container">
//       <div className="stat-card xp">
//         <h2>42</h2>
//         <p>Pending Reviews</p>
//         <span>Content Review</span>
//       </div>
//       <div className="stat-card">
//         <h2>156</h2>
//         <p>Active Users</p>
//         <span>+12 this week</span>
//       </div>
//       <div className="stat-card">
//         <h2 style={{ color: "#8a2be2" }}>3</h2>
//         <p>Active Challenges</p>
//         <span>2 upcoming</span>
//       </div>
//       <div className="stat-card">
//         <h2>89%</h2>
//         <p>Approval Rate</p>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5555';

// Generic fetch helper
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
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

export default function StatsCards({ statsData }) {
  const [stats, setStats] = useState({
    pending_reviews: 0,
    active_users: 0,
    active_challenges: 0,
    approval_rate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        
        // Fetch data from multiple endpoints to calculate stats
        const [moderationStats, challengesData, eventsData, userStats] = await Promise.all([
          fetchAPI('/moderation/admin/stats').catch(() => ({ statistics: {} })),
          fetchAPI('/challenges/active').catch(() => ({ active_challenges: [] })),
          fetchAPI('/challenges/events/active').catch(() => ({ active_events: [] })),
          fetchAPI('/user/stats').catch(() => ({ total_users: 0 }))
        ]);

        // Calculate real stats from backend data
        const calculatedStats = {
          // Pending reviews from moderation flags
          pending_reviews: moderationStats.statistics?.pending_flags || 0,
          
          // Active users (you might want to add a proper endpoint for this)
          active_users: userStats.total_users || 0,
          
          // Active challenges + events
          active_challenges: (challengesData.active_challenges?.length || 0) + (eventsData.active_events?.length || 0),
          
          // Approval rate from moderation
          approval_rate: moderationStats.statistics?.approval_rate || 0
        };

        setStats(calculatedStats);
      } catch (error) {
        console.error('Failed to load stats:', error);
        // Keep zeros if fetch fails
        setStats({
          pending_reviews: 0,
          active_users: 0,
          active_challenges: 0,
          approval_rate: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []); // Empty dependency array means this runs once on component mount

  // If we have statsData from parent, use it (for backward compatibility)
  const displayStats = statsData || stats;

  if (loading) {
    return (
      <div className="stats-container">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="stat-card">
            <div className="skeleton-loader">Loading...</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stats-container">
      <div className="stat-card xp">
        <h2>{displayStats.pending_reviews}</h2>
        <p>Pending Reviews</p>
        <span>Content Review</span>
      </div>
      <div className="stat-card">
        <h2>{displayStats.active_users}</h2>
        <p>Active Users</p>
        <span>This week</span>
      </div>
      <div className="stat-card">
        <h2 style={{ color: "#8a2be2" }}>{displayStats.active_challenges}</h2>
        <p>Active Challenges</p>
        <span>Total ongoing</span>
      </div>
      <div className="stat-card">
        <h2>{displayStats.approval_rate}%</h2>
        <p>Approval Rate</p>
      </div>
    </div>
  );
}