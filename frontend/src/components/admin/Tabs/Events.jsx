// import React, { useState } from "react";

// const Events = () => {
//   const [events, setEvents] = useState([
//     {
//       id: 1,
//       title: "Data Science Month",
//       description: "A month-long focus on data science learning paths and challenges",
//       startDate: "2024-03-01",
//       endDate: "2024-03-31",
//       participants: 234,
//       status: "upcoming"
//     },
//     {
//       id: 2,
//       title: "Web Development Week",
//       description: "Special web development challenges and live sessions",
//       startDate: "2024-02-20",
//       endDate: "2024-02-27",
//       participants: 167,
//       status: "active"
//     }
//   ]);

//   const [newEvent, setNewEvent] = useState({
//     title: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     badgeReward: ""
//   });

//   const handleCreateEvent = (e) => {
//     e.preventDefault();
//     console.log("Creating event:", newEvent);
//     // Reset form
//     setNewEvent({
//       title: "",
//       description: "",
//       startDate: "",
//       endDate: "",
//       badgeReward: ""
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewEvent(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   return (
//     <div className="events-container">
//       <h2 className="form-title">Platform Events</h2>

//       {/* Create Event Form */}
//       <div className="create-event-form">
//         <h3>Create New Event</h3>
//         <form onSubmit={handleCreateEvent}>
//           <div className="form-group">
//             <label>Event Title</label>
//             <input
//               type="text"
//               name="title"
//               value={newEvent.title}
//               onChange={handleInputChange}
//               placeholder="Enter event title"
//             />
//           </div>

//           <div className="form-group">
//             <label>Description</label>
//             <textarea
//               name="description"
//               value={newEvent.description}
//               onChange={handleInputChange}
//               placeholder="Describe the event and its goals"
//             />
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label>Start Date</label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={newEvent.startDate}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="form-group">
//               <label>End Date</label>
//               <input
//                 type="date"
//                 name="endDate"
//                 value={newEvent.endDate}
//                 onChange={handleInputChange}
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label>Special Badge Reward</label>
//             <input
//               type="text"
//               name="badgeReward"
//               value={newEvent.badgeReward}
//               onChange={handleInputChange}
//               placeholder="e.g., Data Science Champion"
//             />
//           </div>

//           <button type="submit" className="submit-btn">Create Event</button>
//         </form>
//       </div>

//       {/* Events List */}
//       <div className="events-list">
//         <h3>Active & Upcoming Events</h3>
//         {events.map(event => (
//           <div key={event.id} className="event-card">
//             <div className="event-header">
//               <h4>{event.title}</h4>
//               <span className={`status ${event.status}`}>
//                 {event.status}
//               </span>
//             </div>
//             <p>{event.description}</p>
//             <div className="event-details">
//               <div className="detail">
//                 <strong>Duration:</strong> {event.startDate} to {event.endDate}
//               </div>
//               <div className="detail">
//                 <strong>Participants:</strong> {event.participants}
//               </div>
//             </div>
//             <div className="event-actions">
//               <button className="edit-btn">Edit</button>
//               <button className="promote-btn">Promote</button>
//               <button className="analytics-btn">View Analytics</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Events;



import React, { useState, useEffect } from "react";

const API_BASE_URL = 'http://localhost:5555';

// Generic fetch helper
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    reward_points: ""
  });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Using your existing endpoint from challenges_bp
      const data = await fetchAPI('/challenges/events/active');
      setEvents(data.active_events || []);
    } catch (error) {
      console.error('Failed to load events:', error);
      // Fallback mock data for development
      setEvents([
        {
          id: 1,
          name: "Data Science Month",
          description: "A month-long focus on data science learning paths and challenges",
          start_date: "2024-03-01",
          end_date: "2024-03-31",
          participants_count: 234,
          reward_points: 150,
          days_remaining: 25
        },
        {
          id: 2,
          name: "Web Development Week",
          description: "Special web development challenges and live sessions",
          start_date: "2024-02-20",
          end_date: "2024-02-27",
          participants_count: 167,
          reward_points: 100,
          days_remaining: 5
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      
      // Using your existing endpoint from challenges_bp
      await fetchAPI('/challenges/admin/events', {
        method: 'POST',
        body: newEvent
      });
      
      // Reset form and reload events
      setNewEvent({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        reward_points: ""
      });
      
      await loadEvents();
      alert('Event created successfully!');
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="events-container">
        <h2 className="form-title">Platform Events</h2>
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <h2 className="form-title">Platform Events</h2>

      {/* Create Event Form */}
      <div className="create-event-form">
        <h3>Create New Event</h3>
        <form onSubmit={handleCreateEvent}>
          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              name="name"
              value={newEvent.name}
              onChange={handleInputChange}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              placeholder="Describe the event and its goals"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="start_date"
                value={newEvent.start_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="end_date"
                value={newEvent.end_date}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Reward Points</label>
            <input
              type="number"
              name="reward_points"
              value={newEvent.reward_points}
              onChange={handleInputChange}
              placeholder="Points reward for participation"
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>

      {/* Events List */}
      <div className="events-list">
        <h3>Active & Upcoming Events</h3>
        {events.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h4>{event.name}</h4>
              <span className={`status ${event.days_remaining > 0 ? 'active' : 'upcoming'}`}>
                {event.days_remaining > 0 ? 'active' : 'upcoming'}
              </span>
            </div>
            <p>{event.description}</p>
            <div className="event-details">
              <div className="detail">
                <strong>Duration:</strong> {new Date(event.start_date).toLocaleDateString()} to {new Date(event.end_date).toLocaleDateString()}
              </div>
              <div className="detail">
                <strong>Participants:</strong> {event.participants_count}
              </div>
              <div className="detail">
                <strong>Reward:</strong> {event.reward_points} points
              </div>
              <div className="detail">
                <strong>Days Remaining:</strong> {event.days_remaining}
              </div>
            </div>
            <div className="event-actions">
              <button className="edit-btn">Edit</button>
              <button className="promote-btn">Promote</button>
              <button className="analytics-btn">View Analytics</button>
            </div>
          </div>
        ))}
        
        {events.length === 0 && (
          <div className="empty-state">
            <p>No active events. Create one to engage users!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;