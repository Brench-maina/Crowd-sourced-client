import { useState } from "react";
import MyResources from "./Tabs/MyResources";
import CreateResource from "./Tabs/CreateResource";
import LearningPaths from "./Tabs/LearningPaths";
import Analytics from "./Tabs/Analytics";
import "./navtabs.css";

export default function NavTabs() {
  const [activeTab, setActiveTab] = useState("resources");

  return (
    <div className="navtabs-container">
      {/* --- Navigation Buttons --- */}
      <div className="tabs-buttons">
        <button
          className={activeTab === "resources" ? "active" : ""}
          onClick={() => setActiveTab("resources")}
        >
          📚 My Resources
        </button>

        <button
          className={activeTab === "create" ? "active" : ""}
          onClick={() => setActiveTab("create")}
        >
          ✨ Create New
        </button>

        <button
          className={activeTab === "paths" ? "active" : ""}
          onClick={() => setActiveTab("paths")}
        >
          📈 Learning Paths
        </button>

        <button
          className={activeTab === "analytics" ? "active" : ""}
          onClick={() => setActiveTab("analytics")}
        >
          📊 Analytics
        </button>
      </div>

      {/* --- Dynamic Tab Content --- */}
      <div className="tab-content">
        {activeTab === "resources" && <MyResources />}
        {activeTab === "create" && <CreateResource />}
        {activeTab === "paths" && <LearningPaths />}
        {activeTab === "analytics" && <Analytics />}
      </div>
    </div>
  );
}
