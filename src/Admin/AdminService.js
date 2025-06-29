import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from "../components/Alert"; // Ensure Alert is implemented properly
import "../AdminStyle/AdminService.css";
import apiUrl from '../utils/api';

function AdminService() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    packages: [{ name: "", description: "", price: "", features: [""] }],
  });
  
   const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [deleteService, setDeleteService] = useState(null); // Store service to delete
  

  const showAlert = (message, type) => {
    setAlert({ message, type });

    setTimeout(() => {
      setAlert({ message: "", type: "" });
    }, 3000);
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/services/services`);
      console.log("Fetched services:", res.data); // Check this
      setServices(res.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  
  
  useEffect(() => {
    fetchServices();
  });

  const handlePackageChange = (index, field, value) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[index][field] = value;
    setFormData({ ...formData, packages: updatedPackages });
  };
  
  const handleFeatureChange = (pkgIndex, featIndex, value) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[pkgIndex].features[featIndex] = value;
    setFormData({ ...formData, packages: updatedPackages });
  };
  
  const addPackage = () => {
    setFormData({
      ...formData,
      packages: [...formData.packages, { name: "", description: "", price: "", features: [""] }],
    });
  };
  
  const removePackage = (index) => {
    const updated = formData.packages.filter((_, i) => i !== index);
    setFormData({ ...formData, packages: updated });
  };
  
  const addFeature = (pkgIndex) => {
    const updated = [...formData.packages];
    updated[pkgIndex].features.push("");
    setFormData({ ...formData, packages: updated });
  };
  
  const removeFeature = (pkgIndex, featIndex) => {
    const updated = [...formData.packages];
    updated[pkgIndex].features.splice(featIndex, 1);
    setFormData({ ...formData, packages: updated });
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (service) => {
    const packages = Array.isArray(service.packages) && service.packages.length > 0
      ? service.packages.map(pkg => ({
          name: pkg.name || "",
          description: pkg.description || "",
          price: pkg.price || "",
          features: Array.isArray(pkg.features) ? pkg.features : [""],
        }))
      : [{ name: "", description: "", price: "", features: [""] }];
  
    setEditingService(service);
    setFormData({
      name: service.name || "",
      description: service.description || "",
      price: service.price || "",
      packages,
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
  
      // Refresh services list after submit
      fetchServices();
  
      // Reset formData after submit to include packages
      setFormData({
        name: "",
        description: "",
        price: "",
        packages: [{ name: "", description: "", price: "", features: [""] }],
      });
  
      setEditingService(null);
    } catch (error) {
      showAlert(error.response?.data.message || "Something went wrong", "error");
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchServices();
  }, []); // Run only once on mount
    
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
  <input type="number" name="price" placeholder="Default Price (optional)" value={formData.price} onChange={handleChange} />

  <h4>Packages</h4>
  {formData.packages.map((pkg, pkgIndex) => (
    <div key={pkgIndex} className="package-box">
      <input type="text" placeholder="Package Name" value={pkg.name} onChange={(e) => handlePackageChange(pkgIndex, "name", e.target.value)} required />
      <input type="text" placeholder="Package Description" value={pkg.description} onChange={(e) => handlePackageChange(pkgIndex, "description", e.target.value)} required />
      <input type="number" placeholder="Package Price" value={pkg.price} onChange={(e) => handlePackageChange(pkgIndex, "price", e.target.value)} required />

      <h5>Features</h5>
      {pkg.features && pkg.features.length > 0 ? (
  pkg.features.map((feat, featIndex) => (
    <div key={featIndex} className="feature-row">
          <input type="text" placeholder="Feature" value={feat} onChange={(e) => handleFeatureChange(pkgIndex, featIndex, e.target.value)} />
          <button type="button" onClick={() => removeFeature(pkgIndex, featIndex)}>×</button>
        </div>
        ))
        ) : (
          <div>No features added</div>
        )}
      <button type="button" onClick={() => addFeature(pkgIndex)}>+ Add Feature</button>
      <hr />
      <button type="button" onClick={() => removePackage(pkgIndex)} className="remove-pkg-btn">Remove Package</button>
    </div>
  ))}
  <button type="button" onClick={addPackage} className="add-pkg-btn">+ Add New Package</button>

  <button type="submit" disabled={loading}>
    {loading ? "Processing..." : editingService ? "Update Service" : "Add Service"}
  </button>
</form>


      {/* Service Cards */}
      {/* Service Cards */}
<div className="service-cards">
  {services.map((service) => (
    <div key={service._id} className="service-card">
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <p className="price">${service.price}</p>

      {service.packages && service.packages.length > 0 && (
        <div className="package-list">
          <h4>Packages</h4>
          {service.packages.map((pkg, i) => (
            <div key={i} className="pkg-item">
              <strong>{pkg.name}</strong>: ${pkg.price}
              <ul>
                {pkg.features.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

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
      {/* Edit Service Modal (When editing) */}
{editingService && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Edit Service</h3>
      <form onSubmit={handleSubmit} className="service-form">
        <input
          type="text"
          name="name"
          placeholder="Service Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Service Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Service Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <h4>Packages</h4>
        {formData.packages && formData.packages.length > 0 && formData.packages.map((pkg, pkgIndex) => (
          <div key={pkgIndex} className="package-box">
            <input
              type="text"
              placeholder="Package Name"
              value={pkg.name}
              onChange={(e) =>
                handlePackageChange(pkgIndex, "name", e.target.value)
              }
              required
            />
            <input
              type="text"
              placeholder="Package Description"
              value={pkg.description}
              onChange={(e) =>
                handlePackageChange(pkgIndex, "description", e.target.value)
              }
              required
            />
            <input
              type="number"
              placeholder="Package Price"
              value={pkg.price}
              onChange={(e) =>
                handlePackageChange(pkgIndex, "price", e.target.value)
              }
              required
            />

            <h5>Features</h5>
            {pkg.features.map((feat, featIndex) => (
              <div key={featIndex} className="feature-row">
                <input
                  type="text"
                  placeholder="Feature"
                  value={feat}
                  onChange={(e) =>
                    handleFeatureChange(pkgIndex, featIndex, e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeFeature(pkgIndex, featIndex)}
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addFeature(pkgIndex)}>
              + Add Feature
            </button>
            <hr />
            <button
              type="button"
              onClick={() => removePackage(pkgIndex)}
              className="remove-pkg-btn"
            >
              Remove Package
            </button>
          </div>
        ))}
        <button type="button" onClick={addPackage} className="add-pkg-btn">
          + Add New Package
        </button>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Update Service"}
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => setEditingService(null)}
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
)}

    </div>
  );
}

export default AdminService;
