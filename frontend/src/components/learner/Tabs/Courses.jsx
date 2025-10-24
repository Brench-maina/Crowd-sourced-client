// // Tabs/Courses.jsx
// import React, { useState } from "react";
// import "./Courses.css";

// const Courses = () => {
//   const [courses, setCourses] = useState([
//     {
//       id: 1,
//       title: "Introduction to Fractions",
//       category: "Mathematics",
//       progress: 65,
//       difficulty: "Beginner",
//       duration: "4 hours",
//       rating: 4.8,
//       enrolled: true
//     },
//     {
//       id: 2,
//       title: "Basic Algebra",
//       category: "Mathematics",
//       progress: 100,
//       difficulty: "Beginner",
//       duration: "6 hours",
//       rating: 4.6,
//       enrolled: true
//     },
//     {
//       id: 3,
//       title: "Geometry Basics",
//       category: "Mathematics",
//       progress: 30,
//       difficulty: "Intermediate",
//       duration: "8 hours",
//       rating: 4.7,
//       enrolled: true
//     },
//     {
//       id: 4,
//       title: "Science Experiments",
//       category: "Science",
//       progress: 0,
//       difficulty: "Beginner",
//       duration: "5 hours",
//       rating: 4.9,
//       enrolled: false
//     }
//   ]);

//   const [filter, setFilter] = useState("All");

//   const filteredCourses = courses.filter(course => 
//     filter === "All" || course.category === filter
//   );

//   return (
//     <div className="courses-container">
//       <div className="courses-header">
//         <h2 className="courses-title">My Courses</h2>
//         <div className="filter-buttons">
//           <button 
//             className={filter === "All" ? "active" : ""}
//             onClick={() => setFilter("All")}
//           >
//             All
//           </button>
//           <button 
//             className={filter === "Mathematics" ? "active" : ""}
//             onClick={() => setFilter("Mathematics")}
//           >
//             Mathematics
//           </button>
//           <button 
//             className={filter === "Science" ? "active" : ""}
//             onClick={() => setFilter("Science")}
//           >
//             Science
//           </button>
//         </div>
//       </div>

//       <div className="courses-grid">
//         {filteredCourses.map(course => (
//           <div key={course.id} className="course-card">
//             <div className="course-header">
//               <h3>{course.title}</h3>
//               <span className={`difficulty ${course.difficulty.toLowerCase()}`}>
//                 {course.difficulty}
//               </span>
//             </div>
            
//             <div className="course-info">
//               <span className="category">{course.category}</span>
//               <span className="duration">⏱️ {course.duration}</span>
//               <span className="rating">⭐ {course.rating}</span>
//             </div>

//             {course.enrolled && (
//               <div className="progress-section">
//                 <div className="progress-bar">
//                   <div 
//                     className="progress-fill" 
//                     style={{width: `${course.progress}%`}}
//                   ></div>
//                 </div>
//                 <span className="progress-text">{course.progress}% complete</span>
//               </div>
//             )}

//             <div className="course-actions">
//               {course.enrolled ? (
//                 <button className="continue-btn">
//                   {course.progress === 0 ? 'Start' : 
//                    course.progress === 100 ? 'Review' : 'Continue'}
//                 </button>
//               ) : (
//                 <button className="enroll-btn">Enroll Now</button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Courses;




