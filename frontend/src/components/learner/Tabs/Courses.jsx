// Tabs/Courses.jsx
import React, { useState } from "react";
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Introduction to Fractions",
      category: "Mathematics",
      progress: 65,
      difficulty: "Beginner",
      duration: "4 hours",
      rating: 4.8,
      enrolled: true
    },
    {
      id: 2,
      title: "Basic Algebra",
      category: "Mathematics",
      progress: 100,
      difficulty: "Beginner",
      duration: "6 hours",
      rating: 4.6,
      enrolled: true
    },
    {
      id: 3,
      title: "Geometry Basics",
      category: "Mathematics",
      progress: 30,
      difficulty: "Intermediate",
      duration: "8 hours",
      rating: 4.7,
      enrolled: true
    },
    {
      id: 4,
      title: "Science Experiments",
      category: "Science",
      progress: 0,
      difficulty: "Beginner",
      duration: "5 hours",
      rating: 4.9,
      enrolled: false
    }
  ]);

  const [filter, setFilter] = useState("All");

  const filteredCourses = courses.filter(course => 
    filter === "All" || course.category === filter
  );

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2 className="courses-title">My Courses</h2>
        <div className="filter-buttons">
          <button 
            className={filter === "All" ? "active" : ""}
            onClick={() => setFilter("All")}
          >
            All
          </button>
          <button 
            className={filter === "Mathematics" ? "active" : ""}
            onClick={() => setFilter("Mathematics")}
          >
            Mathematics
          </button>
          <button 
            className={filter === "Science" ? "active" : ""}
            onClick={() => setFilter("Science")}
          >
            Science
          </button>
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-header">
              <h3>{course.title}</h3>
              <span className={`difficulty ${course.difficulty.toLowerCase()}`}>
                {course.difficulty}
              </span>
            </div>
            
            <div className="course-info">
              <span className="category">{course.category}</span>
              <span className="duration">⏱️ {course.duration}</span>
              <span className="rating">⭐ {course.rating}</span>
            </div>

            {course.enrolled && (
              <div className="progress-section">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${course.progress}%`}}
                  ></div>
                </div>
                <span className="progress-text">{course.progress}% complete</span>
              </div>
            )}

            <div className="course-actions">
              {course.enrolled ? (
                <button className="continue-btn">
                  {course.progress === 0 ? 'Start' : 
                   course.progress === 100 ? 'Review' : 'Continue'}
                </button>
              ) : (
                <button className="enroll-btn">Enroll Now</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;