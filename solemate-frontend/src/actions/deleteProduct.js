import { productApi } from '../services/productapi.js';

export async function adminProductsAction({ request }) {
    if (request.method === 'DELETE') {
      try {
        const formData = await request.formData();
        const productId = formData.get('productId');
        
        if (!productId) {
          return { error: 'Product ID is required' };
        }
        
        // Call your API to delete the product
        await productApi.deleteProduct(productId);
        
        return { success: true };
        
      } catch (error) {
        console.error('Error deleting product:', error);
        return { 
          error: error.response?.data?.error || 
                 error.message || 
                 'Failed to delete product. Please try again.' 
        };
      }
    }
    
    return null;
  }