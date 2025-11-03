import React, { useState, useEffect } from "react";
import "./LearningPaths.css";

const API_URL = import.meta.env.VITE_API_URL; 


const LearningPaths = () => {
  const [view, setView] = useState("list");
  const [myPaths, setMyPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form states (add editing support)
  const [pathForm, setPathForm] = useState({
    id: null,
    title: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyCreatedPaths();
  }, []);

  const fetchMyCreatedPaths = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/learning-paths/paths`, {
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
              `${API_URL}/learning-paths/${path.id}/modules`,
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

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPathForm((prev) => ({ ...prev, [name]: value }));
  };

  // Create or update learning path
  const handleSubmitPath = async (e) => {
    e.preventDefault();

    if (pathForm.title.trim().length < 5) {
      setError("Title must be at least 5 characters long");
      return;
    }

    try {
      setLoading(true);
      setError("");
      let response, data;

      if (pathForm.id) {
        // Update existing path
        response = await fetch(
          `${API_URL}/learning-paths/paths/${pathForm.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: pathForm.title.trim(),
              description: pathForm.description.trim(),
            }),
          }
        );

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) throw new Error(data.error || "Failed to update learning path");

        // Optimistically update state
        setMyPaths((prev) =>
          prev.map((p) =>
            p.id === pathForm.id
              ? { ...p, title: pathForm.title.trim(), description: pathForm.description.trim() }
              : p
          )
        );

        setSuccessMessage("Learning path updated successfully!");
      } else {
        // Create new path
        response = await fetch(`${API_URL}/learning-paths/paths`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: pathForm.title.trim(),
            description: pathForm.description.trim(),
          }),
        });

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) throw new Error(data.error || "Failed to create learning path");

        setSuccessMessage("Learning path created successfully! Now add modules to it.");
        // Refresh list
        await fetchMyCreatedPaths();
      }

      // Reset form
      setPathForm({ id: null, title: "", description: "" });
      setView("list");

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error("Error submitting path:", err);
      setError(err.message || "Failed to submit learning path");
    } finally {
      setLoading(false);
    }
  };

  // Delete learning path
  const handleDeletePath = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this learning path? All modules and resources under it will be removed."
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(`${API_URL}/learning-paths/paths/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete learning path");
      }

      setSuccessMessage("Learning path deleted successfully!");
      setMyPaths((prev) => prev.filter((p) => p.id !== id));
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Error deleting path:", err);
      setError(err.message || "Failed to delete learning path");
    } finally {
      setLoading(false);
    }
  };

  // Populate form for editing
  const handleEditPath = (path) => {
    setPathForm({
      id: path.id,
      title: path.title,
      description: path.description || "",
    });
    setView("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderEmptyState = () => (
    <div className="learning-paths-content">
      <div className="icon">📖</div>
      <h3>Create Your First Learning Path!</h3>
      <p>
        A learning path is a collection of modules organized to teach a specific topic or skill.
        Start by creating a path, then add modules and resources to it.
      </p>
      <button className="get-started-btn" onClick={() => setView("create")}>
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
          <p>
            After creating a path, go to "Add Modules" to add modules, then
            "Create Resources" to add content to those modules.
          </p>
        </div>
      </div>

      <div className="paths-grid">
        {myPaths.map((path) => (
          <div key={path.id} className="path-card">
            <div className="path-card-header">
              <h3>{path.title}</h3>
              <span
                className={`status-badge ${
                  path.is_published ? "published" : "pending"
                }`}
              >
                {path.is_published ? "✓ Published" : "⏳ Pending Review"}
              </span>
            </div>
            <p className="path-description">{path.description}</p>
            <div className="path-stats">
              <span>📚 Modules: {path.moduleCount || 0}</span>
            </div>
            {!path.is_published && (
              <div className="path-note">
                <small>
                  📝 Add modules and resources, then wait for admin approval
                </small>
              </div>
            )}

              <div className="path-actions">
              <button className="purple-btn" onClick={() => handleEditPath(path)}>
                ✏️ Edit
              </button>
              <button className="purple-outline-btn" onClick={() => handleDeletePath(path.id)}>
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCreateForm = () => (
    <div className="create-path-form">
      <div className="form-header">
        <button className="back-btn" onClick={() => setView("list")}>
          ← Back
        </button>
        <h3>{pathForm.id ? "Edit Learning Path" : "Create New Learning Path"}</h3>
      </div>

      <div className="info-box" style={{ marginBottom: "20px" }}>
        <div className="info-icon">ℹ️</div>
        <div className="info-content">
          <strong>What is a Learning Path?</strong>
          <p>
            A learning path is like a course. For example: "Introduction to Web
            Development" or "Python for Beginners". After creating it, you'll
            add modules (lessons) and resources (videos, readings) separately.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmitPath}>
        <div className="form-group">
          <label htmlFor="pathTitle">
            Learning Path Title <span className="required">*</span>
          </label>
          <input
            id="pathTitle"
            type="text"
            name="title"
            placeholder="e.g., Introduction to Web Development"
            value={pathForm.title}
            onChange={handleFormChange}
            required
            minLength={5}
            maxLength={200}
          />
          <small className="help-text">
            {pathForm.title.length}/200 characters (minimum 5)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="pathDescription">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="pathDescription"
            name="description"
            placeholder="Describe what students will learn in this path..."
            value={pathForm.description}
            onChange={handleFormChange}
            rows={5}
            required
          />
          <small className="help-text">
            What skills will students gain? What topics will be covered?
          </small>
        </div>

        <div className="contributor-tips">
          💡 <strong>Tips for Creating Great Learning Paths:</strong>
          <br />• Choose a clear, descriptive title
          <br />• Explain what students will learn and achieve
          <br />• Think about the complete learning journey
          <br />• After creating, add modules in the "Add Modules" tab
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setPathForm({ id: null, title: "", description: "" });
              setView("list");
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || pathForm.title.trim().length < 5}
          >
            {loading
              ? pathForm.id
                ? "Updating..."
                : "Creating..."
              : pathForm.id
              ? "Update Learning Path"
              : "Create Learning Path"}
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
            <button className="close-error" onClick={() => setError("")}>
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
