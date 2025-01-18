import React from "react";
import { useNavigate } from "react-router-dom";
import "./Item.css"; // Import the CSS for styling
import altphone from "../../assets/phone.png"; // Import the phone image

const ItemDetails = ({ item, phone }) => {
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    navigate(`/product?product_id=${item.id}`);
  };

  return (
    <div className="item-details-card">
      <img src={phone ? phone : altphone} alt={item.name} className="item-image" />
      <h2>{item.name}</h2>
      <h3 className="item-price">₦{item.price}</h3>

      <div className="payment-options">
        <table>
          <thead>
            <tr>
              <th>Months</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {item.payment_plans.map((p) =>
             <tr>
             <td>{p.months}Month payment:</td>
             <td>₦{p.monthly_payment}</td>
           </tr> )}
           
           
          </tbody>
        </table>
      </div>

      <div className="availability">
        <span>Availability:</span>
        <span className={item.status==="available"?`in-stock`:'not-in-stock'}>{item.status ==="available"? "In Stock" : "Out of Stock"}</span>
      </div>

      <button className="place-order-btn" onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default ItemDetails;
