import React from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/footer.css';

function Footer() {
  const location = useLocation();

  // Check if the current path is the map page
  const isMapPage = location.pathname === '/map';

  if (isMapPage) {
    return null; // Don't render the footer if on the map page
  }

  return (
    <footer className="footer">
      <hr className="footer-separator" />
      <div className="footer-content">
        <div className="footer-info">
          <div className="footer-info-left">
            <a href="/extra-resources" className="footer-extra-resources">Extra resources</a>
            <div className="footer-info__returns">
              {/* Returns Policy */}
              <br />
              {/* Delivery */}
            </div>
          </div>
          <div className="footer-info-center">
            <a href="/contact" className="footer-info-about">About Us</a>
            <div className="footer-info__terms">
              {/* Copyright */}
            </div>
          </div>
          <div className="footer-info-right">
            <div className="footer-info__number"></div>
            <a href="/our-story" className="footer-our-story">Our Story</a>
          </div>
        </div>
      </div>
      <hr className="footer-separator" />
    </footer>
  );
}

export default Footer;
