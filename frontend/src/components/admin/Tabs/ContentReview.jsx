import React, { useState } from "react";

const ContentReview = () => {
  const [pendingResources, setPendingResources] = useState([
    {
      id: 1,
      title: "Advanced React Patterns",
      contributor: "John Doe",
      type: "Video",
      submitted: "2 hours ago",
      category: "Frontend",
      grade: "Advanced"
    },
    {
      id: 2,
      title: "Python Data Analysis Basics",
      contributor: "Jane Smith",
      type: "Article",
      submitted: "5 hours ago",
      category: "Data Science",
      grade: "Beginner"
    },
    {
      id: 3,
      title: "System Design Fundamentals",
      contributor: "Mike Johnson",
      type: "Tutorial",
      submitted: "1 day ago",
      category: "Backend",
      grade: "Intermediate"
    }
  ]);

  const handleApprove = (id) => {
    setPendingResources(pendingResources.filter(resource => resource.id !== id));
    console.log(`Approved resource ${id}`);
  };

  const handleReject = (id) => {
    setPendingResources(pendingResources.filter(resource => resource.id !== id));
    console.log(`Rejected resource ${id}`);
  };

  return (
    <div className="content-review-container">
      <h2 className="form-title">Content Review Queue</h2>
      
      <div className="review-list">
        {pendingResources.map(resource => (
          <div key={resource.id} className="review-card">
            <div className="review-header">
              <h3>{resource.title}</h3>
              <div className="resource-meta">
                <span className="contributor">By {resource.contributor}</span>
                <span className="submission-time">{resource.submitted}</span>
              </div>
            </div>
            
            <div className="resource-details">
              <div className="detail-item">
                <strong>Type:</strong> {resource.type}
              </div>
              <div className="detail-item">
                <strong>Category:</strong> {resource.category}
              </div>
              <div className="detail-item">
                <strong>Level:</strong> {resource.grade}
              </div>
            </div>
            
            <div className="review-actions">
              <button 
                className="approve-btn"
                onClick={() => handleApprove(resource.id)}
              >
                ✅ Approve
              </button>
              <button 
                className="reject-btn"
                onClick={() => handleReject(resource.id)}
              >
                ❌ Reject
              </button>
              <button className="preview-btn">
                👁️ Preview
              </button>
            </div>
          </div>
        ))}
        
        {pendingResources.length === 0 && (
          <div className="empty-state">
            <p>🎉 No pending reviews! All caught up.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentReview;