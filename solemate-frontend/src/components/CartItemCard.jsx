import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, Package, ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';

// Individual Cart Item Component
const CartItemCard = ({ item, index = 0, onQuantityChange, onRemove, onUndo, pendingChanges }) => {
   const id = item.cart_id;
   const originalQuantity = item.quantity;
   const size = item.size;
   const productName = item.product?.p_name || 'Unknown Product';
   const price = item.product?.price || 0;
   const image = item.product?.P_Images?.[0]?.image_url;

   // Get current quantity (either pending change or original)
   const currentQuantity = pendingChanges[id]?.quantity ?? originalQuantity;
   const isMarkedForRemoval = pendingChanges[id]?.remove;
   const hasChanges = pendingChanges[id] && !isMarkedForRemoval;

   // Calculate total price for this item
   const itemTotal = (currentQuantity * price).toFixed(2);

   const handleQuantityChange = (newQuantity) => {
       if (newQuantity <= 0) {
           onRemove(id);
       } else {
           onQuantityChange(id, newQuantity);
       }
   };

   return (
       <>
           {!isMarkedForRemoval ? (
               <motion.div
                   initial={{ opacity: 0, y: 20, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   transition={{ 
                       duration: 0.4, 
                       delay: index * 0.1,
                       ease: "easeOut" 
                   }}
                   layout
                   className={`rounded-xl border p-6 transition-all ${
                       hasChanges 
                           ? 'bg-amber-50 border-amber-200 shadow-md' 
                           : 'bg-white border-stone-200 hover:shadow-lg'
                   }`}
                   whileHover={{ 
                       scale: hasChanges ? 1.01 : 1.02,
                       transition: { duration: 0.2 }
                   }}
               >
                   <div className="flex items-center space-x-4">
                       
                       {/* Product Image */}
                       <motion.div 
                           className="flex-shrink-0"
                           whileHover={{ scale: 1.05 }}
                           transition={{ duration: 0.2 }}
                       >
                           {image ? (
                               <motion.img 
                                   src={image} 
                                   alt={productName}
                                   className='w-20 h-20 object-cover rounded-lg border border-stone-200'
                                   initial={{ opacity: 0, scale: 0.8 }}
                                   animate={{ opacity: 1, scale: 1 }}
                                   transition={{ delay: 0.2 + index * 0.1 }}
                               />
                           ) : (
                               <div className="w-20 h-20 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-center">
                                   <Package className="w-8 h-8 text-stone-400" />
                               </div>
                           )}
                       </motion.div>

                       {/* Product Details */}
                       <motion.div 
                           className="flex-1 min-w-0"
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                       >
                           <h3 className='font-semibold text-stone-800 text-lg mb-1 truncate'>
                               {productName}
                           </h3>
                           <div className="flex items-center space-x-4 text-sm text-stone-600">
                               <span>Size: {size}</span>
                               <span>•</span>
                               <span>${price} each</span>
                               {hasChanges && (
                                   <>
                                       <span>•</span>
                                       <span className="text-amber-600 font-medium">Modified</span>
                                   </>
                               )}
                           </div>
                       </motion.div>

                       {/* Quantity Controls */}
                       <motion.div 
                           className="flex items-center space-x-3"
                           initial={{ opacity: 0, scale: 0.8 }}
                           animate={{ opacity: 1, scale: 1 }}
                           transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                       >
                           <motion.button 
                               className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                                   hasChanges 
                                       ? 'border-amber-300 hover:bg-amber-100' 
                                       : 'border-stone-300 hover:bg-stone-50'
                               }`}
                               whileHover={{ scale: 1.1 }}
                               whileTap={{ scale: 0.95 }}
                               disabled={currentQuantity <= 1}
                               onClick={() => handleQuantityChange(currentQuantity - 1)}
                           >
                               <Minus className="w-4 h-4 text-stone-600" />
                           </motion.button>
                           
                           <AnimatePresence mode="wait">
                               <motion.span 
                                   key={currentQuantity}
                                   className={`w-8 text-center font-medium ${
                                       hasChanges ? 'text-amber-700' : 'text-stone-800'
                                   }`}
                                   initial={{ scale: 1.3, opacity: 0 }}
                                   animate={{ scale: 1, opacity: 1 }}
                                   exit={{ scale: 0.7, opacity: 0 }}
                                   transition={{ duration: 0.2 }}
                               >
                                   {currentQuantity}
                               </motion.span>
                           </AnimatePresence>
                           
                           <motion.button 
                               className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                                   hasChanges 
                                       ? 'border-amber-300 hover:bg-amber-100' 
                                       : 'border-stone-300 hover:bg-stone-50'
                               }`}
                               whileHover={{ scale: 1.1 }}
                               whileTap={{ scale: 0.95 }}
                               onClick={() => handleQuantityChange(currentQuantity + 1)}
                           >
                               <Plus className="w-4 h-4 text-stone-600" />
                           </motion.button>
                       </motion.div>

                       {/* Item Total */}
                       <motion.div 
                           className="text-right min-w-0"
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                       >
                           <AnimatePresence mode="wait">
                               <motion.div 
                                   key={itemTotal}
                                   className={`font-semibold text-lg ${
                                       hasChanges ? 'text-amber-700' : 'text-stone-800'
                                   }`}
                                   initial={{ scale: 1.2, opacity: 0 }}
                                   animate={{ scale: 1, opacity: 1 }}
                                   exit={{ scale: 0.8, opacity: 0 }}
                                   transition={{ duration: 0.3 }}
                               >
                                   ${itemTotal}
                               </motion.div>
                           </AnimatePresence>
                       </motion.div>

                       {/* Remove Button */}
                       <motion.div 
                           className="flex-shrink-0"
                           initial={{ opacity: 0, rotate: -90 }}
                           animate={{ opacity: 1, rotate: 0 }}
                           transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                       >
                           <motion.button 
                               className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                               whileHover={{ scale: 1.1, rotate: 10 }}
                               whileTap={{ scale: 0.95, rotate: -5 }}
                               onClick={() => onRemove(id)}
                           >
                               <Trash2 className="w-4 h-4" />
                           </motion.button>
                       </motion.div>
                   </div>
               </motion.div>
           ) : (
               <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
                   <span className="text-red-600 font-medium">
                       {productName} will be removed
                   </span>
                   <button 
                       onClick={() => onUndo ? onUndo(id) : onQuantityChange(id, originalQuantity)}
                       className="text-red-600 hover:text-red-700 font-medium text-sm"
                   >
                       Undo
                   </button>
               </div>
           )}
       </>
   );
};

export default CartItemCard;