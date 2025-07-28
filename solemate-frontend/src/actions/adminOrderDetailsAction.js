import { orderApiService } from '../services/orderapi.js';
import { redirect } from 'react-router-dom';

export const adminOrderStatusAction = async ({ request, params }) => {
  try {
    const { orderId } = params;
    const formData = await request.formData();
    
    // Get checkbox value - if checked, it will be "on", if unchecked, it will be null/undefined
    const statusValue = formData.get('status');
    const isComplete = statusValue === 'on'; // Checkbox sends "on" when checked, null when unchecked
    
    if (!orderId) {
      throw new Response('Order ID is required', { status: 400 });
    }
    
    const response = await orderApiService.updateOrderStatus(orderId, { isComplete });
    
    if (response.data.success) {
      return redirect(`/admin/orders/${orderId}`);
    } else {
      throw new Response(response.data.message || 'Failed to update order status', { 
        status: 400 
      });
    }
    
  } catch (error) {
    console.error('Admin order status action error:', error);
    
    if (error instanceof Response) {
      throw error;
    }
    
    throw new Response('Failed to update order status', { status: 500 });
  }
};