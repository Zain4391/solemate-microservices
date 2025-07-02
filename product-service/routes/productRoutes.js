import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getBrands, getCategories, getProductById, getProductSizes, updateProduct, updateStock } from '../controllers/productController.js';
import {deleteImage, getAllProductImages, getImageById, postImage, postMultipleImages, updateImage, updateImageFile} from '../controllers/imageController.js';
import { uploadSingle, handleMulterError, uploadMultiple } from '../middleware/multer.js';
import { adminMiddleware, authMiddleware } from '../middleware/verifyAdmin.js';
const productRouter = express.Router();

productRouter.get('/categories', getCategories);
productRouter.get('/brands', getBrands);

productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProductById);
productRouter.get('/:id/sizes', getProductSizes);

productRouter.post('/', authMiddleware, adminMiddleware, createProduct);
productRouter.put('/:id', authMiddleware, adminMiddleware, updateProduct);
productRouter.put('/:id/stock', authMiddleware, adminMiddleware, updateStock);
productRouter.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);


// Image routes
productRouter.get('/:id/images', getAllProductImages);
productRouter.get('/:id/images/:iId', getImageById);
productRouter.post('/:id/images', authMiddleware, adminMiddleware, uploadSingle, handleMulterError, postImage);
productRouter.post('/:id/images/multiple', authMiddleware, adminMiddleware, uploadMultiple, handleMulterError, postMultipleImages);
productRouter.put('/:id/images/:iId', authMiddleware, adminMiddleware, uploadSingle, handleMulterError, updateImageFile);
productRouter.delete('/:id/images/:iId', authMiddleware, adminMiddleware, deleteImage);

export default productRouter;