import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../AdminStyle/ResetPassword.css";
import Alert from "../components/Alert"; // Import the Alert component

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" }); // State for alert
  const apiUrl = "https://new-app-site-a384f2c56775.herokuapp.com";
  // const apiUrl = "http://localhost:5000";

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return setAlert({ message: "Passwords do not match!", type: "error" }); // Set alert if passwords don't match
    }

    try {
      const res = await axios.post(`${apiUrl}/api/admin/reset-password`, {
        token,
        newPassword,
      });

      setAlert({ message: res.data.message, type: "success" }); // Set success alert
      setTimeout(() => navigate("/admin/login"), 2000); // Redirect to login after success
    } catch (error) {
      setAlert({
        message: error.response?.data?.message || "Something went wrong",
        type: "error",
      });
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {/* Show Alert if message exists */}
      {alert.message && <Alert message={alert.message} type={alert.type} />}
      
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
