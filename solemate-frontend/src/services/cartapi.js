/*
Centralizes axios instance for api management
api => instance of axios with default config
*/

import axios from "axios"

const CART_BASE_URL = `http://${import.meta.env.VITE_AWS_ELASTIC_IP}:3003/api/cart`;

export const api = axios.create({
    baseURL: CART_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
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

api.interceptors.response.use(
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

export const cartApi = {
    getCart: (id) => api.get(`/users/${id}`),
    createCart: (cartData) => api.post('/', cartData),
    updateCart: (cartId, updateData) => api.put(`/${cartId}`, updateData),
    removeItemFromCart: (cartId) => api.delete(`/${cartId}`),
    clearCart: (id) => api.delete(`/users/${id}`)
}