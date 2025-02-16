import React, { useState } from "react";
import axios from "axios";

function ReviewForm({ serviceId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:5000/api/services/${serviceId}/review`, {
      rating,
      comment
    }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

    alert("Review added!");
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={rating} onChange={e => setRating(e.target.value)}>
        {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} Stars</option>)}
      </select>
      <input type="text" placeholder="Your review" value={comment} onChange={e => setComment(e.target.value)} />
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default ReviewForm;
