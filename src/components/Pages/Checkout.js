import React from 'react';
import ItemDisplay from '../ItemsDisplay/ItemsDisplay';
import Footer from '../Footer/Footer';
import Header from '../Header/Header.jsx';
import Checkout from '../Checkout/Checkout.jsx';
import ProfileCard from './RightSide.jsx'
const CheckoutPage = () => {
    return (
        <div className="page-layout">
        <div style={{direction:"rtl"}} className="main-content">
            <div style={{direction:"ltr"}}>
            <Header />
            <Checkout />
            {/* <Footer /> */}
            </div>
           
        </div>
        <div className="right-section">
            <ProfileCard page='checkout'  />
        </div>
    </div>
       
    );
};

export default CheckoutPage;