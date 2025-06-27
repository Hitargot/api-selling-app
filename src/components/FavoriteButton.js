import React, { useState } from "react";
import axios from "axios";
import apiUrl from "../utils/api";

function FavoriteButton({ serviceId }) {
  const [favorited, setFavorited] = useState(false);

  const toggleFavorite = async () => {
    setFavorited(!favorited);
    await axios.post(`${apiUrl}/api/services/${serviceId}/favorite`, {}, {
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
