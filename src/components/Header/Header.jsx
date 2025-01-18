import React from "react";
import { FaSearch, FaUser, FaCartPlus, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import logo from "../../assets/logo.png";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleLogoClick = () => {
    navigate("/shop");
  };

  const handleUserClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")

  };

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo" onClick={handleLogoClick}>
        <img style={{ width: "80px", cursor: "pointer" }} src={logo} alt="Logo" />
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="What are you looking for?" />
        <FaSearch className="search-icon" />
      </div>

      {/* Icons */}
      <div className="icons">
        <Tooltip title="Cart">
          <div className="icon" onClick={handleCartClick}>
            <FaCartPlus />
            <span className="icon-badge">4</span>
          </div>
        </Tooltip>

        <Tooltip title="Profile">
          <div className="icon" onClick={handleUserClick}>
            <FaUser />
          </div>
        </Tooltip>

        <Tooltip title={user ? "Logout" : "Login"}>
          <div className="icon" onClick={handleLogout}>
            {user ? <FaSignOutAlt /> : <FaSignInAlt />}
          </div>
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;