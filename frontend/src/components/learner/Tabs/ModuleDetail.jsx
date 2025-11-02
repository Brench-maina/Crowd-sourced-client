import React, { useState, useEffect } from "react";
import "./ModuleDetail.css";

const API_BASE_URL = "http://localhost:5555";

export default function ModuleDetail({ moduleId }) {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Inline quiz states
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);

  const getAuthToken = () => localStorage.getItem("token") || "";

  useEffect(() => {
    if (moduleId) {
      fetchModuleDetails();
    } else {
      setError("No module ID provided");
      setLoading(false);
    }
  }, [moduleId]);

  const fetchModuleDetails = async () => {
    try {
      setLoading(true);
      setError("");

      console.log(`Fetching module ${moduleId}`);

      const response = await fetch(`${API_BASE_URL}/learning-paths/modules/${moduleId}`, {
        headers: { 
          Authorization: `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to load module: ${response.status}`);
      }

      const data = await response.json();
      setModule(data);

      // Auto start module if it hasn't been started
      if (!data.is_started) {
        await startModule();
      }
    } catch (err) {
      console.error("Error fetching module:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startModule = async () => {
    try {
      await fetch(`${API_BASE_URL}/learning-paths/modules/${moduleId}/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Error starting module:", err);
    }
  };

  const completeModule = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/modules/${moduleId}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("🎉 Module marked as complete!");
        fetchModuleDetails();
      } else {
        throw new Error("Failed to complete module");
      }
    } catch (err) {
      console.error("Error completing module:", err);
      alert("Failed to mark module as complete");
    }
  };

  const retryLoadModule = () => {
    setError("");
    fetchModuleDetails();
  };

  // 🧠 Fetch quiz questions inline
  const fetchQuizQuestions = async (quizId) => {
    try {
      setQuizLoading(true);
      const response = await fetch(`${API_BASE_URL}/modules/${moduleId}/quizzes/${quizId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load quiz");

      const data = await response.json();
      setQuizQuestions(data.questions || []);
      setSelectedQuiz(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, choiceId) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  const submitQuiz = async () => {
    try {
      const payload = {
        answers: Object.entries(quizAnswers).map(([questionId, choiceId]) => ({
          question_id: parseInt(questionId),
          choice_id: parseInt(choiceId),
        })),
      };

      const response = await fetch(`${API_BASE_URL}/modules/${moduleId}/quizzes/${selectedQuiz.id}/attempt`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit quiz");

      const result = await response.json();
      setQuizScore(result.score);
      alert(`You scored ${result.score}%`);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="module-detail-container">
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p>Loading module...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="module-detail-container">
        <div className="error-section">
          <h2>Unable to Load Module</h2>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button onClick={retryLoadModule} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="module-detail-container">
        <div className="error-section">
          <h2>Module Not Found</h2>
          <p>The requested module could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="module-detail-container">
      {/* Header Section */}
      <div className="module-header">
        <div className="module-title-section">
          <h1>{module.title}</h1>
          <div className="module-meta">
            <span className="module-status">
              {module.is_completed ? "✓ Completed" : 
               module.completion_percent > 0 ? "In Progress" : "Not Started"}
            </span>
            {module.completion_percent > 0 && (
              <span className="completion-percent">
                {module.completion_percent}% Complete
              </span>
            )}
          </div>
        </div>
        <p className="module-description">{module.description}</p>
      </div>

      {/* Progress Section */}
      {module.completion_percent > 0 && (
        <div className="progress-section">
          <div className="progress-header">
            <span>Your Progress</span>
            <span>{module.completion_percent}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{width: `${module.completion_percent}%`}}
            ></div>
          </div>
        </div>
      )}

      {/* Resources Section */}
      <div className="resources-section">
        <h3>📚 Learning Resources ({module.resources?.length || 0})</h3>
        {module.resources?.length ? (
          <div className="resources-list">
            {module.resources.map((resource) => (
              <div key={resource.id} className="resource-item">
                <div className="resource-info">
                  <strong>{resource.title}</strong>
                  <span className="resource-type">{resource.type}</span>
                  {resource.description && (
                    <p className="resource-description">{resource.description}</p>
                  )}
                </div>
                <button 
                  className="open-resource-btn"
                  onClick={() => window.open(resource.url, "_blank")}
                >
                  Open Resource
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-content">No resources available for this module.</p>
        )}
      </div>

      {/* Quizzes Section */}
      <div className="quizzes-section">
        <h3>🧠 Quizzes ({module.quizzes?.length || 0})</h3>
        {module.quizzes?.length ? (
          <div className="quizzes-list">
            {module.quizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-item">
                <div className="quiz-info">
                  <strong>{quiz.title}</strong>
                  <span className="quiz-questions">
                    {quiz.question_count || 0} questions
                  </span>
                  {quiz.description && (
                    <p className="quiz-description">{quiz.description}</p>
                  )}
                  {quiz.has_attempted && (
                    <span className="quiz-attempt">
                      Last score: {quiz.last_score}%
                    </span>
                  )}
                </div>
                <button 
                  className="take-quiz-btn"
                  onClick={() => fetchQuizQuestions(quiz.id)}
                >
                  {quiz.has_attempted ? 'Retake Quiz' : 'Take Quiz'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-content">No quizzes available for this module.</p>
        )}
      </div>

      {/* Inline Quiz Section */}
      {selectedQuiz && (
        <div className="quiz-detail">
          <h3>{selectedQuiz.title}</h3>

          {quizLoading ? (
            <p>Loading quiz questions...</p>
          ) : (
            <>
              {quizQuestions.map((q) => (
                <div key={q.id} className="quiz-question">
                  <p><strong>{q.text}</strong></p>
                  <div className="quiz-choices">
                    {q.choices.map((c) => (
                      <label key={c.id} className="choice-option">
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={c.id}
                          checked={quizAnswers[q.id] === c.id}
                          onChange={() => handleAnswerSelect(q.id, c.id)}
                        />
                        {c.text}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {!quizScore && (
                <button className="submit-quiz-btn" onClick={submitQuiz}>
                  Submit Quiz
                </button>
              )}

              {quizScore !== null && (
                <p className="quiz-score">🎯 Your score: {quizScore}%</p>
              )}

              <button
                className="close-quiz-btn"
                onClick={() => {
                  setSelectedQuiz(null);
                  setQuizQuestions([]);
                  setQuizAnswers({});
                  setQuizScore(null);
                }}
              >
                Close Quiz
              </button>
            </>
          )}
        </div>
      )}

      {/* Completion Section */}
      {!module.is_completed && (
        <div className="completion-section">
          <button className="complete-btn" onClick={completeModule}>
            ✓ Mark Module as Complete
          </button>
          <p className="completion-note">
            Mark this module as complete when you've finished all resources and quizzes.
          </p>
        </div>
      )}

      {module.is_completed && (
        <div className="completed-section">
          <div className="completion-badge">✓ Module Completed</div>
          <p>Great job! You've completed this module.</p>
        </div>
      )}
    </div>
  );
}
