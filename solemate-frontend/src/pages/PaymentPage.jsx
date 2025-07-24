import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';
import { motion } from 'framer-motion';
import { orderApiService } from '../services/orderapi';
import { paymentApiService } from '../services/paymentapi';

const stripePromise = loadStripe('pk_test_51RaMOG2MVk4mUNBLJidXPvx9pxKowzNddYsUMeXo5IL4e6WKIMOYu5O48VUcXSkgkKuCt71x7G8GaKWXHGrkysuT00gODM1lqC');

const PaymentPage = () => {
    const { orderId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // State for retry functionality
    const [paymentData, setPaymentData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get URL parameters
    const clientSecret = searchParams.get('client_secret');
    const paymentId = searchParams.get('payment_id');
    const amount = searchParams.get('amount') ? parseInt(Math.ceil(searchParams.get("amount"))) : null;
    const isRetry = searchParams.get('retry') === 'true';

    // Step 2: Load order and create new payment intent for retry
    useEffect(() => {
        const handleRetryPayment = async () => {
            if (!isRetry) return;
            
            setLoading(true);
            setError(null);
            
            try {
                console.log('Loading order for retry payment...');
                
                // Fetch order details
                const orderResponse = await orderApiService.getOrderById(orderId);
                const order = orderResponse.data.data[0];
                setOrderData(order);
                
                console.log('Creating new payment intent for retry...');
                
                // Create new payment intent
                const paymentResponse = await paymentApiService.createPayment({
                    order_o_id: orderId,
                    payment_amount: order.total_amount,
                    currency: 'usd'
                });
                
                setPaymentData(paymentResponse.data.data);
                console.log('New payment intent created for retry');
                
            } catch (error) {
                console.error('Failed to setup retry payment:', error);
                setError('Failed to setup payment. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        handleRetryPayment();
    }, [isRetry, orderId]);

    // Step 3: Determine which data to use
    const finalClientSecret = isRetry ? paymentData?.client_secret : clientSecret;
    const finalPaymentId = isRetry ? paymentData?.payment_id : paymentId;
    const finalAmount = isRetry ? orderData?.total_amount : amount;

    // Loading state for retry
    if (isRetry && loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-stone-600">Setting up payment...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-stone-800 mb-4">Payment Setup Failed</h2>
                    <p className="text-stone-600 mb-6">{error}</p>
                    <button 
                        onClick={() => navigate('/orders')}
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    // Invalid payment data
    if (!finalClientSecret || !finalPaymentId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-stone-800 mb-4">Invalid Payment Link</h2>
                    <p className="text-stone-600 mb-6">
                        {isRetry ? 'Unable to setup retry payment.' : 'This payment link is invalid or expired.'}
                    </p>
                    <button 
                        onClick={() => navigate(isRetry ? '/orders' : '/checkout')}
                        className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        {isRetry ? 'Back to Orders' : 'Return to Checkout'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-stone-50 py-8'>
            <div className='max-w-2xl mx-auto px-4'>
                <motion.div 
                    className='bg-white shadow-lg rounded-2xl p-8'
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                >
                    <div className='text-center mb-8'>
                        <h1 className="text-3xl font-bold text-stone-800 mb-2">
                            {isRetry ? 'Complete Your Payment' : 'Complete Payment'}
                        </h1>
                        <p className="text-stone-600">Order #{orderId}</p>
                        {isRetry && (
                            <p className="text-amber-600 text-sm mt-2">
                                Your previous payment was not completed. Please try again.
                            </p>
                        )}
                        <p className="text-2xl font-semibold text-amber-600 mt-4">
                            Total: ${finalAmount.toFixed(2)}
                        </p>
                    </div>
                    
                    <Elements stripe={stripePromise} options={{ clientSecret: finalClientSecret }}>
                        <PaymentForm 
                            clientSecret={finalClientSecret}
                            amount={finalAmount}
                            paymentId={finalPaymentId}
                        />
                    </Elements>
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentPage;