import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="card bg-white shadow-xl animate-pulse">
      <figure className="bg-stone-200 h-48 w-full"></figure>
      <div className="card-body">
        <div className="h-6 bg-stone-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-stone-200 rounded w-1/2 mb-1"></div>
        <div className="h-4 bg-stone-200 rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-stone-200 rounded w-1/4 mb-4"></div>
        <div className="card-actions justify-end">
          <div className="h-8 bg-stone-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;