import React, { useState, useEffect } from "react";
import "./ProfileTab.css";

const API_URL = import.meta.env.VITE_API_URL; 


export default function ProfileTab() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to load profile");

      const data = await response.json();
      setProfile(data);
      setFormData({ username: data.username, email: data.email, password: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/user/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");

      setSuccess("Profile updated successfully!");
      setProfile((prev) => ({ ...prev, ...formData }));
      setEditing(false);
      setFormData((prev) => ({ ...prev, password: "" })); // clear password after update
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/user/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete account");

      alert("Account deleted successfully.");
      localStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return <div className="loading-state">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>👤 My Profile</h2>

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError("")}>×</button>
          </div>
        )}
        {success && (
          <div className="success-banner">
            <span>✅ {success}</span>
            <button onClick={() => setSuccess("")}>×</button>
          </div>
        )}

        {profile && (
          <>
            <p>
              <strong>Joined:</strong> {profile.joined_on}
            </p>
            <p>
              <strong>Role:</strong> {profile.role}
            </p>

            {!editing ? (
              <button className="edit-btn" onClick={() => setEditing(true)}>
                ✏️ Edit Profile
              </button>
            ) : (
              <form onSubmit={handleUpdate} className="profile-form">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>

                <div className="form-group">
                  <label>New Password (optional)</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="update-btn" disabled={loading}>
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <button
              type="button"
              className="delete-btn"
              onClick={handleDelete}
              disabled={loading}
            >
              🗑 Delete Account
            </button>
          </>
        )}
      </div>
    </div>
  );
}
