/*
Payment API service - handles all order-related API calls
Follows the same pattern as cartApi
*/

import axios from "axios"

const PAYMENT_BASE_URL = "http://localhost:3003/api/payment"

export const paymentApi = axios.create({
    baseURL: PAYMENT_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add same interceptors as your other APIs
paymentApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

paymentApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = `/login`;
        }
        return Promise.reject(error);
    }
)

export const paymentApiService = {
    createPayment: (paymentData) => paymentApi.post('/create-payment', paymentData),
    confirmPayment: (confirmData) => paymentApi.post('/confirm-payment', confirmData),
    getPaymentStatus: (paymentId) => paymentApi.get(`/payment-status/${paymentId}`),
    mockConfirmPayment: (paymentId) => paymentApi.post(`/mock-confirm-payment/${paymentId}`)
};