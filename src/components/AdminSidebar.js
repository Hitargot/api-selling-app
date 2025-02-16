import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaCog, FaCreditCard, FaShoppingCart } from "react-icons/fa";
import "./AdminSidebar.css";

function AdminSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`admin-sidebar ${isExpanded ? "expanded" : "collapsed"}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <h2 className="sidebar-title">{isExpanded ? "Admin Panel" : "AP"}</h2>

      <nav>
        <ul>
          <li>
            <NavLink to="/admin" end>
              <FaTachometerAlt className="icon" /> {isExpanded && "Dashboard"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/services">
              <FaCog className="icon" /> {isExpanded && "Services"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/payment">
              <FaCreditCard className="icon" /> {isExpanded && "Payment Method"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/purchase">
              <FaShoppingCart className="icon" /> {isExpanded && "Purchase"}
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/services-api">
              <FaShoppingCart className="icon" /> {isExpanded && "Services API"}
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminSidebar;
