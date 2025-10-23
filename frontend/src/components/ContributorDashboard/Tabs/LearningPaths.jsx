import React from "react";
import "./LearningPaths.css"; // We'll create this file next

const LearningPaths = () => {
  return (
    <div className="learning-paths-container">
      <div className="learning-paths-card">
        <div className="learning-paths-header">
          <h2>Design Learning Paths</h2>
          <button className="create-path-btn">+ Create Learning Path</button>
        </div>

        <div className="learning-paths-content">
          <div className="icon">📖</div>
          <h3>Create Your First Learning Path!</h3>
          <p>
            Group related resources together to create a structured learning
            journey for students.
          </p>
          <button className="get-started-btn">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default LearningPaths;
