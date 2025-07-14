/**
 * @fileoverview Payment routes for SOLEMATE application
 * @module routes/paymentRoutes
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */

import express from 'express';
import { 
    createPayment, 
    confirmPayment, 
    getPaymentById, 
    getPaymentsByUserId, 
    getPaymentsByOrderId, 
    getAllPayments, 
    cancelPayment, 
    getPaymentStatus, 
    mockConfirmPayment
} from '../controllers/PaymentController.js';
import { authMiddleware, adminMiddleware } from '../middleware/verifyAdmin.js';

const paymentRouter = express.Router();

paymentRouter.post('/mock-confirm-payment/:id', authMiddleware, mockConfirmPayment);
paymentRouter.post('/create-payment', authMiddleware, createPayment);
paymentRouter.post('/confirm-payment', authMiddleware, confirmPayment);
paymentRouter.get('/payment/:id', authMiddleware, getPaymentById);
paymentRouter.get('/payment-status/:id', authMiddleware, getPaymentStatus);
paymentRouter.get('/user/:userId', authMiddleware, getPaymentsByUserId);
paymentRouter.get('/order/:orderId', authMiddleware, getPaymentsByOrderId);
paymentRouter.put('/cancel/:id', authMiddleware, cancelPayment);
paymentRouter.get('/all', authMiddleware, adminMiddleware, getAllPayments);

export default paymentRouter;