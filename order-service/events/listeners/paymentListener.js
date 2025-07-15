/**
 * Payment Listener for Order Service
 * Listens for payment completion events and updates orders
 */

import redisClient from "../../config/Redis.js";
import OrderService from '../../services/orderService.js';
import orderPublisher from "../publishers/orderPublisher.js";

class PaymentListener {
    constructor() {
        this.channel = 'payments.channel';
    }

    async handlePaymentCompleted(paymentData) {
        try {
            console.log(`Payment completed, updating order: ${paymentData.order_id}`);

            const orderDetailsResult = await OrderService.getOrderDetails(paymentData.order_id);

            await OrderService.updateOrderStatus(paymentData.order_id, true);

            await orderPublisher.publishOrderCompleted({
                order_id: paymentData.order_id,
                user_id: paymentData.user_id,
                payment_id: paymentData.payment_id,
                items: orderDetailsResult.data.map(item => ({
                    product_id: item.product_p_id,
                    quantity: item.quantity,
                    size: item.size
                }))
            });

            console.log(`Order with ${paymentData.order_id} marked at completed`);
        } catch (error) {
            console.error(`Error handling payment completion: ${error.message}`);
        }
    }

    async listen() {
        const subscriber = redisClient.duplicate()
        await subscriber.connect();

        console.log("Order service listening for payment events...");
        subscriber.subscribe(this.channel, async (message) => {
            try {
                const event = JSON.parse(message);

                if(event.type === 'payment.completed') {
                    await this.handlePaymentCompleted(event.data);
                }
            } catch (error) {
                console.error(`Error processing payment completion: ${error.message}`);
            }
        });
    }
};

export default new PaymentListener();