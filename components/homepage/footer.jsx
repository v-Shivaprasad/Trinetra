import React from "react";
import "../homepage/foot.css";
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-light py-3">
      <Container>
        <div className="footer-content text-center">
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
      </Container>
    </footer>
  );
};

export default Footer;
