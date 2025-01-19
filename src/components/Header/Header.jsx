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
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ paddingLeft: "70px",marginBottom:"30px", paddingRight: "50px" }}>
      <div className="container-fluid">
        <a className="navbar-brand" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          <img src={logo} alt="Logo" style={{ width: "80px" }} />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" onClick={() => navigate("/")}>
                Home
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a className="dropdown-item" href="#" onClick={() => navigate("/categories/phones")}>
                    Phones
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={() => navigate("/categories/laptops")}>
                    Laptops
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <form className="d-flex search-form">
                <input className="form-control me-2" type="search" placeholder="What are you looking for?" aria-label="Search" />
              </form>
            </li>
            <li className="nav-item">
              <Tooltip title="Cart">
                <div className="nav-link icon" onClick={handleCartClick}>
                  <FaCartPlus />
               
                </div>
              </Tooltip>
            </li>
            <li className="nav-item">
              <Tooltip title="Profile">
                <div className="nav-link icon" onClick={handleUserClick}>
                  <FaUser />
                </div>
              </Tooltip>
            </li>
            <li className="nav-item">
              <Tooltip title={user ? "Logout" : "Login"}>
                <div className="nav-link icon" onClick={handleLogout}>
                  {user ? <FaSignOutAlt /> : <FaSignInAlt />}
                </div>
              </Tooltip>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;