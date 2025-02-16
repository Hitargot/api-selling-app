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
    //   const apiUrl = "https://api-selling-app-95e637847b06.herokuapp.com";
const apiUrl = "http://localhost:5000";

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return Alert("Passwords do not match!", "error");
    }

    try {
      const res = await axios.post(`${apiUrl}/api/admin/reset-password`, {
        token,
        newPassword,
      });

      Alert(res.data.message, "success");
      setTimeout(() => navigate("/admin/login"), 2000); // Redirect to login after success
    } catch (error) {
      Alert(error.response?.data?.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
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
