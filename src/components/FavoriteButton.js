import React, { useState } from "react";
import axios from "axios";

function FavoriteButton({ serviceId }) {
  const [favorited, setFavorited] = useState(false);

  const toggleFavorite = async () => {
    setFavorited(!favorited);
    await axios.post(`http://localhost:5000/api/services/${serviceId}/favorite`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
  };

  return (
    <button onClick={toggleFavorite} style={{ color: favorited ? "red" : "gray" }}>
      ❤️ {favorited ? "Favorited" : "Favorite"}
    </button>
  );
}

export default FavoriteButton;
