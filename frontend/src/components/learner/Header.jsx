// Header.jsx
import "./dashboard.css";
import { MdSchool } from "react-icons/md";

export default function Header() {
  return (
    <div className="dashboard-header">
      <div>
        <p className="dashboard-subtitle">
          <span className="icon-circle">
            <MdSchool />
          </span>
          <span className="dashboard-text">Learner Dashboard</span>
        </p>
        <p>Track your progress and continue learning!</p>
      </div>
      <button className="back-btn">Back to Platform</button>
    </div>
  );
}