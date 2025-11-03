import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/user/profile", {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">Loading your learning guide...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="guide-header">
        <h1 className="guide-title">
          📚 Learning Platform Guide
        </h1>
        <p className="guide-subtitle">
          Welcome to your learning journey. Here's how to make the most of this platform.
        </p>
      </div>

      {/* Main Guide Sections */}
      <div className="guide-grid">
        
        {/* Platform Navigation */}
        <div className="guide-card">
          <div className="card-header">
            <h3>🗺️ How to Navigate the Platform</h3>
          </div>
          <div className="card-content">
            <div className="instruction-section">
              <h4>Main Sections:</h4>
              <ul className="instruction-list">
                <li>
                  <strong>Learning Paths</strong> - Browse and enroll in structured courses
                </li>
                <li>
                  <strong>Challenges & Events</strong> - Participate in time-limited learning activities
                </li>
                <li>
                  <strong>Community</strong> - Connect with other learners and share knowledge
                </li>
                <li>
                  <strong>Progress Tracking</strong> - Monitor your learning journey and achievements
                </li>
                <li>
                  <strong>Leaderboard</strong> - See how you compare with other learners
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="guide-card">
          <div className="card-header">
            <h3>🚀 Getting Started Guide</h3>
          </div>
          <div className="card-content">
            <div className="instruction-section">
              <h4>Your First Steps:</h4>
              <ol className="step-list">
                <li>
                  <strong>Explore Learning Paths</strong>
                  <p>Browse available courses and select one that interests you. Each path contains modules that build upon each other.</p>
                </li>
                <li>
                  <strong>Start with Module 1</strong>
                  <p>Begin with the first module of your chosen learning path. Complete the reading materials and resources.</p>
                </li>
                <li>
                  <strong>Take the Quiz</strong>
                  <p>After completing module resources, test your knowledge with the included quiz.</p>
                </li>
                <li>
                  <strong>Move to Next Module</strong>
                  <p>Once you pass the quiz, proceed to the next module in sequence.</p>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Learning Guidelines */}
        <div className="guide-card">
          <div className="card-header">
            <h3>📖 Effective Learning Strategies</h3>
          </div>
          <div className="card-content">
            <div className="guideline-item">
              <div className="guideline-icon">⏱️</div>
              <div className="guideline-content">
                <h5>Consistent Daily Practice</h5>
                <p>Dedicate 15-30 minutes daily rather than long sessions occasionally. Consistency builds strong learning habits.</p>
              </div>
            </div>
            <div className="guideline-item">
              <div className="guideline-icon">🎯</div>
              <div className="guideline-content">
                <h5>Set Clear Objectives</h5>
                <p>Before each session, define what you want to accomplish. Complete specific modules or understand particular concepts.</p>
              </div>
            </div>
            <div className="guideline-item">
              <div className="guideline-icon">🔄</div>
              <div className="guideline-content">
                <h5>Regular Review</h5>
                <p>Revisit previous modules weekly. Spaced repetition helps transfer knowledge to long-term memory.</p>
              </div>
            </div>
            <div className="guideline-item">
              <div className="guideline-icon">💭</div>
              <div className="guideline-content">
                <h5>Active Learning</h5>
                <p>Don't just read passively. Take notes, ask questions, and try to explain concepts in your own words.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="guide-card">
          <div className="card-header">
            <h3>⚙️ Platform Features Explained</h3>
          </div>
          <div className="card-content">
            <div className="feature-item">
              <h5>Learning Paths</h5>
              <p>Structured courses organized into modules. Each path has a clear progression from beginner to advanced topics.</p>
            </div>
            <div className="feature-item">
              <h5>Challenges & Events</h5>
              <p>Time-limited activities that encourage focused learning. Perfect for testing your skills in a competitive environment.</p>
            </div>
            <div className="feature-item">
              <h5>Community Discussions</h5>
              <p>Share insights, ask questions, and help fellow learners. Learning together enhances understanding.</p>
            </div>
            <div className="feature-item">
              <h5>Progress Tracking</h5>
              <p>Monitor your completion rates, quiz scores, and learning milestones. Visualize your growth over time.</p>
            </div>
          </div>
        </div>

        {/* Success Tips */}
        <div className="guide-card">
          <div className="card-header">
            <h3>💡 Tips for Success</h3>
          </div>
          <div className="card-content">
            <div className="tip-item">
              <h5>Create a Learning Schedule</h5>
              <p>Set aside specific times for learning. Treat it like an important appointment you can't miss.</p>
            </div>
            <div className="tip-item">
              <h5>Focus on Understanding</h5>
              <p>Don't rush to complete modules. Ensure you truly grasp each concept before moving forward.</p>
            </div>
            <div className="tip-item">
              <h5>Apply What You Learn</h5>
              <p>Try to use new knowledge in practical situations. Application reinforces learning.</p>
            </div>
            <div className="tip-item">
              <h5>Take Breaks</h5>
              <p>Step away periodically. Short breaks help maintain focus and prevent burnout.</p>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="guide-card">
          <div className="card-header">
            <h3>❓ Common Questions</h3>
          </div>
          <div className="card-content">
            <div className="faq-item">
              <h5>How do I choose a learning path?</h5>
              <p>Start with paths that match your current knowledge level and interests. You can always switch or add more paths later.</p>
            </div>
            <div className="faq-item">
              <h5>What if I fail a quiz?</h5>
              <p>Review the module materials and retake the quiz. Learning often involves multiple attempts to master concepts.</p>
            </div>
            <div className="faq-item">
              <h5>Can I learn multiple paths at once?</h5>
              <p>Yes, but focus on one primary path while dabbling in others. Too much multitasking can reduce learning effectiveness.</p>
            </div>
            <div className="faq-item">
              <h5>How do I track my progress?</h5>
              <p>Your progress is automatically tracked. View completion percentages and quiz scores in your progress dashboard.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Encouragement */}
      <div className="encouragement-section">
        <div className="encouragement-card">
          <h3>🌟 Your Learning Journey</h3>
          <p>Every expert was once a beginner. Your consistent effort, no matter how small, compounds into significant knowledge over time.</p>
          <p>Remember: Learning is a marathon, not a sprint. Celebrate small victories and be patient with your progress.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;