import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import "../AdminStyle/AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="dashboard-content">
        <AdminHeader />
        <div className="outlet-container "><Outlet /> {/* ✅ This loads the correct component inside AdminDashboard */}</div>
        
      </div>
    </div>
  );
}

export default AdminDashboard;