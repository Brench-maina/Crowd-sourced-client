// components/auth/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = ({ switchToSignup, onBackToLanding }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'learner'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isEmailRegistered } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if user exists
      if (!isEmailRegistered(formData.email)) {
        setError('No account found with this email. Please sign up first.');
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Attempt login
      const result = login(formData.email, formData.password);
      
      if (!result.success) {
        setError(result.error);
      }
      // If successful, the AuthContext will handle the redirect
    } catch (err) {
      setError('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupInstead = () => {
    switchToSignup();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back!</h2>
          <p>Sign in to your account</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
            {error.includes('No account found') && (
              <div style={{ marginTop: '8px' }}>
                <button 
                  type="button" 
                  className="link-button" 
                  onClick={handleSignupInstead}
                  style={{ fontSize: '14px' }}
                >
                  Create an account instead
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">I am a...</label>
            <div className="role-selector">
              {['learner', 'contributor', 'admin'].map((role) => (
                <label key={role} className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={handleChange}
                  />
                  <span className="role-label">
                    {role === 'learner' && '🎓 Learner'}
                    {role === 'contributor' && '👨‍🏫 Contributor'}
                    {role === 'admin' && '⚙️ Admin'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        
        <div className="auth-footer">
          <p>
            <button 
              type="button" 
              className="link-button" 
              onClick={onBackToLanding}
              style={{ marginRight: '1rem' }}
            >
              ← Back to Home
            </button>
            Don't have an account?{' '}
            <button type="button" className="link-button" onClick={switchToSignup}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;