/**
 * Event Types for Payment Service
 * Defines Payment related events that can be published/subscribed to
 */

export const PAYMENT_EVENTS = {
    PAYMENT_CREATED: 'payment.created',
    PAYMENT_PROCESSING: 'payment.processing',
    PAYMENT_COMPLETED: 'payment.completed',
    PAYMENT_FAILED: 'payment.failed',
    PAYMENT_CANCELLED: 'payment.cancelled',
    ORDER_PAYMENT_COMPLETED: 'order.payment_completed',
    STOCK_UPDATE_REQUIRED: 'product.stock_update_required'
};


export const EVENT_CHANNELS = {
    PAYMENTS: 'payments_channel',
};