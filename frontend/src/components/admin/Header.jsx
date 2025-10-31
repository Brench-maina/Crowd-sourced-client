// export default function StatsCards() {
//   return (
//     <div className="stats-container">
//       <div className="stat-card xp">
//         <h2>42</h2>
//         <p>Pending Reviews</p>
//         <span>Content Review</span>
//       </div>
//       <div className="stat-card">
//         <h2>156</h2>
//         <p>Active Users</p>
//         <span>+12 this week</span>
//       </div>
//       <div className="stat-card">
//         <h2 style={{ color: "#8a2be2" }}>3</h2>
//         <p>Active Challenges</p>
//         <span>2 upcoming</span>
//       </div>
//       <div className="stat-card">
//         <h2>89%</h2>
//         <p>Approval Rate</p>
//       </div>
//     </div>
//   );
// }

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