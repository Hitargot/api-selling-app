import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import theme from "../theme";
import { Server, Info, Mail } from "lucide-react"; // clean, modern icons

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    color: theme.colors.text,
    padding: "10px 16px",
    fontWeight: "500",
    fontSize: theme.fontSizes.base,
    borderRadius: theme.borderRadius.base,
    transition: "all 0.3s ease",
  };

const navItems = [
  { icon: <Server size={18} />, label: "APIs", href: "#api-list" },
  { icon: <Info size={18} />, label: "About", href: "#about" },
  { icon: <Mail size={18} />, label: "Contact", href: "#contact" },
];


  return (
    <header
      style={{
        backgroundColor: theme.colors.background,
        boxShadow: theme.shadows.card,
        padding: theme.spacing.md,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontSize: theme.fontSizes.large,
          fontWeight: "bold",
          color: theme.colors.primary,
        }}
      >
        API Marketplace
      </div>

      {/* Desktop Nav */}
      {!isMobile && (
        <nav style={{ display: "flex", gap: "10px" }}>
          {navItems.map(({ icon, label, href }) => (
            <a
              key={label}
              href={href}
              style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = theme.colors.primary)}
              onMouseLeave={e => (e.currentTarget.style.color = theme.colors.text)}
            >
              {icon}
              {label}
            </a>
          ))}
        </nav>
      )}

      {/* Mobile Toggle Icon */}
      {isMobile && (
        <button
          onClick={toggleMenu}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            color: theme.colors.text,
            cursor: "pointer",
          }}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      {/* Mobile Slide-In Menu */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: isOpen ? "0" : "-300px",
          height: "100%",
          width: "260px",
          backgroundColor: theme.colors.surface,
          boxShadow: "4px 0 15px rgba(0,0,0,0.1)",
          transition: "left 0.3s ease",
          padding: theme.spacing.lg,
          zIndex: 2000,
          display: isMobile ? "flex" : "none",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {navItems.map(({ icon, label, href }) => (
          <a
            key={label}
            href={href}
            onClick={() => setIsOpen(false)}
            style={{
              ...linkStyle,
              fontSize: "1.1rem",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = theme.colors.primary)}
            onMouseLeave={e => (e.currentTarget.style.color = theme.colors.text)}
          >
            {icon}
            {label}
          </a>
        ))}
      </div>
    </header>
  );
}

export default Header;
