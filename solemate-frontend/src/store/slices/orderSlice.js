/*
State management for order operations  
- Thunks execute api calls
- slices manage business logic {loading, error handling etc}
Following the same pattern as cartSlice
*/ 

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { orderApiService } from '../../services/orderapi.js';

// Helper to calculate order totals (similar to cart calculateTotal)
export const calculateOrderTotal = (orderDetails) => {
    const totalItems = orderDetails.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = orderDetails.reduce((total, item) => {
        return total + (item.quantity * item.od_price);
    }, 0);

    return { totalItems, totalAmount };
}

// Async thunks for order operations
export const createOrder = createAsyncThunk("order/create", 
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await orderApiService.createOrder(orderData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create order'
            );
        }
    }
)

export const moveCartToOrderDetails = createAsyncThunk("order/moveCart", 
    async (moveData, { rejectWithValue }) => {
        try {
            const response = await orderApiService.moveCartToOrderDetails(moveData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to move cart to order'
            );
        }
    }
)

export const fetchOrderById = createAsyncThunk("order/fetchById", 
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await orderApiService.getOrderById(orderId);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch order'
            );
        }
    }
)

export const fetchOrderDetails = createAsyncThunk("order/fetchDetails", 
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await orderApiService.getOrderDetails(orderId);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch order details'
            );
        }
    }
)

export const fetchUserOrders = createAsyncThunk("order/fetchUserOrders", 
    async (userId, { rejectWithValue }) => {
        try {
            const response = await orderApiService.getUserOrders(userId);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch user orders'
            );
        }
    }
)

export const updateOrderStatus = createAsyncThunk("order/updateStatus",
    async ({orderId, isComplete}, { rejectWithValue }) => {
        try {
            const response = await orderApiService.updateOrderStatus(orderId, { isComplete });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update order status'
            );
        }
    }
)

// Initial state following cart pattern
const initialState = {
    // Current order being processed
    currentOrder: null,
    currentOrderDetails: [],
    
    // User's order history
    userOrders: [],
    
    // Calculated totals for current order
    totalAmount: 0,
    totalItems: 0,
    
    // Loading states
    isLoading: false,
    isCreating: false,
    isMovingCart: false,
    
    // Error handling
    error: null,
    
    // Order creation flow state
    orderCreated: false,
    cartMoved: false
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetOrderFlow: (state) => {
            state.currentOrder = null;
            state.currentOrderDetails = [];
            state.totalAmount = 0;
            state.totalItems = 0;
            state.orderCreated = false;
            state.cartMoved = false;
            state.error = null;
        },
        setCurrentOrder: (state, action) => {
            state.currentOrder = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        // Create order
        .addCase(createOrder.pending, (state) => {
            state.isCreating = true;
            state.error = null;
        })
        .addCase(createOrder.fulfilled, (state, action) => {
            state.isCreating = false;
            state.error = null;
            state.currentOrder = action.payload.data;
            state.orderCreated = true;
        })
        .addCase(createOrder.rejected, (state, action) => {
            state.isCreating = false;
            state.error = action.payload;
            state.orderCreated = false;
        })
        
        // Move cart to order details
        .addCase(moveCartToOrderDetails.pending, (state) => {
            state.isMovingCart = true;
            state.error = null;
        })
        .addCase(moveCartToOrderDetails.fulfilled, (state, action) => {
            state.isMovingCart = false;
            state.error = null;
            state.cartMoved = true;
        })
        .addCase(moveCartToOrderDetails.rejected, (state, action) => {
            state.isMovingCart = false;
            state.error = action.payload;
            state.cartMoved = false;
        })
        
        // Fetch order by ID
        .addCase(fetchOrderById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchOrderById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.currentOrder = action.payload[0]; // Backend returns array
        })
        .addCase(fetchOrderById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        
        // Fetch order details (items in order)
        .addCase(fetchOrderDetails.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchOrderDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.currentOrderDetails = action.payload || [];
            
            const { totalItems, totalAmount } = calculateOrderTotal(state.currentOrderDetails);
            state.totalItems = totalItems;
            state.totalAmount = totalAmount;
        })
        .addCase(fetchOrderDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        
        // Fetch user orders
        .addCase(fetchUserOrders.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchUserOrders.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.userOrders = action.payload || [];
        })
        .addCase(fetchUserOrders.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        
        // Update order status
        .addCase(updateOrderStatus.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(updateOrderStatus.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            // Update current order status if it matches
            if (state.currentOrder) {
                state.currentOrder.is_complete = true;
            }
        })
        .addCase(updateOrderStatus.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
    }
})

export const { clearError, resetOrderFlow, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;