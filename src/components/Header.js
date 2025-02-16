import React, { useState } from "react";
import { FaCogs, FaServer, FaInfoCircle, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <h1>
        <FaCogs className="logo-icon" /> API Marketplace
      </h1>

      <button className="menu-toggle" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={isOpen ? "nav open" : "nav"}>
        <a href="#api-list">
          <FaServer className="nav-icon" /> APIs
        </a>
        <a href="#about">
          <FaInfoCircle className="nav-icon" /> About Us
        </a>
        <a href="#contact">
          <FaEnvelope className="nav-icon" /> Contact
        </a>
      </nav>
    </header>
  );
}

export default Header;
