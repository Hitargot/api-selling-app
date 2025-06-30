import React, { useState, useEffect } from "react";
import { FaTimes, FaCopy, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiUrl from '../utils/api';

const BuyModal = ({ service, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    paymentMethod: "",
    receipt: null,
  });
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [countdown, setCountdown] = useState(30 * 60);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const packages = service?.packages || [];

  useEffect(() => {
    axios.get(`${apiUrl}/api/payments/payment`)
      .then((res) => setPaymentMethods(res.data))
      .catch((err) => console.error("Error fetching payment methods:", err));
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.id === "modal-backdrop") onClose();
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [onClose]); // ✅ fixed warning


  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "paymentMethod") {
      const selected = paymentMethods.find((m) => m.name === value);
      if (selected) {
        setSelectedPaymentMethod(selected);
        setCountdown(30 * 60);
      } else {
        toast.error("Invalid payment method selected.");
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      toast.error("Only image files are allowed!");
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB!");
      return;
    }
    setFormData((prev) => ({ ...prev, receipt: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 2) return setStep(3);
    if (step === 3) return setStep(4);
    if (step === 4 && formData.receipt) {
      try {
        setLoading(true);
        const data = new FormData();
        Object.entries({
          ...formData,
          serviceName: service.name,
          packageName: selectedPackage?.name,
          packageDescription: selectedPackage?.description,
          price: selectedPackage?.price || service.price
        }).forEach(([k, v]) => data.append(k, v));
        data.append("receipt", formData.receipt);
        data.append("packageFeatures", JSON.stringify(selectedPackage?.features || []));

        const res = await axios.post(`${apiUrl}/api/purchase`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(res.data.message);
        setTimeout(() => onClose(), 3000);
      } catch (err) {
        toast.error(err.response?.data?.error || "Error submitting purchase");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCopyAddress = () => {
    if (selectedPaymentMethod?.address) {
      navigator.clipboard.writeText(selectedPaymentMethod.address);
      toast.success("Address copied to clipboard!");
    }
  };

  return (
    <div
      id="modal-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 9999,
        overflowY: "auto",
        padding: "40px 16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >

      <div style={{
        backgroundColor: "#fff", borderRadius: 12, padding: 30, width: "100%", maxWidth: 1200,
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)", position: "relative"
      }}>
        <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#333" }}>
          <FaTimes />
        </button>


        {step === 1 && (
          <div
            style={{
              padding: "30px 16px",
              maxWidth: 1200,
              margin: "0 auto",
              position: "relative",
            }}
          >


            {/* Title */}
            <h2
              style={{
                fontSize: 32,
                fontWeight: "bold",
                marginBottom: 30,
                textAlign: "center",
                color: "#1b1b1b",
              }}
            >
              Choose Your Plan
            </h2>

            {/* Plan Cards */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 24,
                justifyContent: "center",
              }}
            >
              {packages.length === 0 ? (
                <p style={{ textAlign: "center", color: "#999" }}>No packages available for this service.</p>
              ) : (
                packages.map((pkg, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: 12,
                      width: 300,
                      padding: 24,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                      textAlign: "left",
                      transition: "all 0.3s ease",
                      animation: "fadeInUp 0.4s ease-in-out",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    {/* Name and Price */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ color: "#1DBF73", fontSize: 20, fontWeight: 700 }}>{pkg.name}</h3>
                      <p style={{ fontSize: 20, fontWeight: "bold", color: "#1b1b1b" }}>${pkg.price}</p>
                    </div>

                    {/* Description */}
                    <p style={{ margin: "10px 0", fontSize: 14, color: "#666" }}>{pkg.description}</p>

                    {/* Divider */}
                    <hr style={{ border: "none", height: 1, backgroundColor: "#eee", margin: "14px 0" }} />

                    {/* Features */}
                    <ul style={{ paddingLeft: 0, listStyle: "none", marginBottom: 20 }}>
                      {pkg.features.map((f, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: 14,
                            color: "#444",
                            marginBottom: 8,
                          }}
                        >
                          <FaCheckCircle style={{ color: "#1DBF73", marginRight: 8 }} />
                          {f}
                        </li>
                      ))}
                      {pkg.name !== "Starter" && (
                        <li style={{ display: "flex", alignItems: "center", color: "#444", fontSize: 14 }}>
                          <FaCheckCircle style={{ color: "#1DBF73", marginRight: 8 }} />
                          Premium Resources
                        </li>
                      )}
                      {pkg.name === "Enterprise" && (
                        <li style={{ display: "flex", alignItems: "center", color: "#444", fontSize: 14 }}>
                          <FaCheckCircle style={{ color: "#1DBF73", marginRight: 8 }} />
                          Dedicated Manager
                        </li>
                      )}
                    </ul>

                    {/* Get Started */}
                    <button
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setStep(2);
                      }}
                      style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#1DBF73",
                        color: "#fff",
                        fontWeight: 600,
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                        fontSize: 15,
                      }}
                    >
                      Get Started
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Animations */}
            <style>
              {`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .package-card {
            width: 90% !important;
            max-width: none !important;
          }
        }
      `}
            </style>
          </div>
        )}

        {step === 2 && (
          <div
            style={{
              maxWidth: 500,
              width: "90%",
              margin: "50px auto",
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              position: "relative",
              animation: "fadeInUp 0.4s ease-in-out",
            }}
          >
            {/* Back Arrow Button */}
            <button
              onClick={() => setStep(1)}
              style={{
                position: "absolute",
                left: 16,
                top: 16,
                fontSize: 20,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#333",
              }}
            >
              ←
            </button>

            <h2 style={{ textAlign: "center", marginBottom: 16 }}>Enter Your Details</h2>

            <p
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "#1DBF73",
                fontSize: 16,
                marginBottom: 24,
              }}
            >
              Selected Plan: {selectedPackage?.name} - ${selectedPackage?.price}/month
            </p>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 15 }}
            >
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                style={{
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "15px",
                }}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "15px",
                }}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "15px",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: "#1DBF73",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "14px",
                  fontSize: "15px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                }}
              >
                {loading ? "Loading..." : "Proceed to Payment"}
              </button>
            </form>

            {/* Animations */}
            <style>
              {`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}
            </style>
          </div>
        )}


        {step === 3 && (
          <div
            style={{
              maxWidth: 520,
              width: "90%",
              margin: "50px auto",
              background: "#fff",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
              position: "relative",
              animation: "fadeInUp 0.4s ease-in-out",
            }}
          >
            {/* Back Arrow */}
            <button
              onClick={() => setStep(2)}
              style={{
                position: "absolute",
                left: 16,
                top: 16,
                background: "transparent",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
                color: "#333",
              }}
            >
              ←
            </button>

            <h2 style={{ textAlign: "center", marginBottom: 20 }}>Select Payment Method</h2>

            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "15px",
                marginBottom: "20px",
              }}
            >
              <option value="">Choose Payment</option>
              {paymentMethods.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>

            {selectedPaymentMethod && (
              <div style={{ marginTop: 10 }}>
                <p style={{ marginBottom: 10 }}>
                  <strong>Amount to Pay:</strong>{" "}
                  <span style={{ fontWeight: "bold", color: "#1DBF73", fontSize: 16 }}>
                    ${selectedPackage?.price || service.price}
                  </span>

                </p>
                <p style={{ marginBottom: 8 }}>
                  <strong>Recipient:</strong> {formData.email}
                </p>
                <p style={{ marginBottom: 8 }}>
                  <strong>Wallet Address:</strong> {selectedPaymentMethod.address}
                </p>
                <p style={{ marginBottom: 16 }}>
                  <strong>Time Left:</strong> {formatCountdown()}
                </p>

                {selectedPaymentMethod.qrCode && (
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <img
                      src={`${apiUrl}${selectedPaymentMethod.qrCode}`}
                      alt="QR Code"
                      style={{ width: 180, marginBottom: 8 }}
                    />
                    <p style={{ fontSize: 14, color: "#666" }}>Scan this QR Code</p>
                    <button
                      onClick={handleCopyAddress}
                      disabled={loading}
                      style={{
                        background: "#f3f3f3",
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        padding: "10px 14px",
                        cursor: "pointer",
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 10,
                      }}
                    >
                      <FaCopy /> Copy Address
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setStep(4)}
                  disabled={loading}
                  style={{
                    backgroundColor: "#1DBF73",
                    color: "#fff",
                    border: "none",
                    padding: "14px",
                    width: "100%",
                    fontWeight: "bold",
                    fontSize: 15,
                    borderRadius: 6,
                    cursor: "pointer",
                    marginTop: 20,
                  }}
                >
                  {loading ? "Loading..." : "Payment Sent? Upload Receipt"}
                </button>
              </div>
            )}

            <style>
              {`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}
            </style>
          </div>
        )}
        {step === 4 && (
          <div
            style={{
              maxWidth: 500,
              width: "90%",
              margin: "50px auto",
              background: "#fff",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
              position: "relative",
              animation: "fadeInUp 0.4s ease-in-out",
            }}
          >
            {/* Back Arrow */}
            <button
              onClick={() => setStep(3)}
              style={{
                position: "absolute",
                left: 16,
                top: 16,
                background: "transparent",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
                color: "#333",
              }}
            >
              ←
            </button>

            <h2 style={{ textAlign: "center", marginBottom: 20 }}>Upload Payment Receipt</h2>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                marginBottom: 20,
              }}
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !formData.receipt}
              style={{
                backgroundColor: "#1DBF73",
                color: "#fff",
                border: "none",
                padding: "14px",
                width: "100%",
                fontWeight: "bold",
                fontSize: 15,
                borderRadius: 6,
                cursor: loading || !formData.receipt ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Submitting..." : "Submit Receipt"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BuyModal;