import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5555"; // change if backend hosted elsewhere

export default function StatsCards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required. Please log in again.");
        }

        const response = await fetch(`${API_BASE_URL}/learning-paths/stats`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Failed to fetch stats (${response.status})`);
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="loading-text">Loading stats...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;
  if (!stats) return <p>No stats found.</p>;

  return (
    <div className="stats-container">
      <div className="stat-card xp">
        <h2>{stats.xp}</h2>
        <p>Contribution XP</p>
        <span>Level {stats.level}</span>
      </div>

      <div className="stat-card">
        <h2>{stats.total_resources}</h2>
        <p>Total Resources</p>
        <span>{stats.approved_resources} approved</span>
      </div>

      <div className="stat-card">
        <h2 style={{ color: "red" }}>{stats.total_views?.toLocaleString() || 0}</h2>
        <p>Total Views</p>
        <span>+245 this week</span>
      </div>

      <div className="stat-card">
        <h2>{stats.avg_rating ? stats.avg_rating.toFixed(1) : "N/A"} ⭐</h2>
        <p>Avg Rating</p>
      </div>
    </div>
  );
}
