import { useState } from "react";
import "./dashboard.css";
import Dashboard from "./Tabs/Dashboard";
import Courses from "./Tabs/Courses";
import ModuleDetail from "./Tabs/ModuleDetail";
import Badges from "./Tabs/Badges";
import Leaderboard from "./Tabs/Leaderboard";
import Profile from "./Tabs/Profile";
import ChallengesEvents from "./Tabs/ChallengesEvents";

export default function NavTabs() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedModuleId, setSelectedModuleId] = useState(null); 

  const handleStartLearning = (module) => {
    setSelectedModuleId(module.id);
    setActiveTab("ModuleDetail");
  };

  const renderTab = () => {
    switch (activeTab) {
      case "Dashboard":
        return <Dashboard />;
      case "Courses":
        return <Courses onStartLearning={handleStartLearning} />;
      case "ModuleDetail":
        return <ModuleDetail moduleId={selectedModuleId} />;
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
      <div className="nav-tabs-wrapper">
        <div className="nav-tabs">
          <button className={activeTab === "Dashboard" ? "active" : ""} onClick={() => setActiveTab("Dashboard")}>📊 Dashboard</button>
          <button className={activeTab === "Courses" ? "active" : ""} onClick={() => setActiveTab("Courses")}>📚 Courses</button>
          <button className={activeTab === "ModuleDetail" ? "active" : ""} onClick={() => setActiveTab("ModuleDetail")}>📖 Module Detail</button>
          <button className={activeTab === "Challenges" ? "active" : ""} onClick={() => setActiveTab("Challenges")}>🎯 Challenges</button>
          <button className={activeTab === "Badges" ? "active" : ""} onClick={() => setActiveTab("Badges")}>🏆 Badges</button>
          <button className={activeTab === "Leaderboard" ? "active" : ""} onClick={() => setActiveTab("Leaderboard")}>🏅 Leaderboard</button>
          <button className={activeTab === "Profile" ? "active" : ""} onClick={() => setActiveTab("Profile")}>👤 Profile</button>
        </div>
      </div>

      <div className="main-tab-card">{renderTab()}</div>
    </div>
  );
}