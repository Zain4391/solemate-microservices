// src/pages/CartPage.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';
import { updateCart, removeItemFromCart, fetchItemsFromCart } from '../store/slices/cartSlice.js';

const CartPage = () => {
  const { items, totalItems, totalAmount, isLoading } = useSelector(state => state.cart);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  // Batch update state
  const [pendingChanges, setPendingChanges] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUndo = (cartId) => {
    setPendingChanges(prev => {
      const newChanges = { ...prev };
      delete newChanges[cartId]; // Completely remove the pending change
      return newChanges;
    });
  };

  // Check if there are any pending changes
  const hasChanges = Object.keys(pendingChanges).length > 0;

  // Handle quantity changes (local state only)
  const handleQuantityChange = (cartId, newQuantity) => {
    setPendingChanges(prev => ({
      ...prev,
      [cartId]: { quantity: newQuantity, remove: false }
    }));
  };

  // Handle item removal (local state only)
  const handleRemove = (cartId) => {
    setPendingChanges(prev => ({
      ...prev,
      [cartId]: { remove: true }
    }));
  };

  // Calculate new totals with pending changes
  const calculateNewTotals = () => {
    let newTotalItems = 0;
    let newTotalAmount = 0;

    items.forEach(item => {
      const change = pendingChanges[item.cart_id];
      if (change?.remove) return; // Skip removed items
      
      const quantity = change?.quantity ?? item.quantity;
      const price = item.product?.price ?? 0;
      
      newTotalItems += quantity;
      newTotalAmount += quantity * price;
    });

    return { newTotalItems, newTotalAmount };
  };

  // Batch update function
  const handleUpdateCart = async () => {
    setIsUpdating(true);
    
    try {
      // Process all pending changes
      const promises = Object.entries(pendingChanges).map(([cartId, change]) => {
        if (change.remove) {
          // Dispatch remove action
          return dispatch(removeItemFromCart({ 
            cartId, 
            userId: user.u_id 
          })).unwrap();
        } else {
          // Dispatch update action
          return dispatch(updateCart({ 
            cartId, 
            updateData: { quantity: change.quantity },
            userId: user.u_id 
          })).unwrap();
        }
      });

      // Wait for all updates to complete
      await Promise.all(promises);

      await dispatch(fetchItemsFromCart(user.userId));
      
      // Clear pending changes
      setPendingChanges({});
      
    } catch (error) {
      console.error('Error updating cart:', error);
      // You could show a toast notification here
    } finally {
      setIsUpdating(false);
    }
  };

  // Use new totals if there are changes, otherwise use Redux totals
  const displayTotals = hasChanges ? calculateNewTotals() : { 
    newTotalItems: totalItems, 
    newTotalAmount: totalAmount 
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Please Login</h2>
          <p className="text-stone-600">You need to be logged in to view your cart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Page Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-stone-800">Shopping Cart</h1>
          <p className="text-stone-600 mt-2">
            {displayTotals.newTotalItems} items in your cart
            {hasChanges && (
              <span className="text-amber-600 font-medium ml-2">
                • {Object.keys(pendingChanges).length} changes pending
              </span>
            )}
          </p>
        </motion.div>

        {/* Main Grid - Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-stone-200 p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Your Items</h2>
              
              <div className="space-y-4">
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <CartItemCard 
                      key={item.cart_id} 
                      item={item}
                      index={index}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                      onUndo={handleUndo}
                      pendingChanges={pendingChanges}
                    />
                  ))
                ) : (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <ShoppingCart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-500 text-lg">Your cart is empty</p>
                    <Link 
                      to="/products" 
                      className="text-amber-600 hover:text-amber-700 font-medium mt-2 inline-block"
                    >
                      Continue Shopping
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Update Cart Button - Only shown when there are changes */}
            <AnimatePresence>
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="mt-6"
                >
                  <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <ShoppingCart className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="font-medium text-stone-800">
                            {Object.keys(pendingChanges).length} changes pending
                          </p>
                          <p className="text-sm text-stone-600">
                            New total: {displayTotals.newTotalItems} items • ${displayTotals.newTotalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setPendingChanges({})}
                          className="px-4 py-2 text-stone-600 hover:text-stone-800 transition-colors"
                          disabled={isUpdating}
                        >
                          Cancel
                        </button>
                        
                        <motion.button
                          onClick={handleUpdateCart}
                          disabled={isUpdating}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isUpdating ? (
                            <>
                              <motion.div
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              <span>Updating...</span>
                            </>
                          ) : (
                            <span>Update Cart</span>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 sticky top-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-stone-600">
                    Items ({displayTotals.newTotalItems})
                    {hasChanges && <span className="text-amber-600 ml-1">*</span>}
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={displayTotals.newTotalAmount}
                      className={`${hasChanges ? 'text-amber-700 font-medium' : 'text-stone-800'}`}
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ${displayTotals.newTotalAmount?.toFixed(2) || '0.00'}
                    </motion.span>
                  </AnimatePresence>
                </div>
                
                <div className="border-t border-stone-200 pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={displayTotals.newTotalAmount}
                        className={hasChanges ? 'text-amber-700' : 'text-stone-800'}
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ${displayTotals.newTotalAmount?.toFixed(2) || '0.00'}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>

                {hasChanges && (
                  <motion.p 
                    className="text-xs text-amber-600 italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    * Pending changes shown. Click "Update Cart" to save.
                  </motion.p>
                )}

                <Link 
                  to="/checkout"
                  className={`w-full px-2 py-3 rounded-lg font-medium transition-colors mt-6 flex items-center justify-center space-x-2 ${
                    hasChanges 
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed' 
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                  onClick={(e) => hasChanges && e.preventDefault()}
                >
                  {hasChanges ? (
                    <span>Update Cart First</span>
                  ) : (
                    <>
                      <span>Proceed to Checkout</span>
                      <ArrowRight className='w-4 h-4 ml-2'/>
                    </>
                  )}
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;