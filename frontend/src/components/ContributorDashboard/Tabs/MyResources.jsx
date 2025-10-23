import React, { useState } from "react";
import "./MyResources.css";

const MyResources = () => {
  const [resources, setResources] = useState([
    {
      id: 1,
      title: "Introduction to Fractions",
      status: "approved",
      type: "Video",
      views: 1234,
      rating: 4.8,
      comments: 45,
      xp: 500,
    },
  ]);

  const handleCreate = () => {
    const newResource = {
      id: Date.now(),
      title: "New Resource Example",
      status: "pending",
      type: "Video",
      views: 0,
      rating: 0,
      comments: 0,
      xp: 0,
    };
    setResources([newResource, ...resources]);
  };

  return (
    <div className="resources-page">
      <div className="resources-header">
        <h2>Your Contributions</h2>
        <button className="create-btn" onClick={handleCreate}>
          + Create Resource
        </button>
      </div>

      <div className="resources-list">
        {resources.map((res) => (
          <div key={res.id} className="resource-card">
            <div className="resource-header">
              <h3>{res.title}</h3>
              <div className="tags">
                <span className={`status ${res.status}`}>{res.status}</span>
                <span className="type-tag">{res.type}</span>
              </div>
            </div>

            <div className="resource-stats">
              <div>
                <h4>{res.views}</h4>
                <p>Views</p>
              </div>
              <div>
                <h4>{res.rating}</h4>
                <p>Rating</p>
              </div>
              <div>
                <h4>{res.comments}</h4>
                <p>Comments</p>
              </div>
              <div>
                <h4 className="xp">+{res.xp}</h4>
                <p>XP Earned</p>
              </div>
            </div>

            <div className="resource-buttons">
              <button className="edit-btn">Edit</button>
              <button className="details-btn">View Details</button>
              <button className="comments-btn">💬 View Comments</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyResources;
