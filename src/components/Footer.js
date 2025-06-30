import React from "react";
import theme from "../theme";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: theme.colors.footer,
        color: theme.colors.footerText,
        textAlign: "center",
        padding: theme.spacing.lg,
        marginTop: "auto",
        fontSize: theme.fontSizes.small,
      }}
    >
      <p>© 2025 API Marketplace. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
