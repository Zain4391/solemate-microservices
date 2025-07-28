// loaders/adminLoader.js
import { orderApiService } from '../services/orderapi.js';

export const adminLoader = async () => {
  try {
    const ordersResponse = await orderApiService.getAllOrders();
    const orders = ordersResponse.data.data;
    
    // Calculate dashboard stats from orders data
    const stats = {
      totalOrders: orders.length,
      totalSales: orders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
      pendingOrders: orders.filter(order => !order.is_complete).length,
      completedOrders: orders.filter(order => order.is_complete).length,
    };
    
    // Get recent orders (last 5) - sorted by order_date
    const recentOrders = orders
      .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
      .slice(0, 5);
    
    return {
      dashboardData: {
        stats,
        recentOrders,
        totalOrdersCount: orders.length
      }
    };
  } catch (error) {
    console.error('Admin loader error:', error);
    throw new Response('Failed to load admin data', { status: 500 });
  }
};