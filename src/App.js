import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Store from './components/Store';
import ShopPage from './components/Pages/ShopPage';
import ProductDetailsPage from './components/Pages/ProductDetailsPage';
import CartPage from './components/Pages/Cart';
import CheckoutPage from './components/Pages/Checkout';
import Profile from './components/Profile/Profile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShopPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/product" element={<ProductDetailsPage />} />
        
      </Routes>
    </Router>
  );
};

export default App;
