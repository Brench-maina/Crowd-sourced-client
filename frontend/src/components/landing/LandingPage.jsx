// components/landing/LandingPage.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './LandingPage.css';

const LandingPage = ({ onShowLogin, onShowSignup }) => {
  const { user } = useAuth();

  // If user is already logged in, don't show landing page
  if (user) {
    return null;
  }

  const features = [
    {
      icon: '🎓',
      title: 'Interactive Learning',
      description: 'Engage with interactive courses, quizzes, and progress tracking'
    },
    {
      icon: '👨‍🏫',
      title: 'Content Creation',
      description: 'Create and share educational resources with the community'
    },
    {
      icon: '📊',
      title: 'Progress Analytics',
      description: 'Track your learning journey with detailed analytics and insights'
    },
    {
      icon: '🏆',
      title: 'Achievement System',
      description: 'Earn badges and rewards for your learning milestones'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Medical Student',
      avatar: '👩‍⚕️',
      content: 'This platform revolutionized how I study. The interactive courses made complex topics so much easier to understand!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Software Engineer',
      avatar: '👨‍💻',
      content: 'As a contributor, I love sharing my knowledge. The analytics help me understand what resources students find most helpful.',
      rating: 5
    },
    {
      name: 'Dr. Emily Davis',
      role: 'University Professor',
      avatar: '👩‍🏫',
      content: 'The admin tools make managing course content seamless. My students engagement has increased significantly since we started using this platform.',
      rating: 4
    },
    {
      name: 'Alex Rodriguez',
      role: 'High School Student',
      avatar: '👨‍🎓',
      content: 'The gamified learning experience keeps me motivated. Ive earned 15 badges in just 2 months!',
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <header className="landing-header">
        <div className="landing-nav">
          <div className="nav-brand">
            <span className="brand-icon">🎯</span>
            <span className="brand-name">EduPlatform</span>
          </div>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#testimonials">Reviews</a>
            <a href="#roles">For You</a>
          </nav>
          <div className="nav-auth">
            <button className="auth-btn login-btn" onClick={onShowLogin}>
              Login
            </button>
            <button className="auth-btn signup-btn" onClick={onShowSignup}>
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Transform Your Learning Experience</h1>
            <p className="hero-subtitle">
              Join thousands of learners, educators, and administrators in a revolutionary 
              educational platform designed to make learning engaging, effective, and accessible.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Active Learners</div>
              </div>
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Courses</div>
              </div>
              <div className="stat">
                <div className="stat-number">95%</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
            </div>
            <div className="hero-actions">
              <button className="cta-button primary" onClick={onShowSignup}>
                Start Learning Free
              </button>
              <button className="cta-button secondary" onClick={onShowLogin}>
                Existing Account
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <span>📚</span>
              <p>Interactive Courses</p>
            </div>
            <div className="floating-card card-2">
              <span>🏆</span>
              <p>Earn Badges</p>
            </div>
            <div className="floating-card card-3">
              <span>📊</span>
              <p>Track Progress</p>
            </div>
            <div className="main-visual">
              <div className="platform-preview">
                <div className="preview-header">
                  <div className="preview-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="preview-content">
                  <div className="preview-course">
                    <div className="course-progress"></div>
                    <div className="course-title">Learning in Progress...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <h2>Why Choose Our Platform?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Sections */}
      <section id="roles" className="roles-section">
        <div className="container">
          <h2>Designed for Everyone in Education</h2>
          
          {/* Learner Section */}
          <div className="role-section learner-role">
            <div className="role-content">
              <div className="role-info">
                <div className="role-header">
                  <span className="role-icon">🎓</span>
                  <h3>For Learners</h3>
                </div>
                <p className="role-description">
                  Embark on an engaging learning journey with personalized courses, 
                  interactive content, and comprehensive progress tracking.
                </p>
                <div className="role-features">
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Access to thousands of interactive courses across all subjects</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Personalized learning paths based on your goals and progress</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Gamified experience with badges, points, and achievement levels</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Interactive quizzes and assessments with instant feedback</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Progress tracking and detailed analytics on your learning journey</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Collaborative learning with discussion forums and peer support</span>
                  </div>
                </div>
              </div>
              <div className="role-visual">
                <div className="demo-card learner-demo">
                  <div className="demo-header">
                    <span>Learner Dashboard</span>
                  </div>
                  <div className="demo-content">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '75%'}}></div>
                    </div>
                    <div className="course-list">
                      <div className="course-item">📊 Current Progress: 75%</div>
                      <div className="course-item">🏆 Badges Earned: 12</div>
                      <div className="course-item">⭐ Current Streak: 7 days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contributor Section */}
          <div className="role-section contributor-role">
            <div className="role-content reversed">
              <div className="role-visual">
                <div className="demo-card contributor-demo">
                  <div className="demo-header">
                    <span>Contributor Dashboard</span>
                  </div>
                  <div className="demo-content">
                    <div className="stats-grid">
                      <div className="stat">📈 15,420 Views</div>
                      <div className="stat">⭐ 4.8 Rating</div>
                      <div className="stat">💬 45 Comments</div>
                    </div>
                    <div className="resource-list">
                      <div className="resource">✅ Introduction to Fractions</div>
                      <div className="resource">🔄 Advanced Algebra (Draft)</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="role-info">
                <div className="role-header">
                  <span className="role-icon">👨‍🏫</span>
                  <h3>For Contributors</h3>
                </div>
                <p className="role-description">
                  Share your knowledge, create impactful educational content, and earn 
                  recognition while helping others learn and grow.
                </p>
                <div className="role-features">
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Easy-to-use content creation tools with rich text and media support</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Real-time analytics on resource performance and student engagement</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Collaborative content development with version control</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Recognition system with contributor levels and achievement badges</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Monetization opportunities for premium content creators</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Community feedback and rating system to improve your content</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Section */}
          <div className="role-section admin-role">
            <div className="role-content">
              <div className="role-info">
                <div className="role-header">
                  <span className="role-icon">⚙️</span>
                  <h3>For Administrators</h3>
                </div>
                <p className="role-description">
                  Manage your educational institution with powerful tools for content 
                  management, user administration, and platform analytics.
                </p>
                <div className="role-features">
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Comprehensive user management with role-based access control</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Advanced content moderation and quality control tools</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Platform-wide analytics and reporting dashboard</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Customizable learning paths and curriculum management</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Bulk operations for user management and content updates</span>
                  </div>
                  <div className="feature-item">
                    <span className="checkmark">✅</span>
                    <span>Integration capabilities with existing educational systems</span>
                  </div>
                </div>
              </div>
              <div className="role-visual">
                <div className="demo-card admin-demo">
                  <div className="demo-header">
                    <span>Admin Dashboard</span>
                  </div>
                  <div className="demo-content">
                    <div className="admin-stats">
                      <div className="admin-stat">
                        <div className="stat-value">2,847</div>
                        <div className="stat-label">Active Users</div>
                      </div>
                      <div className="admin-stat">
                        <div className="stat-value">156</div>
                        <div className="stat-label">New Courses</div>
                      </div>
                    </div>
                    <div className="quick-actions">
                      <div className="action">Manage Users</div>
                      <div className="action">View Reports</div>
                      <div className="action">System Settings</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <h2>What Our Community Says</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="user-avatar">{testimonial.avatar}</div>
                  <div className="user-info">
                    <div className="user-name">{testimonial.name}</div>
                    <div className="user-role">{testimonial.role}</div>
                  </div>
                  <div className="rating">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <div className="testimonial-content">
                  "{testimonial.content}"
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join our community of learners, educators, and innovators today.</p>
            <div className="cta-actions">
              <button className="cta-button primary large" onClick={onShowSignup}>
                Create Free Account
              </button>
              <button className="cta-button secondary large" onClick={onShowLogin}>
                Sign In to Existing Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="brand-icon">🎯</span>
              <span className="brand-name">EduPlatform</span>
              <p>Transforming education through technology and community.</p>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Platform</h4>
                <a href="#features">Features</a>
                <a href="#roles">For You</a>
                <a href="#testimonials">Reviews</a>
              </div>
              <div className="link-group">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Contact Us</a>
                <a href="#">Privacy Policy</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 EduPlatform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;