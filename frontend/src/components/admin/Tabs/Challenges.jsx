// import React, { useState } from "react";

// const Challenges = () => {
//   const [challenges, setChallenges] = useState([
//     {
//       id: 1,
//       title: "Frontend Master Challenge",
//       description: "Complete 5 frontend learning paths this month",
//       participants: 89,
//       xpReward: 1000,
//       status: "active",
//       endDate: "2024-02-28"
//     },
//     {
//       id: 2,
//       title: "Data Science Sprint",
//       description: "Finish 3 data science modules in 2 weeks",
//       participants: 45,
//       xpReward: 750,
//       status: "upcoming",
//       startDate: "2024-02-15"
//     }
//   ]);

//   const [newChallenge, setNewChallenge] = useState({
//     title: "",
//     description: "",
//     xpReward: "",
//     startDate: "",
//     endDate: ""
//   });

//   const handleCreateChallenge = (e) => {
//     e.preventDefault();
//     console.log("Creating challenge:", newChallenge);
//     // Reset form
//     setNewChallenge({
//       title: "",
//       description: "",
//       xpReward: "",
//       startDate: "",
//       endDate: ""
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewChallenge(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   return (
//     <div className="challenges-container">
//       <div className="challenges-header">
//         <h2 className="form-title">Manage Challenges</h2>
//         <button className="create-btn">+ Create Challenge</button>
//       </div>

//       {/* Create Challenge Form */}
//       <div className="create-challenge-form">
//         <h3>Create New Challenge</h3>
//         <form onSubmit={handleCreateChallenge}>
//           <div className="form-row">
//             <div className="form-group">
//               <label>Challenge Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={newChallenge.title}
//                 onChange={handleInputChange}
//                 placeholder="Enter challenge title"
//               />
//             </div>
//             <div className="form-group">
//               <label>XP Reward</label>
//               <input
//                 type="number"
//                 name="xpReward"
//                 value={newChallenge.xpReward}
//                 onChange={handleInputChange}
//                 placeholder="XP amount"
//               />
//             </div>
//           </div>
          
//           <div className="form-group">
//             <label>Description</label>
//             <textarea
//               name="description"
//               value={newChallenge.description}
//               onChange={handleInputChange}
//               placeholder="Describe the challenge requirements"
//             />
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label>Start Date</label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={newChallenge.startDate}
//                 onChange={handleInputChange}
//               />
//             </div>
//             <div className="form-group">
//               <label>End Date</label>
//               <input
//                 type="date"
//                 name="endDate"
//                 value={newChallenge.endDate}
//                 onChange={handleInputChange}
//               />
//             </div>
//           </div>

//           <button type="submit" className="submit-btn">Create Challenge</button>
//         </form>
//       </div>

//       {/* Active Challenges List */}
//       <div className="challenges-list">
//         <h3>Active & Upcoming Challenges</h3>
//         {challenges.map(challenge => (
//           <div key={challenge.id} className="challenge-card">
//             <div className="challenge-header">
//               <h4>{challenge.title}</h4>
//               <span className={`status ${challenge.status}`}>
//                 {challenge.status}
//               </span>
//             </div>
//             <p>{challenge.description}</p>
//             <div className="challenge-stats">
//               <span>👥 {challenge.participants} participants</span>
//               <span>⭐ {challenge.xpReward} XP</span>
//               <span>📅 Ends: {challenge.endDate}</span>
//             </div>
//             <div className="challenge-actions">
//               <button className="edit-btn">Edit</button>
//               <button className="view-btn">View Progress</button>
//               <button className="end-btn">End Challenge</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Challenges;

import React, { useState, useEffect } from "react";

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [myParticipations, setMyParticipations] = useState([]);
  const [newQuizChallenge, setNewQuizChallenge] = useState({
    title: "",
    description: "",
    xp_reward: "",
    points_reward: "",
    duration_days: "",
    quiz_id: ""
  });
  const [showQuizChallengeForm, setShowQuizChallengeForm] = useState(false);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);

  const API_BASE_URL = "http://localhost:5555";

  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

  // Check if user is learner
  const isUserLearner = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.role === 'learner';
    }
    return false;
  };

  // Check if user is admin
  const isUserAdmin = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.role === 'admin';
    }
    return false;
  };

  // Fetch available quizzes for admin to link
  const fetchAvailableQuizzes = async () => {
    try {
      // Placeholder - you'll need to implement this endpoint
      setAvailableQuizzes([
        { id: 1, title: "Python Basics Quiz" },
        { id: 2, title: "Web Development Fundamentals" },
        { id: 3, title: "Data Structures Quiz" }
      ]);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    }
  };

  // Fetch active QUIZ challenges only
  const fetchActiveChallenges = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/challenges/active`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch challenges');

      const data = await response.json();
      setChallenges(data.active_challenges || []);
    } catch (err) {
      console.error('Error fetching challenges:', err);
    }
  };

  // Fetch my participations
  const fetchMyParticipations = async () => {
    if (!isUserLearner()) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/challenges/my-challenges`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch participations');

      const data = await response.json();
      // Filter only challenge participations (not events)
      const challengeParticipations = data.participations.filter(
        p => p.type === 'challenge'
      );
      setMyParticipations(challengeParticipations || []);
    } catch (err) {
      console.error('Error fetching participations:', err);
    }
  };

  // Join QUIZ challenge (Learner only)
  const joinQuizChallenge = async (challengeId) => {
    if (!isUserLearner()) {
      alert("Only learners can join challenges");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/challenges/challenges/${challengeId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to join challenge');
        return;
      }

      const data = await response.json();
      alert(data.message);
      fetchMyParticipations();
    } catch (err) {
      console.error('Error joining challenge:', err);
      alert('Failed to join challenge');
    }
  };

  // Create QUIZ challenge (Admin only)
  const createQuizChallenge = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/challenges/admin/challenges`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuizChallenge)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create challenge');
        return;
      }

      const data = await response.json();
      
      // If quiz_id is provided, link the quiz to the challenge
      if (newQuizChallenge.quiz_id) {
        await linkQuizToChallenge(data.challenge.id, newQuizChallenge.quiz_id);
      }

      alert("Quiz challenge created successfully!");
      setNewQuizChallenge({
        title: "",
        description: "",
        xp_reward: "",
        points_reward: "",
        duration_days: "",
        quiz_id: ""
      });
      setShowQuizChallengeForm(false);
      fetchActiveChallenges();
    } catch (err) {
      console.error('Error creating challenge:', err);
      alert('Failed to create challenge');
    }
  };

  // Link quiz to challenge
  const linkQuizToChallenge = async (challengeId, quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${challengeId}/link-quiz`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quiz_id: quizId })
      });

      if (!response.ok) {
        console.warn('Failed to link quiz to challenge');
      }
    } catch (err) {
      console.error('Error linking quiz:', err);
    }
  };

  useEffect(() => {
    fetchActiveChallenges();
    fetchMyParticipations();
    
    if (isUserAdmin()) {
      fetchAvailableQuizzes();
    }
  }, []);

  const handleQuizChallengeInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuizChallenge(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // If user is not learner or admin, show access denied
  if (!isUserLearner() && !isUserAdmin()) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>Only learners and administrators can access quiz challenges.</p>
      </div>
    );
  }

  return (
    <div className="challenges-container">
      <div className="challenges-header">
        <h2>🧠 Quiz Challenges</h2>
        <p>
          {isUserLearner() 
            ? "Test your knowledge and earn rewards by participating in quiz challenges!" 
            : "Manage quiz challenges for learners"}
        </p>
      </div>

      {/* Admin Creation Button */}
      {isUserAdmin() && (
        <div className="admin-actions">
          <button 
            className="create-btn"
            onClick={() => setShowQuizChallengeForm(!showQuizChallengeForm)}
          >
            {showQuizChallengeForm ? '✕ Cancel' : '+ Create Quiz Challenge'}
          </button>
        </div>
      )}

      {/* Create Quiz Challenge Form (Admin only) */}
      {showQuizChallengeForm && isUserAdmin() && (
        <div className="create-form">
          <h3>Create New Quiz Challenge</h3>
          <form onSubmit={createQuizChallenge}>
            <div className="form-group">
              <label>Challenge Title *</label>
              <input
                type="text"
                name="title"
                value={newQuizChallenge.title}
                onChange={handleQuizChallengeInputChange}
                placeholder="e.g., Python Master Challenge"
                required
              />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={newQuizChallenge.description}
                onChange={handleQuizChallengeInputChange}
                placeholder="Describe the quiz challenge and requirements..."
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>XP Reward</label>
                <input
                  type="number"
                  name="xp_reward"
                  value={newQuizChallenge.xp_reward}
                  onChange={handleQuizChallengeInputChange}
                  placeholder="100"
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Points Reward</label>
                <input
                  type="number"
                  name="points_reward"
                  value={newQuizChallenge.points_reward}
                  onChange={handleQuizChallengeInputChange}
                  placeholder="50"
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Duration (Days)</label>
                <input
                  type="number"
                  name="duration_days"
                  value={newQuizChallenge.duration_days}
                  onChange={handleQuizChallengeInputChange}
                  placeholder="7"
                  min="1"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Link to Quiz (Optional)</label>
              <select
                name="quiz_id"
                value={newQuizChallenge.quiz_id}
                onChange={handleQuizChallengeInputChange}
              >
                <option value="">Select a quiz to link</option>
                {availableQuizzes.map(quiz => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title}
                  </option>
                ))}
              </select>
              <small>Linking a quiz will automatically track completion</small>
            </div>
            <button type="submit" className="submit-btn">Create Quiz Challenge</button>
          </form>
        </div>
      )}

      {/* Active Challenges Section */}
      <div className="content-section">
        <div className="section-header">
          <h3>Active Quiz Challenges ({challenges.length})</h3>
          {isUserLearner() && (
            <button 
              className="view-my-btn"
              onClick={() => document.getElementById('my-challenges').scrollIntoView()}
            >
              View My Progress
            </button>
          )}
        </div>

        {challenges.length === 0 ? (
          <div className="empty-state">
            <p>No active quiz challenges at the moment.</p>
            {isUserAdmin() && <p>Create the first quiz challenge!</p>}
          </div>
        ) : (
          <div className="challenges-grid">
            {challenges.map(challenge => (
              <div key={challenge.id} className="challenge-card">
                <div className="challenge-header">
                  <h4>🧠 {challenge.title}</h4>
                  <span className="time-badge">{challenge.days_remaining}d left</span>
                </div>
                <p className="challenge-description">{challenge.description}</p>
                <div className="challenge-rewards">
                  <span className="reward">⭐ {challenge.xp_reward} XP</span>
                  <span className="reward">🏆 {challenge.points_reward} Points</span>
                </div>
                <div className="challenge-stats">
                  <span>👥 {challenge.participants_count} participants</span>
                  <span>⏱️ {challenge.duration_days} days total</span>
                </div>
                {isUserLearner() && (
                  <button 
                    className="join-btn"
                    onClick={() => joinQuizChallenge(challenge.id)}
                  >
                    Join Challenge
                  </button>
                )}
                {isUserAdmin() && (
                  <div className="admin-notes">
                    <small>ID: {challenge.id} • Created: {formatDate(challenge.created_at)}</small>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Challenges Progress (Learner only) */}
      {isUserLearner() && (
        <div id="my-challenges" className="content-section">
          <h3>My Challenge Progress ({myParticipations.length})</h3>
          {myParticipations.length === 0 ? (
            <div className="empty-state">
              <p>You haven't joined any quiz challenges yet.</p>
              <p>Join a challenge above to start earning rewards!</p>
            </div>
          ) : (
            <div className="my-challenges-grid">
              {myParticipations.map(participation => (
                <div key={participation.participation_id} className={`progress-card ${participation.is_completed ? 'completed' : 'in-progress'}`}>
                  <div className="progress-header">
                    <h4>🧠 {participation.title}</h4>
                    <span className={`status ${participation.is_completed ? 'completed' : 'in-progress'}`}>
                      {participation.is_completed ? '✅ Completed' : `📊 ${participation.progress_percent}%`}
                    </span>
                  </div>
                  <p>{participation.description}</p>
                  <div className="progress-details">
                    <div className="rewards">
                      <span>⭐ {participation.xp_reward} XP</span>
                      <span>🏆 {participation.points_reward} Points</span>
                    </div>
                    <div className="dates">
                      <span>Joined: {formatDate(participation.started_at)}</span>
                      {participation.is_completed && (
                        <span>Completed: {formatDate(participation.completed_at)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .challenges-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .challenges-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .challenges-header h2 {
          color: #333;
          margin-bottom: 10px;
        }

        .admin-actions {
          margin-bottom: 20px;
        }

        .create-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
        }

        .create-form {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 10px;
          margin-bottom: 30px;
          border: 1px solid #e9ecef;
        }

        .create-form h3 {
          margin-top: 0;
          color: #333;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-group small {
          color: #666;
          font-size: 12px;
          margin-top: 5px;
          display: block;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 15px;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .submit-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
        }

        .content-section {
          margin-bottom: 40px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h3 {
          color: #333;
          margin: 0;
        }

        .view-my-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .challenges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .challenge-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-left: 4px solid #007bff;
        }

        .challenge-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .challenge-header h4 {
          margin: 0;
          color: #333;
          flex: 1;
        }

        .time-badge {
          background: #ffc107;
          color: #856404;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .challenge-description {
          color: #666;
          margin-bottom: 15px;
          line-height: 1.5;
        }

        .challenge-rewards {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
        }

        .reward {
          background: #e7f3ff;
          color: #0066cc;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 600;
        }

        .challenge-stats {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 15px;
        }

        .challenge-stats span {
          font-size: 13px;
          color: #666;
        }

        .join-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          width: 100%;
          font-size: 14px;
        }

        .join-btn:hover {
          background: #0056b3;
        }

        .admin-notes {
          background: #f8f9fa;
          padding: 8px 12px;
          border-radius: 4px;
          margin-top: 10px;
          text-align: center;
        }

        .admin-notes small {
          color: #666;
          font-size: 11px;
        }

        .my-challenges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .progress-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .progress-card.completed {
          border-left: 4px solid #28a745;
          background: #f8fff9;
        }

        .progress-card.in-progress {
          border-left: 4px solid #ffc107;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .progress-header h4 {
          margin: 0;
          color: #333;
          flex: 1;
        }

        .status {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .status.completed {
          background: #d4edda;
          color: #155724;
        }

        .status.in-progress {
          background: #fff3cd;
          color: #856404;
        }

        .progress-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
        }

        .rewards {
          display: flex;
          gap: 10px;
        }

        .rewards span {
          background: #e7f3ff;
          color: #0066cc;
          padding: 4px 8px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 600;
        }

        .dates {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dates span {
          font-size: 11px;
          color: #666;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #666;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .access-denied {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .access-denied h2 {
          color: #dc3545;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default Challenges;