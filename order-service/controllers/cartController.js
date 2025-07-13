/**
 * @fileoverview Cart Controller handles HTTP requests for cart operations
 * @module controllers/cartController
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */

import cartService from "../services/cartService.js";

export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        if(!userId) {
            return res.status(400).json({message: "Bad request, user id required", success: false});
        }
        const response = await cartService.getCartByUserId(userId);
        return res.status(200).json({
            success: true,
            message: 'Cart retrieved successfully',
            data: response.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });   
    }
};


export const addToCart = async (req, res) => {
    try {
        const { userId, productId, size, quantity } = req.body;

        if(!userId || !productId || !size || !quantity) {
            return res.status(400).json({
                message: "Bad Request. All fields required",
                success: false
            });
        }
        const response = await cartService.createCart(userId, productId, size, quantity);
        return res.status(201).json({
            message: "Item added to cart.",
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

export const updateCartItem = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { quantity, size } = req.body;
        
        if (!cartId || !quantity || !size) {
            return res.status(400).json({
                message: "Bad Request. Cart ID, quantity and size are required",
                success: false
            });
        }

        const response = await cartService.updateCart(cartId, quantity, size);
        
        return res.status(200).json({
            message: "Cart item updated successfully",
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

export const removeFromCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        
        if (!cartId) {
            return res.status(400).json({
                message: "Bad Request. Cart ID is required",
                success: false
            });
        }

        const response = await cartService.removeFromCart(cartId);
        
        return res.status(200).json({
            message: "Item removed from cart successfully",
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