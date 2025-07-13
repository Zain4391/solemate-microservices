/**
 * @fileoverview Order Controller handles HTTP requests for order operations
 * @module controllers/orderController
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */

import orderService from '../services/orderService.js';

export const getOrders = async (req, res) => {
    try {
        const response = await orderService.getAllOrders();

        return res.status(200).json({
            message: "Orders fetched successfully",
            success: true,
            data: response.data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { userId, address, totalAmount, promiseDate } = req.body;
        
        if (!userId || !address || !totalAmount || !promiseDate) {
            return res.status(400).json({
                message: "Bad Request. All fields required",
                success: false
            });
        }

        const response = await orderService.createOrder(userId, address, totalAmount, promiseDate);
        
        return res.status(201).json({
            message: "Order created successfully",
            success: true,
            data: response.data,
            orderId: response.orderId
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        if (!orderId) {
            return res.status(400).json({
                message: "Bad Request. Order ID is required",
                success: false
            });
        }

        const response = await orderService.getOrderById(orderId);
        
        return res.status(200).json({
            message: "Order fetched successfully",
            success: true,
            data: response.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({
                message: "Bad Request. User ID is required",
                success: false
            });
        }

        const response = await orderService.getAllUserOrders(userId);
        
        return res.status(200).json({
            message: "User orders fetched successfully",
            success: true,
            data: response.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const moveCartToOrderDetails = async (req, res) => {
    try {
        const { userId, orderId } = req.body;

        if(!userId || !orderId) {
            return res.status(400).json({
                message: "Bad request, all fields needed",
                success: false
            });
        }

        const response = await orderService.moveCartToOrderDetails(userId, orderId);
        return res.status(200).json({
            message: "Cart moved to order details successfully",
            success: true,
            data: response.data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { isComplete } = req.body;

        if(!orderId || !isComplete) {
            return res.status(400).json({
                message: "Bad Request, all field required",
                success: false
            });
        }

        const response = await orderService.updateOrderStatus(orderId, isComplete);
        return res.status(200).json({
            message: "Order status updated successfully",
            success: true,
            data: response.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        if (!orderId) {
            return res.status(400).json({
                message: "Bad Request. Order ID is required",
                success: false
            });
        }

        const response = await orderService.deleteOrder(orderId);
        
        return res.status(200).json({
            message: "Order deleted successfully",
            success: true,
            data: response.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        if (!orderId) {
            return res.status(400).json({
                message: "Bad Request. Order ID is required",
                success: false
            });
        }

        const response = await orderService.getOrderDetails(orderId);
        
        return res.status(200).json({
            message: "Order details fetched successfully",
            success: true,
            data: response.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getOrdersByStatus = async (req, res) => {
    try {
        const { isComplete } = req.params;
        
        if (isComplete === undefined) {
            return res.status(400).json({
                message: "Bad Request. Completion status is required",
                success: false
            });
        }

        // Convert string to boolean
        const status = isComplete === 'true';
        
        const response = await orderService.getOrdersByStatus(status);
        
        return res.status(200).json({
            message: "Orders fetched by status successfully",
            success: true,
            data: response.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateOrderAddress = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { address } = req.body;
        
        if (!orderId || !address) {
            return res.status(400).json({
                message: "Bad Request. Order ID and new address are required",
                success: false
            });
        }

        const response = await orderService.updateOrderAddress(orderId, address);
        
        return res.status(200).json({
            message: "Order address updated successfully",
            success: true,
            data: response.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updatePromiseDate = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { promiseDate } = req.body;
        
        if (!orderId || !promiseDate) {
            return res.status(400).json({
                message: "Bad Request. Order ID and new promise date are required",
                success: false
            });
        }

        const response = await orderService.updateOrderPromiseDate(orderId, promiseDate);
        
        return res.status(200).json({
            message: "Order promise date updated successfully",
            success: true,
            data: response.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};