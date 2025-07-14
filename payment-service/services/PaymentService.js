/**
 * @fileoverview PaymentService is a service that carries out payment business logic
 * @module services/PaymentService
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */
import supabase from '../config/Database.js';
import { stripe } from '../config/Stripe.js';

class PaymentService {

    async getAllPayments(page = 1, limit = 10, status = null) {
        try {
            let query = supabase
                .from('payments')
                .select('*')
                .order('created_at', { ascending: false });
            
            // Filter by status if provided
            if (status) {
                query = query.eq('status', status);
            }
            
            // Add pagination
            const offset = (page - 1) * limit;
            query = query.range(offset, offset + limit - 1);
            
            const { data, error } = await query;
            
            if (error) {
                throw new Error(`Error fetching all payments: ${error.message}`);
            }
            
            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error fetching all payments: ${error.message}`);
        }
    }

    async createPayment(paymentData) {
        try {
            const { data, error } = await supabase.from('payments').insert([paymentData]).select().single();

            if(error) {
                throw new Error(`Error creating payment: ${error.message}`);
            }

            return {
                data: data
            }
        } catch (error) {
            throw new Error(`Error creating payment: ${error.message}`);   
        }
    }

    async getPaymentById(paymentId) {
        try {
            const { data, error } = await supabase
                .from('payments')
                .select('*')
                .eq('payment_id', paymentId)
                .single();
            
            if (error) {
                throw new Error(`Error fetching payment: ${error.message}`);
            }
            
            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error fetching payment: ${error.message}`);
        }
    }

    async updatePaymentStatus(paymentId, status, additionalData = {}) {
        try {
            const updateData = {
                status,
                ...additionalData
            };
            
            const { data, error } = await supabase
                .from('payments')
                .update(updateData)
                .eq('payment_id', paymentId)
                .select()
                .single();
            
            if (error) {
                throw new Error(`Error updating payment: ${error.message}`);
            }
            
            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error updating payment: ${error.message}`);
        }
    }

    async getPaymentsByOrderId(orderId) {
        try {
            const { data, error } = await supabase
                .from('payments')
                .select('*')
                .eq('order_o_id', orderId)
                .order('created_at', { ascending: false });
            
            if (error) {
                throw new Error(`Error fetching payments: ${error.message}`);
            }
            
            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error fetching payments: ${error.message}`);
        }
    }

    async createStripePaymentIntent(amount, currency = 'usd', metadata = {}) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency,
                automatic_payment_methods: {
                    enabled: true
                },
                metadata
            });

            const data = {
                client_secret: paymentIntent.client_secret,
                payment_intent_id: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                status: paymentIntent.status
            }

            return {
                data: data
            }
        } catch (error) {
            throw new Error(`Error creating payment intent: ${error.message}`);
        }
    }

    async confrimStripePaymentIntent(paymentIntentId) {
        try {
            const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

            const data = {
                id: paymentIntent.id,
                status: paymentIntent.status,
                currency: paymentIntent.currency,
                payment_method: paymentIntent.payment_method
            }

            return {
                data: data
            }
        } catch (error) {
            throw new Error(`Error confirming payment intent: ${error.message}`);   
        }
    }

    async retrieveStripePaymentIntent(paymentIntentId) {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            const data = {
                id: paymentIntent.id,
                status: paymentIntent.status,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                payment_method: paymentIntent.payment_method,
                client_secret: paymentIntent.client_secret
            }
            
            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error retrieving payment intent: ${error.message}`);
        }
    }

    async getPaymentsByUserId(userId) {
        try {
            const { data, error } = await supabase
                .from('payments')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            
            if (error) {
                throw new Error(`Error fetching user payments: ${error.message}`);
            }
            
            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error fetching user payments: ${error.message}`);
        }
    }

    async cancelStripePaymentIntent(paymentIntentId) {
        try {
            const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);

            const data = {
                id: paymentIntent.id,
                status: paymentIntent.status,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                cancellation_reason: paymentIntent.cancellation_reason
            }
            
            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error canceling payment intent: ${error.message}`);
        }
    }

    async getPaymentByStripeIntentId(stripePaymentIntentId) {
        try {
            const { data, error } = await supabase
                .from('payments')
                .select('*')
                .eq('stripe_payment_intent_id', stripePaymentIntentId)
                .single();
            
            if (error) {
                throw new Error(`Error fetching payment by stripe intent: ${error.message}`);
            }
            
            return {
                data: data
            };
        } catch (error) {
            throw new Error(`Error fetching payment by stripe intent: ${error.message}`);
        }
    }

    async processPayment(paymentData) {
        try {
            const stripeResult = await this.createStripePaymentIntent(
                paymentData.payment_amount,
                paymentData.currency || 'usd',
                {
                    order_id: paymentData.order_o_id,
                    user_id: paymentData.user_id
                }
            );

            const paymentRecord = {
                ...paymentData,
                stripe_payment_intent_id: stripeResult.data.payment_intent_id,
                client_secret: stripeResult.data.client_secret,
                status: 'PENDING'
            }

        const dbResult = await this.createPayment(paymentRecord);
        
        return {
            data: {
                ...dbResult.data,
                client_secret: stripeResult.data.client_secret
            }
        };
        } catch (error) {
            throw new Error(`Error processing payment: ${error.message}`);
        }
    }
}


export default new PaymentService();