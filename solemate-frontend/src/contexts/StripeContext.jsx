import React, { createContext, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Replace with your publishable key
const stripePromise = loadStripe('pk_test_51RaMOG2MVk4mUNBLJidXPvx9pxKowzNddYsUMeXo5IL4e6WKIMOYu5O48VUcXSkgkKuCt71x7G8GaKWXHGrkysuT00gODM1lqC');

const StripeContext = createContext();

export const StripeProvider = ({ children }) => {
    return (
        <Elements stripe={stripePromise}>
            {children}
        </Elements>
    );
};

export const useStripe = () => {
    const context = useContext(StripeContext);
    if (!context) {
        throw new Error('useStripe must be used within StripeProvider');
    }
    return context;
};