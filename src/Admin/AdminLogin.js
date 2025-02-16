import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert"; // Import the Alert component
import "../AdminStyle/AdminLogin.css";

function AdminLogin() {
  const [formData, setFormData] = useState({ emailOrUsername: "", password: "" });
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = "https://new-app-site-a384f2c56775.herokuapp.com";
//const apiUrl = "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ message: "", type: "" });
  
    try {
      const res = await axios.post(`${apiUrl}/api/admin/login`, formData);
  
      // Check if the token is available
      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        setAlert({ message: "Login successful!", type: "success" });
  
        // Navigate to the admin panel after delay
        setTimeout(() => {
          navigate("/admin");
        }, 2000);
      } else {
        setAlert({ message: "Token not found in response", type: "error" });
      }
    } catch (err) {
      setAlert({
        message: err.response?.data.message || "Login failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="admin-login-container">
      {alert.message && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: "", type: "" })} />}

      <div className="admin-login-box">
        <h2>Admin Login</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="emailOrUsername"
            placeholder="Email or Username"
            onChange={handleChange}
            required
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="admin-auth-links">
          <a href="/admin/forgot-password">Forgot Password?</a>
          <span>|</span>
          <a href="/admin/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
