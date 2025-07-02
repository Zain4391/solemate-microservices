import React, { useState } from 'react';
import { useParams, useLoaderData, Link } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, Star, ChevronRight } from 'lucide-react';

const ProductPage = () => {
  const { id } = useParams();
  const loaderData = useLoaderData();
  
  // Extract product data
  const product = loaderData?.data?.product?.[0];
  
  // State for selected size and quantities
  const [quantities, setQuantities] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Product not found</h2>
          <p className="text-stone-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  const { p_name, brand, price, category, P_Size, P_Images } = product;
  
  // Calculate total quantity and check if any quantity exceeds stock
  const getTotalQuantity = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };
  
  const hasInvalidQuantity = () => {
    return P_Size.some(sizeObj => {
      const qty = quantities[sizeObj.size] || 0;
      return qty > sizeObj.stock;
    });
  };
  
  const handleQuantityChange = (size, change) => {
    setQuantities(prev => {
      const currentQty = prev[size] || 0;
      const newQty = Math.max(0, currentQty + change);
      const sizeObj = P_Size.find(s => s.size === size);
      const maxQty = sizeObj ? sizeObj.stock : 0;
      
      return {
        ...prev,
        [size]: Math.min(newQty, maxQty)
      };
    });
  };
  
  const canDecrease = (size) => (quantities[size] || 0) > 0;
  const canIncrease = (size) => {
    const sizeObj = P_Size.find(s => s.size === size);
    return (quantities[size] || 0) < (sizeObj?.stock || 0);
  };
  
  const isProceedDisabled = getTotalQuantity() === 0 || hasInvalidQuantity();
  
  // Calculate total stock
  const totalStock = P_Size.reduce((sum, sizeObj) => sum + sizeObj.stock, 0);
  
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-stone-600 mb-8">
          <Link to="/" className="hover:text-amber-700 transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products" className="hover:text-amber-700 transition-colors">Products</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-amber-700 font-medium">{p_name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gradient-to-br from-stone-100 to-stone-200 rounded-3xl shadow-sm border border-stone-100 relative overflow-hidden">
              <img
                src={P_Images[selectedImageIndex]?.image_url}
                alt={p_name}
                className="w-full h-full object-cover drop-shadow-2xl"
              />
            </div>
            
            {/* Thumbnail Images */}
            {P_Images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {P_Images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 transition-all bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden ${
                      selectedImageIndex === index
                        ? 'border-amber-600 ring-2 ring-amber-200'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`${p_name} ${index + 1}`}
                      className="w-full h-full object-cover drop-shadow-lg"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Thumbnail Dots */}
            {P_Images.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {P_Images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      selectedImageIndex === index ? 'bg-amber-500' : 'bg-stone-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              {category.map((cat, index) => (
                <span key={index} className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {cat.c_name}
                </span>
              ))}
            </div>
            
            {/* Product Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-stone-800 leading-tight mb-3">
                {p_name}
              </h1>
              
              {/* Reviews */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-stone-600 text-sm">(4.8 • 124 customer reviews)</span>
              </div>
              
              {/* Brand and Availability */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-amber-500 rounded text-white text-xs font-bold flex items-center justify-center">
                    {brand.charAt(0)}
                  </span>
                  <span className="font-medium text-stone-700">{brand}</span>
                </div>
                <div className="text-green-600 text-sm font-medium">
                  Availability: {totalStock} in stock
                </div>
              </div>
            </div>
            
            {/* Product Features */}
            <div className="bg-stone-100 rounded-2xl p-6">
              <ul className="space-y-2 text-stone-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  Premium materials and construction
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  Comfortable fit for all-day wear
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  Durable and long-lasting design
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  Available in multiple sizes
                </li>
              </ul>
            </div>
            
            {/* Description */}
            <div>
              <p className="text-stone-600 leading-relaxed">
                Experience comfort and style with these premium {p_name.toLowerCase()}. 
                Crafted with high-quality materials and designed for everyday wear, 
                these shoes offer the perfect blend of fashion and functionality.
              </p>
            </div>
            
            {/* SKU */}
            <div className="text-sm text-stone-500">
              <span className="font-medium">SKU:</span> {id}
            </div>
            
            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-stone-800">${price}</span>
              <span className="text-xl text-stone-400 line-through">${Math.round(price * 1.18)}</span>
            </div>
            
            {/* Size Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-stone-800">Size & Quantity</h3>
              
              <div className="space-y-3">
                {P_Size.map((sizeObj) => {
                  const quantity = quantities[sizeObj.size] || 0;
                  const isOutOfStock = sizeObj.stock === 0;
                  
                  return (
                    <div
                      key={sizeObj.size}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        isOutOfStock
                          ? 'border-stone-200 bg-stone-50 opacity-50'
                          : 'border-stone-200 hover:border-amber-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-semibold text-stone-800">
                          Size {sizeObj.size}
                        </div>
                        <div className="text-sm text-stone-500">
                          {isOutOfStock ? (
                            <span className="text-red-500 font-medium">Out of Stock</span>
                          ) : (
                            <span>{sizeObj.stock} available</span>
                          )}
                        </div>
                      </div>
                      
                      {!isOutOfStock && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleQuantityChange(sizeObj.size, -1)}
                            disabled={!canDecrease(sizeObj.size)}
                            className="w-8 h-8 rounded-full border border-stone-300 bg-white text-stone-600 hover:bg-amber-100 hover:border-amber-600 hover:text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          
                          <div className="w-16 text-center">
                            <span className="w-full h-8 flex items-center justify-center bg-white border border-stone-300 rounded-lg text-stone-800 font-medium">
                              {quantity}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleQuantityChange(sizeObj.size, 1)}
                            disabled={!canIncrease(sizeObj.size)}
                            className="w-8 h-8 rounded-full border border-stone-300 bg-white text-stone-600 hover:bg-amber-100 hover:border-amber-600 hover:text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Order Summary */}
            {getTotalQuantity() > 0 && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div className="text-stone-700">
                    <div className="font-medium">Total: {getTotalQuantity()} pairs</div>
                    <div className="text-sm text-stone-600">
                      {Object.entries(quantities)
                        .filter(([_, qty]) => qty > 0)
                        .map(([size, qty]) => `Size ${size}: ${qty}`)
                        .join(', ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-700">
                      ${(getTotalQuantity() * price).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Button */}
            <div className="pt-2">
              <button
                disabled={isProceedDisabled}
                className={`btn btn-lg w-full h-14 text-lg font-semibold rounded-xl ${
                  isProceedDisabled
                    ? 'btn-disabled bg-stone-300 text-stone-500'
                    : 'bg-amber-600 hover:bg-amber-700 text-white border-0 shadow-lg hover:shadow-xl'
                }`}
              >
                <ShoppingCart className="h-6 w-6 mr-2" />
                {getTotalQuantity() === 0 ? 'Select Size & Quantity' : 'Add to cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;