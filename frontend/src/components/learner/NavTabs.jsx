// // NavTabs.jsx
// import { useState } from "react";
// import "./dashboard.css";
// import Dashboard from "./Tabs/Dashboard";
// import Courses from "./Tabs/Courses";
// import Badges from "./Tabs/Badges";
// import Leaderboard from "./Tabs/Leaderboard";
// import Profile from "./Tabs/Profile";
// import ChallengesEvents.jsx from "./Tabs/ChallengesEvents";

// export default function NavTabs() {
//   const [activeTab, setActiveTab] = useState("Dashboard");

//   const renderTab = () => {
//     switch (activeTab) {
//       case "Dashboard":
//         return <Dashboard />;
//       case "Courses":
//         return <Courses />;
//       case "Badges":
//         return <Badges />;
//       case "Leaderboard":
//         return <Leaderboard />;
//       case "Profile":
//         return <Profile />;
//       default:
//         return <Dashboard />;
//     }
//   };

//   return (
//     <div className="dashboard-inner">
//       {/* === Top Fixed Nav Tabs (Outside Card) === */}
//       <div className="nav-tabs-wrapper">
//         <div className="nav-tabs">
//           <button
//             className={activeTab === "Dashboard" ? "active" : ""}
//             onClick={() => setActiveTab("Dashboard")}
//           >
//             📊 Dashboard
//           </button>

//           <button
//             className={activeTab === "Courses" ? "active" : ""}
//             onClick={() => setActiveTab("Courses")}
//           >
//             📚 Courses
//           </button>

//           <button
//             className={activeTab === "Badges" ? "active" : ""}
//             onClick={() => setActiveTab("Badges")}
//           >
//             🏆 Badges
//           </button>

//           <button
//             className={activeTab === "Leaderboard" ? "active" : ""}
//             onClick={() => setActiveTab("Leaderboard")}
//           >
//             🏅 Leaderboard
//           </button>

//           <button
//             className={activeTab === "Profile" ? "active" : ""}
//             onClick={() => setActiveTab("Profile")}
//           >
//             👤 Profile
//           </button>
//         </div>
//       </div>

//       {/* === Main Content Card (Changes with Tabs) === */}
//       <div className="main-tab-card">
//         {renderTab()}
//       </div>
//     </div>
//   );
// }


// NavTabs.jsx
import { useState } from "react";
import "./dashboard.css";
import Dashboard from "./Tabs/Dashboard";
import Courses from "./Tabs/Courses";
import Badges from "./Tabs/Badges";
import Leaderboard from "./Tabs/Leaderboard";
import Profile from "./Tabs/Profile";
import ChallengesEvents from "./Tabs/ChallengesEvents";

export default function NavTabs() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "Dashboard":
        return <Dashboard />;
      case "Courses":
        return <Courses />;
      case "Badges":
        return <Badges />;
      case "Leaderboard":
        return <Leaderboard />;
      case "Profile":
        return <Profile />;
      case "Challenges":
        return <ChallengesEvents />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="dashboard-inner">
      {/* === Top Fixed Nav Tabs (Outside Card) === */}
      <div className="nav-tabs-wrapper">
        <div className="nav-tabs">
          <button
            className={activeTab === "Dashboard" ? "active" : ""}
            onClick={() => setActiveTab("Dashboard")}
          >
            📊 Dashboard
          </button>

          <button
            className={activeTab === "Courses" ? "active" : ""}
            onClick={() => setActiveTab("Courses")}
          >
            📚 Courses
          </button>

          <button
            className={activeTab === "Challenges" ? "active" : ""}
            onClick={() => setActiveTab("Challenges")}
          >
            🎯 Challenges
          </button>

          <button
            className={activeTab === "Badges" ? "active" : ""}
            onClick={() => setActiveTab("Badges")}
          >
            🏆 Badges
          </button>

          <button
            className={activeTab === "Leaderboard" ? "active" : ""}
            onClick={() => setActiveTab("Leaderboard")}
          >
            🏅 Leaderboard
          </button>

          <button
            className={activeTab === "Profile" ? "active" : ""}
            onClick={() => setActiveTab("Profile")}
          >
            👤 Profile
          </button>
        </div>
      </div>

      {/* === Main Content Card (Changes with Tabs) === */}
      <div className="main-tab-card">
        {renderTab()}
      </div>
    </div>
  );
}