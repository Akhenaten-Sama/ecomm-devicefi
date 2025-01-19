import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Skeleton, message } from "antd";
import "./ProductDetails.css";
import api from "../../api"; // Import the API
import deliveryIcon from "../../assets/icon-delivery.svg"; // Import the delivery SVG
import returnIcon from "../../assets/Icon-return.svg"; // Import the return SVG

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const productId = params.get("product_id");
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await api.catalog.getCatalogById(productId);
      setProduct(response.data.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = async () => {
   
    try {
      await api.cart.createCart({ device_id: product.id, quantity, selected_months: 6 });
      navigate("/cart");
    } catch (error) {
      console.log(error.response.data.message);
     
      setErrorMessage("This product is out of stock.");
   
      console.error("Error adding to cart:", error);
    }
  };

  if (loading) {
    return <div>
      <Skeleton active />
      <Skeleton active />
      <Skeleton active  />
      <Skeleton active  />
    </div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details-page">
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      <div className="product-details-container">
        {/* Product Image Section */}
        <div className="img-section">
          <div className="image-background">
            <img
              src={product.images[0]}
              alt={product.name}
              className="product-image-product-details"
            />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="details-section">
          <h1 className="product-title">{product.name}</h1>
          <div className="ratings">
            <span>⭐⭐⭐⭐⭐</span> <span className="review-count">(150 Reviews)</span>
          </div>
          <span className="stock-status in-stock">{product.status=="available" ? "In Stock" : "Out of Stock"}</span>
          <h2 className="price">₦{product.price}</h2>
          <p className="description">
            {product.description}
          </p>
          <hr style={{color:"black", fontSize:"2px"}}/>
          
          {/* <div className="quantity-section">
            <button onClick={decreaseQuantity}>-</button>
            <input style={{color:"black"}}type="number" value={quantity} readOnly />
            <button onClick={increaseQuantity}>+</button>
          </div> */}
          <div className="delivery-info">
            <div className="delivery-option">
              <div>
              <img src={deliveryIcon} alt="Free Delivery" />
              <span>Free Delivery</span>
              </div>
           
            <p style={{textDecoration:"underline"}}>Enter your postal code for Delivery Availability</p>
          </div>
          <hr />
          <div className="delivery-option">
            <div>
            <img src={returnIcon} alt="Return Delivery" />
            <span>Return Delivery</span>
            </div>
           
            <p style={{textDecoration:"underline"}}>
              Free 30 Days Delivery Returns. <a href="/">Details</a>
            </p>
          </div>
          </div>
         
        </div>
      </div>

      {/* Payment Method Section */}
      <div className="payment-method">
        
        <h3>Choose a Payment Method</h3>
        <table>
          <thead>
            <tr>
              <th>Vendor Name</th>
              <th>Duration</th>
              <th>Amount</th>
              <th>Interest</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Easy Buy</td>
              <td>
                <select>
                  <option>6 months</option>
                  <option>12 months</option>
                </select>
              </td>
              <td className="amount">₦200,000 / per month</td>
              <td>5%</td>
              <td>
                <button onClick={handleAddToCart} className="add-to-cart">Add to cart</button>
              </td>
            </tr>
            <tr>
              <td>Wema Bank</td>
              <td>
                <select>
                  <option>6 months</option>
                  <option>12 months</option>
                </select>
              </td>
              <td className="amount">₦200,000 / per month</td>
              <td>4.5%</td>
              <td>
                <button onClick={handleAddToCart} className="add-to-cart">Add to cart</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetails;
