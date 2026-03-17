import React, { useEffect, useState } from "react";
import API from "../services/api";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          API.get("/categories"),
          API.get("/products"),
        ]);
         console.log("Categories:", catRes.data);
        console.log("Products:", prodRes.data);
        // 🔥 If backend sends {data: [...]}, change to catRes.data.data
        setCategories(catRes.data);
        setProducts(prodRes.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-container">

      {/* 🔥 Banner */}
      <div className="banner">
        <h1>Dry Fruits Store</h1>
        <p>Fresh & Premium Quality Products</p>
      </div>

      {/* 📂 Categories Section */}
      <h2 className="section-title">Shop by Category</h2>
      <div className="grid category-grid">
        {categories.map((cat) => (
          <CategoryCard key={cat._id} category={cat} />
        ))}
      </div>

      {/* 📦 Products Section */}
      <h2 className="section-title">Featured Products</h2>
      <div className="grid product-grid">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

    </div>
  );
};

export default Home;