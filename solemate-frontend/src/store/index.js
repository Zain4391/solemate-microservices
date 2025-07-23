import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import userReducer from './slices/userSlice.js';
import cartReducer from './slices/cartSlice.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        cart: cartReducer
    }
})