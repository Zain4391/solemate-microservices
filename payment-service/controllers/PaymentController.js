/**
 * @fileoverview Payment Controller handles HTTP requests for payment operations
 * @module controllers/paymentController
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */

import PaymentService from '../services/PaymentService.js';

export const createPayment = async (req, res) => {
    try {
        const { order_o_id, payment_amount, currency } = req.body;
        const user_id = req.user.userId;
        
        const paymentData = {
            order_o_id,
            user_id,
            payment_amount,
            currency: currency || 'usd'
        };
        
        const result = await PaymentService.processPayment(paymentData);
        
        res.status(201).json({
            success: true,
            message: 'Payment created successfully',
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const confirmPayment = async (req, res) => {
    try {
        const { payment_id, stripe_payment_intent_id } = req.body;
        
        // Verify payment intent with Stripe
        const stripeResult = await PaymentService.retrieveStripePaymentIntent(stripe_payment_intent_id);
        
        if (stripeResult.data.status === 'succeeded') {
            // Update payment status to completed
            const result = await PaymentService.updatePaymentStatus(payment_id, 'COMPLETED', {
                completed_at: new Date().toISOString()
            });
            
            res.status(200).json({
                success: true,
                message: 'Payment confirmed successfully',
                data: result.data
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment not completed on Stripe'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;  
        const result = await PaymentService.getPaymentById(id);

        // check if user owns the payment or if the admin is accessing the payment
        if(!req.user.isAdmin && result.data.user_id !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied to this payment'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Payment retrieved successfully',
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPaymentsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if user is accessing their own payments or is admin access
        if (!req.user.isAdmin && userId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied to these payments'
            });
        }
        
        const result = await PaymentService.getPaymentsByUserId(userId);
        
        res.status(200).json({
            success: true,
            message: 'User payments retrieved successfully',
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPaymentsByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const result = await PaymentService.getPaymentsByOrderId(orderId);
        
        // Check if user owns any of these payments (unless admin)
        if (!req.user.isAdmin && result.data.length > 0) {
            const userPayments = result.data.filter(payment => payment.user_id === req.user.userId);
            if (userPayments.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied to these payments'
                });
            }
            result.data = userPayments;
        }
        
        res.status(200).json({
            success: true,
            message: 'Order payments retrieved successfully',
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllPayments = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        
        const result = await PaymentService.getAllPayments(
            parseInt(page),
            parseInt(limit),
            status
        )
        
        res.status(200).json({
            success: true,
            message: 'All payments retrieved successfully',
            data: result.data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const cancelPayment = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get payment record
        const paymentResult = await PaymentService.getPaymentById(id);
        const payment = paymentResult.data;
        
        // Check if user owns this payment (unless admin)
        if (!req.user.isAdmin && payment.user_id !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied to this payment'
            });
        }
        
        // Check if payment can be cancelled
        if (payment.status === 'COMPLETED') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel completed payment'
            });
        }
        
        // Cancel on Stripe if payment intent exists
        if (payment.stripe_payment_intent_id) {
            await PaymentService.cancelStripePaymentIntent(payment.stripe_payment_intent_id);
        }
        
        // Update payment status
        const result = await PaymentService.updatePaymentStatus(id, 'CANCELLED');
        
        res.status(200).json({
            success: true,
            message: 'Payment cancelled successfully',
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get payment status from Stripe and update database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get payment record
        const paymentResult = await PaymentService.getPaymentById(id);
        const payment = paymentResult.data;
        
        // Check if user owns this payment (unless admin)
        if (!req.user.isAdmin && payment.user_id !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied to this payment'
            });
        }
        
        // Get latest status from Stripe
        if (payment.stripe_payment_intent_id) {
            const stripeResult = await PaymentService.retrieveStripePaymentIntent(payment.stripe_payment_intent_id);
            
            // Update database if status changed
            if (stripeResult.data.status === 'succeeded' && payment.status !== 'COMPLETED') {
                await PaymentService.updatePaymentStatus(id, 'COMPLETED', {
                    completed_at: new Date().toISOString()
                });
                payment.status = 'COMPLETED';
            }
        }
        
        res.status(200).json({
            success: true,
            message: 'Payment status retrieved successfully',
            data: {
                payment_id: payment.payment_id,
                status: payment.status,
                payment_amount: payment.payment_amount,
                currency: payment.currency
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const mockConfirmPayment = async (req, res) => {
    try {
        const { id } = req.params;

        const paymentResult = await PaymentService.getPaymentById(id);
        const payment = paymentResult.data;

        if(!req.user.isAdmin && payment.user_id !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied to this payment'
            });
        }

        if (payment.status === 'COMPLETED') {
            return res.status(400).json({
                success: false,
                message: 'Payment already completed'
            });
        }

        const result = await PaymentService.updatePaymentStatus(id, 'COMPLETED')

        res.status(200).json({
            success: true,
            message: 'Payment confirmed successfully (mocked for testing)',
            data: result.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};