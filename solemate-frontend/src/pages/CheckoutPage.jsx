import React, { useState, useEffect } from 'react';
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { orderApiService } from '../services/orderapi.js';
import OrderItemCard from '../components/OrderItemCard.jsx';
import OrderTotals from '../components/OrderTotals.jsx';

const CheckoutPage = () => {
    const { items, totalAmount, totalItems, isLoading } = useSelector(state => state.cart);
    const { user } = useLoaderData()
    const actionData = useActionData();
    const navigation = useNavigation();

    const isSUbmitting = navigation.state === "submitting";

    const subtotal = totalAmount;
    const tax = subtotal * 0.08;
    const shipping = subtotal > 100 ? 0 : 10;
    const grandTotal = subtotal + tax + shipping;

    if (isLoading && items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
            </div>
        );
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
                            <Form method='post' className="space-y-4">

                                <input type='hidden' name='totalAmount' value={Math.ceil(grandTotal)}/>
                                
                                {/* Street Address */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Street Address *
                                    </label>
                                    <input
                                        name='address'
                                        required
                                        minLength={5}
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-stone-800"
                                        placeholder="123 Main Street"
                                    />
                                </div>
                                
                                {/* City and State */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            name='city'
                                            required
                                            minLength={2}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-stone-800"
                                            placeholder="City"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            State *
                                        </label>
                                        <input
                                            name='state'
                                            required
                                            minLength={2}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-stone-800"
                                            placeholder="State"
                                        />
                                    </div>
                                </div>
                                
                                {/* ZIP and Phone */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            ZIP Code *
                                        </label>
                                        <input
                                            name='zipCode'
                                            required
                                            pattern='\d{5}'
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-stone-800"
                                            placeholder="12345"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            Phone *
                                        </label>
                                        <input
                                            name='phone'
                                            required
                                            pattern='/^\(\d{3}\) \d{3}-\d{4}$|^\d{10}$|^\d{3}-\d{3}-\d{4}$/'
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-stone-800"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                </div>
                                
                                {/* Delivery Date */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-2">
                                        Delivery Date *
                                    </label>
                                    <input
                                        type="date"
                                        name='promiseDate'
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-stone-800"
                                    />
                                </div>
                                
                                {/* Error Display */}
                                {actionData?.error && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm"
                                    >
                                        {actionData.error}
                                    </motion.div>
                                )}
                                
                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isSUbmitting || items.length === 0}
                                    whileHover={{ scale: !isSUbmitting && items.length > 0 ? 1.02 : 1 }}
                                    whileTap={{ scale: !isSUbmitting && items.length > 0 ? 0.98 : 1 }}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                                        isSUbmitting || items.length === 0
                                            ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                                            : 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg hover:shadow-xl'
                                    }`}
                                >
                                    {isSUbmitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Processing Order...
                                        </div>
                                    ) : (
                                        `Complete Order • $${grandTotal.toFixed(2)}`
                                    )}
                                </motion.button>
                                
                            </Form>
                            
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
  )
}

export default CheckoutPage
