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

  // Load learning paths on mount
  useEffect(() => {
    fetchMyPaths();
  }, []);

  // Fetch user's created learning paths
  const fetchMyPaths = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/learning-paths/paths`, {
        headers: { Authorization: `Bearer ${token}` },
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

  // Fetch modules for selected path
  const handlePathChange = async (pathId) => {
    setSelectedPath(pathId);
    setExistingModules([]);
    setModuleForm({ title: "", description: "" });
    if (!pathId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/learning-paths/${pathId}/modules`,
        {
          headers: { Authorization: `Bearer ${token}` },
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

  // Input change handler
  const handleChange = (e) => {
    setModuleForm({
      ...moduleForm,
      [e.target.name]: e.target.value,
    });
  };

  // Submit new module
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedPath) {
      setError("Please select a learning path");
      return;
    }

    if (!moduleForm.title.trim() || moduleForm.title.length < 3) {
      setError("Module title must be at least 3 characters long");
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

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to add module");

      const newModule = data.module;
      setExistingModules((prev) => [...prev, newModule]);
      setSuccess("✅ Module added successfully!");
      setModuleForm({ title: "", description: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to save module");
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
              Modules are sections within a learning path. For example, a
              "Web Development" path might have modules like "HTML Basics",
              "CSS Styling", and "JavaScript Fundamentals".
            </p>
          </div>
        </div>

        {/* Error + Success messages */}
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

        {/* Form */}
        <form className="create-form" onSubmit={handleSubmit}>
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

          {/* Existing modules list */}
          {selectedPath && existingModules.length > 0 && (
            <div
              style={{
                background: "#f8f9fa",
                padding: "15px",
                borderRadius: "8px",
                marginTop: "15px",
                marginBottom: "15px",
              }}
            >
              <strong>📚 Existing Modules:</strong>
              <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
                {existingModules.map((module) => (
                  <li
                    key={module.id}
                    style={{
                      background: "white",
                      padding: "10px",
                      borderRadius: "6px",
                      marginBottom: "8px",
                    }}
                  >
                    {module.title}
                  </li>
                ))}
              </ul>
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

          {/* Description */}
          <label htmlFor="description">Module Description</label>
          <textarea
            id="description"
            name="description"
            value={moduleForm.description}
            onChange={handleChange}
            placeholder="What will students learn in this module?"
            rows={4}
          />

          {/* Submit */}
          <div className="form-buttons">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !selectedPath}
            >
              {loading ? "Adding..." : "Add Module"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModules;
