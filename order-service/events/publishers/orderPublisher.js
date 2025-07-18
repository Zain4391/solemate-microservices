/**
 * Order Publisher
 * Publishes order-related events to Redis channels
 */

import BasePublisher from "./basePublisher.js";
import { EVENT_CHANNELS, ORDER_EVENTS } from '../types/eventTypes.js';

class OrderPublisher extends BasePublisher {
    constructor() {
        super(EVENT_CHANNELS.ORDERS);
    }

    async publishOrderCompleted(orderData) {
        await this.publish(ORDER_EVENTS.ORDER_COMPLETED, {
            order_id: orderData.order_id,
            user_id: orderData.user_id,
            payment_id: orderData.payment_id,
            items: orderData.items
        });
    }
};

export default new OrderPublisher();