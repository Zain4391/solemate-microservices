/**
 * @fileoverview Image controller handles HTTP requests for image operations
 * @module controllers/imageController
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */

import ImageService from '../services/ImageService.js';
import ProductService from '../services/ProductService.js';

export const postImage = async (req, res) => {
    const { id } = req.params; 
    const { filename } = req.body;
    
    console.log("File received:", req.file);
    console.log("Body:", req.body);
    console.log("Product ID:", id);
    
    try {
      const file = req.file;
      
      // Validate required fields
      if (!file) {
        return res.status(400).json({ 
          message: "Image file is required.", 
          Images: null, 
          error: true 
        });
      }
  
      if (!filename) {
        return res.status(400).json({
          message: "Filename is required.",
          Images: null,
          error: true,
        });
      }
  
      // Verify product exists
      const productExistsResult = await ImageService.verifyProductExists(id);
      if (!productExistsResult.data) {
        return res.status(404).json({
          message: "Product not found.",
          Images: null,
          error: true,
        });
      }
  
      // Check if product already has 3 images
      const currentImageCountResult = await ImageService.getProductImages(id);
      const currentImageCount = currentImageCountResult.data;
      
      if (currentImageCount >= 3) {
        return res.status(400).json({
          message: "Maximum 3 images allowed per product.",
          Images: null,
          error: true,
        });
      }
  
      // Upload image to Supabase storage
      const uploadResult = await ImageService.uploadImageToStorage(file, filename);
      const publicUrl = uploadResult.data;
      
      console.log("Public URL:", publicUrl);
  
      // Save image metadata to database
      const savedImageResult = await ImageService.saveImageMetadata(publicUrl, id);
      const savedImage = savedImageResult.data;
  
      res.status(201).json({
        message: "Image uploaded and metadata saved.",
        Images: [savedImage],
        error: false,
      });
  
    } catch (error) {
      console.error("Error uploading image:", error);
      
      // ROLLBACK: Delete the product if image upload fails
      try {
        await ImageService.deleteProductRollback(id);
        console.log(`Product ${id} deleted due to image upload failure`);
        
        res.status(500).json({ 
          message: `Image upload failed: ${error.message}. Product has been deleted.`,
          Images: null, 
          error: true 
        });
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
        res.status(500).json({ 
          message: `Image upload failed: ${error.message}. Rollback also failed.`,
          Images: null, 
          error: true 
        });
      }
    }
  };

export const postMultipleImages = async (req, res) => {
    const { id } = req.params; // product ID
    
    console.log("Files received:", req.files);
    console.log("Body:", req.body);
    console.log("Product ID:", id);
    
    try {
      const files = req.files;
      
      if (!files || files.length === 0) {
        return res.status(400).json({ 
          message: "At least one image file is required.", 
          Images: null, 
          error: true 
        });
      }

      const filenames = files.map((file, index) => 
        `${Date.now()}_${index}_${file.originalname}`
      );

      console.log(filenames);
      
      if (!filenames || !Array.isArray(filenames) || filenames.length !== files.length) {
        return res.status(400).json({
          message: "Filenames array is required and must match the number of files.",
          Images: null,
          error: true,
        });
      }
  
      // Verify product exists
      const productExistsResult = await ImageService.verifyProductExists(id);
      if (!productExistsResult.data) {
        return res.status(404).json({
          message: "Product not found.",
          Images: null,
          error: true,
        });
      }
  
      // Check if total images would exceed 3
      const currentImageCountResult = await ImageService.getProductImages(id);
      const currentImageCount = currentImageCountResult.data;
      
      if (currentImageCount + files.length > 3) {
        return res.status(400).json({
          message: `Cannot upload ${files.length} images. Product already has ${currentImageCount} images. Maximum 3 allowed.`,
          Images: null,
          error: true,
        });
      }
  
      const uploadedImages = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filename = filenames[i];
        
        try {
          // Upload to storage
          const uploadResult = await ImageService.uploadImageToStorage(file, filename);
          const publicUrl = uploadResult.data;
          
          // Save metadata
          const savedImageResult = await ImageService.saveImageMetadata(publicUrl, id);
          const savedImage = savedImageResult.data;
          
          uploadedImages.push(savedImage);
        } catch (uploadError) {
          console.error(`Error uploading image ${i + 1}:`, uploadError);
          
          // If any upload fails, delete all uploaded images and rollback product
          try {
            // Delete uploaded images from this batch
            for (const uploadedImage of uploadedImages) {
              await ImageService.deleteImageFromDb(uploadedImage.id);
              const filename = uploadedImage.image_url.split('/').pop();
              await ImageService.deleteImageFromStorage(filename);
            }
            
            // Rollback product
            await ImageService.deleteProductRollback(id);
            
            return res.status(500).json({
              message: `Image upload failed at image ${i + 1}: ${uploadError.message}. Product has been deleted.`,
              Images: null,
              error: true
            });
          } catch (rollbackError) {
            console.error("Rollback failed:", rollbackError);
            return res.status(500).json({
              message: `Image upload failed and rollback failed: ${rollbackError.message}`,
              Images: null,
              error: true
            });
          }
        }
      }
  
      res.status(201).json({
        message: `${uploadedImages.length} images uploaded successfully.`,
        Images: uploadedImages,
        error: false,
      });
  
    } catch (error) {
      console.error("Error uploading multiple images:", error);
      
      // Rollback product
      try {
        await ImageService.deleteProductRollback(id);
        res.status(500).json({ 
          message: `Multiple image upload failed: ${error.message}. Product has been deleted.`,
          Images: null, 
          error: true 
        });
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
        res.status(500).json({ 
          message: `Upload failed: ${error.message}. Rollback also failed.`,
          Images: null, 
          error: true 
        });
      }
    }
  };
  
  
