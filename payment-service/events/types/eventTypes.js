/**
 * Event Types for Payment Service
 * Defines all events that can be published/subscribed to
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
    ORDERS: 'orders_channel', 
    PRODUCTS: 'products_channel'
};