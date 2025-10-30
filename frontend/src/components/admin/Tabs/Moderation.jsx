import React, { useState } from "react";

const Moderation = () => {
  const [reportedItems, setReportedItems] = useState([
    {
      id: 1,
      type: "comment",
      content: "This is inappropriate content...",
      reporter: "User123",
      reason: "Spam",
      status: "pending"
    },
    {
      id: 2,
      type: "resource",
      title: "Bad Resource Title",
      reporter: "User456",
      reason: "Inaccurate Information",
      status: "pending"
    }
  ]);

  const handleAction = (id, action) => {
    setReportedItems(reportedItems.filter(item => item.id !== id));
    console.log(`Action: ${action} on item ${id}`);
  };

  return (
    <div className="moderation-container">
      <h2 className="form-title">Content Moderation</h2>
      
      <div className="moderation-stats">
        <div className="stat-item">
          <h3>Pending Reports</h3>
          <p className="stat-number">{reportedItems.length}</p>
        </div>
        <div className="stat-item">
          <h3>Resolved Today</h3>
          <p className="stat-number">12</p>
        </div>
      </div>

      <div className="reported-items">
        {reportedItems.map(item => (
          <div key={item.id} className="reported-item">
            <div className="item-header">
              <span className={`type-badge ${item.type}`}>
                {item.type.toUpperCase()}
              </span>
              <span className="reporter">Reported by: {item.reporter}</span>
            </div>
            
            <div className="item-content">
              <p><strong>Content:</strong> {item.content || item.title}</p>
              <p><strong>Reason:</strong> {item.reason}</p>
            </div>
            
            <div className="moderation-actions">
              <button 
                className="remove-btn"
                onClick={() => handleAction(item.id, 'remove')}
              >
                🗑️ Remove Content
              </button>
              <button 
                className="dismiss-btn"
                onClick={() => handleAction(item.id, 'dismiss')}
              >
                ✅ Dismiss Report
              </button>
              <button 
                className="warn-btn"
                onClick={() => handleAction(item.id, 'warn')}
              >
                ⚠️ Warn User
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Moderation;