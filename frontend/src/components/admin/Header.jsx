import "./dashboard.css";
import { MdAdminPanelSettings } from "react-icons/md";

export default function Header() {
  return (
    <div className="dashboard-header">
      <div>
        <p className="dashboard-subtitle">
          <span className="icon-circle">
            <MdAdminPanelSettings />
          </span>
          <span className="dashboard-text">Admin Dashboard</span>
        </p>
        <p>Manage platform content, users, and gamification features</p>
      </div>
    </div>
  );
}