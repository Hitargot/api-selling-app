import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaShareAlt, FaHeart, FaCheck, FaSearch, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate for navigation
import BuyModal from "./BuyModal";
import "./UserServices.css";

function UserServices() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [likedServices, setLikedServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedServiceId, setCopiedServiceId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const apiUrl = "https://new-app-site-a384f2c56775.herokuapp.com";
  //const apiUrl = "http://localhost:5000";

  const navigate = useNavigate(); // ✅ Hook for navigation

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem("likedServices")) || {};
    setLikedServices(savedLikes);
  }, []);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/services/services`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setServices(response.data);
          setFilteredServices(response.data); // ✅ Initialize filteredServices with all services
        } else {
          console.error("❌ API did not return an array!", response.data);
          setError("Invalid data format from API");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error fetching services:", error);
        setError("Failed to load services");
        setLoading(false);
      });
  }, [apiUrl]);

  const toggleFavorite = (id) => {
    const updatedLikes = { ...likedServices, [id]: !likedServices[id] };
    setLikedServices(updatedLikes);
    localStorage.setItem("likedServices", JSON.stringify(updatedLikes));
  };

  const shareService = async (service) => {
    const shareData = {
      title: service.name,
      text: `${service.name} - ${service.description}\nPrice: $${service.price}`,
      url: `${window.location.origin}/service/${service._id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("✅ Service shared successfully");
      } catch (error) {
        console.error("❌ Share failed:", error);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      setCopiedServiceId(service._id);
      setTimeout(() => setCopiedServiceId(null), 2000);
    }
  };

  const handleBuyClick = (service) => {
    setSelectedService(service);
  };

  const handleConfirmPurchase = (service) => {
    alert(`You have purchased: ${service.name}`);
    setSelectedService(null);
  };

  // ✅ Handle search filtering
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = services.filter((service) =>
      service.name.toLowerCase().includes(term) || service.description.toLowerCase().includes(term)
    );
    setFilteredServices(filtered);
  };

  return (
    <div>
      <div className="header-container">
        {/* ✅ Home Button */}
        <button className="home-btn" onClick={() => navigate("/")}>
          <FaHome /> Home
        </button>

        {/* ✅ Search Bar */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <h2>Available Services</h2>

      {loading ? (
        <p>Loading services...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredServices.length > 0 ? (
        <div className="service-list">
          {filteredServices.map((service) => (
            <div key={service._id} className="service-card">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <p><strong>Price:</strong> ${service.price}</p>
              <p>⭐ {service.averageRating?.toFixed(1) || "0.0"} ({service.totalReviews || 0} reviews)</p>

              <div className="btn-group">
                <button className="share-btn" onClick={() => shareService(service)}>
                  {copiedServiceId === service._id ? <><FaCheck style={{ color: "green" }} /> Copied!</> : <><FaShareAlt /> Share</>}
                </button>
                <button className="buy-btn" onClick={() => handleBuyClick(service)}>
                  <FaShoppingCart /> Buy
                </button>
              </div>

              <FaHeart
                className="favorite-icon"
                onClick={() => toggleFavorite(service._id)}
                style={{ cursor: "pointer", color: likedServices[service._id] ? "red" : "gray", fontSize: "1.5rem", marginTop: "10px" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No services found</p>
      )}

      {/* ✅ Buy Modal */}
      {selectedService && (
        <BuyModal
          service={selectedService}
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          onConfirm={handleConfirmPurchase}
        />
      )}
    </div>
  );
}

export default UserServices;
