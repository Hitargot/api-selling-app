import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from '../components/Alert'; // Import your Alert component
import '../AdminStyle/AdminPurchase.css';
import apiUrl from '../utils/api';

const AdminPurchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [modalData, setModalData] = useState(null);
  

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/admin/purchases`);
        const sortedPurchases = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPurchases(sortedPurchases);
        setLoading(false);
      } catch (err) {
        setAlert({ message: 'Error fetching purchases', type: 'error' });
        setLoading(false);
      }
    };
    fetchPurchases();
  });

  const handleStatusChange = async (purchaseId, status) => {
    try {
      const response = await axios.post(`${apiUrl}/api/admin/purchase/status`, {
        purchaseId,
        status,
      });
  
      // Update the purchase status locally
      setPurchases((prevPurchases) =>
        prevPurchases.map((purchase) =>
          purchase._id === purchaseId ? { ...purchase, status } : purchase
        )
      );
  
      // Show success alert
      setAlert({ message: response.data.message, type: 'success' });
      
      // Clear modal data
      setModalData(null);
    } catch (error) {
      console.error('Error updating purchase status:', error);
  
      // Improved error handling
      const errorMessage = error.response?.data?.message || 'Failed to update status.';
      setAlert({ message: errorMessage, type: 'error' });
    }
  };
  

  const openModal = (purchaseId, status) => {
    setModalData({ purchaseId, status });
  };

  const closeModal = () => {
    setModalData(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-purchase-container">
      <h1>Admin Purchase</h1>
      {alert.message && <Alert message={alert.message} type={alert.type} />} {/* Display alert here */}
      <div className="purchase-list">
        {purchases.map((purchase) => (
          <div key={purchase._id} className="purchase-card">
            <h3>{purchase.serviceName}</h3>
            <p><strong>Price:</strong> ${purchase.price}</p>
            <p><strong>Payment Method:</strong> {purchase.paymentMethod}</p>
            <p><strong>Status:</strong> {purchase.status}</p>
            <p><strong>Full Name:</strong> {purchase.fullName}</p>
            <p><strong>Phone:</strong> {purchase.phone}</p>
            <p><strong>Email:</strong> {purchase.email}</p>
            <p><strong>Submitted At:</strong> {new Date(purchase.createdAt).toLocaleString()}</p>
            <div className="purchase-actions">
              {purchase.status === 'pending' ? (
                <>
                  <button onClick={() => openModal(purchase._id, 'accepted')} className="approve-btn">
                    Approve
                  </button>
                  <button onClick={() => openModal(purchase._id, 'rejected')} className="reject-btn">
                    Reject
                  </button>
                </>
              ) : (
                <span className="completed-status">Completed</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {modalData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to {modalData.status} this purchase?</p>
            <div className="modal-buttons">
              <button onClick={() => handleStatusChange(modalData.purchaseId, modalData.status)} className="confirm-btn">
                Yes
              </button>
              <button onClick={closeModal} className="cancel-btn">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPurchase;
