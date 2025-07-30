import { productApi } from "../services/productapi.js";
import { redirect } from "react-router-dom";

export async function addProductLoader() {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        productApi.getCategories(),
        productApi.getBrands()
      ]);
      
      return {
        categories: categoriesRes.data.categories || [],
        brands: brandsRes.data.brands || []
      };
    } catch (error) {
      console.error('Error loading add product data:', error);
      return {
        categories: [],
        brands: []
      };
    }
  }