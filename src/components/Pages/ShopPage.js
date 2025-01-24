import React from 'react';
import ItemDisplay from '../ItemsDisplay/ItemsDisplay';
import Footer from '../Footer/Footer';
import Header from '../Header/Header.jsx';
import ProfileCard from './RightSide.jsx';
import './PageLayout.css'; // Import the CSS for layout
const ShopPage = () => {
    return (
        <div className="page-layout">
        <div style={{direction:"rtl"}} className="main-content">
            <div style={{direction:"ltr"}}>
            <Header />
            <ItemDisplay />
            {/* <Footer /> */}
            </div>
           
        </div>
        <div className="right-section">
            <ProfileCard />
        </div>
    </div>
    );
};

export default ShopPage;