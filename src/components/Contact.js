import React from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import "./Contact.css";

function Contact() {
  return (
    <section id="contact">
      <h2>Contact Us</h2>
      <p>Have questions? Feel free to reach out to us.</p>
      <div className="contact-info">
        <p><FaEnvelope className="contact-icon" /> Email: <a href="mailto:support@apimarket.com">support@apimarket.com</a></p>
        <p><FaPhone className="contact-icon" /> Phone: +1 (234) 567-890</p>
      </div>
    </section>
  );
}

export default Contact;
