/**
 * Order Listener for Product Service
 * Listens for order completion events and updates product stock
 * @author: Zain Rasool
 * @version: 1.0.0
 */

import redisClient from "../../config/Redis.js";
import ProductService from '../../services/ProductService.js';

class OrderListener {
    constructor() {
        this.channel = 'orders_channel';
    }

    async listen() {
        const subscriber = redisClient.duplicate();
        await subscriber.connect();

        console.log(`Listening for order events...`);
        subscriber.subscribe(this.channel, async (message) => {
            try {
                const event = JSON.parse(message);

                if(event.type === "order.completed") {
                    await this.handleOrderCompleted(event.data);
                }
            } catch (error) {
                throw new Error(`Error processing order event: ${error.message}`);
            }
        });
        
    }

    async handleOrderCompleted(orderData) {
        try {
            console.log(`Order Completed, updating stock for order ${orderData.order_id}`);
            console.log('📦 Order data received:', orderData);
            console.log('📦 Items received:', orderData.items);

            for(const item of orderData.items) {
                const currentStock = await ProductService.getCurrentStock(item.product_id, item.size);
                const newStock = currentStock - item.quantity;
                await ProductService.updateStock(item.product_id, item.size, newStock);

                console.log(`Stock decreased for Product: ${item.product_id}, Size: ${item.size}.`);   
            }
            console.log(`Stock updated for Products in Order: ${orderData.order_id}`);
        } catch (error) {
            throw new Error(`Error updating stock: ${error.message}`);
        }
    }
}

export default new OrderListener();