export const getAllProductImages = async (req, res) => {
    const { id } = req.params;
    
    try {
      // Verify product exists
      const productExistsResult = await ImageService.verifyProductExists(id);
      if (!productExistsResult.data) {
        return res.status(404).json({
          message: "Product not found.",
          Images: null,
          error: true,
        });
      }
  
      const imagesResult = await ImageService.getAllProductImages(id);
      const images = imagesResult.data;
      
      res.status(200).json({
        message: "Product images retrieved successfully",
        Images: images,
        error: false,
      });
    } catch (error) {
      console.error("Error fetching product images:", error);
      res.status(500).json({ 
        message: "Internal Server Error", 
        Images: null, 
        error: true 
      });
    }
  };
  
export const getImageById = async (req, res) => {
    const { id, iId } = req.params;
    
    try {
      const imageResult = await ImageService.getImageById(id, iId);
      const image = imageResult.data;
      
      if (!image) {
        return res.status(404).json({
          message: "Image not found",
          Images: null,
          error: true,
        });
      }
  
      res.status(200).json({
        message: "Image retrieved successfully",
        Images: [image],
        error: false,
      });
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).json({ 
        message: "Internal Server Error", 
        Images: null, 
        error: true 
      });
    }
  };
  
export const updateImage = async (req, res) => {
    const { iId } = req.params;
    const { image_url } = req.body;
    
    try {
      if (!image_url) {
        return res.status(400).json({
          message: "Image URL is required",
          Images: null,
          error: true,
        });
      }
  
      const updatedImageResult = await ImageService.updateImageUrl(iId, image_url);
      const updatedImage = updatedImageResult.data;
      
      if (!updatedImage) {
        return res.status(404).json({
          message: "Image not found",
          Images: null,
          error: true,
        });
      }
  
      res.status(200).json({
        message: "Image updated successfully",
        Images: [updatedImage],
        error: false,
      });
    } catch (error) {
      console.error("Error updating image:", error);
      res.status(500).json({ 
        message: "Internal Server Error", 
        Images: null, 
        error: true 
      });
    }
  };
  
  export const updateImageFile = async (req, res) => {
    const { iId } = req.params;
    const { filename } = req.body;
    
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({
          message: "New image file is required",
          Images: null,
          error: true,
        });
      }
  
      if (!filename) {
        return res.status(400).json({
          message: "Filename is required",
          Images: null,
          error: true,
        });
      }
  
      const updateResult = await ImageService.updateImageInStorage(iId, file, filename);
      
      res.status(200).json({
        message: "Image file updated successfully",
        Images: [updateResult.data],
        error: false,
      });
    } catch (error) {
      console.error("Error updating image file:", error);
      res.status(500).json({ 
        message: `Error updating image: ${error.message}`, 
        Images: null, 
        error: true 
      });
    }
  };
  
  export const deleteImage = async (req, res) => {
    const { iId } = req.params;
    
    try {
      // First get the image to extract filename for storage deletion
      const imageResult = await ImageService.getImageById(null, iId);
      const image = imageResult.data;
      
      if (!image) {
        return res.status(404).json({
          message: "Image not found",
          Images: null,
          error: true,
        });
      }
  
      // Extract filename from URL for storage deletion
      const urlParts = image.image_url.split('/');
      const filename = urlParts[urlParts.length - 1];

      console.log("Extracted filename:", filename); // ADD THIS
      console.log("Storage path will be:", `public/${filename}`); 
  
      // Delete from database first
      await ImageService.deleteImageFromDb(iId);
      
      // Delete from storage
      try {
        console.log("Attempting storage deletion..."); 
        await ImageService.deleteImageFromStorage(filename);
        console.log("Storage deletion successful."); 
      } catch (storageError) {
        console.warn("Failed to delete from storage:", storageError.message);
      }
  
      res.status(200).json({
        message: "Image deleted successfully",
        Images: null,
        error: false,
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ 
        message: "Internal Server Error", 
        Images: null, 
        error: true 
      });
    }
  };