import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Simple fade-in on mount
        setTimeout(() => setVisible(true), 100);
    }, []);

    return (
        <section
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "100px 20px",
                background: "linear-gradient(to right, #1e3c72, #2a5298)",
                color: "#fff",
                transition: "opacity 1s ease",
                opacity: visible ? 1 : 0,
                backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
                backgroundSize: "auto",
            }}
        >
            <h1
                style={{
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    fontWeight: "bold",
                    marginBottom: "20px",
                    lineHeight: 1.2,
                }}
            >
                Buy API Keys Instantly ⚡
            </h1>
            <p
                style={{
                    fontSize: "clamp(1rem, 2vw, 1.25rem)",
                    maxWidth: "700px",
                    marginBottom: "30px",
                    lineHeight: 1.6,
                }}
            >
                Choose your preferred API, pay securely, and receive your key in seconds.
                Fast, easy, and developer-friendly 🔐.
            </p>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
                <button
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "#ff6b00",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "1rem",
                        cursor: "pointer",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                        transition: "background 0.3s ease",
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = "#e55e00"}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = "#ff6b00"}
                    onClick={() => navigate("/services")}
                    >
                    🚀 View Packages
                </button>

                <button
                    style={{
                        padding: "12px 24px",
                        backgroundColor: "transparent",
                        border: "2px solid #fff",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "1rem",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.backgroundColor = "#fff";
                        e.currentTarget.style.color = "#2a5298";
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#fff";
                    }}
                >
                    💬 Contact Us
                </button>
            </div>
        </section>
    );
}

export default Hero;
