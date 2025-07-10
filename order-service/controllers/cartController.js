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
        const {userId } = req.params;

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
        return res.status(201).jso({
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