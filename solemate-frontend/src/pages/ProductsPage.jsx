import { useState } from "react";
import React from 'react';
import ProductCard from "../components/ProductCard";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.button
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
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2 }}
    >
      {page}
    </motion.button>
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      className='p-6 bg-stone-50 min-h-screen'
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Filter Bar */}
      <motion.div 
        className='mb-8 max-w-7xl mx-auto'
        variants={itemVariants}
      >
        <motion.div 
          className='bg-white rounded-2xl p-6 shadow-lg border border-stone-200'
          whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Top Row */}
          <motion.div 
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'
            variants={containerVariants}
          >
            {/* Search Product */}
            <motion.div 
              className='flex flex-col'
              variants={itemVariants}
            >
              <label className='text-stone-700 text-sm font-medium mb-2'>Search Product</label>
              <motion.input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
            
            {/* Select Category */}
            <motion.div 
              className='flex flex-col'
              variants={itemVariants}
            >
              <label className='text-stone-700 text-sm font-medium mb-2'>Select Category</label>
              <motion.select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none cursor-pointer'
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((categoryName, index) => (
                  <option key={`category-${index}-${categoryName}`} value={categoryName}>
                    {categoryName}
                  </option>
                ))}
              </motion.select>
            </motion.div>
            
            {/* Select Brand */}
            <motion.div 
              className='flex flex-col'
              variants={itemVariants}
            >
              <label className='text-stone-700 text-sm font-medium mb-2'>Select Brand</label>
              <motion.select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className='w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none cursor-pointer'
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <option value="">All Brands</option>
                {uniqueBrands.map((brandName, index) => (
                  <option key={`brand-${index}-${brandName}`} value={brandName}>
                    {brandName}
                  </option>
                ))}
              </motion.select>
            </motion.div>
            
            {/* Sort By */}
            <motion.div 
              className='flex flex-col'
              variants={itemVariants}
            >
              <label className='text-stone-700 text-sm font-medium mb-2'>Sort By</label>
              <motion.select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none cursor-pointer'
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <option value="">Default</option>
                <option value="name-az">Name A-Z</option>
                <option value="name-za">Name Z-A</option>
                <option value="price-low">Price Low to High</option>
                <option value="price-high">Price High to Low</option>
              </motion.select>
            </motion.div>
          </motion.div>
          
          {/* Bottom Row */}
          <motion.div 
            className='grid grid-cols-1 md:grid-cols-2 gap-6 items-end'
            variants={containerVariants}
          >
            {/* Price Range */}
            <motion.div 
              className='flex flex-col'
              variants={itemVariants}
            >
              <label className='text-stone-700 text-sm font-medium mb-2'>Max Price</label>
              <div className='relative'>
                <motion.input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className='w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer slider'
                  style={{
                    background: `linear-gradient(to right, #d97706 0%, #d97706 ${(priceRange/maxPrice)*100}%, #d6d3d1 ${(priceRange/maxPrice)*100}%, #d6d3d1 100%)`
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.div 
                  className='flex justify-between mt-2 text-stone-600 text-sm'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span>$0</span>
                  <motion.span 
                    className='text-amber-700 font-medium'
                    key={priceRange} // Re-animate when value changes
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    ${priceRange.toLocaleString()}
                  </motion.span>
                  <span>Max: ${maxPrice.toLocaleString()}</span>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Reset Button */}
            <motion.div 
              className='flex flex-col'
              variants={itemVariants}
            >
              <motion.button
                onClick={handleReset}
                className='w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg'
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" 
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                RESET FILTERS
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Results count */}
      <motion.div 
        className="max-w-7xl mx-auto mb-4"
        variants={itemVariants}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-stone-600 text-sm">
          Showing {pagination.total_items > 0 ? ((pagination.current_page - 1) * pagination.items_per_page) + 1 : 0} to {Math.min(pagination.current_page * pagination.items_per_page, pagination.total_items)} of {pagination.total_items} products
          {selectedCategory && ` in "${selectedCategory}"`}
          {selectedBrand && ` from "${selectedBrand}"`}
          {searchTerm && ` matching "${searchTerm}"`}
          {priceRange < maxPrice && ` under $${priceRange.toLocaleString()}`}
        </p>
      </motion.div>
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="mt-3 text-stone-600">Loading products...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Products Grid */}
      <AnimatePresence mode="wait">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 max-w-7xl mx-auto"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          key={`${searchTerm}-${selectedCategory}-${selectedBrand}-${sortBy}-${priceRange}`} // Re-animate on filter changes
        >
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product, index) => (
              <motion.div
                key={product.p_id}
                variants={cardVariants}
                custom={index}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="col-span-full text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p 
                className="text-stone-500 text-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                No products found
              </motion.p>
              {(searchTerm || selectedCategory || selectedBrand || priceRange < maxPrice) && (
                <motion.button 
                  onClick={handleReset}
                  className="mt-2 text-amber-600 hover:text-amber-700 font-medium"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear all filters
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Pagination Controls */}
      {pagination.total_pages > 1 && (
        <motion.div 
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div 
            className="bg-white rounded-2xl p-4 shadow-lg border border-stone-200"
            whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center space-x-1">
              {/* Previous Button */}
              <motion.button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 mx-1 rounded-lg text-sm font-medium transition-all duration-200 bg-white text-stone-600 hover:bg-stone-50 border border-stone-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={currentPage !== 1 && !isLoading ? { scale: 1.05 } : {}}
                whileTap={currentPage !== 1 && !isLoading ? { scale: 0.95 } : {}}
              >
                Previous
              </motion.button>
              
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
              <motion.button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.total_pages || isLoading}
                className="px-4 py-2 mx-1 rounded-lg text-sm font-medium transition-all duration-200 bg-white text-stone-600 hover:bg-stone-50 border border-stone-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={currentPage !== pagination.total_pages && !isLoading ? { scale: 1.05 } : {}}
                whileTap={currentPage !== pagination.total_pages && !isLoading ? { scale: 0.95 } : {}}
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
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
    </motion.div>
  );
}

export default ProductsPage;