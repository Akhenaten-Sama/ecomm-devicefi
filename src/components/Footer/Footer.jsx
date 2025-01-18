import React from "react";
import "./Footer.css"; // Import the styles

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section subscribe">
          <h3>Subscribe</h3>
          <p>Get 10% off your first order</p>
          <div className="email-input">
            <input type="email" placeholder="Enter your email" />
            <button>&#10140;</button>
          </div>
        </div>

        <div className="footer-section support">
          <h3>Support</h3>
          <p>12, Abibolaji Drive, VI, Lagos</p>
          <p>devicefi@gmail.com</p>
          <p>+88015-88888-9999</p>
        </div>

        <div className="footer-section account">
          <h3>Account</h3>
          <ul>
            <li>My Account</li>
            <li>Login / Register</li>
            <li>Cart</li>
            <li>Wishlist</li>
            <li>Shop</li>
          </ul>
        </div>

        <div className="footer-section quick-link">
          <h3>Quick Link</h3>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms Of Use</li>
            <li>FAQ</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className="footer-section download">
          <h3>Download App</h3>
          <div className="app-links">
            <img src="/path-to-qr.png" alt="QR Code" />
            <div>
              <img src="/path-to-google-play.png" alt="Google Play" />
              <img src="/path-to-app-store.png" alt="App Store" />
            </div>
          </div>
          <div className="social-links">
            <i className="fab fa-facebook"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-linkedin"></i>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; Copyright Devicefi 2024. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
