import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../AdminStyle/AdminSignup.css";

function AdminSignup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const apiUrl = "https://new-app-site-a384f2c56775.herokuapp.com";
//const apiUrl = "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/admin/signup`, formData);
      setMessage(res.data.message);
      navigate("/admin/login");
    } catch (err) {
      setMessage(err.response?.data.message || "Signup failed");
    }
  };

  return (
<div className="admin-signup-container">
  <div className="admin-signup-box">
    <h2>Admin Signup</h2>
    {message && <p>{message}</p>}
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Sign Up</button>
    </form>
  </div>
</div>

  );
}

export default AdminSignup;
