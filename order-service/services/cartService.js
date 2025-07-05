/**
 * @fileoverview Cart Service is a service that carries out CRUD operations on cart
 * @module services/ProductService
 * @author Zain
 * @version 1.0.4
 * @since 1.0.0
 */

import supabase from "../config/Database.js";
import { v4 as uuidv4 } from 'uuid';

class CartService {
    async createCart(userId, productId, size, quantity) {
        try {
            const cartId = uuidv4();
            const { data, error } = await supabase.from('cart').insert({
                cart_id: cartId,
                user_id: userId,
                product_id: productId,
                size: size,
                quantity: quantity
            });
            if (error) {
                throw new Error(error.message);
            }
            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error creating cart: ${error.message}`);
        }
    }

    async getCartByUserId(userId) {
        try {
            const { data, error } = await supabase
            .from('cart')
            .select(`
                *,
                product(
                    name,
                    price,
                    P_Images (
                        image_url
                    )
                )
            `)
            .eq('user_id', userId)
            .order('added_date', { ascending: false });
    
            if (error) {
                throw new Error(error.message);
            }
        
            return {
                data: data,
            };
        } catch (error) {
            throw new Error(`Error getting cart: ${error.message}`);
        }
    }

    async updateCart(cartId, quantity, size) {
        try {
            const { data, error } = await supabase
            .from('cart')
            .update({
                quantity: quantity,
                size: size,
                updated_date: new Date().toISOString()
            }).eq('cart_id', cartId);

            if (error) {
                throw new Error(error.message);
            }

            return {
                data: data
            } 
            
        } catch (error) {
            throw new Error(`Error updating cart: ${error.message}`);
        }
    }

    async removeFromCart(cartId) {
        try {
            const { data, error } = await supabase
            .from('cart')
            .delete()
            .eq('cart_id', cartId);

            if (error) {
                throw new Error(error.message);
            }

            return {
                data: data
            } 
            
        } catch (error) {
            throw new Error(`Error updating cart: ${error.message}`);
        }
    }

    async clearCart(userId) {
        try {
            const { data, error } = await supabase
            .from('cart')
            .delete()
            .eq('user_id', userId);
    
        if (error) {
            throw new Error(`Error clearing cart: ${error.message}`);
        }
    
        return { data: data };
        } catch (error) {
            throw new Error(`Error clearing cart: ${error.message}`);
        }
    }
}

export default new CartService();