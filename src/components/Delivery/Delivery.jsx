import React, { useState } from "react";
import "./Delivery.css";
import phone from "../../assets/phone.png";
import api from "../../api"; // Import the API

const DeliveryDetails = ({ order, setStatus }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [useRegistrationAddress, setUseRegistrationAddress] = useState(true);
  const [address, setAddress] = useState({
    street: user?.address,
    apartment: "",
    city: user?.address,
  });

  const handleCheckboxChange = (useRegAddress) => {
    setUseRegistrationAddress(useRegAddress);
    if (useRegAddress) {
      setAddress({
        street: user?.address,
        apartment: "",
        city: ""
      });
    } else {
      setAddress({
        street: "",
        apartment: "",
        city: "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await api.orders.updateOrderStatus(order.id, {
        status: "completed",
        pickup_address: address?.street,
      });
      setStatus("completed");
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="delivery-page">
      {/* Left Column */}
      <div className="delivery-column">
        {/* First Row */}
        <div className="delivery-row">
          <input
            type="checkbox"
            className="delivery-checkbox"
            checked={useRegistrationAddress}
            onChange={() => handleCheckboxChange(true)}
          />
          <span className="delivery-text">
            Use registration address as delivery address
          </span>
        </div>
        {/* Second Row */}
        <div className="delivery-row">
          <input
            type="checkbox"
            className="delivery-checkbox"
            checked={!useRegistrationAddress}
            onChange={() => handleCheckboxChange(false)}
          />
          <span className="delivery-text">
            Use another address as delivery address
          </span>
        </div>

        {/* Address Inputs */}
        <div className="delivery-input-group">
          <label className="delivery-label">Street Address*</label>
          <input
            type="text"
            className="delivery-input"
            placeholder="Enter street address"
            name="street"
            value={address.street}
            onChange={handleInputChange}
            disabled={useRegistrationAddress}
          />
        </div>
        <div className="delivery-input-group">
          <label className="delivery-label">
            Apartment, floor, etc. (optional)
          </label>
          <input
            type="text"
            className="delivery-input"
            placeholder="Enter apartment details"
            name="apartment"
            value={address.apartment}
            onChange={handleInputChange}
            disabled={useRegistrationAddress}
          />
        </div>
        <div className="delivery-input-group">
          <label className="delivery-label">Town/City*</label>
          <input
            type="text"
            className="delivery-input"
            placeholder="Enter town or city"
            name="city"
            value={address.city}
            onChange={handleInputChange}
            disabled={useRegistrationAddress}
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="delivery-column">
        {/* Device Details */}
        <div className="device-details">
          <div className="device-row">
            <img src={phone} alt="Oppo A1" className="device-image" />
            <div className="device-info">
              <p>Oppo A1</p>
              <p>₦123,000</p>
            </div>
          </div>
          <div className="device-row">
            <img src={phone} alt="Nokia G6" className="device-image" />
            <div className="device-info">
              <p>Nokia G6</p>
              <p>₦196,000</p>
            </div>
          </div>
        </div>

        {/* Subtotal, Shipping, Total */}
        <div className="pricing-details">
          <div className="pricing-row">
            <span>Subtotal:</span>
            <span>₦315,000</span>
          </div>
          <div className="pricing-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="pricing-row total">
            <span>Total:</span>
            <span>₦315,000</span>
          </div>
        </div>

        {/* Submit Button */}
        <button className="delivery-submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default DeliveryDetails;
