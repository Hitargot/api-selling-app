import React from "react";
import { FaEnvelope } from "react-icons/fa";
import theme from "../theme";

const Contact = () => {
  return (
    <section
      id="contact"
      style={{
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.surface,
        color: theme.colors.text,
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2
          style={{
            fontSize: theme.fontSizes.xlarge,
            marginBottom: theme.spacing.md,
            color: theme.colors.primary,
          }}
        >
          📬 Contact Us
        </h2>
        <p
          style={{
            fontSize: theme.fontSizes.base,
            color: theme.colors.muted,
            marginBottom: theme.spacing.lg,
          }}
        >
          Have questions or need help? We’d love to hear from you.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing.md,
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.sm }}>
            <FaEnvelope style={{ color: theme.colors.primaryDark }} />
            <a
              href="mailto:support@apimarket.com"
              style={{
                color: theme.colors.primary,
                textDecoration: "none",
                fontSize: theme.fontSizes.base,
              }}
            >
              support@apimarket.com
            </a>
          </div>

          {/* <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.sm }}>
            <FaPhone style={{ color: theme.colors.primaryDark }} />
            <span style={{ fontSize: theme.fontSizes.base }}>+1 (910) 734-6464</span>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Contact;
