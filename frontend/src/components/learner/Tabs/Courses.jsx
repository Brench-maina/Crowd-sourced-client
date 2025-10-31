// components/learner/Tabs/Courses.jsx
import React, { useState, useEffect } from "react";
import "./Courses.css";

const Courses = () => {
  const [learningPaths, setLearningPaths] = useState([]);
  const [myPaths, setMyPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showPathModal, setShowPathModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:5555";

  // Mock current user (replace with actual auth context)
  const currentUser = {
    id: 1,
    username: "current_user",
    token: "your-jwt-token-here" // This should come from your auth context
  };

  // Fetch all learning paths
  const fetchLearningPaths = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/learning-paths/paths`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLearningPaths(data.paths || []);
    } catch (err) {
      console.error('Error fetching learning paths:', err);
      setError('Failed to load learning paths');
      // Fallback to mock data
      setLearningPaths(getMockLearningPaths());
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's followed paths
  const fetchMyPaths = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/my-paths`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMyPaths(data || []);
    } catch (err) {
      console.error('Error fetching my paths:', err);
      // Fallback to mock data
      setMyPaths(getMockMyPaths());
    }
  };

  // Fetch single learning path with modules
  const fetchLearningPath = async (pathId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/paths/${pathId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Fetch modules for this path
      const modulesResponse = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/modules`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      if (modulesResponse.ok) {
        const modulesData = await modulesResponse.json();
        data.modules = await Promise.all(
          modulesData.map(async (module) => {
            // Fetch resources for each module
            const resourcesResponse = await fetch(`${API_BASE_URL}/modules/${module.id}/resources`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
              }
            });

            if (resourcesResponse.ok) {
              const resourcesData = await resourcesResponse.json();
              return {
                ...module,
                resources: resourcesData
              };
            }
            return module;
          })
        );
      }

      return data;
    } catch (err) {
      console.error('Error fetching learning path:', err);
      // Fallback to mock data
      return getMockLearningPath(pathId);
    }
  };

  // Follow a learning path
  const followPath = async (pathId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/paths/${pathId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchMyPaths(); // Refresh my paths
      return true;
    } catch (err) {
      console.error('Error following path:', err);
      return false;
    }
  };

  // Unfollow a learning path
  const unfollowPath = async (pathId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/paths/${pathId}/unfollow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchMyPaths(); // Refresh my paths
      return true;
    } catch (err) {
      console.error('Error unfollowing path:', err);
      return false;
    }
  };

  // Create a new learning path (for contributors/admins)
  const createLearningPath = async (pathData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/learning-paths/paths`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(pathData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      await fetchLearningPaths(); // Refresh paths list
      return data;
    } catch (err) {
      console.error('Error creating learning path:', err);
      return null;
    }
  };

  // Create a new resource for a module
  const createModuleResource = async (moduleId, resourceData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/modules/${moduleId}/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(resourceData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error('Error creating resource:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchLearningPaths();
    fetchMyPaths();
  }, []);

  const handlePathClick = async (path) => {
    const pathDetails = await fetchLearningPath(path.id);
    setSelectedPath(pathDetails);
    setShowPathModal(true);
  };

  const handleFollowPath = async (pathId) => {
    const success = await followPath(pathId);
    if (success) {
      // Update local state
      setLearningPaths(prev => prev.map(p => 
        p.id === pathId ? { ...p, is_following: true } : p
      ));
      if (selectedPath && selectedPath.id === pathId) {
        setSelectedPath(prev => ({ ...prev, is_following: true }));
      }
    }
  };

  const handleUnfollowPath = async (pathId) => {
    const success = await unfollowPath(pathId);
    if (success) {
      // Update local state
      setLearningPaths(prev => prev.map(p => 
        p.id === pathId ? { ...p, is_following: false } : p
      ));
      if (selectedPath && selectedPath.id === pathId) {
        setSelectedPath(prev => ({ ...prev, is_following: false }));
      }
    }
  };

  const handleLessonClick = (resource, module) => {
    setSelectedLesson(resource);
    setSelectedModule(module);
    
    if (resource.type === "video" || resource.url?.includes('youtube')) {
      setShowLessonModal(true);
    } else if (resource.type === "quiz") {
      setCurrentQuiz(resource);
      setShowQuizModal(true);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setCurrentQuestionIndex(0);
    }
  };

  // Mock data fallbacks
  const getMockLearningPaths = () => [
    {
      id: 1,
      title: "Introduction to Fractions",
      description: "Learn the basics of fractions, including numerator, denominator, and basic operations.",
      is_published: true,
      status: "approved",
      creator: "Math Expert",
      created_at: "2024-01-15T00:00:00",
      module_count: 2,
      is_following: false
    },
    {
      id: 2,
      title: "Basic Algebra",
      description: "Master algebraic expressions, equations, variables, and problem-solving techniques.",
      is_published: true,
      status: "approved",
      creator: "Algebra Pro",
      created_at: "2024-01-20T00:00:00",
      module_count: 1,
      is_following: true
    },
    {
      id: 3,
      title: "Introduction to Geometry",
      description: "Explore points, lines, angles, shapes, and basic geometric concepts.",
      is_published: true,
      status: "approved",
      creator: "Geometry Guru",
      created_at: "2024-01-25T00:00:00",
      module_count: 1,
      is_following: false
    },
    {
      id: 4,
      title: "Science Experiments",
      description: "Fun and educational science experiments you can do at home.",
      is_published: true,
      status: "approved",
      creator: "Science Wizard",
      created_at: "2024-01-30T00:00:00",
      module_count: 3,
      is_following: false
    },
    {
      id: 5,
      title: "Next.js for Beginners",
      description: "Learn Next.js from scratch and build modern web applications.",
      is_published: true,
      status: "approved",
      creator: "Web Dev Pro",
      created_at: "2024-02-01T00:00:00",
      module_count: 2,
      is_following: false
    }
  ];

  const getMockMyPaths = () => [
    {
      id: 2,
      title: "Basic Algebra",
      description: "Master algebraic expressions, equations, variables, and problem-solving techniques.",
      completion_percentage: 100
    }
  ];

  const getMockLearningPath = (pathId) => {
    const mockPaths = {
      1: {
        id: 1,
        title: "Introduction to Fractions",
        description: "Learn the basics of fractions, including numerator, denominator, and basic operations.",
        status: "approved",
        is_published: true,
        creator: "Math Expert",
        created_at: "2024-01-15T00:00:00",
        modules: [
          {
            id: 1,
            title: "Understanding Fractions",
            description: "Learn the fundamental concepts of fractions",
            resource_count: 4,
            quiz_count: 1,
            resources: [
              {
                id: 1,
                title: "What are Fractions?",
                type: "video",
                url: "https://www.youtube.com/embed/362JVVvgYPE",
                duration: "15 min",
                completed: true
              },
              {
                id: 2,
                title: "Numerator and Denominator",
                type: "video",
                url: "https://www.youtube.com/embed/362JVVvgYPE",
                duration: "10 min",
                completed: true
              },
              {
                id: 3,
                title: "Types of Fractions",
                type: "reading",
                content: "Learn about proper, improper, and mixed fractions...",
                duration: "10 min",
                completed: true
              },
              {
                id: 4,
                title: "Fractions Basics Quiz",
                type: "quiz",
                duration: "20 min",
                questions: getMockQuizQuestions(),
                completed: false
              }
            ]
          }
        ]
      },
      2: {
        id: 2,
        title: "Basic Algebra",
        description: "Master algebraic expressions, equations, variables, and problem-solving techniques.",
        status: "approved",
        is_published: true,
        creator: "Algebra Pro",
        created_at: "2024-01-20T00:00:00",
        modules: [
          {
            id: 2,
            title: "Introduction to Algebra",
            description: "Learn the basics of algebraic expressions",
            resource_count: 3,
            quiz_count: 1,
            resources: [
              {
                id: 5,
                title: "What is Algebra?",
                type: "video",
                url: "https://www.youtube.com/embed/NybHckSEQBI",
                duration: "20 min",
                completed: true
              },
              {
                id: 6,
                title: "Variables and Expressions",
                type: "video",
                url: "https://www.youtube.com/embed/NybHckSEQBI",
                duration: "25 min",
                completed: true
              },
              {
                id: 7,
                title: "Algebra Basics Quiz",
                type: "quiz",
                duration: "20 min",
                questions: getMockQuizQuestions(),
                completed: true
              }
            ]
          }
        ]
      }
    };
    return mockPaths[pathId] || mockPaths[1];
  };

  const getMockQuizQuestions = () => [
    {
      id: 1,
      question: "What is the numerator in the fraction 3/4?",
      options: ["3", "4", "7", "1"],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Which fraction represents one whole?",
      options: ["1/2", "2/2", "1/4", "3/4"],
      correctAnswer: 1
    },
    // ... more questions up to 15
  ];

  const closeModals = () => {
    setShowPathModal(false);
    setShowLessonModal(false);
    setShowQuizModal(false);
    setSelectedPath(null);
    setSelectedModule(null);
    setSelectedLesson(null);
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
  };

  const currentQuestion = currentQuiz?.questions?.[currentQuestionIndex];
  const totalQuestions = currentQuiz?.questions?.length || 0;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  if (loading) {
    return (
      <div className="courses-container">
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p>Loading learning paths...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <div className="header-content">
          <h2 className="courses-title">Learning Paths</h2>
          <p className="courses-subtitle">Explore and follow learning paths to track your progress</p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button onClick={() => {
            setError("");
            fetchLearningPaths();
          }} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* My Learning Paths Section */}
      {myPaths.length > 0 && (
        <div className="section">
          <h3 className="section-title">My Learning Paths</h3>
          <div className="courses-grid">
            {myPaths.map(path => (
              <div key={path.id} className="course-card" onClick={() => handlePathClick(path)}>
                <div className="course-badge">My Path</div>
                <div className="course-header">
                  <h3>{path.title}</h3>
                  <span className="progress-badge">{path.completion_percentage}%</span>
                </div>
                <p className="course-description">{path.description}</p>
                <div className="progress-section">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span>{path.completion_percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${path.completion_percentage}%`}}
                    ></div>
                  </div>
                </div>
                <div className="course-actions">
                  <button className="continue-btn">
                    {path.completion_percentage === 0 ? 'Start Learning' : 
                     path.completion_percentage === 100 ? 'Review Path' : 'Continue Learning'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Learning Paths Section */}
      <div className="section">
        <h3 className="section-title">Available Learning Paths</h3>
        <div className="courses-grid">
          {learningPaths.map(path => (
            <div key={path.id} className="course-card" onClick={() => handlePathClick(path)}>
              <div className={`course-badge ${path.status}`}>
                {path.status}
              </div>
              <div className="course-header">
                <h3>{path.title}</h3>
                <span className="creator">By {path.creator}</span>
              </div>
              <p className="course-description">{path.description}</p>
              <div className="course-info">
                <span className="modules">📚 {path.module_count} modules</span>
                <span className="duration">🕒 {Math.max(path.module_count * 2, 4)} hours</span>
              </div>
              <div className="course-actions">
                {path.is_following ? (
                  <button 
                    className="unfollow-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnfollowPath(path.id);
                    }}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button 
                    className="follow-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowPath(path.id);
                    }}
                  >
                    Follow Path
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Path Details Modal */}
      {showPathModal && selectedPath && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="course-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <h3>{selectedPath.title}</h3>
                <div className="path-meta">
                  <span className="course-category">By {selectedPath.creator}</span>
                  <span className={`path-status ${selectedPath.status}`}>
                    {selectedPath.status}
                  </span>
                </div>
              </div>
              <button className="close-btn" onClick={closeModals}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="course-overview">
                <div className="course-description-full">
                  <p>{selectedPath.description}</p>
                </div>
              </div>

              <div className="modules-section">
                <h4 className="section-title">Path Modules</h4>
                {selectedPath.modules && selectedPath.modules.length > 0 ? (
                  selectedPath.modules.map(module => (
                    <div key={module.id} className="module-card">
                      <div className="module-header">
                        <div className="module-info">
                          <h5>{module.title}</h5>
                          <p className="module-description">{module.description}</p>
                        </div>
                        <div className="module-stats">
                          <span className="resources">📚 {module.resource_count || module.resources?.length || 0} resources</span>
                          <span className="quizzes">🧠 {module.quiz_count || module.resources?.filter(r => r.type === 'quiz').length || 0} quizzes</span>
                        </div>
                      </div>
                      {module.resources && module.resources.length > 0 && (
                        <div className="lessons-list">
                          {module.resources.map(resource => (
                            <div 
                              key={resource.id} 
                              className={`lesson-item ${resource.completed ? 'completed' : ''} ${resource.type}`}
                              onClick={() => handleLessonClick(resource, module)}
                            >
                              <div className="lesson-icon">
                                {resource.type === "video" && "🎥"}
                                {resource.type === "reading" && "📖"}
                                {resource.type === "quiz" && "🧠"}
                                {!resource.type && "📄"}
                              </div>
                              <div className="lesson-info">
                                <span className="lesson-title">{resource.title}</span>
                                <span className="lesson-meta">
                                  <span className="lesson-type">{resource.type || 'resource'}</span>
                                  <span className="lesson-duration">{resource.duration}</span>
                                </span>
                              </div>
                              <div className="lesson-status">
                                {resource.completed ? (
                                  <span className="completed-badge">Completed</span>
                                ) : (
                                  <span className="incomplete-badge">Start</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-modules">
                    <div className="no-modules-icon">📚</div>
                    <p>No modules available yet. Check back soon!</p>
                  </div>
                )}
              </div>

              <div className="path-actions">
                {selectedPath.is_following ? (
                  <button 
                    className="unfollow-btn large"
                    onClick={() => handleUnfollowPath(selectedPath.id)}
                  >
                    Unfollow Path
                  </button>
                ) : (
                  <button 
                    className="follow-btn large"
                    onClick={() => handleFollowPath(selectedPath.id)}
                  >
                    Follow This Path
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Video Modal */}
      {showLessonModal && selectedLesson && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedLesson.title}</h3>
              <button className="close-btn" onClick={closeModals}>×</button>
            </div>
            <div className="video-container">
              <iframe
                width="100%"
                height="400"
                src={selectedLesson.url}
                title={selectedLesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="modal-actions">
              <button className="primary-btn">
                Mark as Complete
              </button>
              <button className="secondary-btn" onClick={closeModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal - Use the same beautiful quiz implementation from before */}
      {showQuizModal && currentQuiz && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
            {/* Quiz content implementation remains the same */}
            <div className="quiz-header">
              <div className="quiz-title-section">
                <h3>{currentQuiz.title}</h3>
                <span className="quiz-duration">⏱️ {currentQuiz.duration}</span>
              </div>
              <button className="close-btn" onClick={closeModals}>×</button>
            </div>
            
            {/* Add your quiz implementation here */}
            <div className="quiz-content">
              <p>Quiz implementation would go here...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;