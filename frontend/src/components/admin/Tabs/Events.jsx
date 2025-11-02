import React, { useState, useEffect } from "react";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [myEventParticipations, setMyEventParticipations] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    reward_points: ""
  });
  const [showEventForm, setShowEventForm] = useState(false);

  const API_BASE_URL = "http://localhost:5555";

  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

  // Check if user is learner
  const isUserLearner = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.role === 'learner';
    }
    return false;
  };

  // Check if user is admin
  const isUserAdmin = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.role === 'admin';
    }
    return false;
  };

  // Fetch active events
  const fetchActiveEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/challenges/events/active`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch events');

      const data = await response.json();
      setEvents(data.active_events || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  // Fetch my event participations
  const fetchMyEventParticipations = async () => {
    if (!isUserLearner()) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/challenges/my-challenges`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch participations');

      const data = await response.json();
      // Filter only event participations (not challenges)
      const eventParticipations = data.participations.filter(
        p => p.type === 'event'
      );
      setMyEventParticipations(eventParticipations || []);
    } catch (err) {
      console.error('Error fetching event participations:', err);
    }
  };

  // Join event (Learner only)
  const joinEvent = async (eventId) => {
    if (!isUserLearner()) {
      alert("Only learners can join events");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/challenges/events/${eventId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to join event');
        return;
      }

      const data = await response.json();
      alert(data.message);
      fetchMyEventParticipations();
    } catch (err) {
      console.error('Error joining event:', err);
      alert('Failed to join event');
    }
  };

  // Create event (Admin only)
  const createEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/challenges/admin/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create event');
        return;
      }

      const data = await response.json();
      alert(data.message);
      setNewEvent({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        reward_points: ""
      });
      setShowEventForm(false);
      fetchActiveEvents();
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event');
    }
  };

  useEffect(() => {
    fetchActiveEvents();
    fetchMyEventParticipations();
  }, []);

  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getEventStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today < start) return 'upcoming';
    if (today > end) return 'ended';
    return 'active';
  };

  // If user is not learner or admin, show access denied
  if (!isUserLearner() && !isUserAdmin()) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>Only learners and administrators can access platform events.</p>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h2>🎯 Platform Events</h2>
        <p>
          {isUserLearner() 
            ? "Participate in special platform events and earn exclusive rewards!" 
            : "Manage platform-wide events and engagement activities"}
        </p>
      </div>

      {/* Admin Creation Button */}
      {isUserAdmin() && (
        <div className="admin-actions">
          <button 
            className="create-btn"
            onClick={() => setShowEventForm(!showEventForm)}
          >
            {showEventForm ? '✕ Cancel' : '+ Create Event'}
          </button>
        </div>
      )}

      {/* Create Event Form (Admin only) */}
      {showEventForm && isUserAdmin() && (
        <div className="create-form">
          <h3>Create New Platform Event</h3>
          <form onSubmit={createEvent}>
            <div className="form-group">
              <label>Event Name *</label>
              <input
                type="text"
                name="name"
                value={newEvent.name}
                onChange={handleEventInputChange}
                placeholder="e.g., Spring Coding Marathon"
                required
              />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleEventInputChange}
                placeholder="Describe the event and participation requirements..."
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  name="start_date"
                  value={newEvent.start_date}
                  onChange={handleEventInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date *</label>
                <input
                  type="date"
                  name="end_date"
                  value={newEvent.end_date}
                  onChange={handleEventInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Reward Points</label>
                <input
                  type="number"
                  name="reward_points"
                  value={newEvent.reward_points}
                  onChange={handleEventInputChange}
                  placeholder="100"
                  min="1"
                />
              </div>
            </div>
            <button type="submit" className="submit-btn">Create Event</button>
          </form>
        </div>
      )}

      {/* Active Events Section */}
      <div className="content-section">
        <div className="section-header">
          <h3>Active Events ({events.length})</h3>
          {isUserLearner() && (
            <button 
              className="view-my-btn"
              onClick={() => document.getElementById('my-events').scrollIntoView()}
            >
              View My Events
            </button>
          )}
        </div>

        {events.length === 0 ? (
          <div className="empty-state">
            <p>No active events at the moment.</p>
            {isUserAdmin() && <p>Create the first platform event!</p>}
          </div>
        ) : (
          <div className="events-grid">
            {events.map(event => {
              const status = getEventStatus(event.start_date, event.end_date);
              return (
                <div key={event.id} className={`event-card ${status}`}>
                  <div className="event-header">
                    <h4>🎯 {event.name}</h4>
                    <div className="event-badges">
                      <span className={`status-badge ${status}`}>
                        {status}
                      </span>
                      <span className="time-badge">
                        {getDaysRemaining(event.end_date)}d left
                      </span>
                    </div>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-details">
                    <div className="event-dates">
                      <span>📅 {formatDate(event.start_date)} - {formatDate(event.end_date)}</span>
                    </div>
                    <div className="event-stats">
                      <span>👥 {event.participants_count} participants</span>
                      <span>🏆 {event.reward_points} Points reward</span>
                    </div>
                  </div>
                  {isUserLearner() && status === 'active' && (
                    <button 
                      className="join-btn"
                      onClick={() => joinEvent(event.id)}
                    >
                      Join Event
                    </button>
                  )}
                  {isUserAdmin() && (
                    <div className="admin-notes">
                      <small>Event ID: {event.id}</small>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* My Events Progress (Learner only) */}
      {isUserLearner() && (
        <div id="my-events" className="content-section">
          <h3>My Event Participations ({myEventParticipations.length})</h3>
          {myEventParticipations.length === 0 ? (
            <div className="empty-state">
              <p>You haven't joined any events yet.</p>
              <p>Join an event above to participate!</p>
            </div>
          ) : (
            <div className="my-events-grid">
              {myEventParticipations.map(participation => {
                const eventStatus = getEventStatus(participation.start_date, participation.end_date);
                return (
                  <div key={participation.participation_id} className={`participation-card ${eventStatus}`}>
                    <div className="participation-header">
                      <h4>🎯 {participation.name}</h4>
                      <span className={`status ${eventStatus}`}>
                        {eventStatus === 'active' ? 'Active' : eventStatus === 'upcoming' ? 'Upcoming' : 'Ended'}
                      </span>
                    </div>
                    <p>{participation.description}</p>
                    <div className="participation-details">
                      <div className="event-info">
                        <span>🏆 {participation.reward_points} Points</span>
                        <span>📅 Ends: {formatDate(participation.end_date)}</span>
                      </div>
                      <div className="participation-info">
                        <span>Joined: {formatDate(participation.started_at)}</span>
                        {participation.is_completed && (
                          <span className="completed">✅ Completed</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .events-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .events-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .events-header h2 {
          color: #333;
          margin-bottom: 10px;
        }

        .admin-actions {
          margin-bottom: 20px;
        }

        .create-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
        }

        .create-form {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 10px;
          margin-bottom: 30px;
          border: 1px solid #e9ecef;
        }

        .create-form h3 {
          margin-top: 0;
          color: #333;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .submit-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
        }

        .content-section {
          margin-bottom: 40px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h3 {
          color: #333;
          margin: 0;
        }

        .view-my-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .event-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .event-card.active {
          border-left: 4px solid #28a745;
        }

        .event-card.upcoming {
          border-left: 4px solid #ffc107;
        }

        .event-card.ended {
          border-left: 4px solid #6c757d;
          opacity: 0.7;
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .event-header h4 {
          margin: 0;
          color: #333;
          flex: 1;
        }

        .event-badges {
          display: flex;
          flex-direction: column;
          gap: 5px;
          align-items: flex-end;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.upcoming {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.ended {
          background: #f8d7da;
          color: #721c24;
        }

        .time-badge {
          background: #e7f3ff;
          color: #0066cc;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .event-description {
          color: #666;
          margin-bottom: 15px;
          line-height: 1.5;
        }

        .event-details {
          margin-bottom: 15px;
        }

        .event-dates {
          margin-bottom: 8px;
        }

        .event-dates span {
          font-size: 13px;
          color: #666;
        }

        .event-stats {
          display: flex;
          gap: 15px;
        }

        .event-stats span {
          font-size: 13px;
          color: #666;
        }

        .join-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          width: 100%;
          font-size: 14px;
        }

        .join-btn:hover {
          background: #218838;
        }

        .admin-notes {
          background: #f8f9fa;
          padding: 8px 12px;
          border-radius: 4px;
          margin-top: 10px;
          text-align: center;
        }

        .admin-notes small {
          color: #666;
          font-size: 11px;
        }

        .my-events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .participation-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .participation-card.active {
          border-left: 4px solid #28a745;
        }

        .participation-card.upcoming {
          border-left: 4px solid #ffc107;
        }

        .participation-card.ended {
          border-left: 4px solid #6c757d;
        }

        .participation-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .participation-header h4 {
          margin: 0;
          color: #333;
          flex: 1;
        }

        .participation-header .status {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .participation-header .status.active {
          background: #d4edda;
          color: #155724;
        }

        .participation-header .status.upcoming {
          background: #fff3cd;
          color: #856404;
        }

        .participation-header .status.ended {
          background: #f8d7da;
          color: #721c24;
        }

        .participation-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
        }

        .event-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .event-info span {
          font-size: 12px;
          color: #666;
        }

        .participation-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: flex-end;
        }

        .participation-info span {
          font-size: 11px;
          color: #666;
        }

        .participation-info .completed {
          color: #28a745;
          font-weight: 600;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #666;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .access-denied {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .access-denied h2 {
          color: #dc3545;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default Events;