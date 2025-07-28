/*
Order API service - handles all order-related API calls
Follows the same pattern as cartApi
*/

import axios from "axios"

const ORDER_BASE_URL = "http://localhost:3003/api/orders"

export const orderApi = axios.create({
    baseURL: ORDER_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

orderApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

orderApi.interceptors.response.use(
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

export const orderApiService = {
    createOrder: (orderData) => orderApi.post('/', orderData),
    moveCartToOrderDetails: (data) => orderApi.post('/move-cart', data),
    getOrderById: (orderId) => orderApi.get(`/${orderId}`),
    getUserOrders: (userId) => orderApi.get(`/users/${userId}`),
    getOrderDetails: (orderId) => orderApi.get(`/${orderId}/details`),
    updateOrderStatus: (orderId, statusData) => orderApi.put(`/${orderId}/status`, statusData),
    updateOrderAddress: (orderId, addressData) => orderApi.put(`/${orderId}/address`, addressData),
    updatePromiseDate: (orderId, dateData) => orderApi.put(`/${orderId}/promise-date`, dateData),
    deleteOrder: (orderId) => orderApi.delete(`/${orderId}`),

    // admin related
    getAllOrders: () => orderApi.get('/'),
    getORderByStatus: (isComplete) => orderApi.get(`/status/${isComplete}`)
}