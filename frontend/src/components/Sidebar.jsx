import { NavLink } from "react-router-dom";
import { FaHome, FaListAlt, FaChartBar, FaWrench } from "react-icons/fa";
import "../styles/Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">API Management</h2>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/" end className="menu-link">
            <FaHome className="menu-icon" />
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/logs" className="menu-link">
            <FaListAlt className="menu-icon" />
            <span>Tracer</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/analysis" className="menu-link">
            <FaChartBar className="menu-icon" />
            <span>Analysis</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/configs" className="menu-link">
            <FaWrench className="menu-icon" />
            <span>Configuration</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
