import React, { useState } from "react";

const Events = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Data Science Month",
      description: "A month-long focus on data science learning paths and challenges",
      startDate: "2024-03-01",
      endDate: "2024-03-31",
      participants: 234,
      status: "upcoming"
    },
    {
      id: 2,
      title: "Web Development Week",
      description: "Special web development challenges and live sessions",
      startDate: "2024-02-20",
      endDate: "2024-02-27",
      participants: 167,
      status: "active"
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    badgeReward: ""
  });

  const handleCreateEvent = (e) => {
    e.preventDefault();
    console.log("Creating event:", newEvent);
    // Reset form
    setNewEvent({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      badgeReward: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              placeholder="Enter event title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              placeholder="Describe the event and its goals"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={newEvent.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={newEvent.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Special Badge Reward</label>
            <input
              type="text"
              name="badgeReward"
              value={newEvent.badgeReward}
              onChange={handleInputChange}
              placeholder="e.g., Data Science Champion"
            />
          </div>

          <button type="submit" className="submit-btn">Create Event</button>
        </form>
      </div>

      {/* Events List */}
      <div className="events-list">
        <h3>Active & Upcoming Events</h3>
        {events.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h4>{event.title}</h4>
              <span className={`status ${event.status}`}>
                {event.status}
              </span>
            </div>
            <p>{event.description}</p>
            <div className="event-details">
              <div className="detail">
                <strong>Duration:</strong> {event.startDate} to {event.endDate}
              </div>
              <div className="detail">
                <strong>Participants:</strong> {event.participants}
              </div>
            </div>
            <div className="event-actions">
              <button className="edit-btn">Edit</button>
              <button className="promote-btn">Promote</button>
              <button className="analytics-btn">View Analytics</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;