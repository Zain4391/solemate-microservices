// loaders/adminOrderDetailsLoader.js
import { orderApiService } from '../services/orderapi.js';

export const adminOrderDetailsLoader = async ({ params }) => {
  try {
    const { orderId } = params;
    
    if (!orderId) {
      throw new Response('Order ID is required', { status: 400 });
    }
    
    // Fetch order basic info
    const orderResponse = await orderApiService.getOrderById(orderId);
    const order = orderResponse.data.data[0];
    
    if (!order) {
      throw new Response('Order not found', { status: 404 });
    }
    
    // Fetch order details (items in the order)
    const orderDetailsResponse = await orderApiService.getOrderDetails(orderId);
    const orderItems = orderDetailsResponse.data.data;
    
    return {
      order,
      orderItems,
      orderId
    };
  } catch (error) {
    console.error('Admin order details loader error:', error);
    if (error instanceof Response) {
      throw error;
    }
    throw new Response('Failed to load order details', { status: 500 });
  }
};