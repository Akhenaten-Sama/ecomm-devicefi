import React from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header.jsx';
import ProductDetails from '../ProductDetails/ProductDetails.jsx';
import './PageLayout.css'; // Import the CSS for layout

const ProductDetailsPage = () => {
    return (
        <div className="page-layout">
            <div className="main-content">
                <Header />
                <ProductDetails />
              
            </div>
            <div className="right-section"></div>
        </div>
    );
};

export default ProductDetailsPage;