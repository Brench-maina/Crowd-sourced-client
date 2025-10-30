import Header from "./Header";
import StatsCards from "./StatsCards";
import NavTabs from "./NavTabs";
import "./dashboard.css";

export default function AdminDashboard() {
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-inner">
        {/* Header Section */}
        <Header />

        {/* Stats Cards Section */}
        <div className="stats-container">
          <StatsCards />
        </div>

        {/* Navigation Tabs */}
        <NavTabs />
      </div>
    </div>
  );
}