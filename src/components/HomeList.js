import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaShareAlt, FaArrowRight, FaHeart, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ApiList.css";
import BuyModal from "./BuyModal"; // ✅ Import BuyModal

function ApiList() {
  const [services, setServices] = useState([]);
  const [likedServices, setLikedServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedServiceId, setCopiedServiceId] = useState(null);
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const apiUrl = "https://new-app-site-a384f2c56775.herokuapp.com";
  // const apiUrl = "http://localhost:5000";

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem("likedServices")) || {};
    setLikedServices(savedLikes);
  }, []);

  useEffect(() => {
    axios.get(`${apiUrl}/api/services/services`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setServices(response.data);
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
  }, []);

  const getRandomServices = (servicesArray) => {
    if (!Array.isArray(servicesArray) || servicesArray.length === 0) return [];
    return [...servicesArray].sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  const randomServices = getRandomServices(services);

  const toggleFavorite = (id) => {
    const updatedLikes = { ...likedServices, [id]: !likedServices[id] };
    setLikedServices(updatedLikes);
    localStorage.setItem("likedServices", JSON.stringify(updatedLikes));
  };

  const shareService = async (service) => {
    const shareData = {
      title: service.name,
      text: `${service.name} - ${service.description}\nPrice: $${service.price}\nCheck it out here:`,
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

  return (
    <section id="api-list">
      <div className="api-card-container">
        <h2>Popular APIs</h2>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading services...</p>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <div className="service-grid">
              {randomServices.map((service) => (
                <div key={service._id} className="api-card">
                  <h3>{service.name}</h3>
                  <div className="rating">
                    ⭐ {service.averageRating?.toFixed(1) || "0.0"}
                    <span>({service.totalReviews || 0} reviews)</span>
                  </div>
                  <p className="description">{service.description}</p>
                  <p><strong>Price:</strong> ${service.price}</p>

                  <div className="btn-group">
                    {/* ✅ Share Button */}
                    <button className="share-btn" onClick={() => shareService(service)}>
                      {copiedServiceId === service._id ? (
                        <>
                          <FaCheck style={{ color: "green" }} /> Copied!
                        </>
                      ) : (
                        <>
                          <FaShareAlt /> Share
                        </>
                      )}
                    </button>
                    <button className="buy-btn" onClick={() => handleBuyClick(service)}>
                      <FaShoppingCart /> Buy
                    </button>
                  </div>

                  <FaHeart
                    className="favorite-icon"
                    onClick={() => toggleFavorite(service._id)}
                    style={{
                      cursor: "pointer",
                      color: likedServices[service._id] ? "red" : "gray",
                      fontSize: "1.5rem",
                      marginTop: "10px",
                    }}
                    aria-label="Toggle Favorite"
                  />
                </div>
              ))}
            </div>

            <div className="see-more-container">
              <button className="see-more-btn" onClick={() => navigate("/services")}>
                See More <FaArrowRight />
              </button>
            </div>
          </>
        )}

        {selectedService && (
          <BuyModal
            service={selectedService}
            isOpen={!!selectedService}
            onClose={() => setSelectedService(null)}
            onConfirm={() => setSelectedService(null)}
          />
        )}
      </div>
    </section>
  );
}

export default ApiList;
