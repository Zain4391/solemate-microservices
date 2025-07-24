/*
State management for cart operations
- Thunks execute api calls
- slices manage business logic {loading, sync localStorage etc}
*/ 

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cartApi } from '../../services/cartapi.js';

// helper to calc total amount and quantity
export const calculateTotal = (items) => {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = items.reduce((total, item) => {
        return total + (item.quantity * item.product.price);
    }, 0);

    return { totalItems, totalAmount };
}

export const fetchItemsFromCart = createAsyncThunk("cart/getItems", 
    async (id, { rejectWithValue }) => {
        try {
            const response = await cartApi.getCart(id);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'failed to fetch cart items'
            );
        }
    }
)

export const addToCart = createAsyncThunk("cart/createcart", 
    async (cartData, { rejectWithValue, dispatch }) => {
        try {
            const response = await cartApi.createCart(cartData);
            // After adding, refetch the cart to get updated data
            dispatch(fetchItemsFromCart(cartData.userId));
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'failed to create cart'
            );
        }
    }
)

export const updateCart = createAsyncThunk("cart/updateItem",
    async ({cartId, updateData, userId}, { rejectWithValue, dispatch }) => {
        try {
            console.log('🔍 API call - updating cartId:', cartId);
            console.log("\n With update data: ", updateData);
            
            const response = await cartApi.updateCart(cartId, updateData);
            console.log('🔍 API call - returned:', response);
            // After updating, refetch the cart to get updated data
            dispatch(fetchItemsFromCart(userId));
            return { cartId, updateData };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'failed to update cart'
            );
        }
    }
)

export const removeItemFromCart = createAsyncThunk("cart/removeItem", 
    async ({cartId, userId}, { rejectWithValue, dispatch }) => {
        try {
            console.log('🔍 API call - removing cartId:', cartId);
            const response = await cartApi.removeItemFromCart(cartId);
            console.log('🔍 API call - returned:', response);
            // After removing, refetch the cart to get updated data
            dispatch(fetchItemsFromCart(userId));
            return cartId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'failed to remove cart items'
            );
        }
    }
)

export const clearCart = createAsyncThunk("cart/clear", 
    async (userId, { rejectWithValue }) => {
        try {
            const response = await cartApi.clearCart(userId);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'failed to delete cart'
            );
        }
    }
)

// initialize cart (server first, when user logs in/ signs up fetch their cart)
const initialState = {
    items: [],
    totalAmount: 0,
    totalItems: 0,
    isLoading: false,
    error: null
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
        // Fetch cart items
        .addCase(fetchItemsFromCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchItemsFromCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.items = action.payload || []; // Handle null/undefined
            
            const { totalItems, totalAmount } = calculateTotal(state.items);
            state.totalItems = totalItems;
            state.totalAmount = totalAmount;
        })
        .addCase(fetchItemsFromCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        
        // Add to cart (will trigger refetch via dispatch)
        .addCase(addToCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            // fetchItemsFromCart will handle updating the state
        })
        .addCase(addToCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        
        // Update cart item (will trigger refetch via dispatch)
        .addCase(updateCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(updateCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            // fetchItemsFromCart will handle updating the state
        })
        .addCase(updateCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        
        // Remove item from cart (will trigger refetch via dispatch)
        .addCase(removeItemFromCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(removeItemFromCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            // fetchItemsFromCart will handle updating the state
        })
        .addCase(removeItemFromCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        
        // Clear entire cart
        .addCase(clearCart.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(clearCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.items = [];
            state.totalItems = 0;
            state.totalAmount = 0;
        })
        .addCase(clearCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;