/*
Payment API service - handles all order-related API calls
Follows the same pattern as cartApi
*/

import axios from "axios"

const PAYMENT_BASE_URL = `http://${import.meta.env.VITE_AWS_ELASTIC_IP}:3004/api/payments`;

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
    getPaymentsByOrderId: (orderId) => paymentApi.get(`/order/${orderId}`),
    mockConfirmPayment: (paymentId) => paymentApi.post(`/mock-confirm-payment/${paymentId}`),
    getAllPayments: (page = 1, limit = 10, status = null, search = null) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString()
        });
        
        if (status) params.append('status', status);
        if (search) params.append('search', search);
        
        return paymentApi.get(`/all?${params.toString()}`);
      },
      getAllPaymentsForStats: () => {
        const params = new URLSearchParams({
          page: '1',
          limit: '1000' // Large number to get all payments
        });
        
        return paymentApi.get(`/all?${params.toString()}`);
      }
};