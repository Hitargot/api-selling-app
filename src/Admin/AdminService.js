import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Alert from "../components/Alert"; // Ensure Alert is implemented properly
import "../AdminStyle/AdminService.css";

function AdminService() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "", price: "" });
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [deleteService, setDeleteService] = useState(null); // Store service to delete
  const apiUrl = "https://new-app-site-a384f2c56775.herokuapp.com";
  //const apiUrl = "http://localhost:5000";
  

  const showAlert = (message, type) => {
    setAlert({ message, type });

    setTimeout(() => {
      setAlert({ message: "", type: "" });
    }, 3000);
  };

  const fetchServices = useCallback(async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/services/services`);
      setServices(res.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }, [apiUrl]);
  
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");

      if (editingService) {
        await axios.put(`${apiUrl}/api/services/${editingService._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showAlert("Service updated successfully", "success");
      } else {
        await axios.post(`${apiUrl}/api/services/create`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showAlert("Service created successfully", "success");
      }

      fetchServices();
      setFormData({ name: "", description: "", price: "" });
      setEditingService(null);
    } catch (error) {
      showAlert(error.response?.data.message || "Something went wrong", "error");
    }
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (!deleteService) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${apiUrl}/api/services/${deleteService._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showAlert("Service deleted successfully", "success");
      fetchServices();
    } catch (error) {
      showAlert(error.response?.data.message || "Failed to delete service", "error");
    }
    setDeleteService(null); // Close modal
  };

  return (
    <div className="admin-service-container">
      <h2>Manage Services</h2>

      {/* Alert Component */}
      {alert.message && <Alert message={alert.message} type={alert.type} />}

      {/* Service Form */}
      <form onSubmit={handleSubmit} className="service-form">
        <input type="text" name="name" placeholder="Service Name" value={formData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Service Description" value={formData.description} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Service Price" value={formData.price} onChange={handleChange} required />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : editingService ? "Update Service" : "Add Service"}
        </button>
      </form>

      {/* Service Cards */}
      <div className="service-cards">
        {services.map((service) => (
          <div key={service._id} className="service-card">
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <p className="price">${service.price}</p>
            <div className="card-actions">
              <button className="edit-btn" onClick={() => handleEdit(service)}>Edit</button>
              <button className="delete-btn" onClick={() => setDeleteService(service)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal for Deleting */}
      {deleteService && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to delete this service?</h3>
            <p>{deleteService.name}</p>
            <div className="modal-buttons">
              <button className="yes-btn" onClick={confirmDelete}>Yes</button>
              <button className="no-btn" onClick={() => setDeleteService(null)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal (When editing) */}
      {editingService && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Service</h3>
            <form onSubmit={handleSubmit} className="service-form">
              <input type="text" name="name" placeholder="Service Name" value={formData.name} onChange={handleChange} required />
              <textarea name="description" placeholder="Service Description" value={formData.description} onChange={handleChange} required />
              <input type="number" name="price" placeholder="Service Price" value={formData.price} onChange={handleChange} required />
              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Update Service"}
              </button>
              <button type="button" className="cancel-btn" onClick={() => setEditingService(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminService;
