import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  
  // Get the first image or use placeholder
  const imageUrl = product.P_Images?.[0]?.image_url || "https://via.placeholder.com/300x200";
  
  // Get the first category name
  const categoryName = product.category?.[0]?.c_name || "Unknown";
  
  // Calculate total stock
  const totalStock = product.P_Size?.reduce((total, size) => total + size.stock, 0) || 0;

  const handleClick = () => {
    navigate(`/products/${product.p_id}`);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="overflow-hidden">
        <img
          src={imageUrl}
          alt={product.p_name}
          className="h-48 w-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {product.p_name}
          {totalStock === 0 && <div className="badge badge-error text-white bg-amber-700">Out of Stock</div>}
        </h2>
        <p className="text-sm text-gray-600">{product.brand}</p>
        <p className="text-sm text-gray-500">{categoryName}</p>
        <p className="text-lg font-bold text-primary">${product.price}</p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary btn-sm"
            disabled={totalStock === 0}
            onClick={handleClick}
            title={totalStock === 0 ? 'Out of Stock' : ''}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;