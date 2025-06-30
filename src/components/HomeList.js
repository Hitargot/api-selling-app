import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  FaShoppingCart,
  FaShareAlt,
  FaArrowRight,
  FaHeart,
  FaCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BuyModal from "./BuyModal";
import apiUrl from "../utils/api";
import theme from "../theme";

function ApiList() {
  const [services, setServices] = useState([]);
  const [likedServices, setLikedServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedServiceId, setCopiedServiceId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceRatings, setServiceRatings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem("likedServices")) || {};
    setLikedServices(savedLikes);
  }, []);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/services/services`)
      .then((response) => {
        setServices(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load services");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const ratings = {};
    services.forEach((service) => {
      const storedRating = localStorage.getItem(`serviceRating_${service._id}`);
      const storedReviews = localStorage.getItem(`serviceReviews_${service._id}`);

      if (storedRating && storedReviews) {
        ratings[service._id] = {
          rating: parseFloat(storedRating),
          reviews: parseInt(storedReviews),
        };
      } else {
        const generatedRating = (4.2 + Math.random() * 0.8).toFixed(1);
        const generatedReviews = Math.floor(Math.random() * 11) + 4;

        localStorage.setItem(`serviceRating_${service._id}`, generatedRating);
        localStorage.setItem(`serviceReviews_${service._id}`, generatedReviews);

        ratings[service._id] = {
          rating: generatedRating,
          reviews: generatedReviews,
        };
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
      text: `${service.name} - ${service.description}\nPrice: $${service.price}`,
      url: `${window.location.origin}/services?search=${service._id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
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
    <section id="api-list" style={{ padding: theme.spacing.xl }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ fontSize: theme.fontSizes.large, color: theme.colors.text, marginBottom: theme.spacing.md }}>
          Popular APIs
        </h2>

        {loading ? (
          <p style={{ color: theme.colors.muted }}>Loading services...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: theme.spacing.lg,
                justifyContent: "center",
              }}
            >
              {randomServices.map((service) => {
                const { rating, reviews } = serviceRatings[service._id] || {
                  rating: "N/A",
                  reviews: "N/A",
                };

                return (
                  <div
                    key={service._id}
                    style={{
                      flex: "1 1 300px",
                      backgroundColor: theme.colors.surface,
                      padding: theme.spacing.lg,
                      borderRadius: theme.borderRadius.large,
                      boxShadow: theme.shadows.card,
                      transition: "transform 0.2s ease",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <h3 style={{ fontSize: theme.fontSizes.medium, marginBottom: "10px", color: theme.colors.text }}>
                      {service.name}
                    </h3>
                    <div style={{ fontSize: "0.9rem", marginBottom: "10px", color: "#444" }}>
                      ⭐ {rating} ({reviews} reviews)
                    </div>
                    <p style={{ color: theme.colors.muted, marginBottom: "10px" }}>
                      {service.description}
                    </p>
                    <p style={{ fontWeight: "bold", color: theme.colors.text }}>
                      ${service.price}
                    </p>

                    <div style={{ display: "flex", gap: "10px", marginTop: theme.spacing.sm }}>
                      <button
                        onClick={() => shareService(service)}
                        style={{
                          flex: 1,
                          backgroundColor: theme.colors.background,
                          border: `1px solid ${theme.colors.primary}`,
                          color: theme.colors.primary,
                          borderRadius: theme.borderRadius.base,
                          padding: "8px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        {copiedServiceId === service._id ? (
                          <>
                            <FaCheck /> Copied
                          </>
                        ) : (
                          <>
                            <FaShareAlt /> Share
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setSelectedService(service)}
                        style={{
                          flex: 1,
                          backgroundColor: theme.colors.primary,
                          border: "none",
                          color: "#fff",
                          borderRadius: theme.borderRadius.base,
                          padding: "8px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        <FaShoppingCart /> Buy
                      </button>
                    </div>

                    {/* Like Icon */}
                    <FaHeart
                      onClick={() => toggleFavorite(service._id)}
                      style={{
                        position: "absolute",
                        top: 15,
                        right: 15,
                        cursor: "pointer",
                        color: likedServices[service._id] ? "red" : "#ccc",
                        fontSize: "1.4rem",
                        transition: "transform 0.2s ease-in-out",
                      }}
                      onMouseDown={(e) => (e.target.style.transform = "scale(1.3)")}
                      onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
                    />
                  </div>
                );
              })}
            </div>

            {/* See More */}
            <div style={{ textAlign: "center", marginTop: theme.spacing.xl }}>
              <button
                onClick={() => navigate("/services")}
                style={{
                  backgroundColor: theme.colors.primary,
                  color: "#fff",
                  padding: "12px 24px",
                  fontSize: "1rem",
                  borderRadius: theme.borderRadius.base,
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                See More <FaArrowRight />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Buy Modal */}
      {selectedService && (
        <BuyModal
          service={selectedService}
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          onConfirm={() => setSelectedService(null)}
        />
      )}
    </section>
  );
}

export default ApiList;
