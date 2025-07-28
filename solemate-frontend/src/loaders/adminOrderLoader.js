// loaders/adminOrdersLoader.js
import { orderApiService } from '../services/orderapi.js';

export const adminOrdersLoader = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search') || '';
    
    const allOrdersResponse = await orderApiService.getAllOrders();
    const allOrders = allOrdersResponse.data.data;
    
    const globalStats = {
      total: allOrders.length,
      pending: allOrders.filter(order => !order.is_complete).length,
      completed: allOrders.filter(order => order.is_complete).length
    };
    
    let filteredOrders = allOrders;
    
    if (status === 'pending') {
      filteredOrders = allOrders.filter(order => !order.is_complete);
    } else if (status === 'completed') {
      filteredOrders = allOrders.filter(order => order.is_complete);
    }
    
    // Apply search filtering if search term exists
    if (search) {
      const searchLower = search.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        order.o_id?.toLowerCase().includes(searchLower) ||
        order.user_u_id?.toLowerCase().includes(searchLower) ||
        order.address?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by most recent first
    filteredOrders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
    
    return {
      orders: filteredOrders,
      filters: {
        status: status || 'all',
        search
      },
      stats: globalStats
    };
  } catch (error) {
    console.error('Admin orders loader error:', error);
    throw new Response('Failed to load orders', { status: 500 });
  }
};