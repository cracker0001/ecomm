import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { id } = useParams(); // category id from URL
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get(`/product?category=${id}`);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching category products:", error);
      }
    };

    fetchProducts();
  }, [id]);

  return (
    <div className="category-page">

      <h2 className="category-title">Products</h2>

      <div className="category-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>

    </div>
  );
};

export default CategoryPage;