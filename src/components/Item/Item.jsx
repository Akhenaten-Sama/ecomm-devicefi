import React from "react";
import { useNavigate } from "react-router-dom";
import "./Item.css"; // Import the CSS for styling
import altphone from "../../assets/phone.png"; // Import the phone image

const ItemDetails = ({ item, phone, user }) => {
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    if(user){
      navigate(`/product?product_id=${item.id}`);
    }else{
      navigate(`/login`);
    }
  };

  return (
    <div className="item-details-card">
      <div className="image-container">
        <img src={phone ? phone : altphone} alt={item.name} className="item-image" />
      </div>
      <div className="item-header">
        <h3>{item.name}</h3>
        <h4 className="item-price">₦{item.price}</h4>
      </div>

      <div className="payment-options">
        <div className="payment-header">
          <span>Months</span>
          <span>Payments</span>
        </div>
        <hr />
        {item.payment_plans.map((p, index) => (
          <div key={index} >
            <div className="payment-plan">
              <span>{p.months} month payments:</span>
              <span>₦{p.monthly_payment}</span>
            </div>
            {index < item.payment_plans.length - 1 && <hr />}
          </div>
        ))}
      </div>

      <div className="availability">
        <span>Availability</span>
        <span className={item.status === "available" ? "in-stock" : "not-in-stock"}>
          {item.status === "available" ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <button className="place-order-btn" onClick={handlePlaceOrder}>View Product</button>
    </div>
  );
};

export default ItemDetails;
