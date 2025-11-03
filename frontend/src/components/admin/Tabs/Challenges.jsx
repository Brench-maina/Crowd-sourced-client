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
    quiz_type: "internal", // internal, external, custom
    quiz_id: "", // for internal quizzes
    external_url: "", // for external quizzes
    custom_questions: [] // for custom quizzes
  });
  const [showQuizChallengeForm, setShowQuizChallengeForm] = useState(false);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [showCustomQuestionForm, setShowCustomQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correct_answer: 0
  });

 const API_URL = import.meta.env.VITE_API_URL; 


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

  // Fetch available internal quizzes
  const fetchAvailableQuizzes = async () => {
    try {
      const response = await fetch(`${API_URL}/quizzes/available`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch quizzes');

      const data = await response.json();
      setAvailableQuizzes(data.quizzes || []);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      // Fallback to placeholder data if API fails
      setAvailableQuizzes([
        { id: 1, title: "Python Basics Quiz", module: "Python Fundamentals" },
        { id: 2, title: "Web Development Fundamentals", module: "Web Dev Basics" },
        { id: 3, title: "Data Structures Quiz", module: "Algorithms" }
      ]);
    }
  };

  // Fetch active challenges
  const fetchActiveChallenges = async () => {
    try {
      const response = await fetch(`${API_URL}/challenges/active`, {
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
      const response = await fetch(`${API_URL}/challenges/my-challenges`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch participations');

      const data = await response.json();
      const challengeParticipations = data.participations.filter(
        p => p.type === 'challenge'
      );
      setMyParticipations(challengeParticipations || []);
    } catch (err) {
      console.error('Error fetching participations:', err);
    }
  };

  // Join challenge
  const joinQuizChallenge = async (challengeId) => {
    if (!isUserLearner()) {
      alert("Only learners can join challenges");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/challenges/challenges/${challengeId}/join`, {
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

  // Add custom question
  const addCustomQuestion = () => {
    if (!newQuestion.question.trim() || newQuestion.options.some(opt => !opt.trim())) {
      alert("Please fill in the question and all options");
      return;
    }

    setNewQuizChallenge(prev => ({
      ...prev,
      custom_questions: [...prev.custom_questions, { ...newQuestion }]
    }));

    setNewQuestion({
      question: "",
      options: ["", "", "", ""],
      correct_answer: 0
    });
    setShowCustomQuestionForm(false);
  };

  // Remove custom question
  const removeCustomQuestion = (index) => {
    setNewQuizChallenge(prev => ({
      ...prev,
      custom_questions: prev.custom_questions.filter((_, i) => i !== index)
    }));
  };

  // Create quiz challenge
  const createQuizChallenge = async (e) => {
    e.preventDefault();
    
    // Validation based on quiz type
    if (newQuizChallenge.quiz_type === "internal" && !newQuizChallenge.quiz_id) {
      alert("Please select an internal quiz");
      return;
    }

    if (newQuizChallenge.quiz_type === "external" && !newQuizChallenge.external_url) {
      alert("Please provide an external quiz URL");
      return;
    }

    if (newQuizChallenge.quiz_type === "custom" && newQuizChallenge.custom_questions.length === 0) {
      alert("Please add at least one custom question");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/challenges/admin/challenges`, {
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
      
      // Link internal quiz if applicable
      if (newQuizChallenge.quiz_type === "internal" && newQuizChallenge.quiz_id) {
        await linkQuizToChallenge(data.challenge.id, newQuizChallenge.quiz_id);
      }

      alert("Quiz challenge created successfully!");
      setNewQuizChallenge({
        title: "",
        description: "",
        xp_reward: "",
        points_reward: "",
        duration_days: "",
        quiz_type: "internal",
        quiz_id: "",
        external_url: "",
        custom_questions: []
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
      const response = await fetch(`${API_URL}/quizzes/${challengeId}/link-quiz`, {
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

  const handleQuestionInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getQuizTypeDisplay = (challenge) => {
    // This would come from your backend - for now we'll infer from available data
    if (challenge.quiz_id) return "Internal Quiz";
    if (challenge.external_url) return "External Quiz";
    return "Custom Quiz";
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
            ? "Test your knowledge with various quiz types - internal, external, or custom quizzes!" 
            : "Create quiz challenges using internal, external, or custom quizzes"}
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

            {/* Quiz Type Selection */}
            <div className="form-group">
              <label>Quiz Type *</label>
              <div className="quiz-type-selector">
                <label className="type-option">
                  <input
                    type="radio"
                    name="quiz_type"
                    value="internal"
                    checked={newQuizChallenge.quiz_type === "internal"}
                    onChange={handleQuizChallengeInputChange}
                  />
                  <span>📚 Internal Quiz</span>
                  <small>Use an existing quiz from learning paths</small>
                </label>
                
                <label className="type-option">
                  <input
                    type="radio"
                    name="quiz_type"
                    value="external"
                    checked={newQuizChallenge.quiz_type === "external"}
                    onChange={handleQuizChallengeInputChange}
                  />
                  <span>🌐 External Quiz</span>
                  <small>Link to a quiz from external platforms</small>
                </label>
                
                <label className="type-option">
                  <input
                    type="radio"
                    name="quiz_type"
                    value="custom"
                    checked={newQuizChallenge.quiz_type === "custom"}
                    onChange={handleQuizChallengeInputChange}
                  />
                  <span>✏️ Custom Quiz</span>
                  <small>Create your own quiz questions</small>
                </label>
              </div>
            </div>

            {/* Internal Quiz Selection */}
            {newQuizChallenge.quiz_type === "internal" && (
              <div className="form-group">
                <label>Select Internal Quiz *</label>
                <select
                  name="quiz_id"
                  value={newQuizChallenge.quiz_id}
                  onChange={handleQuizChallengeInputChange}
                  required
                >
                  <option value="">Choose a quiz...</option>
                  {availableQuizzes.map(quiz => (
                    <option key={quiz.id} value={quiz.id}>
                      {quiz.title} ({quiz.module})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* External Quiz URL */}
            {newQuizChallenge.quiz_type === "external" && (
              <div className="form-group">
                <label>External Quiz URL *</label>
                <input
                  type="url"
                  name="external_url"
                  value={newQuizChallenge.external_url}
                  onChange={handleQuizChallengeInputChange}
                  placeholder="https://example.com/quiz or https://forms.google.com/..."
                  required
                />
                <small>Link to any external quiz platform (Google Forms, Typeform, Kahoot, etc.)</small>
              </div>
            )}

            {/* Custom Questions */}
            {newQuizChallenge.quiz_type === "custom" && (
              <div className="form-group">
                <label>Custom Questions</label>
                <div className="custom-questions-section">
                  {newQuizChallenge.custom_questions.length > 0 ? (
                    <div className="questions-list">
                      {newQuizChallenge.custom_questions.map((q, index) => (
                        <div key={index} className="question-item">
                          <div className="question-header">
                            <strong>Q{index + 1}: {q.question}</strong>
                            <button
                              type="button"
                              className="remove-btn"
                              onClick={() => removeCustomQuestion(index)}
                            >
                              Remove
                            </button>
                          </div>
                          <div className="options-list">
                            {q.options.map((opt, optIndex) => (
                              <div key={optIndex} className={`option ${optIndex === q.correct_answer ? 'correct' : ''}`}>
                                {String.fromCharCode(65 + optIndex)}. {opt}
                                {optIndex === q.correct_answer && " ✅"}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-questions">No questions added yet</p>
                  )}
                  
                  <button
                    type="button"
                    className="add-question-btn"
                    onClick={() => setShowCustomQuestionForm(true)}
                  >
                    + Add Question
                  </button>
                </div>
              </div>
            )}

            <button type="submit" className="submit-btn">Create Quiz Challenge</button>
          </form>
        </div>
      )}

      {/* Custom Question Form Modal */}
      {showCustomQuestionForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Add Custom Question</h4>
            
            <div className="form-group">
              <label>Question *</label>
              <input
                type="text"
                name="question"
                value={newQuestion.question}
                onChange={handleQuestionInputChange}
                placeholder="Enter your question..."
                required
              />
            </div>

            <div className="form-group">
              <label>Options *</label>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="option-input">
                  <span className="option-label">{String.fromCharCode(65 + index)}.</span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    required
                  />
                  <label className="correct-label">
                    <input
                      type="radio"
                      name="correct_answer"
                      checked={newQuestion.correct_answer === index}
                      onChange={() => setNewQuestion(prev => ({ ...prev, correct_answer: index }))}
                    />
                    Correct
                  </label>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowCustomQuestionForm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="add-btn"
                onClick={addCustomQuestion}
              >
                Add Question
              </button>
            </div>
          </div>
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
                  <div>
                    <h4>🧠 {challenge.title}</h4>
                    <span className="quiz-type-badge">
                      {getQuizTypeDisplay(challenge)}
                    </span>
                  </div>
                  <span className="time-badge">{challenge.days_remaining}d left</span>
                </div>
                <p className="challenge-description">{challenge.description}</p>
                
                {/* Show quiz source if available */}
                {challenge.external_url && (
                  <div className="quiz-source">
                    <strong>External Quiz:</strong>{' '}
                    <a href={challenge.external_url} target="_blank" rel="noopener noreferrer">
                      Take Quiz ↗
                    </a>
                  </div>
                )}

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
                    <div>
                      <h4>🧠 {participation.title}</h4>
                      <span className="quiz-type-badge small">
                        {participation.quiz_type || "Internal Quiz"}
                      </span>
                    </div>
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

        .quiz-type-selector {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .type-option {
          display: flex;
          align-items: flex-start;
          padding: 15px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .type-option:hover {
          border-color: #007bff;
        }

        .type-option input[type="radio"] {
          margin-right: 10px;
          margin-top: 2px;
        }

        .type-option span {
          font-weight: 600;
          margin-right: 10px;
        }

        .type-option small {
          color: #666;
          display: block;
          margin-top: 2px;
        }

        .custom-questions-section {
          border: 1px solid #e9ecef;
          border-radius: 6px;
          padding: 15px;
        }

        .questions-list {
          margin-bottom: 15px;
        }

        .question-item {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 10px;
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .option {
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 14px;
        }

        .option.correct {
          background: #d4edda;
          color: #155724;
          font-weight: 600;
        }

        .remove-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }

        .add-question-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .no-questions {
          text-align: center;
          color: #666;
          font-style: italic;
          margin: 10px 0;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 25px;
          border-radius: 10px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .option-input {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .option-label {
          font-weight: 600;
          min-width: 20px;
        }

        .option-input input[type="text"] {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .correct-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #666;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .add-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .quiz-type-badge {
          background: #e7f3ff;
          color: #0066cc;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 600;
          display: inline-block;
          margin-left: 10px;
        }

        .quiz-type-badge.small {
          font-size: 10px;
          padding: 1px 6px;
        }

        .quiz-source {
          background: #fff3cd;
          padding: 8px 12px;
          border-radius: 4px;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .quiz-source a {
          color: #007bff;
          text-decoration: none;
        }

        .quiz-source a:hover {
          text-decoration: underline;
        }

        /* Rest of the styles remain the same as previous version */
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

        /* Form styles */
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
      `}</style>
    </div>
  );
};

export default Challenges;