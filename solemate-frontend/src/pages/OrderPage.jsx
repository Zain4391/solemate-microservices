import React, { useState } from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CheckCircle, CreditCard, Eye, Calendar, MapPin } from 'lucide-react';

const OrdersPage = () => {
    const { orders, user } = useLoaderData();
    const [activeTab, setActiveTab] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);
    
    // Filter orders based on active tab
    const filteredOrders = orders.filter(order => {
        switch (activeTab) {
            case 'pending':
                return !order.is_complete;
            case 'completed':
                return order.is_complete;
            default:
                return true;
        }
    });
    
    const getOrderStatus = (order) => {
        if (order.is_complete) return { status: 'Completed', color: 'green', icon: CheckCircle };
        
        const hasCompletedPayment = order.payments.some(payment => payment.status === 'COMPLETED');
        if (hasCompletedPayment) return { status: 'Processing', color: 'blue', icon: Package };
        
        return { status: 'Pending Payment', color: 'amber', icon: Clock };
    };
    
    const getPaymentStatus = (payments) => {
        if (payments.length === 0) return { status: 'No Payment', color: 'gray' };
        
        const latestPayment = payments[payments.length - 1];
        switch (latestPayment.status) {
            case 'COMPLETED':
                return { status: 'Paid', color: 'green' };
            case 'PENDING':
                return { status: 'Pending', color: 'amber' };
            case 'CANCELLED':
                return { status: 'Cancelled', color: 'red' };
            default:
                return { status: 'Unknown', color: 'gray' };
        }
    };

    const tabs = [
        { id: 'all', label: 'All Orders', count: orders.length },
        { id: 'pending', label: 'Pending', count: orders.filter(o => !o.is_complete).length },
        { id: 'completed', label: 'Completed', count: orders.filter(o => o.is_complete).length }
    ];

    return (
        <div className="min-h-screen bg-stone-50 py-4 sm:py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6 sm:mb-8"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-2">My Orders</h1>
                    <p className="text-stone-600">Track and manage your orders</p>
                </motion.div>
                
                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center mb-6 sm:mb-8"
                >
                    <div className="bg-white rounded-xl p-2 shadow-lg w-full max-w-lg sm:max-w-none sm:w-auto overflow-x-auto">
                        <div className="flex space-x-2 min-w-max sm:min-w-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-amber-600 text-white shadow-md'
                                            : 'text-stone-600 hover:bg-stone-100'
                                    }`}
                                >
                                    {tab.label}
                                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-stone-200 text-stone-700">
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
                
                {/* Orders List */}
                <div className="space-y-4 sm:space-y-6">
                    <AnimatePresence mode="wait">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order, index) => {
                                const orderStatus = getOrderStatus(order);
                                const paymentStatus = getPaymentStatus(order.payments);
                                const StatusIcon = orderStatus.icon;
                                
                                return (
                                    <motion.div
                                        key={order.o_id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
                                    >
                                        <div className="p-4 sm:p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                
                                                {/* Order Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <StatusIcon className={`w-6 h-6 text-${orderStatus.color}-600`} />
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-stone-800">
                                                                Order #{order.o_id.slice(-8)}
                                                            </h3>
                                                            <p className="text-stone-600 text-sm">
                                                                Placed on {new Date(order.order_date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-stone-500">Status</span>
                                                            <p className={`font-semibold text-${orderStatus.color}-600`}>
                                                                {orderStatus.status}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-stone-500">Payment</span>
                                                            <p className={`font-semibold text-${paymentStatus.color}-600`}>
                                                                {paymentStatus.status}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-stone-500">Total</span>
                                                            <p className="font-semibold text-stone-800">
                                                                ${order.total_amount.toFixed(2)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-stone-500">Delivery</span>
                                                            <p className="font-semibold text-stone-800">
                                                                {new Date(order.promised_date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Actions */}
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <button
                                                        onClick={() => setExpandedOrder(
                                                            expandedOrder === order.o_id ? null : order.o_id
                                                        )}
                                                        className="flex items-center justify-center px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        {expandedOrder === order.o_id ? 'Hide' : 'View'} Details
                                                    </button>
                                                    
                                                    {!order.is_complete && paymentStatus.status !== 'Paid' && (
                                                        <Link
                                                            to={`/payment/${order.o_id}?retry=true`}
                                                            className="flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                                        >
                                                            <CreditCard className="w-4 h-4 mr-2" />
                                                            Complete Payment
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Expanded Details */}
                                        <AnimatePresence>
                                            {expandedOrder === order.o_id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="border-t border-stone-200 bg-stone-50"
                                                >
                                                    <div className="p-4 sm:p-6">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div>
                                                                <h4 className="flex items-center font-semibold text-stone-800 mb-3">
                                                                    <MapPin className="w-4 h-4 mr-2" />
                                                                    Delivery Address
                                                                </h4>
                                                                <p className="text-stone-600">{order.address}</p>
                                                            </div>
                                                            
                                                            <div>
                                                                <h4 className="flex items-center font-semibold text-stone-800 mb-3">
                                                                    <Calendar className="w-4 h-4 mr-2" />
                                                                    Important Dates
                                                                </h4>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-stone-500">Order Date:</span>
                                                                        <span className="text-stone-800">
                                                                            {new Date(order.order_date).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-stone-500">Expected Delivery:</span>
                                                                        <span className="text-stone-800">
                                                                            {new Date(order.promised_date).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Payment History */}
                                                        {order.payments.length > 0 && (
                                                            <div className="mt-6">
                                                                <h4 className="font-semibold text-stone-800 mb-3">Payment History</h4>
                                                                <div className="space-y-2">
                                                                    {order.payments.map((payment, payIndex) => (
                                                                        <div key={payment.payment_id} className="flex justify-between items-center py-2 px-4 bg-white rounded-lg">
                                                                            <div>
                                                                                <span className="text-stone-600 text-sm">
                                                                                    Payment #{payment.payment_id.slice(-8)}
                                                                                </span>
                                                                                <p className="text-stone-800 font-medium">
                                                                                    ${payment.payment_amount.toFixed(2)}
                                                                                </p>
                                                                            </div>
                                                                            <span className={`px-3 py-1 rounded-full text-sm font-medium text-${getPaymentStatus([payment]).color}-800 bg-${getPaymentStatus([payment]).color}-100`}>
                                                                                {payment.status}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-8 sm:py-12"
                            >
                                <Package className="w-12 h-12 sm:w-16 sm:h-16 text-stone-300 mx-auto mb-4" />
                                <h3 className="text-lg sm:text-xl font-semibold text-stone-800 mb-2">
                                    No {activeTab !== 'all' ? activeTab : ''} orders found
                                </h3>
                                <p className="text-stone-600 mb-6">
                                    {activeTab === 'all' 
                                        ? "You haven't placed any orders yet." 
                                        : `You don't have any ${activeTab} orders.`
                                    }
                                </p>
                                <Link
                                    to="/products"
                                    className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                                >
                                    Start Shopping
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;