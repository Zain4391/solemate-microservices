import axios from "axios";

const PRODUCTS_BASE_URL = 'http://localhost:3002/api';


export const api = axios.create({
    baseURL: PRODUCTS_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = `/login`;
        }

        return Promise.reject(error);
    }
)


export const productApi = {

    // product related
    getAllProducts: (page = 1, limit = 10) => {
        return api.get(`/products?page=${page}&limit=${limit}`);
    },
    getProductById: (id) => api.get(`/products/${id}`),
    getProductSizes: (id) => api.get(`/products/${id}/sizes`),
    createProduct: (productData) => api.post('/products', productData),
    updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
    updateStock: (id, size, stock) => api.put(`/products/${id}/stock`, { size, stock }),
    deleteProduct: (id) => api.delete(`/products/${id}`),

    // category and brands
    getCategories: () => api.get('/products/categories'),
    getBrands: () => api.get('/products/brands'),

    getProductImages: (id) => api.get(`/products/${id}/images`),
    getImageById: (productId, imageId) => api.get(`/products/${productId}/images/${imageId}`),
  
  // Image upload operations (FormData)
    uploadImage: (id, imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        return api.post(`/products/${id}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
        });
    },
  
    uploadMultipleImages: (id, imageFiles) => {
        const formData = new FormData();
        imageFiles.forEach(file => {
        formData.append('images', file);
        });
        return api.post(`/products/${id}/images/multiple`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
        });
    },
  
    updateImageFile: (productId, imageId, imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        return api.put(`/products/${productId}/images/${imageId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
        });
    },
    
    deleteImage: (productId, imageId) => api.delete(`/products/${productId}/images/${imageId}`)
}
