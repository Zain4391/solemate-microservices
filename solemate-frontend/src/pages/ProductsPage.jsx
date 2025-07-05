import { useState } from "react";
import React from 'react';
import ProductCard from "../components/ProductCard";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";

const ProductsPage = () => {
  const loaderData = useLoaderData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState(10000); // Set a high default
  const [sortBy, setSortBy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Access the nested data structure
  const products = loaderData?.products?.data?.products || [];
  const categories = loaderData?.categories?.data?.categories || [];
  const brands = loaderData?.brands?.data?.brands || [];
  const pagination = loaderData?.products?.data?.pagination || {};

  console.log(pagination);
  
  
  // Get current page from URL
  const currentPage = parseInt(searchParams.get('page')) || 1;
  
  // Get unique category and brand names
  const uniqueCategories = [...new Set(categories.map(cat => cat.c_name))];
  const uniqueBrands = [...new Set(brands)]; // Assuming brands come as strings
  
  // Get max price from products
  const maxPrice = Math.max(...products.map(p => p.price), 10000);
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.p_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      product.category?.some(cat => cat.c_name === selectedCategory);
    
    const matchesBrand = !selectedBrand || 
      product.brand === selectedBrand;
    
    const matchesPrice = product.price <= priceRange;
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-az':
        return a.p_name.localeCompare(b.p_name);
      case 'name-za':
        return b.p_name.localeCompare(a.p_name);
      default:
        return 0;
    }
  });
  
  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSortBy('');
    setPriceRange(maxPrice);
  };

  // Pagination logic
  const handlePageChange = (page) => {
    if (page === currentPage || isLoading) return;
    
    setIsLoading(true);
    
    // Build the new URL with new page
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    
    navigate(`/products?${params.toString()}`, { replace: true });
    
    // Loading will be cleared when component re-renders with new data
    setTimeout(() => setIsLoading(false), 100);
  };

  const generatePageNumbers = () => {
    const totalPages = pagination.total_pages || 1;
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const PaginationButton = ({ page, isActive, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive 
          ? 'bg-amber-600 text-white shadow-md' 
          : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-300'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
      `}
    >
      {page}
    </button>
  );

  return (
    <div className='p-6 bg-stone-50 min-h-screen'>
      {/* Filter Bar */}
      <div className='mb-8 max-w-7xl mx-auto'>
        <div className='bg-white rounded-2xl p-6 shadow-lg border border-stone-200'>
          {/* Top Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
            {/* Search Product */}
            <div className='flex flex-col'>
              <label className='text-stone-700 text-sm font-medium mb-2'>Search Product</label>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
              />
            </div>
            
            {/* Select Category */}
            <div className='flex flex-col'>
              <label className='text-stone-700 text-sm font-medium mb-2'>Select Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none cursor-pointer'
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((categoryName, index) => (
                  <option key={`category-${index}-${categoryName}`} value={categoryName}>
                    {categoryName}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Select Brand */}
            <div className='flex flex-col'>
              <label className='text-stone-700 text-sm font-medium mb-2'>Select Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className='w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none cursor-pointer'
              >
                <option value="">All Brands</option>
                {uniqueBrands.map((brandName, index) => (
                  <option key={`brand-${index}-${brandName}`} value={brandName}>
                    {brandName}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort By */}
            <div className='flex flex-col'>
              <label className='text-stone-700 text-sm font-medium mb-2'>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none cursor-pointer'
              >
                <option value="">Default</option>
                <option value="name-az">Name A-Z</option>
                <option value="name-za">Name Z-A</option>
                <option value="price-low">Price Low to High</option>
                <option value="price-high">Price High to Low</option>
              </select>
            </div>
          </div>
          
          {/* Bottom Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-end'>
            {/* Price Range */}
            <div className='flex flex-col'>
              <label className='text-stone-700 text-sm font-medium mb-2'>Max Price</label>
              <div className='relative'>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className='w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer slider'
                  style={{
                    background: `linear-gradient(to right, #d97706 0%, #d97706 ${(priceRange/maxPrice)*100}%, #d6d3d1 ${(priceRange/maxPrice)*100}%, #d6d3d1 100%)`
                  }}
                />
                <div className='flex justify-between mt-2 text-stone-600 text-sm'>
                  <span>$0</span>
                  <span className='text-amber-700 font-medium'>${priceRange.toLocaleString()}</span>
                  <span>Max: ${maxPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Reset Button */}
            <div className='flex flex-col'>
              <button
                onClick={handleReset}
                className='w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg'
              >
                RESET FILTERS
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results count */}
      <div className="max-w-7xl mx-auto mb-4">
        <p className="text-stone-600 text-sm">
          Showing {pagination.total_items > 0 ? ((pagination.current_page - 1) * pagination.items_per_page) + 1 : 0} to {Math.min(pagination.current_page * pagination.items_per_page, pagination.total_items)} of {pagination.total_items} products
          {selectedCategory && ` in "${selectedCategory}"`}
          {selectedBrand && ` from "${selectedBrand}"`}
          {searchTerm && ` matching "${searchTerm}"`}
          {priceRange < maxPrice && ` under $${priceRange.toLocaleString()}`}
        </p>
      </div>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-3 text-stone-600">Loading products...</p>
          </div>
        </div>
      )}
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 max-w-7xl mx-auto">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <ProductCard key={product.p_id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-stone-500 text-lg">No products found</p>
            {(searchTerm || selectedCategory || selectedBrand || priceRange < maxPrice) && (
              <button 
                onClick={handleReset}
                className="mt-2 text-amber-600 hover:text-amber-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      {pagination.total_pages > 1 && (
        <div className="mt-12 flex justify-center">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-stone-200">
            <div className="flex items-center justify-center space-x-1">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 mx-1 rounded-lg text-sm font-medium transition-all duration-200 bg-white text-stone-600 hover:bg-stone-50 border border-stone-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              {generatePageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-stone-400">...</span>
                  ) : (
                    <PaginationButton
                      page={page}
                      isActive={page === currentPage}
                      onClick={() => handlePageChange(page)}
                      disabled={isLoading}
                    />
                  )}
                </React.Fragment>
              ))}
              
              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.total_pages || isLoading}
                className="px-4 py-2 mx-1 rounded-lg text-sm font-medium transition-all duration-200 bg-white text-stone-600 hover:bg-stone-50 border border-stone-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #b45309;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #b45309;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

export default ProductsPage;