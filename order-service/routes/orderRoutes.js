/**
 * @fileoverview Order Routes defines API endpoints for order operations
 * @module routes/orderRoutes
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */

import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/VerifyAdmin.js';
import {
    getOrders,
    getOrderDetails,
    getOrderById,
    getOrdersByStatus,
    getUserOrders,
    createOrder,
    updateOrderStatus,
    updateOrderAddress,
    updatePromiseDate,
    deleteOrder,
    moveCartToOrder
} from '../controllers/orderController.js';

const orderRouter = express.Router();

// Admin-only routes
orderRouter.get('/', authMiddleware, adminMiddleware, getOrders);
orderRouter.get('/status/:isComplete', authMiddleware, adminMiddleware, getOrdersByStatus);
orderRouter.delete('/:orderId', authMiddleware, adminMiddleware, deleteOrder);

// User routes (authenticated users only)
orderRouter.post('/', authMiddleware, createOrder);
orderRouter.get('/:orderId', authMiddleware, getOrderById);
orderRouter.get('/users/:userId', authMiddleware, getUserOrders); 
orderRouter.post('/move-cart', authMiddleware, moveCartToOrder);
orderRouter.put('/:orderId/status', authMiddleware, updateOrderStatus);
orderRouter.get('/:orderId/details', authMiddleware, getOrderDetails);
orderRouter.put('/:orderId/address', authMiddleware, updateOrderAddress);
orderRouter.put('/:orderId/promise-date', authMiddleware, updatePromiseDate);

export default orderRouter;