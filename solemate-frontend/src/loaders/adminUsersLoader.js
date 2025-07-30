import { userApi } from '../services/api.js';

export async function adminUsersLoader() {
    try {
      const response = await userApi.getAllUsers();
      
      return {
        users: response.data.data.users || response.data.users || response.data || []
      };
    } catch (error) {
      console.error('Error loading users:', error);
      
      // Return empty array instead of throwing to prevent crashes
      return {
        users: []
      };
    }
  }