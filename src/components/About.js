import React from "react";
import { FaCode, FaCogs, FaUsers } from "react-icons/fa";
import "./About.css";

function About() {
  return (
    <section id="about">
      <div className="about-container">
        <h2>About Us</h2>
        <p>
          We provide <b>high-quality</b> and <b>reliable</b> APIs tailored for developers, businesses, and innovators. 
          Our APIs are designed to be <b>scalable, secure, and easy to integrate</b> into your applications.
        </p>

        <div className="about-features">
          <div className="feature-card">
            <FaCode className="feature-icon" />
            <h3>Developer Friendly</h3>
            <p>Easy-to-use APIs with clear documentation and quick integration.</p>
          </div>

          <div className="feature-card">
            <FaCogs className="feature-icon" />
            <h3>High Performance</h3>
            <p>Optimized for speed, reliability, and real-time data processing.</p>
          </div>

          <div className="feature-card">
            <FaUsers className="feature-icon" />
            <h3>Trusted by Many</h3>
            <p>Used by thousands of developers and businesses worldwide.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