// components/learner/Tabs/Courses.jsx
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
      enrolled: true,
      youtubeUrl: "https://www.youtube.com/embed/362JVVvgYPE", // Fractions video
      description: "Learn the basics of fractions, including numerator, denominator, and basic operations with fun examples and practical applications."
    },
    {
      id: 2,
      title: "Basic Algebra",
      category: "Mathematics",
      progress: 100,
      difficulty: "Beginner",
      duration: "6 hours",
      rating: 4.6,
      enrolled: true,
      youtubeUrl: "https://www.youtube.com/embed/NybHckSEQBI", // Algebra basics
      description: "Master algebraic expressions, equations, variables, and problem-solving techniques. Perfect for beginners starting their algebra journey."
    },
    {
      id: 3,
      title: "Introduction to Geometry",
      category: "Mathematics",
      progress: 30,
      difficulty: "Intermediate",
      duration: "8 hours",
      rating: 4.7,
      enrolled: true,
      youtubeUrl: "https://www.youtube.com/embed/302eJ3TzJQU", // Geometry basics
      description: "Explore points, lines, angles, shapes, and basic geometric concepts. Learn about triangles, circles, and spatial relationships."
    },
    {
      id: 4,
      title: "Science Experiments",
      category: "Science",
      progress: 0,
      difficulty: "Beginner",
      duration: "5 hours",
      rating: 4.9,
      enrolled: false,
      youtubeUrl: "https://www.youtube.com/embed/1Q_4HXewiS0", // Science experiments
      description: "Fun and educational science experiments you can do at home. Learn scientific principles through hands-on activities and demonstrations."
    },
    {
      id: 5,
      title: "Chemistry Fundamentals",
      category: "Science",
      progress: 0,
      difficulty: "Intermediate",
      duration: "7 hours",
      rating: 4.5,
      enrolled: false,
      youtubeUrl: "https://www.youtube.com/embed/1Q_4HXewiS0", // Chemistry basics (same as science experiments for now)
      description: "Learn about atoms, molecules, chemical reactions, and the periodic table. Understand the building blocks of matter and chemical processes."
    },
    {
      id: 6,
      title: "Next.js for Beginners",
      category: "Programming",
      progress: 0,
      difficulty: "Beginner",
      duration: "6 hours",
      rating: 4.7,
      enrolled: false,
      youtubeUrl: "https://www.youtube.com/embed/ZVnjOPwW4ZA", // Next.js tutorial
      description: "Learn Next.js from scratch! Build modern web applications with React, understand server-side rendering, and deploy your first Next.js project."
    }
  ]);

  const [filter, setFilter] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const filteredCourses = courses.filter(course => 
    filter === "All" || course.category === filter
  );

  const handleCourseClick = (course) => {
    if (course.enrolled) {
      setSelectedCourse(course);
      setShowVideoModal(true);
    }
  };

  const closeModal = () => {
    setShowVideoModal(false);
    setSelectedCourse(null);
  };

  const handleEnroll = (courseId) => {
    setCourses(courses.map(course => 
      course.id === courseId ? { ...course, enrolled: true, progress: 0 } : course
    ));
  };

  const handleMarkComplete = () => {
    if (selectedCourse) {
      setCourses(courses.map(course => 
        course.id === selectedCourse.id ? { ...course, progress: 100 } : course
      ));
      closeModal();
    }
  };

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h2 className="courses-title">My Courses</h2>
        <div className="filter-buttons">
          <button 
            className={filter === "All" ? "active" : ""}
            onClick={() => setFilter("All")}
          >
            All Courses
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
          <button 
            className={filter === "Programming" ? "active" : ""}
            onClick={() => setFilter("Programming")}
          >
            Programming
          </button>
        </div>
      </div>

      <div className="courses-grid">
        {filteredCourses.map(course => (
          <div key={course.id} className="course-card" onClick={() => handleCourseClick(course)}>
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

            <p className="course-description">{course.description}</p>

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
                  {course.progress === 0 ? 'Start Learning' : 
                   course.progress === 100 ? 'Review Course' : 'Continue Learning'}
                </button>
              ) : (
                <button 
                  className="enroll-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnroll(course.id);
                  }}
                >
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {showVideoModal && selectedCourse && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCourse.title}</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="video-container">
              <iframe
                width="100%"
                height="400"
                src={selectedCourse.youtubeUrl}
                title={selectedCourse.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="modal-content">
              <div className="course-details">
                <p><strong>Category:</strong> {selectedCourse.category}</p>
                <p><strong>Difficulty:</strong> {selectedCourse.difficulty}</p>
                <p><strong>Duration:</strong> {selectedCourse.duration}</p>
                <p><strong>Rating:</strong> ⭐ {selectedCourse.rating}</p>
              </div>
              <div className="course-description-full">
                <h4>About this course:</h4>
                <p>{selectedCourse.description}</p>
              </div>
              <div className="modal-actions">
                <button className="primary-btn" onClick={handleMarkComplete}>
                  {selectedCourse.progress === 100 ? 'Completed ✓' : 'Mark as Complete'}
                </button>
                <button className="secondary-btn" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;