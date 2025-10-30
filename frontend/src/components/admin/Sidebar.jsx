import React from "react";
import { NavLink } from "react-router-dom";
import "./admin/Admin.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <nav className="sidebar-nav">
        <NavLink to="/" end className="nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/users" className="nav-link">
          Users
        </NavLink>
        <NavLink to="/resources" className="nav-link">
          Resources
        </NavLink>
        <NavLink to="/challenges" className="nav-link">
          Challenges
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
