import React, { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:5555";

const CreateResource = () => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    type: "video", // video, reading, quiz
    url: "",
    content: "",
    duration: "",
  });

  const token = localStorage.getItem("token");

  // Fetch user's created learning paths
  useEffect(() => {
    fetchMyPaths();
  }, []);

  const fetchMyPaths = async () => {
    try {
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
    }
  };

  // Fetch modules when a path is selected
  const handlePathChange = async (pathId) => {
    setSelectedPath(pathId);
    setSelectedModule("");
    setModules([]);

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
      setModules(data);
    } catch (err) {
      setError("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedModule) {
      setError("Please select a module");
      return;
    }

    if (!formData.title.trim()) {
      setError("Resource title is required");
      return;
    }

    if (formData.type === "video" && !formData.url) {
      setError("Video URL is required");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/modules/${selectedModule}/resources`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create resource");
      }

      setSuccess("Resource created successfully!");
      
      // Reset form
      setFormData({
        title: "",
        type: "video",
        url: "",
        content: "",
        duration: "",
      });

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to create resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-tab-card">
      <div className="create-resource-card">
        <h2 className="form-title">Create Resource for Module</h2>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
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

          {/* Select Module */}
          {selectedPath && (
            <>
              <label htmlFor="module">
                Select Module <span className="required">*</span>
              </label>
              <select
                id="module"
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                required
                disabled={loading || modules.length === 0}
              >
                <option value="">
                  {loading
                    ? "Loading modules..."
                    : modules.length === 0
                    ? "No modules available"
                    : "Choose a module..."}
                </option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Resource Type */}
          <label htmlFor="type">
            Resource Type <span className="required">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="video">🎥 Video</option>
            <option value="reading">📖 Reading Material</option>
            <option value="quiz">🧠 Quiz</option>
          </select>

          {/* Resource Title */}
          <label htmlFor="title">
            Resource Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Introduction to HTML"
            required
          />

          {/* Video URL (if type is video) */}
          {formData.type === "video" && (
            <>
              <label htmlFor="url">
                Video URL (YouTube embed) <span className="required">*</span>
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://www.youtube.com/embed/..."
                required={formData.type === "video"}
              />
              <small className="help-text">Use YouTube embed URL format</small>
            </>
          )}

          {/* Content (if type is reading) */}
          {formData.type === "reading" && (
            <>
              <label htmlFor="content">
                Content <span className="required">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Enter the reading material content..."
                rows={8}
                required={formData.type === "reading"}
              />
            </>
          )}

          {/* Quiz Info */}
          {formData.type === "quiz" && (
            <div className="info-box">
              <div className="info-icon">ℹ️</div>
              <div className="info-content">
                <strong>Quiz Creation</strong>
                <p>
                  Quiz questions will be added in a future update. For now, this creates a placeholder quiz.
                </p>
              </div>
            </div>
          )}

          {/* Duration */}
          <label htmlFor="duration">Duration</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 15 min"
          />

          {/* Tips */}
          <div className="contributor-tips">
            💡 <strong>Contributor Tips:</strong>
            <br />
            • Make content age-appropriate and engaging.
            <br />
            • Include examples and practice exercises.
            <br />
            • Use visuals and interactive elements when possible
            <br />• Earn XP based on views, ratings, and engagement!
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResource;