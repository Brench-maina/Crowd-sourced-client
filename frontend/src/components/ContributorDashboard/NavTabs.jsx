import { useState } from "react";
import "./dashboard.css";
import CreateNew from "./Tabs/CreateResource";
import LearningPaths from "./Tabs/LearningPaths";
import AddModules from "./Tabs/AddModules";
import AddQuiz from "./Tabs/AddQuiz";

export default function NavTabs() {
  const [activeTab, setActiveTab] = useState("MyResources");

  const renderTab = () => {
    switch (activeTab) {
      case "LearningPaths":
        return <LearningPaths />;
      case "CreateNew":
        return <CreateNew />;
      case "AddModules":
        return <AddModules />;
      case "AddQuiz": 
        return <AddQuiz />;
      case "Profile": // ✅ New Profile tab
        return <Profile />;
      default:
        return <LearningPaths />;
    }
  };

  return (
    <div className="dashboard-inner">
      <div className="nav-tabs-wrapper">
        <div className="nav-tabs">

  

          <button
            className={activeTab === "LearningPaths" ? "active" : ""}
            onClick={() => setActiveTab("LearningPaths")}
          >
            📈 Learning Paths
          </button>

          <button
            className={activeTab === "AddModules" ? "active" : ""}
            onClick={() => setActiveTab("AddModules")}
          >
            🧩 Add Modules
          </button>

          <button
            className={activeTab === "CreateNew" ? "active" : ""}
            onClick={() => setActiveTab("CreateNew")}
          >
            ✨ Add Resources
          </button>

          <button
            className={activeTab === "AddQuiz" ? "active" : ""}
            onClick={() => setActiveTab("AddQuiz")}
          >
            📝 Add Quiz
          </button>

          <button
            className={activeTab === "Profile" ? "active" : ""}
            onClick={() => setActiveTab("Profile")}
          >
            👤 Profile
          </button>
        </div>
      </div>

      <div className="main-tab-card">
        {renderTab()}
      </div>
    </div>
  );
}
