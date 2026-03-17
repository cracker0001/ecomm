import React from 'react'
import {useNavigate} from 'react-router-dom'
import "./CategoryCard.css";
const CategoryCard = ({category}) => {
    const navigate = useNavigate();
     const handleClick = () => {
    navigate(`/category/${category._id}`);
  };

  return (
   <div className="category-card" onClick={handleClick}>
     
      <h3 className="category-name">{category.name}</h3>
    </div>
  )
}

export default CategoryCard
