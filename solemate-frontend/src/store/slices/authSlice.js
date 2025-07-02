/*
State management for authentication and authorization
- Thunks execute api calls
- slices manage business logic {loading, sync loacalstorage etc}
*/ 

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi, userApi } from '../../services/api.js';

// Safe function to get user from localStorage
const getUserFromStorage = () => {
    try {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user'); // Clean up corrupted data
        return null;
    }
};

export const registerUser = createAsyncThunk('auth/register', 
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authApi.register(userData);
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Registration failed'
            );
        }
    }
);

export const loginUser = createAsyncThunk('auth/login', 
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);
            const { token, user } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { token, user };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'login failed'
            )
        }
    }
);

export const fetchUserProfile = createAsyncThunk('auth/fetchProfile', 
    async (_, { rejectWithValue }) => {
        try {
            const response = await userApi.getProfile();
            return response.data.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch user'
            )
        }
    }
);

export const logoutUser = createAsyncThunk('auth/logout', 
    async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return "User logged out successfully";
    }
)

const initialState = {
    user: getUserFromStorage(), // FIXED: Safe JSON parsing
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isloading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        clearAuth: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isloading = false;
            state.error = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(registerUser.pending, (state) => {
            state.isloading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isloading = false;
            state.error = null
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isloading = false;
            state.error = action.payload;
        })
        .addCase(loginUser.pending, (state) => {
            state.isloading = true;
            state.error = null
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isloading = false;
            state.error = action.payload;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isloading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
        })
        .addCase(logoutUser.pending, (state) => {
            state.isloading = true;
            state.error = null;
        })
        .addCase(logoutUser.rejected, (state, action) => {
            state.isloading = false;
            state.error = action.payload;
        })
        .addCase(logoutUser.fulfilled, (state, action) => {
            state.isloading = false;
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        })
        .addCase(fetchUserProfile.pending, (state) => {
            state.isloading = true;
            state.error = null;
        })
        .addCase(fetchUserProfile.rejected, (state, action) => {
            state.isloading = false;
            state.error = action.payload;
        })
        .addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.isloading = false;
            state.user = action.payload;
            const basicUser = {
                id: state.user.u_id,
                first_name: state.user.first_name,  // FIXED: state.user instead of user
                last_name: state.user.last_name,    // FIXED: state.user instead of user
                is_admin: state.user.is_admin       // FIXED: state.user instead of user
            }
            localStorage.setItem('user', JSON.stringify(basicUser));
        })
    }
})

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;