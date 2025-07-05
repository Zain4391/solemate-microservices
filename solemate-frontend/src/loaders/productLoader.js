import { productApi } from "../services/productapi.js";

export const productLoader = async ({ request }) => {
    try {
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page')) || 1;
      const limit = 10;
      
      const [productResponse, categoryResponse, brandResponse] = await Promise.all([
        productApi.getAllProducts(page, limit),
        productApi.getCategories(),
        productApi.getBrands()
      ]);
      
      return {
        products: productResponse.data,
        categories: categoryResponse.data,
        brands: brandResponse.data
      };
    } catch (error) {
      console.error('Failed to load products:', error);
      throw new Response('Failed to load products', { status: 500 });
    }
  };