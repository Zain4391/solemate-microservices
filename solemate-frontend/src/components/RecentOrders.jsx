// src/components/RecentOrders.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Eye, MoreHorizontal } from 'lucide-react';

const RecentOrders = ({ orders }) => {
    const getOrderStatusColor = (order) => {
        if (order.is_complete) return 'text-green-600 bg-green-100';
        return 'text-amber-600 bg-amber-100';
    };
    
    const getOrderStatusText = (order) => {
        return order.is_complete ? 'Completed' : 'Pending';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
        >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-stone-800 flex items-center">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Recent Orders
                </h2>
                <Link 
                    to="/orders"
                    className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center"
                >
                    <span className="hidden sm:inline">View All</span>
                    <span className="sm:hidden">All</span>
                    <MoreHorizontal className="w-4 h-4 ml-1" />
                </Link>
            </div>
            
            {orders.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order.o_id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + index * 0.1 }}
                            className="flex items-center justify-between p-3 sm:p-4 border border-stone-200 rounded-lg sm:rounded-xl hover:bg-stone-50 transition-colors"
                        >
                            <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-stone-800 text-sm sm:text-base truncate">
                                        #{order.o_id.slice(-8)}
                                    </p>
                                    <p className="text-xs sm:text-sm text-stone-600">
                                        {new Date(order.order_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <div className="text-right">
                                    <p className="font-semibold text-stone-800 text-sm sm:text-base">
                                        ${order.total_amount.toFixed(2)}
                                    </p>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order)}`}>
                                        {getOrderStatusText(order)}
                                    </span>
                                </div>
                                
                                <Link
                                    to={`/orders`}
                                    className="p-1 sm:p-2 text-stone-400 hover:text-stone-600 transition-colors flex-shrink-0"
                                >
                                    <Eye className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 sm:py-8">
                    <Package className="w-10 h-10 sm:w-12 sm:h-12 text-stone-300 mx-auto mb-3 sm:mb-4" />
                    <p className="text-stone-500 text-sm sm:text-base">No orders yet</p>
                    <Link 
                        to="/products"
                        className="text-amber-600 hover:text-amber-700 font-medium mt-2 inline-block text-sm sm:text-base"
                    >
                        Start Shopping
                    </Link>
                </div>
            )}
        </motion.div>
    );
};

export default RecentOrders;