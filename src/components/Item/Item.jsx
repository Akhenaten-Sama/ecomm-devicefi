import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import "./Item.css"; // Import the CSS for styling
import altphone from "../../assets/phone.png"; // Import the phone image
import api from "../../api";

const paymentPlans = [
  {
    "months": 6,
    "monthly_payment": 8000
  },
  {
    "months": 12,
    "monthly_payment": 5000
  },
  {
    "months": 24,
    "monthly_payment": 3000
  }
]
const ItemDetails = ({ item, phone, user }) => {
   const [product, setProduct] = useState(null);
   const [loading, setLoading] = useState(true);
     const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();


    useEffect(() => {
      fetchProductDetails();
    }, [item.id]);
  
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await api.catalog.getCatalogById(item.id);
        setProduct(response?.data?.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };


  
  const handlePlaceOrder = () => {
    if(user){
      navigate(`/product?product_id=${item.id}`);
    }else{
      navigate(`/login`);
    }
  };

  const handleAddToCart = async () => {
     
      try {
        await api.cart.createCart({ user_id:user?.id, device_id: product.id, quantity:1, selected_months: 6 });
        navigate("/cart");
      } catch (error) {
        console.log(error.response?.data?.message||error.response?.message);
       
        setErrorMessage("This product is out of stock.");
     
        console.error("Error adding to cart:", error);
      }
    }

  return (
    <div className="item-details-card">
      <div className="image-container">
        <img src={phone ? phone : altphone} alt={item.name} className="item-image" />
      </div>
      <div className="item-header">
        <h3>{item.name}</h3>
        <h4 className="item-price">R{item.price}</h4>
      </div>

      <div className="payment-options">
        <div className="payment-header">
          <span>Months</span>
          <span>Payments</span>
        </div>
        <hr />
        {paymentPlans.map((p, index) => (
          <div key={index} >
            <div className="payment-plan">
              <span>{p.months} month payments:</span>
              <span>R{p.monthly_payment}</span>
            </div>
            {index < paymentPlans.length - 1 && <hr />}
          </div>
        ))}
      </div>

      <div className="availability">
        <span>Availability</span>
        <span className={item.status === "available" ? "in-stock" : "not-in-stock"}>
          {item.status === "available" ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <button className="place-order-btn" onClick={handleAddToCart}>Add To Cart</button>
    </div>
  );
};

export default ItemDetails;
