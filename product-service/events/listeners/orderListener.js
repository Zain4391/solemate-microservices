/**
 * Order Listener for Product Service
 * Listens for order completion events and updates product stock
 */

import redisClient from "../../config/Redis.js";
import ProductService from '../../services/ProductService.js';

class OrderListener {
    constructor() {
        this.channel = 'orders_channel';
    }

    // TODO: create listen function which susbcribes to order channel, Helper that updates the stock
}

export default new OrderListener();