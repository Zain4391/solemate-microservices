import React from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

// Checkout Order Item Component (Read-only display)
const OrderItemCard = ({ item, index = 0 }) => {
   const productName = item.product?.p_name || 'Unknown Product';
   const price = item.product?.price || 0;
   const quantity = item.quantity;
   const size = item.size;
   const image = item.product?.P_Images?.[0]?.image_url;

   // Calculate total price for this item
   const itemTotal = (quantity * price).toFixed(2);

   return (
       <motion.div
           initial={{ opacity: 0, y: 20, scale: 0.95 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           transition={{ 
               duration: 0.4, 
               delay: index * 0.1,
               ease: "easeOut" 
           }}
           className="rounded-xl border border-stone-200 bg-white p-6 hover:shadow-lg transition-all"
           whileHover={{ 
               scale: 1.01,
               transition: { duration: 0.2 }
           }}
       >
           <div className="flex items-center space-x-4">
               
               {/* Product Image */}
               <motion.div 
                   className="flex-shrink-0"
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.2 + index * 0.1 }}
               >
                   {image ? (
                       <img 
                           src={image} 
                           alt={productName}
                           className='w-20 h-20 object-cover rounded-lg border border-stone-200'
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
                       <span>Size: {size || 'N/A'}</span>
                       <span>•</span>
                       <span>Qty: {quantity}</span>
                       <span>•</span>
                       <span>${price.toFixed(2)} each</span>
                   </div>
               </motion.div>

               {/* Item Total */}
               <motion.div 
                   className="text-right min-w-0"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
               >
                   <div className="font-semibold text-lg text-stone-800">
                       ${itemTotal}
                   </div>
                   <div className="text-sm text-stone-500">
                       ${price.toFixed(2)} × {quantity}
                   </div>
               </motion.div>
           </div>
       </motion.div>
   );
};

export default OrderItemCard;