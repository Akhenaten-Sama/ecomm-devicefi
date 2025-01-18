import React, { useState, useEffect } from "react";
import "./Checkout.css";
import { FaCheckCircle } from "react-icons/fa";
import phone from "../../assets/phone.png";
import DeliveryDetails from "../Delivery/Delivery";
import api from "../../api"; // Import the API

const Checkout = () => {
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(false);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState(null);
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await api.orders.getOrder(); // Replace "order_id" with the actual order ID
      setOrder(response.data.data.orders[0]);
      setStatus(response.data.data.orders[0].status);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const handleContinueToCheckout = async () => {
    try {
      await api.orders.updateOrderStatus(order.id, {
        status: "confirmed",
      });
      setShowDeliveryDetails(true);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleOnboardDevice = () => {
    window.location.href = "https://admin.devicefi.com/onboarding";
  };

  return status === "completed" ? (
    <div className="checkout-container">
      <div className="success-icon">
        <FaCheckCircle className="icon" />
      </div>
      <h1 className="success-title">Order Successful!</h1>
      <p className="success-message">
        You have successfully ordered the item below
        <br />
        View order details for shipping and installment payment date.
        <br />
        We are setting up your device - we will deliver to you within 48 hours
      </p>
      <div className="order-summary">
        <div className="product-details">
          <img src={order?.OrderItems[0].DeviceCatalog?.images[0]} alt="Oppo A1" className="product-image" />
          <div className="product-info">
            <h2 className="product-name">{order?.OrderItems[0].DeviceCatalog?.name}</h2>
            <p className="product-rating">
              <span className="stars">★★★★☆</span> (150 Reviews)
            </p>
            <p className="product-description">
              Oppo Skin High quality vinyl with air channel adhesive for easy
              bubble free install & mess free removal Pressure sensitive.
            </p>
            <p className="product-colours">
              Colours: <span className="colour-indicator"></span>
            </p>
          </div>
        </div>
      </div>
      {user?.login_type !== "USER" && (
        <button onClick={handleOnboardDevice} className="checkout-button">
          Onboard this device
        </button>
      )}
    </div>
  ) : showDeliveryDetails ? (
    <DeliveryDetails order={order} setStatus={setStatus} />
  ) : (
    <div className="checkout-container">
      <div className="success-icon">
        <FaCheckCircle className="icon" />
      </div>
      <h1 className="success-title">Order Successful!</h1>
      <p className="success-message">
        You have successfully ordered the item below
        <br />
        View order details for shipping and installment payment date.
        <br />
        We are setting up your device - we will deliver to you within 48 hours
      </p>
      <div className="order-summary">
        <div className="product-details">
          <img src={order?.OrderItems[0].DeviceCatalog?.images[0]} alt="Oppo A1" className="product-image" />
          <div className="product-info">
            <h2 className="product-name">{order?.OrderItems[0].DeviceCatalog?.name}</h2>
            <p className="product-rating">
              <span className="stars">★★★★☆</span> (150 Reviews)
            </p>
            <p className="product-description">
              Oppo Skin High quality vinyl with air channel adhesive for easy
              bubble free install & mess free removal Pressure sensitive.
            </p>
            <p className="product-colours">
              Colours: <span className="colour-indicator"></span>
            </p>
          </div>
        </div>
      </div>
      <div className="pagination">
        <span className="pagination-dot active"></span>
        <span className="pagination-dot"></span>
      </div>
      <button onClick={handleContinueToCheckout} className="checkout-button">
        Continue to Checkout
      </button>
    </div>
  );
};

export default Checkout;
