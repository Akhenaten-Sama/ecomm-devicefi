import React from 'react';
import ItemDisplay from '../ItemsDisplay/ItemsDisplay';
import Footer from '../Footer/Footer';
import Header from '../Header/Header.jsx';
import Checkout from '../Checkout/Checkout.jsx';
const CheckoutPage = () => {
    return (
        <div>
            <Header />
            
           <Checkout />
            <Footer />
        </div>
    );
};

export default CheckoutPage;