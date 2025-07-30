import { userApi } from "../services/api";

export async function adminUsersAction({ request }) {
    if (request.method === 'DELETE') {
      try {
        const formData = await request.formData();
        const userId = formData.get('userId');
        
        if (!userId) {
          return { error: 'User ID is required' };
        }
        
        await userApi.deleteUser(userId);
        
        return { success: true };
        
      } catch (error) {
        console.error('Error deleting user:', error);
        return { 
          error: error.response?.data?.message || 
                 error.response?.data?.error || 
                 error.message || 
                 'Failed to delete user. Please try again.' 
        };
      }
    }
    
    return null;
  }