import { productApi } from "../services/productapi.js";

export const productLoader = async () => {
    try {
        const [ productResponse, categoryResponse, brandResponse ] = await Promise.all([
            productApi.getAllProducts(),
            productApi.getCategories(),
            productApi.getBrands()
        ]);

        return {
            products: productResponse.data,
            categories: categoryResponse.data,
            brands: brandResponse.data
        }
    } catch (error) {
        console.error('Failed to load products:', error);
        throw new Response('Failed to load products', { status: 500 });
    }
};