import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import './navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation handle function
  const handleNavClick = (sectionId) => {
    // Close mobile menu
    setIsMenuOpen(false);
    
    // If we're not on home page, navigate to home first
    if (location.pathname !== '/') {
      // Navigate to home page
      navigate('/');
      // Wait for navigation then scroll to section
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If we're already on home page, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Brochure download function
  const handleBrochureDownload = () => {
    console.log('Downloading brochure...');
    // Yahan aap actual brochure download logic add kar sakte hain
    // Example: window.open('/brochure.pdf', '_blank');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <div className="logo-section">
          <Link 
            to="/" 
            className="logo-wrapper"
            onClick={() => setIsMenuOpen(false)}
          >
            <img 
              src="/navbar/logo.png" 
              alt="Mahindra" 
              className="main-logo"
            />
            <div className="logo-divider"></div>
            <div className="thar-brand">
              <span className="thar-main">THAR</span>
              <span className="thar-sub">ADVENTURE REDEFINED</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className={`nav-menu ${isMenuOpen ? 'nav-menu-active' : ''}`}>
          <div className="nav-links">
            <button 
              className="nav-link"
              onClick={() => handleNavClick('home')}
            >
              <span className="link-text">Home</span>
              <span className="link-hover"></span>
            </button>
            
            <button 
              className="nav-link"
              onClick={() => handleNavClick('variants')}
            >
              <span className="link-text">Variants</span>
              <span className="link-hover"></span>
            </button>
            
            <button 
              className="nav-link"
              onClick={() => handleNavClick('features')}
            >
              <span className="link-text">Features</span>
              <span className="link-hover"></span>
            </button>
            
            <button 
              className="nav-link"
              onClick={() => handleNavClick('gallery')}
            >
              <span className="link-text">Gallery</span>
              <span className="link-hover"></span>
            </button>
            
            <button 
              className="nav-link"
              onClick={() => handleNavClick('test-drive')}
            >
              <span className="link-text">Test Drive</span>
              <span className="link-hover"></span>
            </button>

            {/* ✅ TRACK ORDER LINK ADDED */}
            <Link 
              to="/booking-status" 
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="link-text">Track Order</span>
              <span className="link-hover"></span>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="mobile-actions">
            {/* <button 
              className="action-btn brochure-btn"
              onClick={handleBrochureDownload}
            >
              <span className="btn-icon">📥</span>
              <span className="btn-text">Brochure</span>
            </button> */}
            <Link 
              to="/booking" 
              className="action-btn book-btn"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="btn-icon">🚙</span>
              <span className="btn-text">Book Now</span>
            </Link>
          </div>
        </div>

        {/* Desktop Action Buttons */}
        <div className="nav-actions">
          {/* <button 
            className="action-btn brochure-btn"
            onClick={handleBrochureDownload}
          >
            <span className="btn-icon">📥</span>
            <span className="btn-text">Brochure</span>
          </button> */}
          <Link 
            to="/booking" 
            className="action-btn book-btn"
          >
            <span className="btn-icon">🚙</span>
            <span className="btn-text">Book Now</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'menu-toggle-active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;