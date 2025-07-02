/**
 * @fileoverview ImageService is a service that carries out CRUD operations on product images
 * @module services/ImageService
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */

import supabase from "../config/Database.js";
import {v4 as uuid } from 'uuid';

class ImageService {

    async uploadImageToStorage(file, filename) {
        try {
            const { data, error } = await supabase.storage.from('solemate').upload(`public/${filename}`,file.buffer, {
                cacheControl: 3600,
                upsert: false,
                contentType: file.mimetype
            });

            if(error) {
                throw new Error(`Image upload failed: ${error.message}`);
            }

            const { data: publicURLData } = await supabase.storage.from('solemate').getPublicUrl(`public/${filename}`);

            return {
                data: publicURLData.publicUrl
            }
        } catch (error) {
            throw error;
        }
    }

    async saveImageMetadata(imageUrl, productId) {
        try {
          const iId = uuid();
          const { data, error } = await supabase
            .from('P_Images')
            .insert([
              {
                id: iId,
                image_url: imageUrl,
                product_id: productId
              }
            ])
            .select();
      
          if (error) {
            throw new Error(`Failed to save image metadata: ${error.message}`);
          }
      
          if (!data || data.length === 0) {
            throw new Error("Failed to save image metadata to database");
          }
      
          return {
            data: data[0]
          }
        } catch (error) {
          throw error;
        }
    }

    async getAllProductImages(productId) {
        try {
          const { data, error } = await supabase
            .from('P_Images')
            .select('*')
            .eq('product_id', productId);
      
          if (error) {
            throw new Error(`Failed to fetch product images: ${error.message}`);
          }
      
          return {
            data: data || []
          }
        } catch (error) {
          throw error;
        }
    }

    async getImageById(productId, imageId) {
        try {
          let query = supabase.from('P_Images').select('*').eq('id', imageId);
          
          if (productId) {
            query = query.eq('product_id', productId);
          }
      
          const { data, error } = await query.single();
      
          if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
            throw new Error(`Failed to fetch image: ${error.message}`);
          }
      
          return {
            data: data
          }
        } catch (error) {
          throw error;
        }
    }

    async updateImageUrl(imageId, imageUrl) {
        try {
          const { data, error } = await supabase
            .from('P_Images')
            .update({ image_url: imageUrl })
            .eq('id', imageId)
            .select();
      
          if (error) {
            throw new Error(`Failed to update image: ${error.message}`);
          }

      
          return {
            data: data && data.length > 0 ? data[0] : null
          }
        } catch (error) {
          throw error;
        }
    }

    async updateImageInStorage(imageId, newFile, newFilename) {
        try {
            // Step 1: Fetch the old image metadata
            const { data: imageData, error: fetchError } = await supabase
                .from('P_Images')
                .select('image_url')
                .eq('id', imageId)
                .single();
    
            if (fetchError) {
                throw new Error(`Failed to fetch existing image: ${fetchError.message}`);
            }
    
            // Extract old filename from URL if needed
            const oldUrl = imageData.image_url;
            const oldFilename = oldUrl.split('/').pop();
    
            // Step 2: Delete the old image from storage
            const { error: deleteError } = await supabase.storage
                .from('solemate')
                .remove([`public/${oldFilename}`]);
    
            if (deleteError) {
                throw new Error(`Failed to delete old image: ${deleteError.message}`);
            }
    
            // Step 3: Upload the new image
            const { error: uploadError } = await supabase.storage
                .from('solemate')
                .upload(`public/${newFilename}`, newFile.buffer, {
                    cacheControl: 3600,
                    upsert: false,
                    contentType: newFile.mimetype
                });
    
            if (uploadError) {
                throw new Error(`Failed to upload new image: ${uploadError.message}`);
            }
    
            // Step 4: Get the new public URL
            const { data: publicURLData } = await supabase.storage
                .from('solemate')
                .getPublicUrl(`public/${newFilename}`);
    
            const newImageUrl = publicURLData.publicUrl;
    
            // Step 5: Update the database with the new image URL
            const updateResult = await this.updateImageUrl(imageId, newImageUrl);
    
            return {
                data: {
                    message: 'Image updated successfully',
                    imageUrl: newImageUrl,
                    db: updateResult
                }
            };
        } catch (error) {
            throw error;
        }
    }
    

    async deleteImageFromStorage(filename) {
        try {
          const { data, error } = await supabase.storage
            .from("solemate")
            .remove([`public/${filename}`]);
          
          if (error) {
            console.log("Supabase storage error:", error);
            throw new Error(`Failed to delete image from storage: ${error.message}`);
          }
          console.log("ImageService: Image deleted from storage successfully");
          
          return {
            data: true
          }
        } catch (error) {
          throw error;
        }
    }

    async deleteProductRollback(productId) {
        try {
          // Delete in correct order due to foreign key constraints
          
          // Delete images
          const { error: imagesError } = await supabase
            .from('P_Images')
            .delete()
            .eq('product_id', productId);
          
          if (imagesError) {
            console.warn('Failed to delete images:', imagesError);
          }
      
          // Delete sizes
          const { error: sizesError } = await supabase
            .from('P_Size')
            .delete()
            .eq('product_id', productId);
          
          if (sizesError) {
            console.warn('Failed to delete sizes:', sizesError);
          }
      
          // Delete categories
          const { error: categoriesError } = await supabase
            .from('category')
            .delete()
            .eq('product_p_id', productId);
          
          if (categoriesError) {
            console.warn('Failed to delete categories:', categoriesError);
          }
      
          // Delete product
          const { error: productError } = await supabase
            .from('product')
            .delete()
            .eq('p_id', productId);
          
          if (productError) {
            throw new Error(`Failed to delete product: ${productError.message}`);
          }
      
          return {
            data: true
          };
        } catch (error) {
          throw error;
        }
    }

    async getProductImages(productId) {
        try {
          const { count, error } = await supabase
            .from('P_Images')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', productId);
      
          if (error) {
            throw new Error(`Failed to count product images: ${error.message}`);
          }
      
          return {
            data: count || 0
          };
        } catch (error) {
          throw error;
        }
    }

    async verifyProductExists(productId) {
        try {
          const { data, error } = await supabase
            .from('product')
            .select('p_id')
            .eq('p_id', productId)
            .single();
      
          if (error && error.code !== 'PGRST116') {
            throw new Error(`Failed to verify product: ${error.message}`);
          }
      
          return {
            data: !!data
          };
        } catch (error) {
          throw error;
        }
    }
    
    async deleteImageFromDb(imageId) {
        try {
          const { error } = await supabase
            .from('P_Images')
            .delete()
            .eq('id', imageId);
      
          if (error) {
            throw new Error(`Failed to delete image from database: ${error.message}`);
          }
      
          return {
            data: true
          };
        } catch (error) {
          throw error;
        }
    }
      
    async deleteImage(imageId) {
        try {
          // Get image info first
          const imageResult = await this.getImageById(null, imageId);
          if (!imageResult.data) {
            throw new Error("Image not found");
          }
          
          const image = imageResult.data;
          const filename = image.image_url.split('/').pop();
          
          // Delete from database first
          await this.deleteImageFromDb(imageId);
          
          // Then delete from storage
          await this.deleteImageFromStorage(filename);
          
          return { data: true };
        } catch (error) {
          throw error;
        }
    }
}

export default new ImageService();