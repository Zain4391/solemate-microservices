import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, CreditCard, Truck, Home } from 'lucide-react';
import { orderApiService } from '../services/orderapi';

const PaymentSuccessPage = () => {
    const { orderId } = useParams();
    const [searchParams] = useSearchParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const paymentIntentId = searchParams.get('payment_intent');

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await orderApiService.getOrderById(orderId);
                setOrderDetails(response.data.data[0]);
            } catch (error) {
                console.error('Failed to fetch order details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                
                {/* Success Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4"
                    >
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl font-bold text-stone-800 mb-2"
                    >
                        Payment Successful!
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl text-stone-600"
                    >
                        Thank you for your order. We'll start preparing it right away!
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center mb-6">
                            <Package className="w-6 h-6 text-amber-600 mr-3" />
                            <h2 className="text-2xl font-semibold text-stone-800">Order Details</h2>
                        </div>
                        
                        {orderDetails && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-stone-200">
                                    <span className="text-stone-600">Order Number</span>
                                    <span className="font-semibold text-stone-800">#{orderId}</span>
                                </div>
                                
                                <div className="flex justify-between items-center py-2 border-b border-stone-200">
                                    <span className="text-stone-600">Order Date</span>
                                    <span className="font-semibold text-stone-800">
                                        {new Date(orderDetails.order_date).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center py-2 border-b border-stone-200">
                                    <span className="text-stone-600">Delivery Date</span>
                                    <span className="font-semibold text-stone-800">
                                        {new Date(orderDetails.promised_date).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-center py-2 border-b border-stone-200">
                                    <span className="text-stone-600">Total Amount</span>
                                    <span className="font-bold text-2xl text-amber-600">
                                        ${orderDetails.total_amount.toFixed(2)}
                                    </span>
                                </div>
                                
                                <div className="py-2">
                                    <span className="text-stone-600">Delivery Address</span>
                                    <p className="font-semibold text-stone-800 mt-1">
                                        {orderDetails.address}
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Next Steps */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <div className="flex items-center mb-6">
                            <Truck className="w-6 h-6 text-amber-600 mr-3" />
                            <h2 className="text-2xl font-semibold text-stone-800">What's Next?</h2>
                        </div>
                        
                        <div className="space-y-6">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                className="flex items-start space-x-4"
                            >
                                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                    <span className="text-amber-600 font-bold text-sm">1</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-stone-800">Order Confirmation</h3>
                                    <p className="text-stone-600 text-sm">
                                        You'll receive an email confirmation shortly with your order details.
                                    </p>
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.4 }}
                                className="flex items-start space-x-4"
                            >
                                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                    <span className="text-amber-600 font-bold text-sm">2</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-stone-800">Processing</h3>
                                    <p className="text-stone-600 text-sm">
                                        We'll start preparing your order and send you tracking information.
                                    </p>
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.6 }}
                                className="flex items-start space-x-4"
                            >
                                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                    <span className="text-amber-600 font-bold text-sm">3</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-stone-800">Delivery</h3>
                                    <p className="text-stone-600 text-sm">
                                        Your order will be delivered by {orderDetails && new Date(orderDetails.promised_date).toLocaleDateString()}.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Continue Shopping
                    </Link>
                    
                    <Link
                        to="/orders"
                        className="inline-flex items-center justify-center px-6 py-3 bg-stone-600 text-white font-semibold rounded-lg hover:bg-stone-700 transition-colors"
                    >
                        <Package className="w-5 h-5 mr-2" />
                        View My Orders
                    </Link>
                </motion.div>

                {/* Payment Details */}
                {paymentIntentId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.0 }}
                        className="mt-8 text-center"
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-lg">
                            <CreditCard className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-green-800 text-sm">
                                Payment ID: {paymentIntentId.slice(-8)}
                            </span>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccessPage;