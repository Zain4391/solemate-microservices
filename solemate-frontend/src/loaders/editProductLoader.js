import { productApi } from '../services/productapi.js';

// Loader function - runs before component renders
export async function editProductLoader({ params }) {
  try {
    const { id } = params;
    
    const [productRes, categoriesRes, brandsRes] = await Promise.all([
      productApi.getProductById(id),
      productApi.getCategories(),
      productApi.getBrands()
    ]);
    
    return {
      product: productRes.data.data.product[0], // Based on your API response structure
      categories: categoriesRes.data.categories || [],
      brands: brandsRes.data.brands || []
    };
  } catch (error) {
    console.error('Error loading edit product data:', error);
    throw new Response('Product not found', { status: 404 });
  }
}

