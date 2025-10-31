import Header from "./Header";
import StatsCards from "./StatsCards";
import NavTabs from "./NavTabs";
import "./dashboard.css";
import { useState } from "react";

export default function AdminDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Optional: Add a refresh function if you want manual refresh
  const refreshStats = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-inner">
        {/* Header Section */}
        <Header />

        {/* Stats Cards Section - Now fetches its own data */}
        <StatsCards key={refreshTrigger} />

        {/* Navigation Tabs */}
        <NavTabs />
      </div>
    </div>
  );
}