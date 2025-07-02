import { productApi } from "../services/productapi";

export const SingleProductLoader = async (id) => {
    try {
        const response = await productApi.getProductById(id);
        return response.data;
    } catch (error) {
        console.log(`Error while fetching the product: ${error}`);
        throw new Response('Failed to load product', { status: 500 });        
    }
};