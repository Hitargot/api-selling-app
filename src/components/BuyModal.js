import React, { useState, useEffect } from "react";
import { FaTimes, FaCopy } from "react-icons/fa";
import axios from "axios";
import "./BuyModal.css";
import Alert from "./Alert";

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
    const [alert, setAlert] = useState({ message: "", type: "" });
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [countdown, setCountdown] = useState(30 * 60);
      //   const apiUrl = "https://api-selling-app-95e637847b06.herokuapp.com";
const apiUrl = "http://localhost:5000";

    // Fetch payment methods from the backend
    useEffect(() => {
        axios
            .get(`${apiUrl}/api/payments`)
            .then((response) => setPaymentMethods(response.data))
            .catch((error) => console.error("Error fetching payment methods:", error));
    }, [apiUrl]);

    // Countdown Timer Effect
    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    // Format Countdown Time
    const formatCountdown = () => {
        const minutes = Math.floor(countdown / 60);
        const seconds = countdown % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "paymentMethod") {
            const selectedMethod = paymentMethods.find((method) => method.name === value);
            if (selectedMethod) {
                setSelectedPaymentMethod(selectedMethod);
                setCountdown(30 * 60);
                setAlert({ message: "", type: "" }); // Clear alert when valid payment is selected
            } else {
                setAlert({ message: "Invalid payment method selected.", type: "error" });
            }
        }
    };

    // Handle File Selection for Receipt Upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        // Validate file type (only images allowed)
        if (file && !file.type.startsWith("image/")) {
            setAlert({ message: "Only image files are allowed!", type: "error" });
            return;
        }

        // Validate file size (e.g., max 5MB)
        if (file && file.size > 5 * 1024 * 1024) {
            setAlert({ message: "File size must be under 5MB!", type: "error" });
            return;
        }

        setFormData((prev) => ({ ...prev, receipt: file }));
        setAlert({ message: "", type: "" });
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 2) {
            setStep(3);
        } else if (step === 3) {
            setStep(4);
        } else if (step === 4) {
            if (!formData.receipt) {
                setAlert({ message: "Please upload a receipt!", type: "error" });
                return;
            }
    
            try {
                setLoading(true);
                const formDataToSend = new FormData();
                formDataToSend.append("fullName", formData.fullName);
                formDataToSend.append("email", formData.email);
                formDataToSend.append("phone", formData.phone);
                formDataToSend.append("paymentMethod", formData.paymentMethod);
                formDataToSend.append("serviceName", service.name);
                formDataToSend.append("price", service.price);
                formDataToSend.append("receipt", formData.receipt);
    
                const response = await axios.post(`${apiUrl}/api/purchase`, formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
    
                setAlert({ message: response.data.message, type: "success" });
    
                // Wait for 3 seconds before closing the modal
                setTimeout(() => {
                    setAlert({ message: "", type: "" }); // Clear the alert
                    onClose(); // Close the modal
                }, 3000);
    
            } catch (error) {
                setAlert({
                    type: "error",
                    message: error.response ? error.response.data.error : "Error submitting purchase",
                });
            } finally {
                setLoading(false);
            }
        }
    };
    
    useEffect(() => {
        console.log("Alert state:", alert);
    }, [alert, apiUrl]);
    
    // Copy Address to Clipboard
    const handleCopyAddress = () => {
        if (selectedPaymentMethod?.address) {
            navigator.clipboard.writeText(selectedPaymentMethod.address);
            setAlert({ message: "Address copied to clipboard!", type: "success" });
    
            // Clear the alert after 2 seconds
            setTimeout(() => {
                setAlert({ message: "", type: "" });
            }, 3000);
        }
    };
    

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>
                    <FaTimes />
                </button>

                {alert.message && (
    <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: "", type: "" })} />
)}


                {step === 1 && (
                    <>
                        <h2>Confirm Purchase</h2>
                        <p><strong>Service:</strong> {service.name}</p>
                        <p><strong>Description:</strong> {service.description}</p>
                        <p><strong>Price:</strong> ${service.price}</p>
                        <div className="modal-buttons">
                            <button className="confirm-btn" onClick={() => setStep(2)} disabled={loading}>
                                {loading ? "Loading..." : "Confirm Purchase"}
                            </button>
                            <button className="close-btn" onClick={onClose}>
                                <FaTimes />
                            </button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2>Enter Your Details</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                required
                                onChange={handleChange}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                required
                                onChange={handleChange}
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                required
                                onChange={handleChange}
                            />
                            <button type="submit" className="confirm-btn" disabled={loading}>
                                {loading ? "Loading..." : "Proceed to Payment"}
                            </button>
                        </form>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2 className="section-title">Select Payment Method</h2>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="payment-select"
                        >
                            <option value="">Choose Payment</option>
                            {paymentMethods.map((method) => (
                                <option key={method.name} value={method.name}>
                                    {method.name}
                                </option>
                            ))}
                        </select>
                        {selectedPaymentMethod && (
                            <div className="crypto-details">
                                <p><strong>Amount to Pay:</strong> ${service.price}</p>
                                <p><strong>Recipient:</strong> {formData.email}</p>
                                <p><strong>Payment Method:</strong> Crypto currency</p>
                                <p><strong>Wallet Address:</strong> {selectedPaymentMethod.address}</p>
                                <p><strong>Time Left:</strong> {formatCountdown()}</p>
                                {selectedPaymentMethod.qrCode && (
                                    <div className="qr-code-section">
                                        <img
                                            src={`http://localhost:5000${selectedPaymentMethod.qrCode}`}
                                            alt="QR Code"
                                            className="qr-code-img"
                                        />
                                        <p className="qr-text">Scan QR Code</p>
                                        <button onClick={handleCopyAddress} className="copy-btn" disabled={loading}>
                                            <FaCopy /> Copy Address
                                        </button>
                                    </div>
                                )}

                                <button onClick={() => setStep(4)} className="confirm-btn" disabled={loading}>
                                    {loading ? "Loading..." : "Payment Sent? Upload Receipt"}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {step === 4 && (
                    <>
                        <h2>Upload Payment Receipt</h2>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            disabled={loading}
                        />
                        <button
                            onClick={handleSubmit}
                            className="confirm-btn"
                            disabled={loading || !formData.receipt} // Disable if loading or no receipt uploaded
                        >
                            {loading ? "Submitting..." : "Submit Receipt"}
                        </button>

                    </>
                )}
            </div>
        </div>
    );
};

export default BuyModal;