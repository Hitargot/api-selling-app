import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from "../components/Alert"; // Import Alert component
import "../AdminStyle/AdminPayments.css";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const apiUrl = "https://new-app-site-a384f2c56775.herokuapp.com";
  //const apiUrl = "http://localhost:5000";
  
  useEffect(() => {
    fetchPayments();
  }, [apiUrl]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/payments/payment`);
      setPayments(res.data);
    } catch (error) {
      setAlert({ message: "Error fetching payments", type: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAlert({ message: "", type: "" });

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    if (qrCode) formData.append("qrCode", qrCode);

    try {
      if (editMode) {
        await axios.put(`${apiUrl}api/payments/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setAlert({ message: "Payment method updated successfully", type: "success" });
        setEditMode(false);
        setEditId(null);
      } else {
        await axios.post(`${apiUrl}/api/payments/create`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setAlert({ message: "Payment method added successfully", type: "success" });
      }
      fetchPayments();
      setName("");
      setAddress("");
      setQrCode(null);
    } catch (error) {
      setAlert({ message: error.response?.data?.error || "Failed to process payment", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/payments/${id}`);
      setAlert({ message: "Payment method deleted", type: "success" });
      fetchPayments();
    } catch (error) {
      setAlert({ message: error.response?.data?.error || "Error deleting payment", type: "error" });
    }
  };

  const handleEdit = (payment) => {
    setEditMode(true);
    setEditId(payment._id);
    setName(payment.name);
    setAddress(payment.address);
    setQrCode(null);
  };

  return (
    <div>
      <h2>Manage Payment Methods</h2>

      {alert.message && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: "", type: "" })} />}

      {/* Create/Edit Payment Method Form */}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Payment Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Wallet Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        <input type="file" onChange={(e) => setQrCode(e.target.files[0])} />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : editMode ? "Update Payment Method" : "Add Payment Method"}
        </button>
      </form>

      {/* Payment List */}
      <h3>Existing Payment Methods</h3>
      <div className="payment-list">
        {payments.map((p) => (
          <div className="payment-card" key={p._id}>
            <h4>{p.name}</h4>
            <p>{p.address}</p>
            {p.qrCode && <img src={`http://localhost:5000${p.qrCode}`} alt="QR Code" width="80" />}
            <div className="buttons">
              <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPayments;
