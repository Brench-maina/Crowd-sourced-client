import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL; 


export default function AddQuiz() {
  const [learningPaths, setLearningPaths] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", choices: [{ text: "", is_correct: false }, { text: "", is_correct: false }] },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLearningPaths();
  }, []);

  const fetchLearningPaths = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/learning-paths/paths`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch learning paths");
      const data = await res.json();
      setLearningPaths(data.paths || []);
    } catch (err) {
      setError(err.message || "Failed to load learning paths");
    } finally {
      setLoading(false);
    }
  };

  const handlePathChange = async (e) => {
    const pathId = e.target.value;
    setSelectedPath(pathId);
    setSelectedModule("");
    setModules([]);

    if (!pathId) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/learning-paths/${pathId}/modules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch modules");
      const data = await res.json();
      setModules(data || []);
    } catch (err) {
      setError(err.message || "Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", choices: [{ text: "", is_correct: false }, { text: "", is_correct: false }] },
    ]);
  };

  const handleAddChoice = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].choices.push({ text: "", is_correct: false });
    setQuestions(newQuestions);
  };

  const validateQuiz = () => {
    if (!selectedModule) {
      setError("Please select a module!");
      return false;
    }
    if (!quizTitle.trim()) {
      setError("Quiz title is required!");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        setError(`Question ${i + 1} cannot be empty`);
        return false;
      }
      if (q.choices.length < 2) {
        setError(`Question ${i + 1} must have at least 2 choices`);
        return false;
      }
      const hasCorrect = q.choices.some((c) => c.is_correct);
      if (!hasCorrect) {
        setError(`Question ${i + 1} must have at least one correct choice`);
        return false;
      }
      for (let j = 0; j < q.choices.length; j++) {
        if (!q.choices[j].text.trim()) {
          setError(`Choice ${j + 1} of Question ${i + 1} cannot be empty`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateQuiz()) return;

    try {
      setLoading(true);
      const moduleId = selectedModule;

      // 1️⃣ Create the quiz under the module
      const quizRes = await fetch(`${API_URL}/modules/${moduleId}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: quizTitle.trim() }),
      });

      const quizData = await quizRes.json();
      if (!quizRes.ok) throw new Error(quizData.error || "Failed to create quiz");

      // 2️⃣ Add questions to the created quiz
      for (let q of questions) {
        const questionRes = await fetch(
          `${API_URL}/modules/${moduleId}/quizzes/${quizData.id}/questions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(q),
          }
        );
        const questionData = await questionRes.json();
        if (!questionRes.ok) throw new Error(questionData.error || "Failed to add question");
      }

      setSuccess("✅ Quiz created successfully!");
      setQuizTitle("");
      setQuestions([
        { text: "", choices: [{ text: "", is_correct: false }, { text: "", is_correct: false }] },
      ]);
      setSelectedModule("");
      setModules([]);
      setSelectedPath("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-tab-card">
      <div className="create-resource-card">
        <h2 className="form-title">Add Quiz to Module</h2>

        <div className="info-box" style={{ marginBottom: "20px" }}>
          <div className="info-icon">💡</div>
          <div className="info-content">
            <strong>About Quizzes</strong>
            <p>
              Quizzes test students' understanding of modules. Each question
              must have at least 2 choices and at least one correct choice.
            </p>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button className="close-error" onClick={() => setError("")}>×</button>
          </div>
        )}
        {success && (
          <div className="success-banner">
            <span className="success-icon">✓</span>
            <span>{success}</span>
          </div>
        )}

        <form className="create-form" onSubmit={handleSubmit}>
          <label htmlFor="learningPath">
            Select Learning Path <span className="required">*</span>
          </label>
          <select id="learningPath" value={selectedPath} onChange={handlePathChange} required>
            <option value="">Choose a learning path...</option>
            {learningPaths.map((lp) => (
              <option key={lp.id} value={lp.id}>
                {lp.title}
              </option>
            ))}
          </select>

          {selectedPath && (
            <div
              style={{
                background: "#f8f9fa",
                padding: "15px",
                borderRadius: "8px",
                marginTop: "15px",
                marginBottom: "15px",
              }}
            >
              <strong>📚 Modules in this path:</strong>
              {loading && <p>Loading modules...</p>}
              {!loading && modules.length === 0 && (
                <p>ℹ️ No modules found. Add modules first!</p>
              )}
              {modules.length > 0 && (
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  required
                >
                  <option value="">Select Module</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <label htmlFor="quizTitle">
            Quiz Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="quizTitle"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="e.g., JavaScript Basics Quiz"
            required
          />

          <h3 style={{ marginTop: "20px" }}>Questions</h3>
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              style={{
                background: "#f8f9fa",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            >
              <input
                type="text"
                placeholder={`Question ${qIndex + 1}`}
                value={q.text}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[qIndex].text = e.target.value;
                  setQuestions(newQuestions);
                }}
              />

              <h4 style={{ marginTop: "10px" }}>Choices</h4>
              {q.choices.map((c, cIndex) => (
                <div key={cIndex} style={{ marginBottom: "8px" }}>
                  <input
                    type="text"
                    placeholder={`Choice ${cIndex + 1}`}
                    value={c.text}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[qIndex].choices[cIndex].text = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    style={{ marginRight: "10px" }}
                  />
                  <label>
                    Correct?
                    <input
                      type="checkbox"
                      checked={c.is_correct}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[qIndex].choices[cIndex].is_correct = e.target.checked;
                        setQuestions(newQuestions);
                      }}
                      style={{ marginLeft: "6px" }}
                    />
                  </label>
                </div>
              ))}
              <button
                type="button"
                className="submit-btn"
                onClick={() => handleAddChoice(qIndex)}
              >
                Add Choice
              </button>
            </div>
          ))}

          <button type="button" className="submit-btn" onClick={handleAddQuestion}>
            Add Question
          </button>
          <div style={{ marginTop: "20px" }}>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
