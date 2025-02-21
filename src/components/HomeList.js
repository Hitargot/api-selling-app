import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaShoppingCart, FaShareAlt, FaArrowRight, FaHeart, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./HomeList.css";
import BuyModal from "./BuyModal";

function ApiList() {
  const [services, setServices] = useState([]);
  const [likedServices, setLikedServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedServiceId, setCopiedServiceId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceRatings, setServiceRatings] = useState({});
  const navigate = useNavigate();
  
  const apiUrl = "https://new-app-site-a384f2c56775.herokuapp.com";
  // const apiUrl = "http://localhost:5000";

  useEffect(() => {
    // Load liked services from localStorage
    const savedLikes = JSON.parse(localStorage.getItem("likedServices")) || {};
    setLikedServices(savedLikes);
  }, []);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/services/services`)
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

  useEffect(() => {
    // Store service ratings and reviews in state to avoid re-calculating on each render
    const ratings = {};
    services.forEach((service) => {
      const storedRating = localStorage.getItem(`serviceRating_${service._id}`);
      const storedReviews = localStorage.getItem(`serviceReviews_${service._id}`);

      if (storedRating && storedReviews) {
        ratings[service._id] = { rating: parseFloat(storedRating), reviews: parseInt(storedReviews) };
      } else {
        const generatedRating = (4.2 + Math.random() * (5 - 4.2)).toFixed(1);
        const generatedReviews = Math.floor(Math.random() * (14 - 4 + 1)) + 4;

        localStorage.setItem(`serviceRating_${service._id}`, generatedRating);
        localStorage.setItem(`serviceReviews_${service._id}`, generatedReviews);

        ratings[service._id] = { rating: generatedRating, reviews: generatedReviews };
      }
    });
    setServiceRatings(ratings);
  }, [services]);

  const randomServices = useMemo(() => {
    return [...services].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [services]);

  const toggleFavorite = (id) => {
    const updatedLikes = { ...likedServices, [id]: !likedServices[id] };
    setLikedServices(updatedLikes);
    localStorage.setItem("likedServices", JSON.stringify(updatedLikes));
  };

  const shareService = async (service) => {
    const shareData = {
      title: service.name,
      text: `${service.name} - ${service.description}\nPrice: $${service.price}\nCheck it out here:`,
      url: `${window.location.origin}/services?search=${service._id}`,
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

  return (
    <section id="api-list">
      <div className="api-card-container">
        <h2>Popular APIs</h2>

        {loading ? (
          <div className="loading-container">
            <div className="skeleton-loader"></div>
            <p>Loading services...</p>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <div className="service-grid">
              {randomServices.map((service) => {
                const { rating, reviews } = serviceRatings[service._id] || {
                  rating: "N/A",
                  reviews: "N/A",
                };
                return (
                  <div key={service._id} className="api-card">
                    <h3>{service.name}</h3>
                    <div className="rating">
                      ⭐ {rating} ({reviews} reviews)
                    </div>
                    <p className="description">{service.description}</p>
                    <p><strong>Price:</strong> ${service.price}</p>

                    <div className="btn-group">
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
                      <button className="buy-btn" onClick={() => setSelectedService(service)}>
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
                        transition: "transform 0.2s ease-in-out",
                      }}
                      onMouseDown={(e) => (e.target.style.transform = "scale(1.2)")}
                      onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
                      aria-label="Toggle Favorite"
                    />
                  </div>
                );
              })}
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
