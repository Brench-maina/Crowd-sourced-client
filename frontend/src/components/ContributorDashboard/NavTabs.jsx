import { useState } from "react";
import "./dashboard.css";
import MyResources from "./Tabs/MyResources";
import CreateNew from "./Tabs/CreateResource";
import LearningPaths from "./Tabs/LearningPaths";
import AddModules from "./Tabs/AddModules";
import Analytics from "./Tabs/Analytics";

export default function NavTabs() {
  const [activeTab, setActiveTab] = useState("MyResources");

  const renderTab = () => {
    switch (activeTab) {
      case "MyResources":
        return <MyResources />;
      case "CreateNew":
        return <CreateNew />;
      case "LearningPaths":
        return <LearningPaths />;
      case "AddModules":
        return <AddModules />;  
      case "Analytics":
        return <Analytics />;
      default:
        return <MyResources />;
    }
  };

  return (
    <div className="dashboard-inner">
      {/* === Top Fixed Nav Tabs (Outside Card) === */}
      <div className="nav-tabs-wrapper">
        <div className="nav-tabs">
          <button
            className={activeTab === "MyResources" ? "active" : ""}
            onClick={() => setActiveTab("MyResources")}
          >
            📚 My Resources
          </button>

          <button
            className={activeTab === "CreateNew" ? "active" : ""}
            onClick={() => setActiveTab("CreateNew")}
          >
            ✨ Create New
          </button>

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
            className={activeTab === "Analytics" ? "active" : ""}
            onClick={() => setActiveTab("Analytics")}
          >
            📊 Analytics
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
