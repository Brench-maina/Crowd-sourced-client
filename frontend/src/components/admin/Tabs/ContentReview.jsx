// import React, { useState } from "react";

// const ContentReview = () => {
//   const [pendingResources, setPendingResources] = useState([
//     {
//       id: 1,
//       title: "Advanced React Patterns",
//       contributor: "John Doe",
//       type: "Video",
//       submitted: "2 hours ago",
//       category: "Frontend",
//       grade: "Advanced"
//     },
//     {
//       id: 2,
//       title: "Python Data Analysis Basics",
//       contributor: "Jane Smith",
//       type: "Article",
//       submitted: "5 hours ago",
//       category: "Data Science",
//       grade: "Beginner"
//     },
//     {
//       id: 3,
//       title: "System Design Fundamentals",
//       contributor: "Mike Johnson",
//       type: "Tutorial",
//       submitted: "1 day ago",
//       category: "Backend",
//       grade: "Intermediate"
//     }
//   ]);

//   const handleApprove = (id) => {
//     setPendingResources(pendingResources.filter(resource => resource.id !== id));
//     console.log(`Approved resource ${id}`);
//   };

//   const handleReject = (id) => {
//     setPendingResources(pendingResources.filter(resource => resource.id !== id));
//     console.log(`Rejected resource ${id}`);
//   };

//   return (
//     <div className="content-review-container">
//       <h2 className="form-title">Content Review Queue</h2>
      
//       <div className="review-list">
//         {pendingResources.map(resource => (
//           <div key={resource.id} className="review-card">
//             <div className="review-header">
//               <h3>{resource.title}</h3>
//               <div className="resource-meta">
//                 <span className="contributor">By {resource.contributor}</span>
//                 <span className="submission-time">{resource.submitted}</span>
//               </div>
//             </div>
            
//             <div className="resource-details">
//               <div className="detail-item">
//                 <strong>Type:</strong> {resource.type}
//               </div>
//               <div className="detail-item">
//                 <strong>Category:</strong> {resource.category}
//               </div>
//               <div className="detail-item">
//                 <strong>Level:</strong> {resource.grade}
//               </div>
//             </div>
            
//             <div className="review-actions">
//               <button 
//                 className="approve-btn"
//                 onClick={() => handleApprove(resource.id)}
//               >
//                 ✅ Approve
//               </button>
//               <button 
//                 className="reject-btn"
//                 onClick={() => handleReject(resource.id)}
//               >
//                 ❌ Reject
//               </button>
//               <button className="preview-btn">
//                 👁️ Preview
//               </button>
//             </div>
//           </div>
//         ))}
        
//         {pendingResources.length === 0 && (
//           <div className="empty-state">
//             <p>🎉 No pending reviews! All caught up.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ContentReview;


import React, { useState, useEffect } from "react";

const API_BASE_URL = 'http://localhost:5555';

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

const ContentReview = () => {
  const [pendingResources, setPendingResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for development (since content review endpoint doesn't exist yet)
  const mockPendingResources = [
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
  ];

  useEffect(() => {
    const loadPendingContent = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Try to fetch from your backend (you'll need to add this endpoint)
        // For now, using mock data
        setPendingResources(mockPendingResources);
        
        // Uncomment when you add the endpoint:
        // const data = await fetchAPI('/learning-paths/admin/pending');
        // setPendingResources(data.content || []);
        
      } catch (err) {
        setError('Failed to load pending content. Using sample data.');
        console.error('Error loading content:', err);
        // Fallback to mock data
        setPendingResources(mockPendingResources);
      } finally {
        setLoading(false);
      }
    };

    loadPendingContent();
  }, []);

  const handleApprove = async (id, contentType) => {
    try {
      // You'll need to add this endpoint to your backend
      // await fetchAPI(`/learning-paths/admin/${id}/review`, {
      //   method: 'PUT',
      //   body: { action: 'approve', content_type: contentType }
      // });
      
      setPendingResources(prev => prev.filter(resource => resource.id !== id));
      console.log(`Approved ${contentType} ${id}`);
      alert(`Approved: ${contentType} #${id}`);
    } catch (err) {
      console.error('Failed to approve:', err);
      alert('Failed to approve content');
    }
  };

  const handleReject = async (id, contentType) => {
    try {
      const reason = prompt('Enter rejection reason:');
      if (reason) {
        // You'll need to add this endpoint to your backend
        // await fetchAPI(`/learning-paths/admin/${id}/review`, {
        //   method: 'PUT',
        //   body: { action: 'reject', content_type: contentType, reason }
        // });
        
        setPendingResources(prev => prev.filter(resource => resource.id !== id));
        console.log(`Rejected ${contentType} ${id}`);
        alert(`Rejected: ${contentType} #${id}`);
      }
    } catch (err) {
      console.error('Failed to reject:', err);
      alert('Failed to reject content');
    }
  };

  if (loading) {
    return (
      <div className="content-review-container">
        <h2 className="form-title">Content Review Queue</h2>
        <div className="loading">Loading pending content...</div>
      </div>
    );
  }

  return (
    <div className="content-review-container">
      <h2 className="form-title">Content Review Queue</h2>
      
      {error && <div className="error-message">{error}</div>}
      
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
                onClick={() => handleApprove(resource.id, resource.type)}
              >
                ✅ Approve
              </button>
              <button 
                className="reject-btn"
                onClick={() => handleReject(resource.id, resource.type)}
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