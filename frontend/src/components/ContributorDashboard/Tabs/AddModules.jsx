import React, { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:5555";

const AddModules = () => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState("");
  const [existingModules, setExistingModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyPaths();
  }, []);

  // Fetch user's created learning paths
  const fetchMyPaths = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/learning-paths/paths`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch paths");

      const data = await response.json();
      setLearningPaths(data.paths || []);
    } catch (err) {
      setError("Failed to load learning paths");
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing modules when path is selected
  const handlePathChange = async (pathId) => {
    setSelectedPath(pathId);
    setExistingModules([]);

    if (!pathId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/learning-paths/${pathId}/modules`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch modules");

      const data = await response.json();
      setExistingModules(data);
    } catch (err) {
      setError("Failed to load existing modules");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setModuleForm({
      ...moduleForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedPath) {
      setError("Please select a learning path");
      return;
    }

    if (!moduleForm.title.trim() || moduleForm.title.length < 3) {
      setError("Module title must be at least 3 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/learning-paths/${selectedPath}/modules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: moduleForm.title.trim(),
            description: moduleForm.description.trim(),
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create module");
      }

      setSuccess("Module added successfully!");

      // Reset form
      setModuleForm({
        title: "",
        description: "",
      });

      // Refresh modules list
      handlePathChange(selectedPath);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to create module");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-tab-card">
      <div className="create-resource-card">
        <h2 className="form-title">Add Module to Learning Path</h2>

        <div className="info-box" style={{ marginBottom: "20px" }}>
          <div className="info-icon">💡</div>
          <div className="info-content">
            <strong>What are Modules?</strong>
            <p>
              Modules are sections within a learning path. For example, a "Web Development" path might have modules like "HTML Basics", "CSS Styling", and "JavaScript Fundamentals".
            </p>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button className="close-error" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="success-banner">
            <span className="success-icon">✓</span>
            <span>{success}</span>
          </div>
        )}

        <form className="create-form" onSubmit={handleSubmit}>
          {/* Select Learning Path */}
          <label htmlFor="learningPath">
            Select Learning Path <span className="required">*</span>
          </label>
          <select
            id="learningPath"
            value={selectedPath}
            onChange={(e) => handlePathChange(e.target.value)}
            required
          >
            <option value="">Choose a learning path...</option>
            {learningPaths.map((path) => (
              <option key={path.id} value={path.id}>
                {path.title}
              </option>
            ))}
          </select>

          {/* Show existing modules */}
          {selectedPath && existingModules.length > 0 && (
            <div style={{ 
              background: "#f8f9fa", 
              padding: "15px", 
              borderRadius: "8px",
              marginTop: "15px",
              marginBottom: "15px"
            }}>
              <strong style={{ display: "block", marginBottom: "10px" }}>
                📚 Existing Modules ({existingModules.length}):
              </strong>
              <ul style={{ 
                listStyle: "none", 
                padding: 0, 
                margin: 0 
              }}>
                {existingModules.map((module, index) => (
                  <li 
                    key={module.id} 
                    style={{
                      padding: "8px 12px",
                      background: "white",
                      borderRadius: "4px",
                      marginBottom: "5px",
                      fontSize: "14px"
                    }}
                  >
                    {index + 1}. {module.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedPath && existingModules.length === 0 && !loading && (
            <div style={{
              padding: "10px",
              background: "#fff3cd",
              borderRadius: "4px",
              marginTop: "15px",
              marginBottom: "15px",
              fontSize: "14px"
            }}>
              ℹ️ No modules yet. Add your first one below!
            </div>
          )}

          {/* Module Title */}
          <label htmlFor="title">
            Module Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={moduleForm.title}
            onChange={handleChange}
            placeholder="e.g., HTML Basics"
            required
            minLength={3}
            maxLength={200}
          />
          <small className="help-text">
            {moduleForm.title.length}/200 characters (minimum 3)
          </small>

          {/* Module Description */}
          <label htmlFor="description">Module Description</label>
          <textarea
            id="description"
            name="description"
            value={moduleForm.description}
            onChange={handleChange}
            placeholder="What will students learn in this module?"
            rows={4}
          />

          {/* Tips */}
          <div className="contributor-tips">
            💡 <strong>Module Creation Tips:</strong>
            <br />
            • Break content into logical, digestible sections
            <br />
            • Each module should take 1-2 hours to complete
            <br />
            • Order modules from beginner to advanced
            <br />
            • After creating modules, add resources to them!
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading || !selectedPath}
            >
              {loading ? "Adding Module..." : "Add Module"}
            </button>
          </div>
        </form>

        {/* Next Steps */}
        {success && (
          <div style={{
            marginTop: "20px",
            padding: "15px",
            background: "#e7f5ff",
            borderRadius: "8px",
            borderLeft: "4px solid #2196F3"
          }}>
            <strong>✨ Next Step:</strong>
            <p style={{ margin: "8px 0 0 0" }}>
              Now add resources (videos, readings, quizzes) to your modules in the "Create Resources" tab!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddModules;