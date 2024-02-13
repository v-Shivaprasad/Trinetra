import React from "react";
import "../homepage/foot.css";
const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>&copy; 2024 Trinetra All Rights Reserved.</p>
        <div className="social-icons">
          {/* Add your social media icons or links here */}
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;