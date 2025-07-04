import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./utils/protectedRoute";
import AdminSignup from "./Admin/AdminSignup";
import AdminLogin from "./Admin/AdminLogin";
import AdminForgotPassword from "./Admin/AdminForgotPassword";
import AdminDashboard from "./Admin/AdminDashboard";
import ResetPassword from "./Admin/ResetPassword";
import UserServices from "./components/UserServices";
import DashboardHome from "./Admin/DashboardHome";
import AdminService from "./Admin/AdminService";
import AdminPayments from "./Admin/AdminPayments";
import AdminPurchase from "./Admin/AdminPurchase";
import ServiceDetails from "./components/ServiceDetails";
import ServiceAPIManager from "./Admin/ServiceAPIManager";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {

  return (
    <Router>
            <ToastContainer position="top-right" autoClose={4000} theme="colored" />

      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/services" element={<UserServices />} />
        <Route path="/service/:id" element={<ServiceDetails />} />
       {/* ✅ Protect all admin routes */}
       <Route path="/admin" element={<ProtectedRoute />}>
        {/* ✅ Wrap all admin routes inside AdminDashboard */}
        <Route element={<AdminDashboard />}>
          <Route index element={<DashboardHome />} /> {/* ✅ Default admin home */}
          <Route path="services" element={<AdminService />} />
          <Route path="payment" element={<AdminPayments />} />
          <Route path="purchase" element={<AdminPurchase />} />
          <Route path="services-api" element={<ServiceAPIManager  />} />
        </Route>
      </Route>
      </Routes>
    </Router>
  );
}

export default App;
