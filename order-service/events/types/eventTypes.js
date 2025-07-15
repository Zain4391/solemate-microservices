/**
 * Event Types for Payment Service
 * Defines Payment related events that can be published/subscribed to
 */

export const ORDER_EVENTS = {
    ORDER_COMPLETED: 'order.completed',
    ORDER_CANCELLED: 'order.cancelled'
};

export const EVENT_CHANNELS = {
    ORDERS: 'orders_channel'
};