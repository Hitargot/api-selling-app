import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ApiList from "../components/HomeList";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import theme from "../theme"; // 👈 Import the theme file
import { useNavigate } from "react-router-dom";

function Hero() {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
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
                padding: theme.spacing.xl,
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                opacity: visible ? 1 : 0,
                transition: "opacity 1s ease-in-out",
            }}
        >
            <h1
                style={{
                    fontSize: theme.fontSizes.xlarge,
                    fontWeight: "bold",
                    marginBottom: theme.spacing.md,
                    lineHeight: 1.2,
                }}
            >
                Buy API Keys Instantly ⚡
            </h1>
            <p
                style={{
                    fontSize: theme.fontSizes.base,
                    color: theme.colors.muted,
                    maxWidth: "700px",
                    marginBottom: theme.spacing.lg,
                    lineHeight: 1.6,
                }}
            >
                Choose your preferred API, pay securely, and receive your key in seconds.
                Fast, easy, and developer-friendly.
            </p>
            <div style={{ display: "flex", gap: theme.spacing.md, flexWrap: "wrap", justifyContent: "center" }}>
                <button
                    style={{
                        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                        backgroundColor: theme.colors.primary,
                        border: "none",
                        borderRadius: theme.borderRadius.base,
                        color: "#fff",
                        fontSize: theme.fontSizes.base,
                        cursor: "pointer",
                        boxShadow: theme.shadows.hover,
                        transition: "background-color 0.3s",
                    }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = theme.colors.primaryDark)}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = theme.colors.primary)}
                    onClick={() => navigate("/services")}
                >
                    🚀 View Packages
                </button>
                <button
                    style={{
                        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                        backgroundColor: "transparent",
                        border: `2px solid ${theme.colors.primary}`,
                        borderRadius: theme.borderRadius.base,
                        color: theme.colors.primary,
                        fontSize: theme.fontSizes.base,
                        cursor: "pointer",
                        transition: "all 0.3s",
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.primary;
                        e.currentTarget.style.color = "#fff";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = theme.colors.primary;
                    }}
                    onClick={() => {
                        const section = document.getElementById("contact");
                        section?.scrollIntoView({ behavior: "smooth" });
                    }}
                >
                    💬 Contact Us
                </button>

            </div>
        </section>
    );
}

function Home() {
    return (
        <div>
            <Header />
            <main>
                <Hero />
                <ApiList />
                <About />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}

export default Home;
