/**
 * Payment Publisher
 * Publishes payment-related events to Redis channels
 */

import basePublisher from "./basePublisher.js";
import { EVENT_CHANNELS, PAYMENT_EVENTS } from '../types/eventTypes.js';

class paymentPublisher extends basePublisher {
    constructor() {
        super(EVENT_CHANNELS.PAYMENTS)
    }

    async publishPaymentCreated(paymentData) {
        await this.publish(PAYMENT_EVENTS.PAYMENT_CREATED, {
            payment_id: paymentData.payment_id,
            order_id: paymentData.order_o_id,
            user_id: paymentData.user_id,
            amount: paymentData.payment_amount,
            currency: paymentData.currency,
            status: paymentData.statu
        });
    }

    async publishPaymentCompleted(paymentData) {
        await this.publish(PAYMENT_EVENTS.PAYMENT_COMPLETED, {
            payment_id: paymentData.payment_id,
            order_id: paymentData.order_o_id,
            user_id: paymentData.user_id,
            amount: paymentData.payment_amount,
            currency: paymentData.currency,
            stripe_payment_intent_id: paymentData.stripe_payment_intent_id
        });
    }
}

export default new paymentPublisher();