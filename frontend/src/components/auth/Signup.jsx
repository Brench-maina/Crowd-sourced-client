import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Signup = ({ switchToLogin, onBackToLanding }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'learner'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  //Use login instead of signup to automatically log user in
  const { login } = useAuth();

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

    //Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5555/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role.toLowerCase(),
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Invalid server response');
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to create account');
      }
      
      //auto login
      if (data.access_token && data.user) {
      localStorage.setItem('token', data.access_token);
        login(data.user, data.access_token);
      } else {
        alert('Account created successfully! Please log in.');
        switchToLogin();
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDescription = (role) => {
    const descriptions = {
      learner: 'Access courses, track progress, and earn badges',
      contributor: 'Create educational content and resources',
      admin: 'Manage platform content and users'
    };
    return descriptions[role];
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join our learning community</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
            {error.includes('already exists') && (
              <div style={{ marginTop: '8px' }}>
                <button
                  type="button"
                  className="link-button"
                  onClick={switchToLogin}
                  style={{ fontSize: '14px' }}
                >
                  Sign in instead
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Username</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

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
              placeholder="Create a password (min. 8 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">I want to join as a...</label>
            <div className="role-cards">
              {['learner', 'contributor', 'admin'].map((role) => (
                <label
                  key={role}
                  className={`role-card ${formData.role === role ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="role-card-content">
                    <div className="role-icon">
                      {role === 'learner' && '🎓'}
                      {role === 'contributor' && '👨‍🏫'}
                      {role === 'admin' && '⚙️'}
                    </div>
                    <div className="role-info">
                      <div className="role-title">
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </div>
                      <div className="role-description">
                        {getRoleDescription(role)}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
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
            Already have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={switchToLogin}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;