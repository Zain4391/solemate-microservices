/*
State management for User operations (includes Admin operations)
- thunks for API calls
- reducers for general access
*/

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userApi } from "../../services/api.js";

export const updateUserProfile = createAsyncThunk('user/updateProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await userApi.updateProfile(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Update failed.'
            )
        }
    }
);

export const deleteUserAccount = createAsyncThunk('user/deleteProfile',
    async(_, { rejectWithValue }) => {
        try {
            await userApi.deleteAccount();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return true;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Account deletion failed'
            )
        }
    }
);

export const fetchAllUsers = createAsyncThunk('user/fetchAllUsers', 
    async(_, {rejectWithValue}) => {
        try {
            const response = await userApi.getAllUsers();
            return response.data.users;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch users'
            )   
        }
    }
);

export const fetchUserById = createAsyncThunk('user/fetchUserById', 
    async(userId, {rejectWithValue}) => {
        try {
            const response = await userApi.getUserById(userId);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch user'
            )
        }
    }
);

export const deleteUser = createAsyncThunk('user/deleteUser',
    async(userId, { rejectWithValue }) => {
        try {
            await userApi.deleteUser(userId);
            return userId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to delete user'
            )
        }
    }
);

const initialState = {
    isUpdating: false,
    updateError: null,
    updateSuccess: false,
    
    isDeleting: false,
    deleteError: null,
    
    allUsers: [],
    selectedUser: null,
    isLoadingUsers: false,
    usersError: null,
    
    isOperating: false,
    operationError: null,
    operationSuccess: false,
  };

  const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUpdateStatus: (state) => {
            state.updateError = null;
            state.updateSuccess = false;
          },
          clearDeleteStatus: (state) => {
            state.deleteError = null;
          },
          clearUsersError: (state) => {
            state.usersError = null;
          },
          clearOperationStatus: (state) => {
            state.operationError = null;
            state.operationSuccess = false;
          },
          clearSelectedUser: (state) => {
            state.selectedUser = null;
          },
    },
    extraReducers: (builder) => {
        builder

      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateSuccess = true;
        const basicUser = {
            id: action.payload.u_id,
            first_name: action.payload.first_name,
            last_name: action.payload.last_name,
            is_admin: action.payload.is_admin
        }
        localStorage.setItem('user', JSON.stringify(basicUser));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload;
      })
      
      .addCase(deleteUserAccount.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.isDeleting = false;
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload;
      })
      
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoadingUsers = true;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoadingUsers = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoadingUsers = false;
        state.usersError = action.payload;
      })
      
      .addCase(fetchUserById.pending, (state) => {
        state.isLoadingUsers = true;
        state.usersError = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoadingUsers = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoadingUsers = false;
        state.usersError = action.payload;
      })
      
      .addCase(deleteUser.pending, (state) => {
        state.isOperating = true;
        state.operationError = null;
        state.operationSuccess = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isOperating = false;
        state.operationSuccess = true;
        state.allUsers = state.allUsers.filter(user => user.u_id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isOperating = false;
        state.operationError = action.payload;
      });
    }
  })

  export const {
    clearUpdateStatus,
    clearDeleteStatus,
    clearUsersError,
    clearOperationStatus,
    clearSelectedUser
  } = userSlice.actions;

  export default userSlice.reducer;