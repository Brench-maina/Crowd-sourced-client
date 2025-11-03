import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;


const fetchAPI = async (endpoint) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    return { active_challenges: [] };
  }
};

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    setLoading(true);
    const data = await fetchAPI("/challenges/active");
    setChallenges(data.active_challenges || []);
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading active challenges...</div>;
  }

  return (
    <div className="challenges-container">
      <h2>Active Challenges</h2>
      {challenges.length === 0 ? (
        <p>No active challenges available at the moment.</p>
      ) : (
        challenges.map((challenge) => (
          <div key={challenge.id} className="challenge-card">
            <h3>{challenge.title}</h3>
            <p>{challenge.description}</p>
            <div className="challenge-stats">
              <span>⭐ XP: {challenge.xp_reward}</span>
              <span>🏆 Points: {challenge.points_reward}</span>
              <span>👥 Participants: {challenge.participants_count}</span>
              <span>📅 Days remaining: {challenge.days_remaining}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Challenges;
