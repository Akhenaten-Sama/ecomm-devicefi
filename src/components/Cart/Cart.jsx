import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import api from "../../api"; // Import the API
import emptyCartImage from "../../assets/empty.png"; // Import the empty cart image

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [lenders, setLenders] = useState([]);
  const [chosenTenure, setChosenTenure] = useState(null);
  const navigate = useNavigate();

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem("user")) : null;

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    if (cartItems.amount) {
      fetchLenders();
    }
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const response = await api.cart.getCart(user?.id);
      setCartItems(response.data.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const fetchLenders = async () => {
    try {
      const response = await api.lender.getAvailableLender(cartItems.amount);
      setLenders(response.data.data);
    } catch (error) {
      console.error("Error fetching lenders:", error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await api.cart.removeCartItem(id, user?.id);
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
      const response = await api.cart.selectLender({...chosenTenure, user_id: user?.id});
      if (response.data) {
        await api.orders.createOrder({ user_id: user?.id, cart_id: cartItems.id });
        navigate("/checkout");
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const calculateInterest = (tenure) => { 
    if (!tenure || !cartItems.amount) {
      return;
    }
    const interest = cartItems.amount * (tenure.tenure_rate_type_value / 100);
    const TotalPayable = Math.ceil(interest + cartItems.amount);
    const totalMonthlyPayment = `${Math.ceil(TotalPayable / tenure.tenure_type_value)} / ${tenure.tenure_type}`.replace('s', '');

    return { interest, TotalPayable, totalMonthlyPayment };
  };

  const handleTenureChange = (lender, tenure) => {
    const selectedTenure = {
      lender_id: lender.id,
      lenders_name: lender.lenders_name,
      tenure_id: tenure.id,
      tenure_type: tenure.tenure_type,
      tenure_type_value: tenure.tenure_type_value,
      tenure_rate_type: tenure.tenure_rate_type,
      max_loan_amount: tenure.max_loan_amount,
      min_loan_amount: tenure.min_loan_amount,
      tenure_rate_type_value: tenure.tenure_rate_type_value,
    };
    setChosenTenure(selectedTenure);
    localStorage.setItem('chosenTenure', JSON.stringify({amount:cartItems.amount, ...selectedTenure}));
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

      {/* Payment Method */}
      <div className="payment-method">
        <h3>Choose a Lender</h3>
        <table>
          <thead>
            <tr>
              <th>Lender Name</th>
              <th>Duration</th>
              <th>Total Amount</th>
              <th>Payment Plan</th>
              <th>Interest</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {lenders.map((lender) => (
              <tr key={lender.id}>
                <td>{lender.lenders_name}</td>
                <td>
                  <select onChange={(e) => handleTenureChange(lender, lender.tenure[e.target.value])}>
                    {lender.tenure.map((tenure, index) => (
                      <option key={tenure.id} value={index}>
                        {tenure.tenure_type_value} {tenure.tenure_type}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="amount">R{chosenTenure?.lender_id === lender.id ? calculateInterest(chosenTenure).TotalPayable: calculateInterest(lender.tenure[0]).TotalPayable}</td>
                <td className="amount">R{chosenTenure?.lender_id === lender.id ? calculateInterest(chosenTenure).totalMonthlyPayment: calculateInterest(lender.tenure[0]).totalMonthlyPayment} </td>
                <td>{chosenTenure?.lender_id === lender.id ? chosenTenure.tenure_rate_type_value : lender.tenure[0].tenure_rate_type_value}%</td>
                <td>
                  <button className="add-to-cart" disabled={chosenTenure?.lender_id === lender.id} onClick={() => handleTenureChange(lender, lender.tenure[0])}>
                    {chosenTenure?.lender_id === lender.id ? "Selected" : "Choose"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cart Total Section */}
      <div className="cart-total">
        <h3>Cart Total</h3>
        <div className="summary-item">
          <span>Subtotal:</span>
          <span>R{calculateInterest(chosenTenure)?.TotalPayable||" 0.00"}</span>
        </div>
        <div className="summary-item">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="summary-item total">
          <span>Total:</span>
          <span>R{calculateInterest(chosenTenure)?.TotalPayable||" 0.00"}</span>
        </div>
        <button className="confirm-button cart-button" onClick={handleConfirmOrder}>Confirm Order</button>
      </div>
    </div>
  );
};

export default Cart;
