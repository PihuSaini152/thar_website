import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-brand"> 
            <div className="footer-logo">
              <img 
                src="/footer/logo.png" 
                alt="Mahindra" 
                className="mahindra-logo"
              />
              <div className="logo-divider"></div>
              <span className="footer-thar">THAR</span>
            </div>
            <p className="footer-tagline">Built to Conquer Any Terrain</p>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">📺</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <div className="link-group">
              <h4>QUICK LINKS</h4>
              <a href="#home">Home</a>
              <a href="#variants">Variants</a>
              <a href="#features">Features</a>
              <a href="#gallery">Gallery</a>
              <a href="#test-drive">Test Drive</a>
            </div>

            <div className="link-group">
              <h4>CONTACT INFO</h4>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>1800-209-6006</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>customercare@mahindra.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>Mahindra & Mahindra Ltd., Mumbai</span>
              </div>
            </div>

            <div className="link-group">
              <h4>BUSINESS HOURS</h4>
              <div className="timing-item">
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </div>
              <div className="timing-item">
                <span>Saturday: 9:00 AM - 2:00 PM</span>
              </div>
              <div className="timing-item">
                <span>Sunday: Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2024 Mahindra & Mahindra Ltd. All Rights Reserved.</p>
          </div>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;