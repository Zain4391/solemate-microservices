/*
Centralizes axios instance for api management
api => instance of axios with default config
*/

import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const APP_BASE_URL = `http://${process.env.VITE_AWS_ELASTIC_IP}:3001/api`;


export const api = axios.create({
    baseURL: APP_BASE_URL,
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

export const authApi = {
    register: (userData) => api.post('/auth/sign-in', userData),
    login: (userData) => api.post('/auth/login', userData),
    resetPassword: (email, password) => api.post('/auth/reset-password', {
        email,
        password
    })
}

export const userApi = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (userData) => api.put('/users/profile', userData),
    deleteAccount: () => api.delete('/users/account'),

    // admin ops
    getAllUsers: () => api.get('/users/users'),
    getUserById: (id) => api.get(`/users/users/${id}`),
    deleteUser: (id) => api.delete(`/users/users/${id}`)
}
