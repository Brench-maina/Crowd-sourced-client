// import React, { useState } from "react";

// const Moderation = () => {
//   const [reportedItems, setReportedItems] = useState([
//     {
//       id: 1,
//       type: "comment",
//       content: "This is inappropriate content...",
//       reporter: "User123",
//       reason: "Spam",
//       status: "pending"
//     },
//     {
//       id: 2,
//       type: "resource",
//       title: "Bad Resource Title",
//       reporter: "User456",
//       reason: "Inaccurate Information",
//       status: "pending"
//     }
//   ]);

//   const handleAction = (id, action) => {
//     setReportedItems(reportedItems.filter(item => item.id !== id));
//     console.log(`Action: ${action} on item ${id}`);
//   };

//   return (
//     <div className="moderation-container">
//       <h2 className="form-title">Content Moderation</h2>
      
//       <div className="moderation-stats">
//         <div className="stat-item">
//           <h3>Pending Reports</h3>
//           <p className="stat-number">{reportedItems.length}</p>
//         </div>
//         <div className="stat-item">
//           <h3>Resolved Today</h3>
//           <p className="stat-number">12</p>
//         </div>
//       </div>

//       <div className="reported-items">
//         {reportedItems.map(item => (
//           <div key={item.id} className="reported-item">
//             <div className="item-header">
//               <span className={`type-badge ${item.type}`}>
//                 {item.type.toUpperCase()}
//               </span>
//               <span className="reporter">Reported by: {item.reporter}</span>
//             </div>
            
//             <div className="item-content">
//               <p><strong>Content:</strong> {item.content || item.title}</p>
//               <p><strong>Reason:</strong> {item.reason}</p>
//             </div>
            
//             <div className="moderation-actions">
//               <button 
//                 className="remove-btn"
//                 onClick={() => handleAction(item.id, 'remove')}
//               >
//                 🗑️ Remove Content
//               </button>
//               <button 
//                 className="dismiss-btn"
//                 onClick={() => handleAction(item.id, 'dismiss')}
//               >
//                 ✅ Dismiss Report
//               </button>
//               <button 
//                 className="warn-btn"
//                 onClick={() => handleAction(item.id, 'warn')}
//               >
//                 ⚠️ Warn User
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Moderation;



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

const Moderation = () => {
  const [reportedItems, setReportedItems] = useState([]);
  const [moderationStats, setModerationStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModerationData = async () => {
      try {
        setLoading(true);
        
        // Using your existing endpoints
        const [flaggedData, statsData] = await Promise.all([
          fetchAPI('/moderation/admin/flagged?status=pending'),
          fetchAPI('/moderation/admin/stats')
        ]);
        
        setReportedItems(flaggedData.flagged_content || []);
        setModerationStats(statsData.statistics || {});
      } catch (error) {
        console.error('Failed to load moderation data:', error);
        // Fallback data
        setModerationStats({
          pending_flags: 5,
          approved_flags: 12,
          approval_rate: 70.5
        });
      } finally {
        setLoading(false);
      }
    };

    loadModerationData();
  }, []);

  const handleAction = async (id, action) => {
    try {
      // Using your existing endpoint
      await fetchAPI(`/moderation/admin/flags/${id}/resolve`, {
        method: 'PUT',
        body: { action }
      });
      
      setReportedItems(prev => prev.filter(item => item.flag_id !== id));
      
      // Reload stats to reflect changes
      const statsData = await fetchAPI('/moderation/admin/stats');
      setModerationStats(statsData.statistics || {});
      
      alert(`Flag ${id} ${action}ed successfully`);
    } catch (err) {
      console.error('Failed to process action:', err);
      alert('Failed to process action');
    }
  };

  if (loading) {
    return (
      <div className="moderation-container">
        <h2 className="form-title">Content Moderation</h2>
        <div className="loading">Loading moderation data...</div>
      </div>
    );
  }

  return (
    <div className="moderation-container">
      <h2 className="form-title">Content Moderation</h2>
      
      <div className="moderation-stats">
        <div className="stat-item">
          <h3>Pending Reports</h3>
          <p className="stat-number">{moderationStats.pending_flags || 0}</p>
        </div>
        <div className="stat-item">
          <h3>Resolved Today</h3>
          <p className="stat-number">{moderationStats.approved_flags || 0}</p>
        </div>
        <div className="stat-item">
          <h3>Approval Rate</h3>
          <p className="stat-number">{moderationStats.approval_rate || 0}%</p>
        </div>
      </div>

      <div className="reported-items">
        {reportedItems.map(item => (
          <div key={item.flag_id} className="reported-item">
            <div className="item-header">
              <span className={`type-badge ${item.content_type}`}>
                {item.content_type?.toUpperCase()}
              </span>
              <span className="reporter">Reported by: {item.reporter_username}</span>
            </div>
            
            <div className="item-content">
              <p><strong>Content:</strong> {item.content_preview}</p>
              <p><strong>Reason:</strong> {item.reason}</p>
              <p><strong>Author:</strong> {item.author_username}</p>
            </div>
            
            <div className="moderation-actions">
              <button 
                className="remove-btn"
                onClick={() => handleAction(item.flag_id, 'approve')}
              >
                🗑️ Remove Content
              </button>
              <button 
                className="dismiss-btn"
                onClick={() => handleAction(item.flag_id, 'reject')}
              >
                ✅ Dismiss Report
              </button>
            </div>
          </div>
        ))}
        
        {reportedItems.length === 0 && (
          <div className="empty-state">
            <p>✅ No pending reports! All clear.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Moderation;