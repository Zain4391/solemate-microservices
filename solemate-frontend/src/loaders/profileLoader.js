// src/loaders/profileLoader.js
import { redirect } from 'react-router-dom';
import { orderApiService } from '../services/orderapi';

export const profileLoader = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
        throw redirect('/login');
    }
    
    try {
        // Fetch user's orders for stats
        let orders = [];
        
        try {
            const ordersResponse = await orderApiService.getUserOrders(user.userId);
            orders = ordersResponse.data.data || [];
        } catch (error) {
            // If no orders found, that's OK
            if (error.response?.status === 404 || error.message?.includes('No orders found')) {
                orders = [];
            } else {
                throw error;
            }
        }
        
        // Calculate stats
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);
        const pendingOrders = orders.filter(order => !order.is_complete).length;
        const completedOrders = orders.filter(order => order.is_complete).length;
        
        // Get recent orders (last 5)
        const recentOrders = orders
            .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
            .slice(0, 5);
        
        return { 
            user,
            stats: {
                totalOrders,
                totalSpent,
                pendingOrders,
                completedOrders
            },
            recentOrders
        };
        
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            throw redirect('/login');
        }
        
        // Return basic user info even if orders fail
        return {
            user,
            stats: {
                totalOrders: 0,
                totalSpent: 0,
                pendingOrders: 0,
                completedOrders: 0
            },
            recentOrders: []
        };
    }
};