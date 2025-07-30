import { productApi } from '../services/productapi.js';
import { redirect } from 'react-router-dom';

// Action function - handles form submission
export async function addProductAction({ request }) {
  try {
    const formData = await request.formData();
    
    // Extract basic product data
    const productData = {
      p_name: formData.get('p_name'),
      brand: formData.get('brand'),
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
    if (!productData.p_name || !productData.brand || !productData.price) {
      return {
        error: 'Please fill in all required fields (name, brand, price)'
      };
    }
    
    // Create the product
    const response = await productApi.createProduct(productData);
    const createdProduct = response.data;
    console.log(createdProduct);
    
    if (!createdProduct.data?.product?.[0]?.p_id) {
        throw new Error('Invalid response from server');
      }
    const productId = createdProduct.data.product[0].p_id;
    
    // Handle image uploads if any
    const imageFiles = formData.getAll('images').filter(file => file.size > 0);
    
    if (imageFiles.length > 0) {
      try {
        // Upload images to the created product
        await productApi.uploadMultipleImages(productId, imageFiles);
      } catch (imageError) {
        console.error('Error uploading images:', imageError);
        // Product is created but images failed - still redirect but could show warning
        // You might want to handle this case differently based on your UX requirements
      }
    }
    
    // Redirect to products list on success
    return redirect('/admin/products');
    
  } catch (error) {
    console.error('Error creating product:', error);
    
    return {
      error: error.response?.data?.error || 
             error.message || 
             'An error occurred while creating the product. Please try again.'
    };
  }
}