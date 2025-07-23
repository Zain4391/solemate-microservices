import React, { useState } from 'react';
import { useParams, useLoaderData, Link } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, Star, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice.js';
import toast from 'react-hot-toast';

const ProductPage = () => {
  const { id } = useParams();
  const loaderData = useLoaderData();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { isLoading } = useSelector(state => state.cart);
  
  // Extract product data
  const product = loaderData?.data?.product?.[0];
  
  // State for selected size and quantities
  const [quantities, setQuantities] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleAddToCart = async () => {
    
    // Check authentication
    if (!isAuthenticated || !user) {
      toast.error('Please login to add items to your cart', {
        id: 'auth-required', // Prevents duplicate toasts
      });
      return;
    }
  
    // Prepare items to add
    const itemsToAdd = Object.entries(quantities)
      .filter(([size, qty]) => qty > 0)
      .map(([size, qty]) => ({
        userId: user.userId,
        productId: id,
        size: size,
        quantity: qty
      }));
  
    if (itemsToAdd.length === 0) {
      toast.error('Please select at least one item');
      return;
    }
  
    // Show loading toast
    const loadingToastId = toast.loading(
      `Adding ${getTotalQuantity()} item${getTotalQuantity() > 1 ? 's' : ''} to cart...`
    );
  
    try {
      // Add all items simultaneously
      const addPromises = itemsToAdd.map(item => 
        dispatch(addToCart(item)).unwrap() // .unwrap() throws error if rejected
      );
  
      await Promise.all(addPromises);
  
      // Success toast
      toast.success(
        `🎉 Added ${getTotalQuantity()} ${p_name} to your cart!`,
        {
          id: loadingToastId, // Replaces the loading toast
          duration: 3000,
        }
      );
  
      // Reset quantities
      setQuantities({});
  
    } catch (error) {
      // Error toast
      toast.error(
        'Failed to add items to cart. Please try again.',
        {
          id: loadingToastId, // Replaces the loading toast
        }
      );
      
      console.error('Cart error:', error);
    }
  };
  
  // Alternative with more detailed error handling
  const handleAddToCartDetailed = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to add items to your cart');
      return;
    }
  
    const itemsToAdd = Object.entries(quantities)
      .filter(([size, qty]) => qty > 0)
      .map(([size, qty]) => ({
        userId: user.id || user.u_id,
        productId: id,
        size: size,
        quantity: qty
      }));
  
    if (itemsToAdd.length === 0) return;
  
    const totalItems = getTotalQuantity();
    const loadingToastId = toast.loading(`Adding ${totalItems} items...`);
  
    try {
      const results = await Promise.allSettled(
        itemsToAdd.map(item => dispatch(addToCart(item)).unwrap())
      );
  
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
  
      if (successful === totalItems) {
        // All succeeded
        toast.success(
          `🛒 Successfully added ${successful} items to cart!`,
          { id: loadingToastId }
        );
        setQuantities({});
      } else if (successful > 0) {
        // Partial success
        toast.success(
          `Added ${successful} items. ${failed} failed to add.`,
          { id: loadingToastId, duration: 5000 }
        );
      } else {
        // All failed
        toast.error(
          'Failed to add items to cart. Please try again.',
          { id: loadingToastId }
        );
      }
  
    } catch (error) {
      toast.error('Something went wrong. Please try again.', {
        id: loadingToastId
      });
    }
  };
  
  if (!product) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-stone-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Product not found</h2>
          <p className="text-stone-600">The product you're looking for doesn't exist.</p>
        </motion.div>
      </motion.div>
    );
  }
  
  const { p_name, brand, price, category, P_Size, P_Images } = product;
  
  // Calculate total quantity and check if any quantity exceeds stock
  const getTotalQuantity = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };
  
  const hasInvalidQuantity = () => {
    return P_Size
        .filter(sizeObj => sizeObj.stock >= 0) // Only check items with valid stock
        .some(sizeObj => {
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

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { y: 30, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const imageVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Add this debugging code right before your return statement
console.log('🔍 Debug button state:');
console.log('getTotalQuantity():', getTotalQuantity());
console.log('hasInvalidQuantity():', hasInvalidQuantity());
console.log('isProceedDisabled:', isProceedDisabled);
console.log('isLoading:', isLoading);
console.log('quantities state:', quantities);
console.log('P_Size data:', P_Size);
  
  return (
    <motion.div 
      className="min-h-screen bg-stone-50"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <motion.div 
          className="flex items-center gap-2 text-sm text-stone-600 mb-8"
          variants={itemVariants}
        >
          <Link to="/" className="hover:text-amber-700 transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products" className="hover:text-amber-700 transition-colors">Products</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-amber-700 font-medium">{p_name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div 
            className="space-y-4"
            variants={itemVariants}
          >
            {/* Main Image */}
            <motion.div 
              className="aspect-square bg-gradient-to-br from-stone-100 to-stone-200 rounded-3xl shadow-sm border border-stone-100 relative overflow-hidden"
              variants={imageVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  src={P_Images[selectedImageIndex]?.image_url}
                  alt={p_name}
                  className="w-full h-full object-cover drop-shadow-2xl"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
            </motion.div>
            
            {/* Thumbnail Images */}
            {P_Images.length > 1 && (
              <motion.div 
                className="flex gap-3 overflow-x-auto pb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {P_Images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 transition-all bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden ${
                      selectedImageIndex === index
                        ? 'border-amber-600 ring-2 ring-amber-200'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={image.image_url}
                      alt={`${p_name} ${index + 1}`}
                      className="w-full h-full object-cover drop-shadow-lg"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
            
            {/* Thumbnail Dots */}
            {P_Images.length > 1 && (
              <motion.div 
                className="flex justify-center gap-2 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                {P_Images.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      selectedImageIndex === index ? 'bg-amber-500' : 'bg-stone-300'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
          
          {/* Product Details */}
          <motion.div 
            className="space-y-6"
            variants={itemVariants}
          >
            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {category.map((cat, index) => (
                <motion.span 
                  key={index} 
                  className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {cat.c_name}
                </motion.span>
              ))}
            </motion.div>
            
            {/* Product Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.h1 
                className="text-3xl lg:text-4xl font-bold text-stone-800 leading-tight mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {p_name}
              </motion.h1>
              
              {/* Reviews */}
              <motion.div 
                className="flex items-center gap-3 mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1, duration: 0.3 }}
                    >
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </motion.div>
                  ))}
                </div>
                <span className="text-stone-600 text-sm">(4.8 • 124 customer reviews)</span>
              </motion.div>
              
              {/* Brand and Availability */}
              <motion.div 
                className="flex items-center gap-6 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <motion.span 
                    className="w-6 h-6 bg-amber-500 rounded text-white text-xs font-bold flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {brand.charAt(0)}
                  </motion.span>
                  <span className="font-medium text-stone-700">{brand}</span>
                </div>
                <motion.div 
                  className="text-green-600 text-sm font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  Availability: {totalStock} in stock
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Product Features */}
            <motion.div 
              className="bg-stone-100 rounded-2xl p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.ul 
                className="space-y-2 text-stone-700"
                variants={{
                  animate: {
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                initial="initial"
                animate="animate"
              >
                {[
                  "Premium materials and construction",
                  "Comfortable fit for all-day wear", 
                  "Durable and long-lasting design",
                  "Available in multiple sizes"
                ].map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center gap-2"
                    variants={{
                      initial: { opacity: 0, x: -10 },
                      animate: { opacity: 1, x: 0 }
                    }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                  >
                    <motion.div 
                      className="w-1.5 h-1.5 bg-amber-500 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.2 }}
                    />
                    {feature}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <p className="text-stone-600 leading-relaxed">
                Experience comfort and style with these premium {p_name.toLowerCase()}. 
                Crafted with high-quality materials and designed for everyday wear, 
                these shoes offer the perfect blend of fashion and functionality.
              </p>
            </motion.div>
            
            {/* SKU */}
            <motion.div 
              className="text-sm text-stone-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              <span className="font-medium">SKU:</span> {id}
            </motion.div>
            
            {/* Price */}
            <motion.div 
              className="flex items-baseline gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.6, type: "spring" }}
            >
              <motion.span 
                className="text-4xl font-bold text-stone-800"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                ${price}
              </motion.span>
              <motion.span 
                className="text-xl text-stone-400 line-through"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.6 }}
              >
                ${Math.round(price * 1.18)}
              </motion.span>
            </motion.div>
            
            {/* Size Selection */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-stone-800">Size & Quantity</h3>
              
              <motion.div 
                className="space-y-3"
                variants={{
                  animate: {
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                initial="initial"
                animate="animate"
              >
                {P_Size.filter(sizeObj => sizeObj.stock >= 0).map((sizeObj, index) => {
                  const quantity = quantities[sizeObj.size] || 0;
                  const isOutOfStock = sizeObj.stock === 0;
                  
                  return (
                    <motion.div
                      key={sizeObj.size}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        isOutOfStock
                          ? 'border-stone-200 bg-stone-50 opacity-50'
                          : 'border-stone-200 hover:border-amber-300 bg-white'
                      }`}
                      variants={{
                        initial: { opacity: 0, x: -20 },
                        animate: { opacity: 1, x: 0 }
                      }}
                      transition={{ delay: 1.7 + index * 0.1, duration: 0.5 }}
                      whileHover={!isOutOfStock ? { 
                        scale: 1.02, 
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
                      } : {}}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="text-lg font-semibold text-stone-800"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.8 + index * 0.1, duration: 0.3 }}
                        >
                          Size {sizeObj.size}
                        </motion.div>
                        <div className="text-sm text-stone-500">
                          {isOutOfStock ? (
                            <span className="text-red-500 font-medium">Out of Stock</span>
                          ) : (
                            <span>{sizeObj.stock} available</span>
                          )}
                        </div>
                      </div>
                      
                      {!isOutOfStock && (
                        <motion.div 
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.9 + index * 0.1, duration: 0.4 }}
                        >
                          <motion.button
                            onClick={() => handleQuantityChange(sizeObj.size, -1)}
                            disabled={!canDecrease(sizeObj.size)}
                            className="w-8 h-8 rounded-full border border-stone-300 bg-white text-stone-600 hover:bg-amber-100 hover:border-amber-600 hover:text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                            whileHover={canDecrease(sizeObj.size) ? { scale: 1.1 } : {}}
                            whileTap={canDecrease(sizeObj.size) ? { scale: 0.9 } : {}}
                          >
                            <Minus className="h-4 w-4" />
                          </motion.button>
                          
                          <div className="w-16 text-center">
                            <AnimatePresence mode="wait">
                              <motion.span 
                                key={quantity}
                                className="w-full h-8 flex items-center justify-center bg-white border border-stone-300 rounded-lg text-stone-800 font-medium"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.2, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {quantity}
                              </motion.span>
                            </AnimatePresence>
                          </div>
                          
                          <motion.button
                            onClick={() => handleQuantityChange(sizeObj.size, 1)}
                            disabled={!canIncrease(sizeObj.size)}
                            className="w-8 h-8 rounded-full border border-stone-300 bg-white text-stone-600 hover:bg-amber-100 hover:border-amber-600 hover:text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                            whileHover={canIncrease(sizeObj.size) ? { scale: 1.1 } : {}}
                            whileTap={canIncrease(sizeObj.size) ? { scale: 0.9 } : {}}
                          >
                            <Plus className="h-4 w-4" />
                          </motion.button>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
            
            {/* Order Summary */}
            <AnimatePresence>
              {getTotalQuantity() > 0 && (
                <motion.div 
                  className="bg-amber-50 border border-amber-300 rounded-xl p-4"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  layout
                >
                  <div className="flex justify-between items-center">
                    <div className="text-stone-700">
                      <motion.div 
                        className="font-medium"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        Total: {getTotalQuantity()} pairs
                      </motion.div>
                      <motion.div 
                        className="text-sm text-stone-600"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {Object.entries(quantities)
                          .filter(([_, qty]) => qty > 0)
                          .map(([size, qty]) => `Size ${size}: ${qty}`)
                          .join(', ')}
                      </motion.div>
                    </div>
                    <motion.div 
                      className="text-right"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      <div className="text-2xl font-bold text-amber-700">
                        ${(getTotalQuantity() * price).toFixed(2)}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Action Button */}
            <motion.div 
              className="pt-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.6 }}
            >
              <motion.button
                onClick={handleAddToCart}
                disabled={isProceedDisabled || isLoading}
                className={`btn btn-lg w-full h-14 text-lg font-semibold rounded-xl ${
                  isProceedDisabled || isLoading
                    ? 'btn-disabled bg-stone-300 text-stone-500'
                    : 'bg-amber-600 hover:bg-amber-700 text-white border-0 shadow-lg hover:shadow-xl'
                }`}
                whileHover={!isProceedDisabled ? { 
                  scale: 1.02, 
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)" 
                } : {}}
                whileTap={!isProceedDisabled ? { scale: 0.98 } : {}}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2, duration: 0.4 }}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding to Cart...
                    </>
                  ): (
                    <>
                      <ShoppingCart className="h-6 w-6 mr-2" />
                      {getTotalQuantity() === 0 ? 'Select Size & Quantity' : 'Add to cart'}
                    </>
                  )}
                </motion.div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductPage;