// src/actions/checkoutAction.js
import { redirect } from 'react-router-dom';
import { orderApiService } from '../services/orderapi';
import { paymentApiService } from '../services/paymentapi';
import { store } from '../store/index.js';
import { fetchItemsFromCart } from '../store/slices/cartSlice.js';

export const checkoutAction = async ({ request }) => {
    const formData = await request.formData();
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        throw redirect('/login');
    }
    
    try {
        const orderData = {
            userId: user.userId,
            address: `${formData.get('address')}, ${formData.get('city')}, ${formData.get('state')} ${formData.get('zipCode')}`,
            totalAmount: parseInt(formData.get('totalAmount')),
            promiseDate: formData.get('promiseDate')
        };
        
        const orderResponse = await orderApiService.createOrder(orderData);
        
        await orderApiService.moveCartToOrderDetails({
            userId: user.userId,
            orderId: orderResponse.data.orderId
        });
        
        const paymentResponse = await paymentApiService.createPayment({
            order_o_id: orderResponse.data.orderId,
            payment_amount: orderData.totalAmount,
            currency: 'usd'
        });

        await store.dispatch(fetchItemsFromCart(user.userId));

        const { client_secret, payment_id } = paymentResponse.data.data;
        return redirect(`/payment/${orderResponse.data.orderId}?client_secret=${client_secret}&payment_id=${payment_id}&amount=${orderData.totalAmount}`);
        
    } catch (error) {
        console.error('Checkout failed:', error);
        return {
            error: error.response?.data?.message || 'Failed to process checkout'
        };
    }
};