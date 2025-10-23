import React from "react";
import "./Analytics.css";

const Analytics = () => {
  return (
    <div className="analytics-container">
      <h2 className="analytics-title">Your Impact & Analytics</h2>

      <div className="analytics-grid">
        {/* Total Reach */}
        <div className="analytics-card total-reach">
          <h3>Total Reach</h3>
          <h1>15,420</h1>
          <p>Students reached through your content</p>
          <span className="growth">↑ 23% from last month</span>
        </div>

        {/* Engagement Rate */}
        <div className="analytics-card engagement-rate">
          <h3>Engagement Rate</h3>
          <h1>78%</h1>
          <p>Average completion rate</p>
          <span className="growth">↑ 5% from last month</span>
        </div>

        {/* Top Resource */}
        <div className="analytics-card top-resource">
          <h3>Top Resource</h3>
          <h4>Introduction to Fractions</h4>
          <p>1,234 views • 4.8 rating</p>
          <span className="popular-badge">⭐ Most Popular</span>
        </div>

        {/* Achievement Progress */}
        <div className="analytics-card achievement-progress">
          <h3>Achievement Progress</h3>
          <p>Content Creator Badge</p>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <span className="progress-text">
            2 more approved resources to unlock!
          </span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

