import React, { useEffect, useState } from "react";
import "./Badges.css";

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBadges = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token"); // get JWT token from login/signup
      if (!token) {
        setError("You must be logged in to view badges.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5555/badges/my-badges", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load badges");
        }

        // Flask returns { total_badges, earned_badges, badges: [ ... ] }
        const formatted = data.badges.map((b) => ({
          id: b.id,
          name: b.name,
          description: b.description,
          icon: "🏅", // you can replace this later with real icons from DB
          earned: b.is_earned,
          progress: b.progress?.percent || 0, // depends on BadgeService
          date: b.is_earned ? b.created_at?.split("T")[0] : null,
        }));

        setBadges(formatted);
      } catch (err) {
        console.error("Error fetching badges:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  // Derived categories
  const earnedBadges = badges.filter((b) => b.earned);
  const inProgressBadges = badges.filter((b) => !b.earned && b.progress > 0);
  const lockedBadges = badges.filter((b) => !b.earned && b.progress === 0);

  if (loading) return <p className="loading-text">Loading your badges...</p>;
  if (error) return <p className="error-text">{error}</p>;

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

      {/* Earned Badges */}
      <div className="badges-section">
        <h3>🏆 Earned Badges</h3>
        <div className="badges-grid">
          {earnedBadges.length === 0 ? (
            <p>No earned badges yet.</p>
          ) : (
            earnedBadges.map((badge) => (
              <div key={badge.id} className="badge-card earned">
                <div className="badge-icon">{badge.icon}</div>
                <h4>{badge.name}</h4>
                <p>{badge.description}</p>
                {badge.date && (
                  <span className="badge-date">Earned: {badge.date}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* In Progress */}
      {inProgressBadges.length > 0 && (
        <div className="badges-section">
          <h3>🔄 In Progress</h3>
          <div className="badges-grid">
            {inProgressBadges.map((badge) => (
              <div key={badge.id} className="badge-card in-progress">
                <div className="badge-icon">{badge.icon}</div>
                <h4>{badge.name}</h4>
                <p>{badge.description}</p>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${badge.progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{badge.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      <div className="badges-section">
        <h3>🔒 Locked Badges</h3>
        <div className="badges-grid">
          {lockedBadges.length === 0 ? (
            <p>You've discovered all badges!</p>
          ) : (
            lockedBadges.map((badge) => (
              <div key={badge.id} className="badge-card locked">
                <div className="badge-icon">❓</div>
                <h4>???</h4>
                <p>Complete challenges to unlock</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Badges;
