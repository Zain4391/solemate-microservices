import React, { useState } from 'react';
import { Form, useActionData, useNavigation, useSubmit } from 'react-router-dom';
import { 
    useStripe, 
    useElements, 
    CardNumberElement,
    CardExpiryElement, 
    CardCvcElement 
} from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Shield, Lock } from 'lucide-react';

const PaymentForm = ({ clientSecret, amount, paymentId, isRetry }) => {
    const stripe = useStripe();
    const elements = useElements();
    const actionData = useActionData();
    const navigation = useNavigation();
    const submit = useSubmit();
    
    const [stripeError, setStripeError] = useState(null);
    const [cardComplete, setCardComplete] = useState({
        cardNumber: false,
        expiry: false,
        cvc: false
    });
    
    const isSubmitting = navigation.state === 'submitting';
    const isFormComplete = Object.values(cardComplete).every(field => field);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!stripe || !elements || !clientSecret) return;
        
        setStripeError(null);
        
        try {
            const cardNumberElement = elements.getElement(CardNumberElement);
            
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardNumberElement,
                }
            });
            
            if (error) {
                setStripeError(error.message);
                return;
            }
            
            if (paymentIntent.status === 'succeeded') {
                const formData = new FormData();
                formData.set('payment_id', paymentId);
                formData.set('payment_intent_id', paymentIntent.id);
                
                submit(formData, { method: 'post' });
            }
            
        } catch (error) {
            setStripeError('Payment failed. Please try again.');
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '18px',
                color: '#1c1917',
                fontFamily: 'system-ui, sans-serif',
                '::placeholder': {
                    color: '#78716c',
                },
                letterSpacing: '0.025em',
            },
            invalid: {
                color: '#ef4444',
                iconColor: '#ef4444'
            },
            complete: {
                color: '#059669',
                iconColor: '#059669'
            }
        }
    };

    return (
        <Form method="post" onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="payment_id" value={paymentId} />
            
            {/* Retry Warning */}
            {isRetry && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800"
                >
                    <div className="flex items-center">
                        <Shield className="w-5 h-5 mr-3 text-amber-600" />
                        <div>
                            <p className="font-medium">Payment Retry</p>
                            <p className="text-sm">Your previous payment was not completed. Please try again.</p>
                        </div>
                    </div>
                </motion.div>
            )}
            
            {/* Payment Security Badge */}
            <div className="flex items-center justify-center space-x-2 text-stone-600 text-sm">
                <Lock className="w-4 h-4" />
                <span>Your payment information is encrypted and secure</span>
            </div>
            
            {/* Card Number Field */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
            >
                <label className="flex items-center text-sm font-medium text-stone-700">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Card Number
                </label>
                <div className={`relative p-4 border rounded-xl bg-white transition-all ${
                    cardComplete.cardNumber ? 'border-green-300 bg-green-50' : 'border-stone-300 hover:border-stone-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200'
                }`}>
                    <CardNumberElement 
                        options={cardElementOptions}
                        onChange={(event) => {
                            setCardComplete(prev => ({
                                ...prev,
                                cardNumber: event.complete
                            }));
                        }}
                    />
                    {cardComplete.cardNumber && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
            
            {/* Expiry and CVC Row */}
            <div className="grid grid-cols-2 gap-4">
                
                {/* Expiry Field */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                >
                    <label className="flex items-center text-sm font-medium text-stone-700">
                        <Calendar className="w-4 h-4 mr-2" />
                        Expiry Date
                    </label>
                    <div className={`relative p-4 border rounded-xl bg-white transition-all ${
                        cardComplete.expiry ? 'border-green-300 bg-green-50' : 'border-stone-300 hover:border-stone-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200'
                    }`}>
                        <CardExpiryElement 
                            options={cardElementOptions}
                            onChange={(event) => {
                                setCardComplete(prev => ({
                                    ...prev,
                                    expiry: event.complete
                                }));
                            }}
                        />
                        {cardComplete.expiry && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
                
                {/* CVC Field */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                >
                    <label className="flex items-center text-sm font-medium text-stone-700">
                        <Shield className="w-4 h-4 mr-2" />
                        CVC
                    </label>
                    <div className={`relative p-4 border rounded-xl bg-white transition-all ${
                        cardComplete.cvc ? 'border-green-300 bg-green-50' : 'border-stone-300 hover:border-stone-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200'
                    }`}>
                        <CardCvcElement 
                            options={cardElementOptions}
                            onChange={(event) => {
                                setCardComplete(prev => ({
                                    ...prev,
                                    cvc: event.complete
                                }));
                            }}
                        />
                        {cardComplete.cvc && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
            
            {/* Form Completion Progress */}
            <div className="flex items-center space-x-2">
                <div className="flex-1 bg-stone-200 rounded-full h-2">
                    <motion.div 
                        className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                            width: `${(Object.values(cardComplete).filter(Boolean).length / 3) * 100}%` 
                        }}
                    />
                </div>
                <span className="text-sm text-stone-600">
                    {Object.values(cardComplete).filter(Boolean).length}/3 Complete
                </span>
            </div>
            
            {/* Stripe Errors */}
            {stripeError && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
                >
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-red-600 text-sm">!</span>
                        </div>
                        <div>
                            <p className="font-medium">Payment Error</p>
                            <p className="text-sm">{stripeError}</p>
                        </div>
                    </div>
                </motion.div>
            )}
            
            {/* Action Errors */}
            {actionData?.error && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
                >
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-red-600 text-sm">!</span>
                        </div>
                        <div>
                            <p className="font-medium">Server Error</p>
                            <p className="text-sm">{actionData.error}</p>
                        </div>
                    </div>
                </motion.div>
            )}
            
            {/* Submit Button */}
            <motion.button
                type="submit"
                disabled={!stripe || isSubmitting || !isFormComplete}
                whileHover={{ scale: stripe && !isSubmitting && isFormComplete ? 1.02 : 1 }}
                whileTap={{ scale: stripe && !isSubmitting && isFormComplete ? 0.98 : 1 }}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                    !stripe || isSubmitting || !isFormComplete
                        ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl'
                }`}
            >
                {isSubmitting ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Processing Payment...
                    </div>
                ) : !isFormComplete ? (
                    'Complete Card Information'
                ) : (
                    <div className="flex items-center justify-center">
                        <Lock className="w-5 h-5 mr-2" />
                        Pay ${amount.toFixed(2)} Securely
                    </div>
                )}
            </motion.button>
            
            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-6 text-stone-500 text-xs">
                <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    <span>Secure Payment</span>
                </div>
                <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-1" />
                    <span>Stripe Protected</span>
                </div>
            </div>
        </Form>
    );
};

export default PaymentForm;