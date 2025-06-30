import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaShoppingCart,
  FaShareAlt,
  FaHeart,
  FaCheck,
  FaSearch,
  FaHome,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import BuyModal from "./BuyModal";
import apiUrl from "../utils/api";
import theme from "../theme";
import logo from "../assets/logoo.png"; // adjust the path as needed

function UserServices() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [likedServices, setLikedServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedServiceId, setCopiedServiceId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [searchParams] = useSearchParams();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const navigate = useNavigate();

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
          setFilteredServices(response.data);
        } else {
          setError("Invalid data format from API");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load services");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const query = searchParams.get("search");
    if (query && services.length > 0) {
      setSearchTerm(query);
      const filtered = services.filter((service) =>
        service._id.includes(query)
      );
      setFilteredServices(filtered);
    }
  }, [searchParams, services]);

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
      } catch (error) {}
    } else {
      navigator.clipboard.writeText(shareData.url);
      setCopiedServiceId(service._id);
      setTimeout(() => setCopiedServiceId(null), 2000);
    }
  };

  const handleBuyClick = (service) => setSelectedService(service);
  const handleConfirmPurchase = () => setSelectedService(null);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = services.filter((service) =>
      service.name.toLowerCase().includes(term) ||
      service.description.toLowerCase().includes(term)
    );
    setFilteredServices(filtered);
  };

  const getServiceRatingAndReviews = (id) => {
    const r = localStorage.getItem(`serviceRating_${id}`);
    const v = localStorage.getItem(`serviceReviews_${id}`);
    if (r && v) return { rating: parseFloat(r), reviews: parseInt(v) };
    const newRating = (4.2 + Math.random() * 0.8).toFixed(1);
    const newReviews = Math.floor(Math.random() * 11) + 4;
    localStorage.setItem(`serviceRating_${id}`, newRating);
    localStorage.setItem(`serviceReviews_${id}`, newReviews);
    return { rating: newRating, reviews: newReviews };
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  const backgroundColor = darkMode ? "#121212" : "#fff";
  const textColor = darkMode ? "#f0f0f0" : "#000";
  const cardBackground = darkMode ? "#1e1e1e" : "#fff";
  const borderColor = darkMode ? "#333" : "#eee";

  return (
    <div style={{ backgroundColor, color: textColor, minHeight: "100vh", transition: "all 0.3s ease" }}>
      <div style={{ padding: "20px", borderBottom: `1px solid ${borderColor}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1100px", margin: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <img src={logo} alt="API Marketplace Logo" style={{ height: 70 }} />
      <div>
        <h2 style={{ margin: 0, color: theme.colors.primary }}>API Marketplace</h2>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
          Explore and buy APIs instantly
        </p>
      </div>
    </div>  
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <FaHome
              onClick={() => navigate("/")}
              style={{ cursor: "pointer", color: theme.colors.primary, fontSize: "1.2rem" }}
              title="Go to Home"
            />
            {darkMode ? (
              <FaSun
                onClick={toggleDarkMode}
                style={{ cursor: "pointer", color: "#fdd835", fontSize: "1.2rem" }}
                title="Switch to Light Mode"
              />
            ) : (
              <FaMoon
                onClick={toggleDarkMode}
                style={{ cursor: "pointer", color: "#333", fontSize: "1.2rem" }}
                title="Switch to Dark Mode"
              />
            )}
          </div>
        </div>

        <div style={{ marginTop: "16px", maxWidth: "600px", marginInline: "auto", display: "flex", alignItems: "center", backgroundColor: darkMode ? "#2a2a2a" : "#f2f2f2", borderRadius: "8px", padding: "8px 12px" }}>
          <FaSearch style={{ marginRight: "8px", color: "#888" }} />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              width: "100%",
              fontSize: "1rem",
              color: textColor,
            }}
          />
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        {loading ? (
          <p>Loading services...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {filteredServices.map((service) => {
              const { rating, reviews } = getServiceRatingAndReviews(service._id);
              return (
                <div
                  key={service._id}
                  style={{
                    backgroundColor: cardBackground,
                    border: `1px solid ${borderColor}`,
                    borderRadius: "12px",
                    padding: "16px",
                    boxShadow: darkMode ? "0 2px 10px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.05)",
                    position: "relative",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0px)"}
                >
                  <h3>{service.name}</h3>
                  <p style={{ color: darkMode ? "#ccc" : "#555", fontSize: "0.95rem" }}>{service.description}</p>
                  <p style={{ fontWeight: "bold", color: theme.colors.primary }}>${service.price}</p>
                  <p style={{ fontSize: "0.9rem", color: darkMode ? "#aaa" : "#777" }}>⭐ {rating} ({reviews} reviews)</p>
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                      onClick={() => shareService(service)}
                      style={{
                        flex: 1,
                        background: darkMode ? "#333" : "#f8f8f8",
                        border: `1px solid ${borderColor}`,
                        borderRadius: "6px",
                        padding: "8px",
                        cursor: "pointer",
                        color: textColor,
                      }}
                    >
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
                    <button
                      onClick={() => handleBuyClick(service)}
                      style={{
                        flex: 1,
                        background: theme.colors.primary,
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <FaShoppingCart /> Buy
                    </button>
                  </div>
                  <FaHeart
                    onClick={() => toggleFavorite(service._id)}
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      color: likedServices[service._id] ? "red" : "#ccc",
                      fontSize: "1.4rem",
                      cursor: "pointer",
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

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
