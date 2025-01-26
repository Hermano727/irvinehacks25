import React from 'react';
import '../styles/footer.css';

function Footer() {
  return (
    <footer className="footer">
      <hr className="footer-separator" />
      <div className="footer-content">
        <div className="footer-social-media">
          <a href="/" target="_blank">CAre</a>
        </div>
        <div className="footer-info">
          <div className="footer-info-left">
            <div className="footer-info__name">Extra resources</div>
            <div className="footer-info__returns">
              {/* Returns Policy */}
              <br />
              {/* Delivery */}
            </div>
          </div>
          <div className="footer-info-center">
            <div className="footer-info__email">shop.info@gmail.com</div>
            <div className="footer-info__terms">
              About Us
              <br />
              {/* Copyright */}
            </div>
          </div>
          <div className="footer-info-right">
            <div className="footer-info__number"></div>
            <div className="footer-info__contact">
              Our Story
              <br />
              {/* Contact Us */}
            </div>
          </div>
        </div>
      </div>
      <hr className="footer-separator" />
    </footer>
  );
}

export default Footer;
