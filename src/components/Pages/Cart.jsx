import React from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header.jsx';
import Cart from '../Cart/Cart.jsx';
import ProfileCard from './RightSide.jsx';
import './PageLayout.css'; // Import the CSS for layout

const CartPage = () => {
    return (
        <div className="page-layout">
        <div style={{direction:"rtl"}} className="main-content">
            <div style={{direction:"ltr"}}>
            <Header />
            <Cart />
            {/* <Footer /> */}
            </div>
           
        </div>
        <div className="right-section">
            <ProfileCard />
        </div>
    </div>
    );
};

export default CartPage;