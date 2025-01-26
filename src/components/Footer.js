import React from 'react';
import '../styles/footer.css';

function Footer() {
  return (
    <footer className="footer">
      <hr className="footer-separator" />
      <div className="footer-content">
        <div className="footer-social-media">
          <span className="footer-info__name">CAre</span>
        </div>
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
            <a href="/about-us" className="footer-info-about">About Us</a>
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