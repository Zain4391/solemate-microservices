/**
 * @fileoverview Order Service handles CRUD operations on orders and order_details
 * @module services/OrderService
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */
import supabase from "../config/Database.js";
import { v4 as uuidv4 } from 'uuid';
import cartService from "./cartService.js";

class OrderService {
    async createOrder(userId, address, totalAmount, promiseDate) {
        try {
            const orderId = uuidv4();
            const { data, error } = await supabase.from('order').insert({
                o_id: orderId,
                user_u_id: userId,
                order_date: new Date().toISOString(),
                promise_date: promiseDate,
                address: address,
                total_amount: totalAmount,
                is_complete: false
            });

            if (error) {
                throw new Error(`Error creating order: ${error.message}`);
            }

            return {
                data: data,
                orderId: orderId
            };
        } catch (error) {
            throw new Error(`Error creating order: ${error.message}`);
        }
    }

    async getAllOrders() {
        try {
            const { data, error} = await supabase.from('order').select('*');

            if (error) {
                throw new Error(`Error fetching orders: ${error.message}`);
            }

            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error fetching orders: ${error.message}`);   
        }
    }

    async moveCartToOrderDetails(userId, orderId) {
        try {
            const { data: cartData, error: cartError } = await supabase
            .from('cart')
            .select('*, product(price)').eq('user_id', userId);

            if(cartError) {
                throw new Error(`Error fetching cart items: ${cartError.message}`);
            }

            const orderDetailsData = cartData.map(item => ({
                od_id: uuidv4(),
                quantity: item.quantity,
                od_price: item.products.price,
                product_p_id: item.product_p_id,
                order_o_id: orderId,
                user_id: userId,
                size: item.size
            }))

            const { data, error } = await supabase.from('order_details').insert(orderDetailsData);

            if (error) {
                throw new Error(`Error moving cart items to order details: ${error.message}`);
            }

            await cartService.clearCart(userId);
            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error moving cart items to order details: ${error.message}`);
        }
    }

    async getOrderById(orderId) {
        try {
            const { data, error } = await supabase.from('order').select('*').eq('o_id', orderId);
            if (error) {
                throw new Error(`Error fetching order by ID: ${error.message}`);
            }

            if(data.length === 0) {
                throw new Error(`No order found with ID: ${orderId}`);
            }
            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error fetching order by ID: ${error.message}`);
        }
    }

    async getAllUserOrders(userId) {
        try {
            const { data, error } = await supabase.from('order').select('*').eq('user_u_id', userId);

            if(error) {
                throw new Error(`Error fetching user orders: ${error.message}`);
            }

            if(data.length === 0) {
                throw new Error(`No orders found for user with ID: ${userId}`);
            }

            return {
                data: data
            }
        } catch (error) {
            throw new Error(`Error fetching user orders: ${error.message}`);
        }
    }

    async updateOrderStatus(orderId, isComplete) {
        try {
            const { data, error } = await supabase
                .from('order')
                .update({
                    is_complete: isComplete
                })
                .eq('o_id', orderId);
    
            if (error) {
                throw new Error(`Error updating order status: ${error.message}`);
            }
    
            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error updating order status: ${error.message}`);
        }
    }

    async deleteOrder(orderId) {
        try {
            // First delete order details
            const { error: detailsError } = await supabase
                .from('order_details')
                .delete()
                .eq('order_o_id', orderId);
    
            if (detailsError) {
                throw new Error(`Error deleting order details: ${detailsError.message}`);
            }
    
            // Then delete the order
            const { data, error } = await supabase
                .from('order')
                .delete()
                .eq('o_id', orderId);
    
            if (error) {
                throw new Error(`Error deleting order: ${error.message}`);
            }
    
            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error deleting order: ${error.message}`);
        }
    }

    async getOrderDetails(orderId) {
        try {
            const { data, error } = await supabase
                .from('order_details')
                .select(`
                    *,
                    product(
                        name,
                        description,
                        P_Images(
                            image_url
                        )
                    )
                `)
                .eq('order_o_id', orderId);
    
            if (error) {
                throw new Error(`Error fetching order details: ${error.message}`);
            }
    
            if (data.length === 0) {
                throw new Error(`No order details found for order ID: ${orderId}`);
            }
    
            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error fetching order details: ${error.message}`);
        }
    }

    async getOrdersByStatus(isComplete) {
        try {
            const { data, error } = await supabase
                .from('order')
                .select('*')
                .eq('is_complete', isComplete)
                .order('order_date', { ascending: false });
    
            if (error) {
                throw new Error(`Error fetching orders by status: ${error.message}`);
            }
    
            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error fetching orders by status: ${error.message}`);
        }
    }

    async updateOrderAddress(orderId, newAddress) {
        try {
            const { data, error } = await supabase
                .from('order')
                .update({
                    address: newAddress
                })
                .eq('o_id', orderId);
    
            if (error) {
                throw new Error(`Error updating order address: ${error.message}`);
            }
    
            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error updating order address: ${error.message}`);
        }
    }
}

export default new OrderService();