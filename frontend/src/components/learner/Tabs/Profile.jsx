// Tabs/Profile.js
import React, { useState, useEffect } from "react";
import "./Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token"); // assuming JWT is stored here after login

  // Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {

     const token = localStorage.getItem("token");
      
    
      try {
        const response = await fetch("http://localhost:5555/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setError("You must be logged in to view your profile.");
      setLoading(false);
    }
  }, [token]);

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!userData) return null;

  return (
    <div className="profile-container">
      {/* --- Header --- */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">{userData.username[0].toUpperCase()}</div>
          <div className="level-badge">XP {userData.xp}</div>
        </div>

        <div className="profile-info">
          <h2>{userData.username}</h2>
          <p className="profile-email">{userData.email}</p>
          <p className="profile-join">Joined {userData.joined_on}</p>

          <div className="xp-progress">
            <div className="progress-header">
              <span>XP Progress</span>
              <span>{userData.points} pts</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(userData.points / 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Tabs --- */}
      <div className="profile-tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "achievements" ? "active" : ""}
          onClick={() => setActiveTab("achievements")}
        >
          Achievements
        </button>
        <button
          className={activeTab === "settings" ? "active" : ""}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      {/* --- Tab Content --- */}
      <div className="profile-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <h3>Learning Progress</h3>
            {userData.progress.length === 0 ? (
              <p>No learning progress yet.</p>
            ) : (
              <ul className="progress-list">
                {userData.progress.map((p) => (
                  <li key={p.module_id}>
                    Module {p.module_id} – {p.completion_percent}% complete
                  </li>
                ))}
              </ul>
            )}

            <div className="stats-section">
              <h3>Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{userData.points}</div>
                  <div className="stat-label">Total Points</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userData.streak_days}</div>
                  <div className="stat-label">Current Streak</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userData.xp}</div>
                  <div className="stat-label">XP Earned</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-tab">
            <h3>Account Settings</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = {
                  username: e.target.username.value,
                  email: e.target.email.value,
                };
                try {
                  const res = await fetch("http://localhost:5555/user/profile/update", {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "Update failed");
                  alert("Profile updated successfully!");
                } catch (err) {
                  alert(err.message);
                }
              }}
            >
              <div className="form-group">
                <label>Username</label>
                <input name="username" type="text" defaultValue={userData.username} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" defaultValue={userData.email} />
              </div>
              <button className="save-btn" type="submit">Save Changes</button>
            </form>

            <button
              className="delete-btn"
              onClick={async () => {
                if (!window.confirm("Are you sure you want to delete your account?")) return;
                try {
                  const res = await fetch("http://localhost:5555/user/delete", {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "Delete failed");
                  alert("Account deleted. Logging out...");
                  localStorage.removeItem("token");
                  window.location.href = "/";
                } catch (err) {
                  alert(err.message);
                }
              }}
            >
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
