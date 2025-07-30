import { productApi } from '../services/productapi.js';
import { redirect } from 'react-router-dom';

export async function editProductAction({ request, params }) {
    try {
      const { id } = params;
      const formData = await request.formData();
      
      // Extract basic product data
      const productData = {
        p_name: formData.get('p_name')?.trim(),
        brand: formData.get('brand')?.trim(),
        price: parseFloat(formData.get('price')),
        categories: [],
        sizes: []
      };
      
      // Extract categories (dynamic form fields)
      const categoryEntries = Array.from(formData.entries())
        .filter(([key]) => key.startsWith('categories['));
      
      const categoryMap = {};
      categoryEntries.forEach(([key, value]) => {
        const match = key.match(/categories\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const [, index, field] = match;
          if (!categoryMap[index]) categoryMap[index] = {};
          categoryMap[index][field] = value;
        }
      });
      
      productData.categories = Object.values(categoryMap);
      
      // Extract sizes (dynamic form fields)
      const sizeEntries = Array.from(formData.entries())
        .filter(([key]) => key.startsWith('sizes['));
      
      const sizeMap = {};
      sizeEntries.forEach(([key, value]) => {
        const match = key.match(/sizes\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const [, index, field] = match;
          if (!sizeMap[index]) sizeMap[index] = {};
          sizeMap[index][field] = field === 'stock' ? parseInt(value) : value;
        }
      });
      
      productData.sizes = Object.values(sizeMap);
      
      // Validate required fields
      if (!productData.p_name || !productData.brand || productData.price <= 0) {
        return {
          error: 'Please fill in all required fields (name, brand, price > 0)'
        };
      }
      
      // Handle image deletions
      const imagesToDelete = JSON.parse(formData.get('imagesToDelete') || '[]');
      
      // Delete specified images
      for (const imageId of imagesToDelete) {
        try {
          await productApi.deleteImage(id, imageId);
        } catch (imageError) {
          console.error('Error deleting image:', imageError);
          // Continue with other operations even if image deletion fails
        }
      }
      
      // Update the product
      await productApi.updateProduct(id, productData);
      
      // Handle new image uploads if any
      const imageFiles = Array.from(formData.getAll('images')).filter(file => file.size > 0);
      
      if (imageFiles.length > 0) {
        try {
          // Upload new images to the product
          await productApi.uploadMultipleImages(id, imageFiles);
        } catch (imageError) {
          console.error('Error uploading new images:', imageError);
          // Product is updated but images failed - still redirect but could show warning
          return {
            error: 'Product updated successfully, but some new images failed to upload. You can try adding them again.'
          };
        }
      }
      
      // Redirect to products list on success
      return redirect('/admin/products');
      
    } catch (error) {
      console.error('Error updating product:', error);
      
      return {
        error: error.response?.data?.error || 
               error.message || 
               'An error occurred while updating the product. Please try again.'
      };
    }
  }