import React, { useState, useEffect } from "react";
import "./LearningPaths.css";

const API_BASE_URL = "http://localhost:5555";

const LearningPaths = () => {
  const [view, setView] = useState("list");
  const [myPaths, setMyPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Form states
  const [pathTitle, setPathTitle] = useState("");
  const [pathDescription, setPathDescription] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyCreatedPaths();
  }, []);

  const fetchMyCreatedPaths = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/learning-paths/paths`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch paths");

      const data = await response.json();
      const paths = data.paths || [];
      
      // Fetch module count for each path
      const pathsWithModules = await Promise.all(
        paths.map(async (path) => {
          try {
            const modulesResponse = await fetch(
              `${API_BASE_URL}/learning-paths/${path.id}/modules`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            
            if (modulesResponse.ok) {
              const modules = await modulesResponse.json();
              return { ...path, moduleCount: modules.length || 0 };
            }
            return { ...path, moduleCount: 0 };
          } catch (err) {
            console.error(`Error fetching modules for path ${path.id}:`, err);
            return { ...path, moduleCount: 0 };
          }
        })
      );
      
      setMyPaths(pathsWithModules);
    } catch (err) {
      console.error("Error fetching paths:", err);
      setError("Failed to load your learning paths");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePath = async (e) => {
    e.preventDefault();
    
    if (pathTitle.trim().length < 5) {
      setError("Title must be at least 5 characters long");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(`${API_BASE_URL}/learning-paths/paths`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: pathTitle.trim(),
          description: pathDescription.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create learning path");
      }
      
      setSuccessMessage("Learning path created successfully! Now add modules to it.");
      
      // Reset form
      setPathTitle("");
      setPathDescription("");
      setView("list");
      
      // Refresh paths list
      await fetchMyCreatedPaths();
      
      setTimeout(() => setSuccessMessage(""), 5000);
      
    } catch (err) {
      console.error("Error creating path:", err);
      setError(err.message || "Failed to create learning path");
    } finally {
      setLoading(false);
    }
  };

  const renderEmptyState = () => (
    <div className="learning-paths-content">
      <div className="icon">📖</div>
      <h3>Create Your First Learning Path!</h3>
      <p>
        A learning path is a collection of modules organized to teach a specific topic or skill.
        Start by creating a path, then add modules and resources to it.
      </p>
      <button 
        className="get-started-btn"
        onClick={() => setView("create")}
      >
        Get Started
      </button>
    </div>
  );

  const renderPathsList = () => (
    <div className="paths-list">
      <div className="info-box" style={{ marginBottom: "20px" }}>
        <div className="info-icon">💡</div>
        <div className="info-content">
          <strong>Next Steps:</strong>
          <p>After creating a path, go to "Add Modules" to add modules, then "Create Resources" to add content to those modules.</p>
        </div>
      </div>

      <div className="paths-grid">
        {myPaths.map((path) => (
          <div key={path.id} className="path-card">
            <div className="path-card-header">
              <h3>{path.title}</h3>
              <span className={`status-badge ${path.is_published ? 'published' : 'pending'}`}>
                {path.is_published ? '✓ Published' : '⏳ Pending Review'}
              </span>
            </div>
            <p className="path-description">{path.description}</p>
            <div className="path-stats">
              <span>📚 Modules: {path.moduleCount || 0}</span>
            </div>
            {!path.is_published && (
              <div className="path-note">
                <small>📝 Add modules and resources, then wait for admin approval</small>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCreateForm = () => (
    <div className="create-path-form">
      <div className="form-header">
        <button 
          className="back-btn"
          onClick={() => setView("list")}
        >
          ← Back
        </button>
        <h3>Create New Learning Path</h3>
      </div>

      <div className="info-box" style={{ marginBottom: "20px" }}>
        <div className="info-icon">ℹ️</div>
        <div className="info-content">
          <strong>What is a Learning Path?</strong>
          <p>
            A learning path is like a course. For example: "Introduction to Web Development" or "Python for Beginners". 
            After creating it, you'll add modules (lessons) and resources (videos, readings) separately.
          </p>
        </div>
      </div>

      <form onSubmit={handleCreatePath}>
        <div className="form-group">
          <label htmlFor="pathTitle">
            Learning Path Title <span className="required">*</span>
          </label>
          <input
            id="pathTitle"
            type="text"
            placeholder="e.g., Introduction to Web Development"
            value={pathTitle}
            onChange={(e) => setPathTitle(e.target.value)}
            required
            minLength={5}
            maxLength={200}
          />
          <small className="help-text">
            {pathTitle.length}/200 characters (minimum 5)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="pathDescription">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="pathDescription"
            placeholder="Describe what students will learn in this path..."
            value={pathDescription}
            onChange={(e) => setPathDescription(e.target.value)}
            rows={5}
            required
          />
          <small className="help-text">
            What skills will students gain? What topics will be covered?
          </small>
        </div>

        <div className="contributor-tips">
          💡 <strong>Tips for Creating Great Learning Paths:</strong>
          <br />
          • Choose a clear, descriptive title
          <br />
          • Explain what students will learn and achieve
          <br />
          • Think about the complete learning journey
          <br />
          • After creating, add modules in the "Add Modules" tab
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setView("list")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || pathTitle.trim().length < 5}
          >
            {loading ? "Creating..." : "Create Learning Path"}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="learning-paths-container">
      <div className="learning-paths-card">
        <div className="learning-paths-header">
          <h2>My Learning Paths</h2>
          {view === "list" && myPaths.length > 0 && (
            <button 
              className="create-path-btn"
              onClick={() => setView("create")}
            >
              + Create Learning Path
            </button>
          )}
        </div>

        {successMessage && (
          <div className="success-banner">
            <span className="success-icon">✓</span>
            <span>{successMessage}</span>
            <button 
              className="close-error"
              onClick={() => setSuccessMessage("")}
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button 
              className="close-error"
              onClick={() => setError("")}
            >
              ×
            </button>
          </div>
        )}

        {loading && view === "list" && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your learning paths...</p>
          </div>
        )}

        {!loading && (
          <>
            {view === "list" && myPaths.length === 0 && renderEmptyState()}
            {view === "list" && myPaths.length > 0 && renderPathsList()}
            {view === "create" && renderCreateForm()}
          </>
        )}
      </div>
    </div>
  );
};

export default LearningPaths;