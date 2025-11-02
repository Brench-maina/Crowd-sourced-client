// Tabs/ChallengesEvents.jsx
import React, { useState, useEffect } from "react";
import "./ChallengesEvents.css";

const ChallengesEvents = () => {
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [platformEvents, setPlatformEvents] = useState([]);
  const [myParticipations, setMyParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("challenges");

  const API_BASE_URL = "http://localhost:5555";

  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

  // Safe fetch function with error handling
  const safeFetch = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.log(`API call failed for ${url}:`, err.message);
      throw err;
    }
  };

  // Fetch active challenges
  const fetchActiveChallenges = async () => {
    try {
      const data = await safeFetch(`${API_BASE_URL}/challenges/active`);
      setActiveChallenges(data.active_challenges || []);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError('Failed to load challenges');
      setActiveChallenges([]);
    }
  };

  // Fetch platform events
  const fetchPlatformEvents = async () => {
    try {
      const data = await safeFetch(`${API_BASE_URL}/challenges/events/active`);
      setPlatformEvents(data.active_events || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
      setPlatformEvents([]);
    }
  };

  // Fetch my challenge participations
  const fetchMyParticipations = async () => {
    try {
      const data = await safeFetch(`${API_BASE_URL}/challenges/my-challenges`);
      setMyParticipations(data.participations || []);
    } catch (err) {
      console.error('Error fetching my participations:', err);
      setMyParticipations([]);
    }
  };

  // Join a challenge
  const joinChallenge = async (challengeId) => {
    try {
      const data = await safeFetch(`${API_BASE_URL}/challenges/challenges/${challengeId}/join`, {
        method: 'POST'
      });
      
      // Refresh participations after joining
      await fetchMyParticipations();
      
      // Show success message
      alert(data.message || 'Successfully joined the challenge!');
      
      return true;
    } catch (err) {
      console.error('Error joining challenge:', err);
      setError(err.message || 'Failed to join challenge');
      return false;
    }
  };

  // Join an event
  const joinEvent = async (eventId) => {
    try {
      const data = await safeFetch(`${API_BASE_URL}/challenges/events/${eventId}/join`, {
        method: 'POST'
      });
      
      // Refresh participations after joining
      await fetchMyParticipations();
      
      // Show success message
      alert(data.message || 'Successfully joined the event!');
      
      return true;
    } catch (err) {
      console.error('Error joining event:', err);
      setError(err.message || 'Failed to join event');
      return false;
    }
  };

  // Update challenge progress
  const updateChallengeProgress = async (participationId, progressPercent, markCompleted = false) => {
    try {
      const data = await safeFetch(`${API_BASE_URL}/challenges/participations/${participationId}/progress`, {
        method: 'PUT',
        body: JSON.stringify({
          progress_percent: progressPercent,
          mark_completed: markCompleted
        })
      });
      
      // Refresh participations after updating progress
      await fetchMyParticipations();
      
      return data;
    } catch (err) {
      console.error('Error updating progress:', err);
      setError('Failed to update progress');
      return null;
    }
  };

  // Check if user is participating in a challenge/event
  const isParticipating = (itemId, type) => {
    return myParticipations.some(participation => 
      (type === 'challenge' && participation.challenge_id === itemId) ||
      (type === 'event' && participation.event_id === itemId)
    );
  };

  // Get participation progress
  const getParticipationProgress = (itemId, type) => {
    const participation = myParticipations.find(p => 
      (type === 'challenge' && p.challenge_id === itemId) ||
      (type === 'event' && p.event_id === itemId)
    );
    return participation ? participation.progress_percent : 0;
  };

  // Get participation ID
  const getParticipationId = (itemId, type) => {
    const participation = myParticipations.find(p => 
      (type === 'challenge' && p.challenge_id === itemId) ||
      (type === 'event' && p.event_id === itemId)
    );
    return participation ? participation.participation_id : null;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError("");
      
      try {
        await Promise.all([
          fetchActiveChallenges(),
          fetchPlatformEvents(),
          fetchMyParticipations()
        ]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load some data. Please try refreshing.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleJoinChallenge = async (challengeId, challengeTitle) => {
    const success = await joinChallenge(challengeId);
    if (success) {
      // Update UI optimistically
      setActiveChallenges(prev => prev.map(challenge =>
        challenge.id === challengeId ? { ...challenge, is_participating: true } : challenge
      ));
    }
  };

  const handleJoinEvent = async (eventId, eventTitle) => {
    const success = await joinEvent(eventId);
    if (success) {
      // Update UI optimistically
      setPlatformEvents(prev => prev.map(event =>
        event.id === eventId ? { ...event, is_participating: true } : event
      ));
    }
  };

  const handleUpdateProgress = async (participationId, progressPercent) => {
    const result = await updateChallengeProgress(participationId, progressPercent);
    if (result) {
      // Progress updated successfully
      console.log('Progress updated:', result);
    }
  };

  // Calculate days remaining for events
  const getDaysRemaining = (endDate) => {
    try {
      const end = new Date(endDate);
      const today = new Date();
      const diffTime = end - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch (err) {
      return 0;
    }
  };

  // Calculate days remaining for challenges
  const getChallengeDaysRemaining = (challenge) => {
    try {
      return challenge.days_remaining || 0;
    } catch (err) {
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="challenges-events-container">
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p>Loading challenges and events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="challenges-events-container">
      <div className="header-section">
        <h2 className="page-title">Challenges & Events</h2>
        <p className="page-subtitle">Participate in challenges and events to earn XP and rewards!</p>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button onClick={() => setError("")} className="retry-btn">
            Dismiss
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('challenges')}
        >
          🎯 Challenges
          <span className="tab-count">{activeChallenges.length}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          🏆 Events
          <span className="tab-count">{platformEvents.length}</span>
        </button>
      </div>

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="tab-content">
          <div className="section-header">
            <h3>Active Challenges</h3>
            <p>Complete challenges to earn XP and badges</p>
          </div>

          {activeChallenges.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <p>No active challenges at the moment.</p>
              <p className="empty-subtitle">Check back later for new challenges!</p>
            </div>
          ) : (
            <div className="challenges-grid">
              {activeChallenges.map(challenge => {
                const participating = isParticipating(challenge.id, 'challenge');
                const progress = getParticipationProgress(challenge.id, 'challenge');
                const participationId = getParticipationId(challenge.id, 'challenge');
                const daysRemaining = getChallengeDaysRemaining(challenge);
                
                return (
                  <div key={challenge.id} className="challenge-card">
                    <div className="challenge-header">
                      <div className="challenge-badge">Challenge</div>
                      {participating && <div className="participating-badge">Joined</div>}
                      <div className="challenge-time">
                        <span className="time-remaining">
                          {daysRemaining > 0 ? `${daysRemaining} days left` : 'Ending soon'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="challenge-content">
                      <h4>{challenge.title}</h4>
                      <p className="challenge-description">{challenge.description}</p>
                      
                      <div className="challenge-rewards">
                        <span className="reward-xp">⭐ {challenge.xp_reward} XP</span>
                        <span className="reward-points">🏅 {challenge.points_reward} Points</span>
                      </div>

                      <div className="challenge-meta">
                        <span className="participants">👥 {challenge.participants_count || 0} participants</span>
                        <span className="duration">⏱️ {challenge.duration_days} days</span>
                      </div>

                      {participating && (
                        <div className="progress-section">
                          <div className="progress-header">
                            <span>Your Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{width: `${progress}%`}}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="challenge-actions">
                      {participating ? (
                        <button 
                          className="continue-btn"
                          onClick={() => handleUpdateProgress(participationId, Math.min(100, progress + 25))}
                        >
                          {progress === 100 ? 'Completed 🎉' : 'Update Progress'}
                        </button>
                      ) : (
                        <button 
                          className="join-btn"
                          onClick={() => handleJoinChallenge(challenge.id, challenge.title)}
                          disabled={daysRemaining <= 0}
                        >
                          {daysRemaining <= 0 ? 'Challenge Ended' : 'Join Challenge'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="tab-content">
          <div className="section-header">
            <h3>Platform Events</h3>
            <p>Participate in special events for exclusive rewards</p>
          </div>

          {platformEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏆</div>
              <p>No upcoming events at the moment.</p>
              <p className="empty-subtitle">Stay tuned for exciting events!</p>
            </div>
          ) : (
            <div className="events-grid">
              {platformEvents.map(event => {
                const participating = isParticipating(event.id, 'event');
                const progress = getParticipationProgress(event.id, 'event');
                const participationId = getParticipationId(event.id, 'event');
                const daysRemaining = getDaysRemaining(event.end_date);
                
                return (
                  <div key={event.id} className="event-card">
                    <div className="event-header">
                      <div className="event-badge">Event</div>
                      <div className="event-time">
                        <span className="time-remaining">
                          {daysRemaining > 0 ? `${daysRemaining} days left` : 'Ended'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="event-content">
                      <h4>{event.name}</h4>
                      <p className="event-description">{event.description}</p>
                      
                      <div className="event-dates">
                        <div className="date-item">
                          <span className="date-label">Starts:</span>
                          <span className="date-value">
                            {new Date(event.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="date-item">
                          <span className="date-label">Ends:</span>
                          <span className="date-value">
                            {new Date(event.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="event-rewards">
                        <span className="reward-points">
                          🎁 {event.reward_points} Points
                        </span>
                        <span className="participants">👥 {event.participants_count || 0} participants</span>
                      </div>

                      {participating && (
                        <div className="progress-section">
                          <div className="progress-header">
                            <span>Event Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{width: `${progress}%`}}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="event-actions">
                      {participating ? (
                        <button 
                          className="continue-btn"
                          onClick={() => handleUpdateProgress(participationId, Math.min(100, progress + 25))}
                        >
                          {progress === 100 ? 'Completed 🎉' : 'Update Progress'}
                        </button>
                      ) : daysRemaining > 0 ? (
                        <button 
                          className="join-btn"
                          onClick={() => handleJoinEvent(event.id, event.name)}
                        >
                          Join Event
                        </button>
                      ) : (
                        <button className="disabled-btn" disabled>
                          Event Ended
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* My Participations Section */}
      {myParticipations.length > 0 && (
        <div className="my-participations-section">
          <h3 className="section-title">My Active Participations</h3>
          <div className="participations-grid">
            {myParticipations.map(participation => {
              const challenge = activeChallenges.find(c => c.id === participation.challenge_id);
              const event = platformEvents.find(e => e.id === participation.event_id);
              const item = challenge || event;
              
              if (!item) return null;

              return (
                <div key={participation.participation_id} className="participation-card">
                  <div className="participation-type">
                    {challenge ? '🎯 Challenge' : '🏆 Event'}
                  </div>
                  <h5>{item.title || item.name}</h5>
                  <p className="participation-description">
                    {challenge ? challenge.description : event.description}
                  </p>
                  <div className="progress-section">
                    <div className="progress-header">
                      <span>Progress</span>
                      <span>{participation.progress_percent || 0}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: `${participation.progress_percent || 0}%`}}
                      ></div>
                    </div>
                  </div>
                  <button 
                    className="continue-btn small"
                    onClick={() => handleUpdateProgress(participation.participation_id, Math.min(100, (participation.progress_percent || 0) + 25))}
                  >
                    Update Progress
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengesEvents;