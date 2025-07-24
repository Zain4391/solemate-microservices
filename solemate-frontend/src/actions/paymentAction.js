// src/actions/paymentAction.js
import { redirect } from 'react-router-dom';
import { paymentApiService } from '../services/paymentapi';
import { orderApiService } from '../services/orderapi';

export const paymentAction = async ({ request, params }) => {
    const { orderId } = params;
    const formData = await request.formData();
    
    const paymentIntentId = formData.get('payment_intent_id');
    const paymentId = formData.get('payment_id');
    
    try {
        console.log('Confirming payment...');
        
        // Confirm payment with backend
        await paymentApiService.confirmPayment({
            payment_id: paymentId,
            stripe_payment_intent_id: paymentIntentId
        });
        
        // Update order status to completed
        await orderApiService.updateOrderStatus(orderId, { isComplete: true });
        
        console.log('Payment and order completed successfully');
        
        return redirect(`/payment-success/${orderId}`);
        
    } catch (error) {
        console.error('Payment confirmation failed:', error);
        return {
            error: error.response?.data?.message || 'Payment confirmation failed'
        };
    }
};