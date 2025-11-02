import "./dashboard.css";
import { MdPeople } from "react-icons/md";


export default function Header() {
  return (
    <div className="dashboard-header">
      <div>
    <p className="dashboard-subtitle">
  <span className="icon-circle">
    <MdPeople />
  </span>
  <span className="dashboard-text">Contributors Dashboard</span>
</p>

        <p>Share your knowledge and earn rewards!</p>
      </div>
    </div>
  );
}
