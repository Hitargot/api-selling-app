import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHeader.css"; // ✅ Import CSS file

function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <header className="admin-header">
      <h1>Admin Dashboard</h1>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </header>
  );
}

export default AdminHeader;
