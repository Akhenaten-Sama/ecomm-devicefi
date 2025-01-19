import React from "react";
import "./Footer.css"; // Import the styles
import logo from "../../assets/logo-alt.png"; // Import the logo
import qrCode from "../../assets/qrcode.png"; // Import the QR code
import googlePlay from "../../assets/googleplay.png"; // Import the Google Play image
import appStore from "../../assets/appstore.png"; // Import the App Store image

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section subscribe">
          <img width='100px' src={logo} alt="Logo" className="footer-logo" />
          <h4>Subscribe</h4>
          <p>Get 10% off your first order</p>
          <div className="email-input">
            <input type="email" placeholder="Enter your email" />
            <button>&#10140;</button>
          </div>
        </div>

        <div className="footer-section support">
          <h4>Support</h4>
          <p>12, Abibolaji Drive, VI, Lagos</p>
          <p>devicefi@gmail.com</p>
          <p>+88015-88888-9999</p>
        </div>

        <div className="footer-section account">
          <h4>Account</h4>
          <ul>
            <li>My Account</li>
            <li>Login / Register</li>
            <li>Cart</li>
            <li>Wishlist</li>
            <li>Shop</li>
          </ul>
        </div>

        <div className="footer-section quick-link">
          <h4>Quick Link</h4>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms Of Use</li>
            <li>FAQ</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className="footer-section download">
          <h4>Download App</h4>
          <div className="app-links">
            <img src={qrCode} alt="QR Code" />
            <div style={{ display: "flex", flexDirection:"column", gap: "10px" }}>
              <img src={googlePlay} alt="Google Play" />
              <img src={appStore} alt="App Store" />
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
