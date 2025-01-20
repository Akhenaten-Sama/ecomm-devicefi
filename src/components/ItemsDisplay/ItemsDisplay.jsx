import React, { useState, useEffect } from "react";
import ItemDetails from "../Item/Item.jsx"; // Import your item component
import { Tabs, Skeleton } from "antd";
import "./ItemsDisplay.css"; // CSS file for styling
import api from "../../api"; // Import the API
import emptyStateImage from "../../assets/empty.png"; // Import the empty state image
import { useNavigate } from "react-router-dom";

const ItemsDisplay = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [items, setItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem("user")? JSON.parse(localStorage.getItem("user")): null;
  const navigate = useNavigate();

  // useEffect(()=>{
  //   if(!user?.id){
  //     navigate("/login");
  //   }
  // },[user?.id]);

  useEffect(() => {
    fetchCategories();
    fetchItems("all"); // Fetch all devices by default
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.categories.getAllCategories();
      setCategories([{ id: "all", name: "All" }, ...response.data.data.categories]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchItems = async (category) => {
    setLoading(true);
    try {
      let response;
      if (category === "all") {
        response = await api.catalog.getAllDevices();
      } else {
        response = await api.catalog.getDevicesByCategory(category);
      }
      setItems(response.data.data.devices);
      setDisplayedItems(response.data.data.devices.slice(0, 6)); // Display first 9 items initially
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (key) => {
    setSelectedCategory(key);
    fetchItems(key);
  };

  const handleViewAll = () => {
    setDisplayedItems(items); // Show all items
  };

  return (
    <div className="items-display">
      <h1 className="title">Explore Our Products</h1>

      <Tabs
        defaultActiveKey="all"
        onChange={handleCategoryChange}
        className="category-tabs"
        tabBarStyle={{ fontWeight: "bold", fontFamily: "Inter", fontSize: "16px", paddingLeft: "30px", paddingRight: "30px" }}
      >
        {categories.map((category) => (
          <Tabs.TabPane tab={category.name.toUpperCase()} key={category.id} />
        ))}
      </Tabs>

      {loading ? (
        <Skeleton active style={{ height: "60vh" }} />
      ) : displayedItems.length === 0 ? (
        <div className="empty-state">
          <img src={emptyStateImage} alt="No Items" className="empty-state-image" />
          <h2>No items found</h2>
          <p>Try selecting a different category or check back later.</p>
        </div>
      ) : (
        <div className="items-grid">
          {displayedItems.map((item, index) => (
            <div key={index} className="item-card">
              <ItemDetails item={item}user={user}phone={item.images[0]} />
            </div>
          ))}
        </div>
      )}

      {displayedItems.length < items.length && (
        <div className="view-all-container">
          <button className="view-all-btn" onClick={handleViewAll}>
            View All
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemsDisplay;
