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
  const [pendingPaths, setPendingPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    loadPendingPaths();
  }, [currentPage]);

  const loadPendingPaths = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await fetchAPI(`/learning-paths/admin/paths/pending?page=${currentPage}&per_page=10`);
      
      setPendingPaths(data.pending_paths || []);
      setTotalPages(data.total_pages || 1);
      setTotalItems(data.total_items || 0);
      
    } catch (err) {
      setError('Failed to load pending learning paths. Please try again.');
      console.error('Error loading pending paths:', err);
      setPendingPaths([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (pathId) => {
    if (!window.confirm('Are you sure you want to approve this learning path?')) {
      return;
    }

    try {
      await fetchAPI(`/learning-paths/admin/paths/${pathId}/review`, {
        method: 'PUT',
        body: { action: 'approve' }
      });
      
      // Remove from list after successful approval
      setPendingPaths(prev => prev.filter(path => path.id !== pathId));
      setTotalItems(prev => prev - 1);
      
      alert('Learning path approved successfully!');
    } catch (err) {
      console.error('Failed to approve:', err);
      alert(`Failed to approve: ${err.message}`);
    }
  };

  const handleReject = async (pathId) => {
    const reason = prompt('Enter rejection reason:');
    
    if (!reason || reason.trim() === '') {
      alert('Rejection reason is required');
      return;
    }

    try {
      await fetchAPI(`/learning-paths/admin/paths/${pathId}/review`, {
        method: 'PUT',
        body: { 
          action: 'reject',
          reason: reason.trim()
        }
      });
      
      // Remove from list after successful rejection
      setPendingPaths(prev => prev.filter(path => path.id !== pathId));
      setTotalItems(prev => prev - 1);
      
      alert('Learning path rejected successfully!');
    } catch (err) {
      console.error('Failed to reject:', err);
      alert(`Failed to reject: ${err.message}`);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="content-review-container">
        <h2 className="form-title">Learning Path Review Queue</h2>
        <div className="loading">Loading pending learning paths...</div>
      </div>
    );
  }

  return (
    <div className="content-review-container">
      <div className="review-header">
        <h2 className="form-title">Learning Path Review Queue</h2>
        <div className="review-stats">
          <span className="stat-badge">
            {totalItems} {totalItems === 1 ? 'path' : 'paths'} pending review
          </span>
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={loadPendingPaths} className="retry-btn">
            Retry
          </button>
        </div>
      )}
      
      <div className="review-list">
        {pendingPaths.map(path => (
          <div key={path.id} className="review-card">
            <div className="review-header">
              <h3>{path.title}</h3>
              <div className="resource-meta">
                <span className="contributor">By {path.creator}</span>
                <span className="submission-time">
                  {new Date(path.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            
            <div className="resource-details">
              <div className="detail-item">
                <strong>Description:</strong>
                <p>{path.description || 'No description provided'}</p>
              </div>
              <div className="detail-item">
                <strong>Modules:</strong> {path.module_count} module{path.module_count !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="review-actions">
              <button 
                className="approve-btn"
                onClick={() => handleApprove(path.id)}
              >
                ✅ Approve
              </button>
              <button 
                className="reject-btn"
                onClick={() => handleReject(path.id)}
              >
                ❌ Reject
              </button>
            </div>
          </div>
        ))}
        
        {pendingPaths.length === 0 && !error && (
          <div className="empty-state">
            <p>🎉 No pending reviews! All caught up.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-btn"
          >
            ← Previous
          </button>
          
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentReview;