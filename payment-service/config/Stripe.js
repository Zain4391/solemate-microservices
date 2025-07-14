/**
 * Stripe Configuration
 * Handles Stripe API initialization and configuration
 */

import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    typescript: false
});

const stripeConfig = {
    stripe,
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || null,
    
    defaultCurrency: 'usd',

    paymentIntentDefaults: {
        automatic_payment_methods: {
          enabled: true,
        },
        capture_method: 'automatic',
        confirmation_method: 'automatic'
      },
    
    webhookEvents: [
        'payment_intent.succeeded',
        'payment_intent.payment_failed',
        'payment_intent.canceled',
        'payment_method.attached'
      ]
}

export default stripeConfig;