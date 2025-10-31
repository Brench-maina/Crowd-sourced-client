import React, { useState, useEffect } from "react";

const API_BASE_URL = 'http://localhost:5555';

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

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    xp_reward: "",
    points_reward: "",
    duration_days: ""
  });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      // Using your existing endpoint
      const data = await fetchAPI('/challenges/active');
      setChallenges(data.active_challenges || []);
    } catch (error) {
      console.error('Failed to load challenges:', error);
      // Fallback data
      setChallenges([
        {
          id: 1,
          title: "Frontend Master Challenge",
          description: "Complete 5 frontend learning paths this month",
          participants_count: 89,
          xp_reward: 1000,
          points_reward: 20,
          days_remaining: 15
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      // Using your existing endpoint
      await fetchAPI('/challenges/admin/challenges', {
        method: 'POST',
        body: newChallenge
      });
      
      // Reset form and reload challenges
      setNewChallenge({
        title: "",
        description: "",
        xp_reward: "",
        points_reward: "",
        duration_days: ""
      });
      
      await loadChallenges();
      alert('Challenge created successfully!');
    } catch (error) {
      console.error('Failed to create challenge:', error);
      alert('Failed to create challenge: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChallenge(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="challenges-container">
        <div className="challenges-header">
          <h2 className="form-title">Manage Challenges</h2>
        </div>
        <div className="loading">Loading challenges...</div>
      </div>
    );
  }

  return (
    <div className="challenges-container">
      <div className="challenges-header">
        <h2 className="form-title">Manage Challenges</h2>
      </div>

      {/* Create Challenge Form */}
      <div className="create-challenge-form">
        <h3>Create New Challenge</h3>
        <form onSubmit={handleCreateChallenge}>
          <div className="form-row">
            <div className="form-group">
              <label>Challenge Title</label>
              <input
                type="text"
                name="title"
                value={newChallenge.title}
                onChange={handleInputChange}
                placeholder="Enter challenge title"
                required
              />
            </div>
            <div className="form-group">
              <label>XP Reward</label>
              <input
                type="number"
                name="xp_reward"
                value={newChallenge.xp_reward}
                onChange={handleInputChange}
                placeholder="XP amount"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={newChallenge.description}
              onChange={handleInputChange}
              placeholder="Describe the challenge requirements"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Points Reward</label>
              <input
                type="number"
                name="points_reward"
                value={newChallenge.points_reward}
                onChange={handleInputChange}
                placeholder="Points amount"
                required
              />
            </div>
            <div className="form-group">
              <label>Duration (Days)</label>
              <input
                type="number"
                name="duration_days"
                value={newChallenge.duration_days}
                onChange={handleInputChange}
                placeholder="Duration in days"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create Challenge'}
          </button>
        </form>
      </div>

      {/* Active Challenges List */}
      <div className="challenges-list">
        <h3>Active Challenges</h3>
        {challenges.map(challenge => (
          <div key={challenge.id} className="challenge-card">
            <div className="challenge-header">
              <h4>{challenge.title}</h4>
              <span className={`status ${challenge.days_remaining > 0 ? 'active' : 'upcoming'}`}>
                {challenge.days_remaining > 0 ? 'active' : 'upcoming'}
              </span>
            </div>
            <p>{challenge.description}</p>
            <div className="challenge-stats">
              <span>👥 {challenge.participants_count} participants</span>
              <span>⭐ {challenge.xp_reward} XP</span>
              <span>🏆 {challenge.points_reward} points</span>
              <span>📅 {challenge.days_remaining} days remaining</span>
            </div>
          </div>
        ))}
        
        {challenges.length === 0 && (
          <div className="empty-state">
            <p>No active challenges. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;