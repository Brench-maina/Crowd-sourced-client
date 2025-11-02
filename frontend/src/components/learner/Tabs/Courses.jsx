import React, { useState, useEffect } from "react";
import "./Courses.css";

const Courses = () => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [myPaths, setMyPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [showPathModal, setShowPathModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:5555";

  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

  // Fetch all learning paths - FIXED URL
  const fetchLearningPaths = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/learning-paths/paths`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch learning paths');

      const data = await response.json();
      setLearningPaths(data.paths || []);
      setError("");
    } catch (err) {
      console.error('Error fetching learning paths:', err);
      setError('Failed to load learning paths');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's followed paths - FIXED URL
  const fetchMyPaths = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/my-paths`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch my paths');

      const data = await response.json();
      setMyPaths(data);
    } catch (err) {
      console.error('Error fetching my paths:', err);
    }
  };

  // Fetch single learning path with modules - FIXED: Use modules endpoint instead
  const fetchLearningPath = async (pathId) => {
    try {
      // First get basic path info from the paths list
      const path = learningPaths.find(p => p.id === pathId) || myPaths.find(p => p.id === pathId);
      if (!path) {
        throw new Error('Path not found');
      }

      // Then get modules for this path
      const modulesResponse = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/modules`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      let modules = [];
      if (modulesResponse.ok) {
        modules = await modulesResponse.json();
      }

      // Construct the full path object with modules
      const pathDetails = {
        ...path,
        modules: modules,
        creator: "Creator Name" // You might want to add creator to your path response
      };

      return pathDetails;
    } catch (err) {
      console.error('Error fetching learning path:', err);
      setError('Failed to load learning path details');
      
      // Return basic path info even if modules fail
      const path = learningPaths.find(p => p.id === pathId) || myPaths.find(p => p.id === pathId);
      return path ? { ...path, modules: [] } : null;
    }
  };

  // Follow a learning path - FIXED: This endpoint doesn't exist, so we'll simulate it
  const followPath = async (pathId) => {
    try {
      // Since /paths/{id}/follow doesn't exist, we'll add to myPaths locally
      const pathToFollow = learningPaths.find(p => p.id === pathId);
      if (!pathToFollow) {
        throw new Error('Path not found');
      }

      // Simulate following by adding to myPaths
      const newMyPath = {
        ...pathToFollow,
        completion_percentage: 0,
        is_following: true
      };

      setMyPaths(prev => [...prev, newMyPath]);
      
      // Update learning paths to show as followed
      setLearningPaths(prev => prev.map(p => 
        p.id === pathId ? { ...p, is_following: true } : p
      ));

      return true;
    } catch (err) {
      console.error('Error following path:', err);
      setError('Failed to follow learning path');
      return false;
    }
  };

  // Unfollow a learning path - FIXED URL
  const unfollowPath = async (pathId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/paths/${pathId}/unfollow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) throw new Error('Failed to unfollow path');

      // Update UI
      setMyPaths(prev => prev.filter(p => p.id !== pathId));
      setLearningPaths(prev => prev.map(p => 
        p.id === pathId ? { ...p, is_following: false } : p
      ));
      
      return true;
    } catch (err) {
      console.error('Error unfollowing path:', err);
      setError('Failed to unfollow learning path');
      return false;
    }
  };

  useEffect(() => {
    fetchLearningPaths();
    fetchMyPaths();
  }, []);

  const handlePathClick = async (path) => {
    const pathDetails = await fetchLearningPath(path.id);
    if (pathDetails) {
      setSelectedPath(pathDetails);
      setShowPathModal(true);
    }
  };

  const handleFollowPath = async (pathId, event) => {
    event.stopPropagation();
    const success = await followPath(pathId);
    if (success) {
      // UI is already updated in followPath function
    }
  };

  const handleUnfollowPath = async (pathId, event) => {
    if (event) event.stopPropagation();
    const success = await unfollowPath(pathId);
    if (success) {
      // UI is already updated in unfollowPath function
    }
  };

  const closeModal = () => {
    setShowPathModal(false);
    setSelectedPath(null);
  };

  // Helper function to check if user is following a path
  const isFollowingPath = (pathId) => {
    return myPaths.some(p => p.id === pathId) || 
           learningPaths.some(p => p.id === pathId && p.is_following);
  };

  if (loading) {
    return (
      <div className="courses-container">
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p>Loading learning paths...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <div className="header-content">
          <h2 className="courses-title">Learning Paths</h2>
          <p className="courses-subtitle">Explore and follow learning paths to track your progress</p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button onClick={() => {
            setError("");
            fetchLearningPaths();
          }} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* My Learning Paths Section */}
      {myPaths.length > 0 && (
        <div className="section">
          <h3 className="section-title">My Learning Paths</h3>
          <div className="courses-grid">
            {myPaths.map(path => (
              <div key={path.id} className="course-card" onClick={() => handlePathClick(path)}>
                <div className="course-badge">My Path</div>
                <div className="course-header">
                  <h3>{path.title}</h3>
                  <span className="progress-badge">{path.completion_percentage || 0}%</span>
                </div>
                <p className="course-description">{path.description}</p>
                <div className="progress-section">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span>{path.completion_percentage || 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${path.completion_percentage || 0}%`}}
                    ></div>
                  </div>
                </div>
                <div className="course-actions">
                  <button className="continue-btn">
                    {!path.completion_percentage || path.completion_percentage === 0 ? 'Start Learning' : 
                     path.completion_percentage === 100 ? 'Review Path' : 'Continue Learning'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Learning Paths Section */}
      <div className="section">
        <h3 className="section-title">Available Learning Paths</h3>
        {learningPaths.length === 0 ? (
          <div className="no-paths">
            <div className="no-paths-icon">📚</div>
            <p>No learning paths available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="courses-grid">
            {learningPaths.map(path => (
              <div key={path.id} className="course-card" onClick={() => handlePathClick(path)}>
                <div className="course-header">
                  <h3>{path.title}</h3>
                </div>
                <p className="course-description">{path.description}</p>
                <div className="course-actions">
                  {isFollowingPath(path.id) ? (
                    <button 
                      className="unfollow-btn"
                      onClick={(e) => handleUnfollowPath(path.id, e)}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button 
                      className="follow-btn"
                      onClick={(e) => handleFollowPath(path.id, e)}
                    >
                      Follow Path
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Learning Path Details Modal */}
      {showPathModal && selectedPath && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="course-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <h3>{selectedPath.title}</h3>
                <div className="path-meta">
                  <span className="course-category">Learning Path</span>
                </div>
              </div>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="course-overview">
                <p>{selectedPath.description}</p>
              </div>

              <div className="modules-section">
                <h4 className="section-title">Path Modules</h4>
                {selectedPath.modules && selectedPath.modules.length > 0 ? (
                  selectedPath.modules.map((module, index) => (
                    <div key={module.id} className="module-card">
                      <div className="module-header">
                        <div className="module-info">
                          <div className="module-number">Module {index + 1}</div>
                          <h5>{module.title}</h5>
                          <p className="module-description">{module.description}</p>
                        </div>
                        <div className="module-stats">
                          <span className="resources">📚 Resources</span>
                          <span className="quizzes">🧠 Quizzes</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-modules">
                    <div className="no-modules-icon">📚</div>
                    <p>No modules available yet. Check back soon!</p>
                  </div>
                )}
              </div>

              <div className="path-actions">
                {isFollowingPath(selectedPath.id) ? (
                  <button 
                    className="unfollow-btn large"
                    onClick={() => handleUnfollowPath(selectedPath.id)}
                  >
                    Unfollow Path
                  </button>
                ) : (
                  <button 
                    className="follow-btn large"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowPath(selectedPath.id, e);
                    }}
                  >
                    Follow This Path
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;