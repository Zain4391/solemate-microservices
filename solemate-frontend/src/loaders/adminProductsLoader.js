// loaders/adminProductsLoader.js
import { productApi } from '../services/productapi.js';

export const adminProductsLoader = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    const brand = url.searchParams.get('brand') || '';
    
    // Make API calls - your getAllProducts already supports all these filters
    const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
      productApi.getAllProducts(page, 12, { search, category, brand }),
      productApi.getCategories(),
      productApi.getBrands()
    ]);
    
    // Extract data from responses - adjust based on your actual API response structure
    const products = productsResponse.data?.data?.products || productsResponse.data?.products || [];
    const pagination = productsResponse.data?.data?.pagination || productsResponse.data?.pagination || null;
    const categories = categoriesResponse.data?.data?.categories || categoriesResponse.data?.categories || [];
    const brands = brandsResponse.data?.data?.brands || brandsResponse.data?.brands || [];
    
    // Calculate total stock for each product
    const productsWithStock = products.map(product => ({
      ...product,
      stock: product.P_Size?.reduce((sum, size) => sum + (size.stock > 0 ? size.stock : 0), 0) || 0
    }));
    
    return {
      products: productsWithStock,
      pagination,
      categories,
      brands,
      filters: {
        page,
        search,
        category,
        brand
      },
      stats: {
        total: pagination?.total_items || pagination?.total || productsWithStock.length,
        displayed: productsWithStock.length
      }
    };
  } catch (error) {
    console.error('Admin products loader error:', error);
    throw new Response('Failed to load products', { status: 500 });
  }
};

export const adminProductEditLoader = async ({ params }) => {
  try {
    const { productId } = params;
    
    if (!productId) {
      throw new Response('Product ID is required', { status: 400 });
    }
    
    // Use your productApi functions properly
    const [productResponse, categoriesResponse, brandsResponse, imagesResponse] = await Promise.all([
      productApi.getProductById(productId),
      productApi.getCategories(),
      productApi.getBrands(),
      productApi.getProductImages(productId).catch(() => ({ data: [] })) // Handle no images gracefully
    ]);
    
    // Extract data with proper fallbacks
    const product = productResponse.data?.data || productResponse.data;
    const categories = categoriesResponse.data?.data?.categories || categoriesResponse.data?.categories || [];
    const brands = brandsResponse.data?.data?.brands || brandsResponse.data?.brands || [];
    const images = imagesResponse.data?.data || imagesResponse.data || [];
    
    if (!product) {
      throw new Response('Product not found', { status: 404 });
    }
    
    return {
      product,
      categories,
      brands,
      images,
      productId
    };
  } catch (error) {
    console.error('Admin product edit loader error:', error);
    if (error instanceof Response) {
      throw error;
    }
    throw new Response('Failed to load product details', { status: 500 });
  }
};

export const adminProductCreateLoader = async () => {
  try {
    // Use your productApi functions for categories and brands
    const [categoriesResponse, brandsResponse] = await Promise.all([
      productApi.getCategories(),
      productApi.getBrands()
    ]);
    
    // Extract data with proper fallbacks
    const categories = categoriesResponse.data?.data?.categories || categoriesResponse.data?.categories || [];
    const brands = brandsResponse.data?.data?.brands || brandsResponse.data?.brands || [];
    
    return {
      categories,
      brands
    };
  } catch (error) {
    console.error('Admin product create loader error:', error);
    throw new Response('Failed to load form data', { status: 500 });
  }
};