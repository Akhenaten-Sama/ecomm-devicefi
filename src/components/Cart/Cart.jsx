import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import api from "../../api"; // Import the API
import emptyCartImage from "../../assets/empty.png"; // Import the empty cart image

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const user = localStorage.getItem('user')? JSON.parse(localStorage.getItem("user")):null
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await api.cart.getCart(user?.id);
      setCartItems(response.data.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await api.cart.removeCartItem(id,user?.id);
      fetchCartItems(user?.id);
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const handleUpdateQuantity = async (id, quantity) => {
    try {
      await api.cart.updateCartItem({ device_id: id, quantity });
      fetchCartItems();
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      const response = await api.cart.selectLender(user.id);
      if (response.data) {
        await api.orders.createOrder({user_id:user?.id, cart_id: cartItems.id });
        navigate("/checkout");
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  if (!cartItems?.items?.length) {
    return (
      <div className="empty-cart">
        <img src={emptyCartImage} alt="Empty Cart" className="empty-cart-image" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <button className="return-button" onClick={() => navigate("/shop")}>
          Return To Shop
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {/* Table Header */}
      <div className="table-header">
        <div className="header-product">Product</div>
        <div className="header-price">Price</div>
        <div className="header-subtotal">Subtotal</div>
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {cartItems?.items?.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="product-details">
              <div className="image-container-cart">
                <button className="remove-button" onClick={() => handleRemoveItem(item.id)}>&times;</button>
                <img
                  src={item.DeviceCatalog.images[0]}
                  alt={item.DeviceCatalog.name}
                  className="product-image"
                />
              </div>
              <span className="product-name-cart">{item.DeviceCatalog.name}</span>
            </div>
            <div className="price">R{item.DeviceCatalog.price}</div>
            <div className="subtotal">R{item.DeviceCatalog.price * item.quantity}</div>
          </div>
        ))}
      </div>

      {/* Return to Shop Button */}
      <div className="return-to-shop">
        <button className="return-button" onClick={() => navigate("/shop")}>Return To Shop</button>
      </div>

      {/* Cart Total Section */}
      <div className="cart-total">
        <h3>Cart Total</h3>
        <div className="summary-item">
          <span>Subtotal:</span>
          <span>R{cartItems.total_amount}</span>
        </div>
        <div className="summary-item">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="summary-item total">
          <span>Total:</span>
          <span>R{cartItems.total_amount}</span>
        </div>
        <button className="confirm-button cart-button" onClick={handleConfirmOrder}>Confirm Order</button>
      </div>
    </div>
  );
};

export default Cart;
