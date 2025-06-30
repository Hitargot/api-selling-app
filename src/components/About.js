import React from "react";
import { FaShieldAlt, FaPlug, FaRocket } from "react-icons/fa";
import theme from "../theme";

function About() {
  const features = [
    {
      icon: <FaShieldAlt size={24} color={theme.colors.primary} />,
      title: "Secure & Reliable",
      description: "Every API is monitored and optimized for enterprise-grade stability and uptime.",
    },
    {
      icon: <FaPlug size={24} color={theme.colors.primary} />,
      title: "Plug-and-Play APIs",
      description: "No complex setup. Start integrating in minutes with clear, concise documentation.",
    },
    {
      icon: <FaRocket size={24} color={theme.colors.primary} />,
      title: "Built for Scale",
      description: "Whether you serve 100 users or 10 million, our infrastructure scales with you.",
    },
  ];

  return (
    <section
      id="about"
      style={{
        padding: `${theme.spacing.xl} ${theme.spacing.md}`,
        backgroundColor: theme.colors.background,
        borderTop: `1px solid #eee`,
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: theme.fontSizes.large,
            marginBottom: theme.spacing.sm,
            color: theme.colors.text,
          }}
        >
          Why Choose Us
        </h2>
        <p
          style={{
            fontSize: theme.fontSizes.base,
            color: theme.colors.muted,
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: 1.8,
            marginBottom: theme.spacing.xl,
          }}
        >
          We are committed to delivering APIs that empower developers to build faster, smarter, and more securely. From authentication to integration, we prioritize quality at every layer.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: theme.spacing.lg,
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                flex: "1 1 280px",
                background: "rgba(255, 255, 255, 0.95)",
                border: `1px solid #eee`,
                borderRadius: theme.borderRadius.large,
                padding: theme.spacing.lg,
                boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                transition: "all 0.3s ease",
                textAlign: "left",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.04)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ marginBottom: theme.spacing.sm }}>{feature.icon}</div>
              <h3 style={{ fontSize: theme.fontSizes.medium, color: theme.colors.text, marginBottom: "8px" }}>
                {feature.title}
              </h3>
              <p style={{ color: theme.colors.muted, fontSize: theme.fontSizes.small, lineHeight: 1.6 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
