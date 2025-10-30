import { useState } from "react";
import "./dashboard.css";
import ContentReview from "./Tabs/ContentReview";
import Moderation from "./Tabs/Moderation";
import Challenges from "./Tabs/Challenges";
import Events from "./Tabs/Events";

export default function NavTabs() {
  const [activeTab, setActiveTab] = useState("ContentReview");

  const renderTab = () => {
    switch (activeTab) {
      case "ContentReview":
        return <ContentReview />;
      case "Moderation":
        return <Moderation />;
      case "Challenges":
        return <Challenges />;
      case "Events":
        return <Events />;
      default:
        return <ContentReview />;
    }
  };

  return (
    <div className="dashboard-inner">
      {/* Top Fixed Nav Tabs */}
      <div className="nav-tabs-wrapper">
        <div className="nav-tabs">
          <button
            className={activeTab === "ContentReview" ? "active" : ""}
            onClick={() => setActiveTab("ContentReview")}
          >
            📋 Content Review
          </button>

          <button
            className={activeTab === "Moderation" ? "active" : ""}
            onClick={() => setActiveTab("Moderation")}
          >
            ⚡ Moderation
          </button>

          <button
            className={activeTab === "Challenges" ? "active" : ""}
            onClick={() => setActiveTab("Challenges")}
          >
            🏆 Challenges
          </button>

          <button
            className={activeTab === "Events" ? "active" : ""}
            onClick={() => setActiveTab("Events")}
          >
            📅 Events
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="main-tab-card">
        {renderTab()}
      </div>
    </div>
  );
}