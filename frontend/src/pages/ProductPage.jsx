import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams(); // product id
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/product/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-page">

      <div className="product-container">

        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />

        <div className="product-details">
          <h2>{product.name}</h2>
          <p className="price">₹{product.price}</p>

          <p className="description">
            {product.description || "No description available"}
          </p>

          <button className="add-to-cart-btn">
            Add to Cart
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProductPage;