import React, { useState } from "react";
import axios from "axios";
import Alert from "../components/Alert"; // Import the Alert component
import "../AdminStyle/AdminForgotPassword.css";
import apiUrl from '../utils/api';

function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ message: "", type: "" });

    try {
      const res = await axios.post(`${apiUrl}/api/admin/forgot-password`, { email });
      setAlert({ message: res.data.message, type: "success" });
    } catch (err) {
      setAlert({ message: err.response?.data.message || "Failed to send reset email", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-forgot-container">
      {alert.message && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: "", type: "" })} />}

      <div className="admin-forgot-box">
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminForgotPassword;
