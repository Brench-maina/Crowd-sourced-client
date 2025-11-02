import React, { useState, useEffect } from "react";
import "./Analytics.css";

const API_BASE_URL = "http://localhost:5555";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found — please log in again.");

        const res = await fetch(`${API_BASE_URL}/progress/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch analytics");

        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(err.message || "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // 🌀 Loading / Error handling
  if (loading) return <p className="analytics-container">Loading analytics...</p>;
  if (error) return <p className="analytics-container text-red-500">Error: {error}</p>;
  if (!analytics) return <p className="analytics-container">No analytics found.</p>;

  // ✅ Safe destructuring with defaults
  const {
    total_reach = 0,
    engagement_rate = 0,
    top_resource = null,
    achievement_progress = 0,
    achievement_text = "Keep progressing!",
  } = analytics;

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">Your Impact & Analytics</h2>

      <div className="analytics-grid">
        {/* 🧩 Total Reach */}
        <div className="analytics-card total-reach">
          <h3>Total Reach</h3>
          <h1>{total_reach?.toLocaleString() || 0}</h1>
          <p>Students reached through your content</p>
          <span className="growth">↑ 23% from last month</span>
        </div>

        {/* 📈 Engagement Rate */}
        <div className="analytics-card engagement-rate">
          <h3>Engagement Rate</h3>
          <h1>{engagement_rate ?? 0}%</h1>
          <p>Average completion rate</p>
          <span className="growth">↑ 5% from last month</span>
        </div>

        {/* 🌟 Top Resource */}
        <div className="analytics-card top-resource">
          <h3>Top Resource</h3>
          {top_resource ? (
            <>
              <h4>{top_resource.title || "Untitled Resource"}</h4>
              <p>
                {top_resource.views?.toLocaleString() || 0} views •{" "}
                {top_resource.rating ?? 0} rating
              </p>
              <span className="popular-badge">⭐ Most Popular</span>
            </>
          ) : (
            <p>No resources yet</p>
          )}
        </div>

        {/* 🏆 Achievement Progress */}
        <div className="analytics-card achievement-progress">
          <h3>Achievement Progress</h3>
          <p>Content Creator Badge</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${achievement_progress || 0}%`,
                backgroundColor: "#4caf50",
              }}
            ></div>
          </div>
          <span className="progress-text">{achievement_text}</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
