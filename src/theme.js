// src/theme.js
const theme = {
    colors: {
      // Core brand colors
      primary: "#1DBF73",       // Emerald Green (Buttons, Links)
      primaryDark: "#16A34A",   // Darker hover/focus green
      background: "#FFFFFF",    // Main background
      surface: "#F9FAFB",       // Card/section background
      text: "#1B1B1B",          // Main text (dark charcoal)
      muted: "#6B7280",         // Muted text (gray)
      warning: "#F59E0B",       // For alert messages
      danger: "#EF4444",        // For errors or invalid states
      footer: "#1B1B1B",  // Dark footer background
    footerText: "#F1F1F1",
    },
  
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "40px",
    },
  
    fontSizes: {
      small: "0.875rem", // 14px
      base: "1rem",      // 16px
      medium: "1.25rem", // 20px
      large: "1.5rem",   // 24px
      xlarge: "2rem",    // 32px
    },
  
    borderRadius: {
      small: "4px",
      base: "8px",
      large: "12px",
    },
  
    shadows: {
      card: "0 2px 8px rgba(0, 0, 0, 0.05)",
      hover: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
  };
  
  export default theme;
  