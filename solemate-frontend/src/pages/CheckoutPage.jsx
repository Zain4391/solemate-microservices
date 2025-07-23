import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { orderApiService } from '../services/orderapi.js';
import { fetchItemsFromCart} from '../store/slices/cartSlice.js'
import OrderItemCard from '../components/OrderItemCard.jsx';
import OrderTotals from '../components/OrderTotals.jsx';

const CheckoutPage = () => {
    const { items, totalAmount, totalItems } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const [isProcessing, setIsProcessing] = useState(false);
    const [orderError, setOrderError] = useState(null);

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        mode: 'onChange'
    });

    const subtotal = totalAmount;
    const tax = subtotal * 0.08;
    const shipping = subtotal > 100 ? 0 : 10;
    const grandTotal = subtotal + tax + shipping;

    const onSubmit = async (formData) => {
        setIsProcessing(true);
        setOrderError(null);

        try {
            console.log('Creating Order with: ', formData);

            const orderData = {
                userId: user.userId,
                address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
                totalAmount: parseInt(Math.ceil(grandTotal)),
                promiseDate: formData.promiseDate
            };

            console.log('Sending Data: ', orderData);
            

            const orderResponse = await orderApiService.createOrder(orderData);
            console.log('Order created', orderResponse.data);

            const moveToCart = {
                userId: user.userId,
                orderId: orderResponse.data.orderId
            }

            await orderApiService.moveCartToOrderDetails(moveToCart);

            dispatch(fetchItemsFromCart(user.userId));
            console.log("Cart Moved successfully");
        
        } catch (error) {
            console.error('Checkout failed:', error);
            setOrderError(error.response?.data?.message || 'Failed to create order');
        } finally {
            setIsProcessing(false);
        }
    }


  return (
    <div className="min-h-screen bg-stone-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-stone-800 mb-2">Complete Your Order</h1>
                    <p className="text-stone-600">Review your items and provide shipping information</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-stone-800 mb-6">Order Summary</h2>
                            
                            {/* Cart Items List */}
                            <div className="space-y-4 mb-6">
                                {items.length > 0 ? (
                                    items?.map((item, index) => (
                                        <OrderItemCard key={item.cart_id || index} item={item} index={index}/>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-stone-500">
                                        <Package className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                                        <p>Your cart is empty</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Order Totals */}
                            <div className="border-t border-stone-200 pt-6">
                                <OrderTotals totalItems={totalItems} tax={tax} shipping={shipping} grandTotal={grandTotal} subtotal={subtotal}/>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Panel - Shipping Form (1/3 width) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-stone-800 mb-6">Shipping Information</h2>
                            
                            {/* Replace "Form will go here" with this: */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                
                                {/* Street Address */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Street Address *
                                    </label>
                                    <input
                                        {...register('address', { 
                                            required: 'Address is required',
                                            minLength: { value: 5, message: 'Address must be at least 5 characters' }
                                        })}
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-stone-800"
                                        placeholder="123 Main Street"
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                                    )}
                                </div>
                                
                                {/* City and State */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            {...register('city', { 
                                                required: 'City is required',
                                                minLength: { value: 2, message: 'City name too short' }
                                            })}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-stone-800"
                                            placeholder="City"
                                        />
                                        {errors.city && (
                                            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            State *
                                        </label>
                                        <input
                                            {...register('state', { 
                                                required: 'State is required',
                                                minLength: { value: 2, message: 'State is required' }
                                            })}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-stone-800"
                                            placeholder="State"
                                        />
                                        {errors.state && (
                                            <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                                        )}
                                    </div>
                                </div>
                                
                                {/* ZIP and Phone */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            ZIP Code *
                                        </label>
                                        <input
                                            {...register('zipCode', { 
                                                required: 'ZIP code is required',
                                                pattern: { 
                                                    value: /^\d{5}(-\d{4})?$/, 
                                                    message: 'Invalid ZIP code format' 
                                                }
                                            })}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-stone-800"
                                            placeholder="12345"
                                        />
                                        {errors.zipCode && (
                                            <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            Phone *
                                        </label>
                                        <input
                                            {...register('phone', { 
                                                required: 'Phone number is required',
                                                pattern: { 
                                                    value: /^\(\d{3}\) \d{3}-\d{4}$|^\d{10}$|^\d{3}-\d{3}-\d{4}$/, 
                                                    message: 'Invalid phone number' 
                                                }
                                            })}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-stone-800"
                                            placeholder="(555) 123-4567"
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Delivery Date */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Delivery Date *
                                    </label>
                                    <input
                                        type="date"
                                        {...register('promiseDate', { 
                                            required: 'Delivery date is required',
                                            validate: (value) => {
                                                const selectedDate = new Date(value);
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                return selectedDate >= today || 'Date cannot be in the past';
                                            }
                                        })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-stone-800"
                                    />
                                    {errors.promiseDate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.promiseDate.message}</p>
                                    )}
                                </div>
                                
                                {/* Error Display */}
                                {orderError && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm"
                                    >
                                        {orderError}
                                    </motion.div>
                                )}
                                
                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={!isValid || isProcessing || items.length === 0}
                                    whileHover={{ scale: isValid && !isProcessing ? 1.02 : 1 }}
                                    whileTap={{ scale: isValid && !isProcessing ? 0.98 : 1 }}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                                        !isValid || isProcessing || items.length === 0
                                            ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                                            : 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg hover:shadow-xl'
                                    }`}
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Processing Order...
                                        </div>
                                    ) : (
                                        `Complete Order • $${grandTotal.toFixed(2)}`
                                    )}
                                </motion.button>
                                
                            </form>
                            
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
  )
}

export default CheckoutPage
