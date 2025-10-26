import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = ({ switchToSignup, onBackToLanding }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'learner'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Assuming login updates AuthContext after successful login

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Make fetch POST request to your backend
      const response = await fetch('http://localhost:5555/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle backend error messages
        setError(data.message || 'Invalid username or password.');
      } else {
        // If login successful, update AuthContext
        login(data.user, data.token); 
      }

    } catch (err) {
      console.error(err);
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
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
                  onClick={switchToSignup}
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
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
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
