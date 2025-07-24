// src/loaders/ordersLoader.js
import { redirect } from 'react-router-dom';
import { orderApiService } from '../services/orderapi';
import { paymentApiService } from '../services/paymentapi';

export const ordersLoader = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
        throw redirect('/login');
    }
    
    try {
        // Fetch user's orders
        let orders = [];

        try {
            const ordersResponse = await orderApiService.getUserOrders(user.userId);
            orders = ordersResponse.data.data || [];
        } catch (error) {
            if (error.response?.status === 404 || error.message?.includes('No orders found')) {
                orders = [];
            } else {
                throw error;
            }
        }
        
        // Only fetch payments if orders exist
        let orders_with_payments = [];
        
        if (orders.length > 0) {
            // Fetch payment status for each order
            const ordersWithPayments = await Promise.allSettled(
                orders.map(async (order) => {
                    try {
                        const paymentsResponse = await paymentApiService.getPaymentsByOrderId(order.o_id);
                        return {
                            ...order,
                            payments: paymentsResponse.data.data || []
                        };
                    } catch (error) {
                        return {
                            ...order,
                            payments: []
                        };
                    }
                })
            );
            
            // Filter successful results
            orders_with_payments = ordersWithPayments
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value);
        }
        
        return { 
            orders: orders_with_payments,
            user 
        };
        
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            throw redirect('/login');
        }
        
        // For new users or other non-critical errors, return empty orders
        console.error('Orders loader error:', error);
        return {
            orders: [],
            user
        };
    }
};