import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL; 


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

 
  useEffect(() => {
    fetchMyPaths();
  }, []);

  const fetchMyPaths = async () => {
    try {
      const response = await fetch(`${API_URL}/learning-paths/paths`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch paths");

      const data = await response.json();
      setLearningPaths(data.paths || []);
    } catch (err) {
      setError("Failed to load learning paths");
    }
  };

  const handlePathChange = async (pathId) => {
    setSelectedPath(pathId);
    setSelectedModule("");
    setModules([]);

    if (!pathId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/learning-paths/${pathId}/modules`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        `${API_URL}/modules/${selectedModule}/resources`,
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

      setSuccess("✅ Resource created successfully!");
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

        {/* Info Section */}
        <div className="info-box" style={{ marginBottom: "20px" }}>
          <div className="info-icon">💡</div>
          <div className="info-content">
            <strong>What are Resources?</strong>
            <p>
              Resources are the actual learning materials inside modules —
              including videos, readings, and quizzes that learners complete to
              gain XP and progress through a path.
            </p>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button className="close-error" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        {/* Success Banner */}
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

          {/* Conditional fields */}
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
                required
              />
              <small className="help-text">
                Use the YouTube embed link (not the normal video URL)
              </small>
            </>
          )}

          {formData.type === "reading" && (
            <>
              <label htmlFor="content">
                Reading Content <span className="required">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write the reading material here..."
                rows={6}
                required
              />
            </>
          )}

          {formData.type === "quiz" && (
            <div className="info-box">
              <div className="info-icon">🧠</div>
              <div className="info-content">
                <strong>Quiz Placeholder</strong>
                <p>
                  Quizzes will soon support adding questions. For now, this
                  creates a quiz placeholder.
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

          {/* Contributor Tips */}
          <div className="contributor-tips">
            💡 <strong>Contributor Tips:</strong>
            <br />
            • Use clear titles and short explanations. <br />
            • Keep videos under 15 minutes for engagement. <br />
            • Include examples and short exercises. <br />
            • Earn XP from learner engagement!
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Resource"}
            </button>
          </div>
        </form>

        {/* Success Next Step */}
        {success && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#e7f5ff",
              borderRadius: "8px",
              borderLeft: "4px solid #2196F3",
            }}
          >
            <strong>✨ Next Step:</strong>
            <p style={{ margin: "8px 0 0 0" }}>
              Great! You can view your new resource under the selected module in
              your learning path dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateResource;
