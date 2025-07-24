import { redirect } from 'react-router-dom';

export const checkoutLoader = async () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if(!user || !token) {
            redirect('/login');
        }

        return { user };
    } catch (error) {
        console.error('Checkout failed:', error);
        return {
            error: error.response?.data?.message || 'Failed to process user: from checkout loader'
        };
    }
};