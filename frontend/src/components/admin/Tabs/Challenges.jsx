import React, { useState } from "react";

const Challenges = () => {
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "Frontend Master Challenge",
      description: "Complete 5 frontend learning paths this month",
      participants: 89,
      xpReward: 1000,
      status: "active",
      endDate: "2024-02-28"
    },
    {
      id: 2,
      title: "Data Science Sprint",
      description: "Finish 3 data science modules in 2 weeks",
      participants: 45,
      xpReward: 750,
      status: "upcoming",
      startDate: "2024-02-15"
    }
  ]);

  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    xpReward: "",
    startDate: "",
    endDate: ""
  });

  const handleCreateChallenge = (e) => {
    e.preventDefault();
    console.log("Creating challenge:", newChallenge);
    // Reset form
    setNewChallenge({
      title: "",
      description: "",
      xpReward: "",
      startDate: "",
      endDate: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChallenge(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="challenges-container">
      <div className="challenges-header">
        <h2 className="form-title">Manage Challenges</h2>
        <button className="create-btn">+ Create Challenge</button>
      </div>

      {/* Create Challenge Form */}
      <div className="create-challenge-form">
        <h3>Create New Challenge</h3>
        <form onSubmit={handleCreateChallenge}>
          <div className="form-row">
            <div className="form-group">
              <label>Challenge Title</label>
              <input
                type="text"
                name="title"
                value={newChallenge.title}
                onChange={handleInputChange}
                placeholder="Enter challenge title"
              />
            </div>
            <div className="form-group">
              <label>XP Reward</label>
              <input
                type="number"
                name="xpReward"
                value={newChallenge.xpReward}
                onChange={handleInputChange}
                placeholder="XP amount"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={newChallenge.description}
              onChange={handleInputChange}
              placeholder="Describe the challenge requirements"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={newChallenge.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={newChallenge.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">Create Challenge</button>
        </form>
      </div>

      {/* Active Challenges List */}
      <div className="challenges-list">
        <h3>Active & Upcoming Challenges</h3>
        {challenges.map(challenge => (
          <div key={challenge.id} className="challenge-card">
            <div className="challenge-header">
              <h4>{challenge.title}</h4>
              <span className={`status ${challenge.status}`}>
                {challenge.status}
              </span>
            </div>
            <p>{challenge.description}</p>
            <div className="challenge-stats">
              <span>👥 {challenge.participants} participants</span>
              <span>⭐ {challenge.xpReward} XP</span>
              <span>📅 Ends: {challenge.endDate}</span>
            </div>
            <div className="challenge-actions">
              <button className="edit-btn">Edit</button>
              <button className="view-btn">View Progress</button>
              <button className="end-btn">End Challenge</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Challenges;