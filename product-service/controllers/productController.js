/**
 * @fileoverview productController is a controller that carries out request parsing and response handling.
 * @module controllers/productController
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */

import ProductService from "../services/ProductService.js";

export const getAllProducts = async (req, res) => {
    try {
        const filters = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            category: req.query.category,
            brand: req.query.brand,
            minPrice: req.query.minPrice ? parseInt(req.query.minPrice) : null,
            maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice) : null,
            userPreference: req.query.userPreference,
            search: req.query.search
        }

        const result = await ProductService.getAllProducts(filters);

        return res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ProductService.getProductsById(id);

        return res.status(200).json({
            success: true,
            message: 'Product fetched successfully',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getProductSizes = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ProductService.getProductSizes(id);

        return res.status(200).json({
            success: true,
            message: 'Sizes fetched successulyy',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getBrands = async (req, res) => {
    try {
        const result = await ProductService.getBrands();

        return res.status(200).json({
            success: true,
            message: 'Brands fetched successfully',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const result = await ProductService.getCategories();

        return res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add this export
export const createProduct = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const productData = req.body;
        const result = await ProductService.createProduct(productData);
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: result
        });
    } catch (error) {
        console.log('Controller error:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log('Update request for product:', id);
      console.log('Update data:', updateData);
  
      const result = await ProductService.updateProduct(id, updateData);
  
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: result
      });
    } catch (error) {
      console.log('Update controller error:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  export const updateStock = async (req, res) => {
    try {
      const { id } = req.params;
      const { size, stock } = req.body;
  
      if (!size || stock === undefined || stock === null) {
        return res.status(400).json({
          success: false,
          message: 'Size and stock values are required'
        });
      }
  
      console.log('Update stock request:', id, size, stock);
  
      const result = await ProductService.updateStock(id, size, stock);
  
      res.status(200).json({
        success: true,
        message: 'Stock updated successfully',
        data: result
      });
    } catch (error) {
      console.log('Update stock controller error:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  export const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
      
      console.log('Delete request for product:', id);
  
      const result = await ProductService.deleteProduct(id);
  
      
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        data: result
      });
    } catch (error) {
      console.log('Delete controller error:', error.message);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };