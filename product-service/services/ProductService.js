/**
 * @fileoverview Product is a service that carries out CRUD operations on products
 * @module services/ProductService
 * @author Zain
 * @version 1.0.4
 * @since 1.0.0
 */

import supabase from "../config/Database.js";
import { v4 as uuidv4 } from 'uuid';


class ProductService {

    async getAllProducts(filters = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                category,
                minPrice,
                maxPrice,
                userPreference,
                search
            } = filters;
    
            const offset = (page - 1) * limit;
    
            

            let query = supabase
            .from('product')
            .select(`
            p_id,
            p_name,
            brand,
            price,
            category (
                c_id,
                c_name,
                user_preference,
                description
            ),
            P_Size(
                id,
                size,
                stock
            ),
            P_Images(
                id,
                image_url
            )
            `, {count: 'exact'})
            .range(offset, offset + limit - 1);
    
            if(category) {
                query = query.eq('category.c_name', category);
            }
            if(minPrice) {
                query = query.gte('price', minPrice);
            }
            if(maxPrice) {
                query = query.lte('price', maxPrice);
            }
            if (userPreference) {
                query = query.eq('category.user_preference', userPreference);
            }
            if (search) {
                query = query.or(`p_name.ilike.%${search}%,brand.ilike.%${search}%`);
            }
    
            const { data, error, count } = await query;
    
            if(error) {
                throw new Error(error.message);
            }
    
            return {
                products: data,
                pagination: {
                    current_page: page,
                    total_pages: Math.ceil(count / limit),
                    total_items: count,
                    items_per_page: limit
                }
            }
        } catch (error) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    }

    async getProductsById(productId) {
        try {
            const { data, error } = await supabase
                                    .from('product')
                                    .select(`
                                        *,
                                        category(c_name, description, user_preference),
                                        P_Size(size, stock),
                                        P_Images(image_url)
                                    `)
                                    .eq('p_id', productId);
            
            
            if (error) {
                console.log('Error details:', error);
            if (error.code === 'PGRST116') {
                throw new Error("Product not found");
            }
                throw new Error(error.message);
            }

            if(!data) {
                throw new Error("Product not found");
            }
            return {
                product: data
            }
        } catch (error) {
            throw new Error(`Error fetching product: ${error.message}`);
        }
    }

    async getProductSizes(productId) {
        try {
            const { data, error } = await supabase
                .from('p_size')
                .select('*')
                .eq('product_id', productId)
                .gt('stock', 0);
            if (error) throw error;

            return {
                sizes: data
            };
        } catch (error) {
            throw new Error(`Error fetching product sizes: ${error.message}`);
        }
    }

    async getBrands() {
        try {
            const { data, error } = await supabase.from('product').select('brand');

            if(error) {
                throw new Error(error.message);
            }

            if(!data || data.length === 0) {
                return {
                    brands: []
                }
            }
            // unique brands
            const uniqueBrands = [...new Set(data.map(item => item.brand))];
            return {
                brands: uniqueBrands
            }
        } catch (error) {

            throw new Error(`Error fetching brands: ${error.message}`);
        }
    }

    async getCategories() {
        try {
            const { data, error } = await supabase
                .from('category')
                .select('c_id, user_preference, c_name, description');

            if (error) throw error;

            return {
                categories: data || []
            };
        } catch (error) {
            throw new Error(`Error fetching categories: ${error.message}`);
        }
    }

    // POST methods
    async createProduct(productData) {
        try {
            const { p_name, brand, price, categories, sizes } = productData;
            const p_id = uuidv4();

            const insertData = {
                p_id,
                p_name,
                brand,
                price
            }
            const { data, error } = await supabase.from("product").insert(insertData).select().single();

            if(error) {
                console.log(`Insert Error: ${error}`);
                throw new Error(error.message);
            }

            console.log('Product created', data);

            if(categories && categories.length > 0) {
                const categoryData = categories.map(cat => ({
                    c_id: uuidv4(),
                    c_name: cat.c_name,
                    user_preference: cat.user_preference,
                    description: cat.description,
                    product_p_id: p_id 
                }));

                const {error: categoryError } = await supabase.from("category").insert(categoryData);

                if(categoryError) {
                    console.log(`Category Insert Error: ${error}`);
                    await supabase.from('product').delete().eq('p_id', p_id);
                    throw new Error(categoryError.message);
                }
                console.log("Categories created");
            }

            if(sizes && sizes.length > 0) {
                const sizeData = sizes.map(size => ({
                    id: `${p_id}_${size.size}`,
                    size: size.size,
                    stock: size.stock,
                    product_id: p_id 
                }));

                const { error: sizeError } = await supabase.from('P_Size').insert(sizeData);

                if (sizeError) {
                    console.log('Size insert error:', sizeError);
                    // Rollback: delete product and categories
                    await supabase.from('category').delete().eq('product_p_id', p_id);
                    await supabase.from('product').delete().eq('p_id', p_id);
                    throw new Error(sizeError.message);
                }
            }

            return await this.getProductsById(p_id)
        } catch (error) {
            console.log('Create product error:', error.message);
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    // PUT/PATCH methods
    async updateProduct(productId, updateData) {
        try {
            const { p_name, brand, price, categories, sizes } = updateData;
            
            console.log('Updating product:', productId, updateData);
    
            // Update main product
            const { data: product, error: productError } = await supabase
                .from('product')
                .update({ p_name, brand, price })
                .eq('p_id', productId)
                .select()
                .single();
    
            if (productError) {
                if (productError.code === 'PGRST116') {
                    throw new Error("Product not found");
                }
                throw new Error(productError.message);
            }
    
            console.log('Product updated:', product);
    
            // Update categories if provided
            if (categories && categories.length > 0) {
                // Delete existing categories for this product
                await supabase.from('category').delete().eq('product_p_id', productId);
                
                // Insert new categories
                const categoryData = categories.map(cat => ({
                    c_id: uuidv4(),
                    c_name: cat.c_name,
                    user_preference: cat.user_preference,
                    description: cat.description,
                    product_p_id: productId
                }));
    
                const { error: categoryError } = await supabase
                    .from('category')
                    .insert(categoryData);
    
                if (categoryError) {
                    console.log('Category update error:', categoryError);
                    throw new Error(categoryError.message);
                }
                console.log('Categories updated');
            }
    
            // Update sizes if provided
            if (sizes && sizes.length > 0) {
                // Delete existing sizes
                await supabase.from('P_Size').delete().eq('product_id', productId);
                
                // Insert new sizes
                const sizeData = sizes.map(size => ({
                    id: `${productId}_${size.size}`,
                    size: size.size,
                    stock: size.stock,
                    product_id: productId
                }));
    
                const { error: sizeError } = await supabase
                    .from('P_Size')
                    .insert(sizeData);
    
                if (sizeError) {
                    console.log('Size update error:', sizeError);
                    throw new Error(sizeError.message);
                }
                console.log('Sizes updated');
            }
    
            return await this.getProductsById(productId);
        } catch (error) {
            console.log('Update product error:', error.message);
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    async updateStock(productId, size, newStock) {
        try {
            console.log('Updating stock:', productId, size, newStock);
    
            const { data, error } = await supabase
                .from('P_Size')
                .update({ stock: newStock })
                .eq('product_id', productId)
                .eq('size', size)
                .select()
                .single();
    
            if (error) {
                if (error.code === 'PGRST116') {
                    throw new Error("Size not found for this product");
                }
                throw new Error(error.message);
            }
    
            console.log('Stock updated:', data);
            return { data };
        } catch (error) {
            console.log('Update stock error:', error.message);
            throw new Error(`Error updating stock: ${error.message}`);
        }
    }

    // DELETE methods
    async deleteProduct(productId) {
        try {
            console.log('Deleting product:', productId);
    
            // Check if product exists
            const { data: existingProduct, error: checkError } = await supabase
                .from('product')
                .select('p_id')
                .eq('p_id', productId)
                .single();
    
            if (checkError && checkError.code === 'PGRST116') {
                throw new Error("Product not found");
            }
            if (checkError) {
                throw new Error(checkError.message);
            }
    
            // STEP 1: Get all image URLs before deleting from database
            const { data: images, error: imagesGetError } = await supabase
                .from('P_Images')
                .select('image_url')
                .eq('product_id', productId);
    
            if (imagesGetError) {
                console.log('Error fetching images:', imagesGetError);
            }
    
            // STEP 2: Delete image files from Supabase Storage
            if (images && images.length > 0) {
                console.log(`Found ${images.length} images to delete from storage`);
                
                for (const image of images) {
                    try {
                        // Extract filename from URL
                        const imageUrl = image.image_url;
                        const filename = imageUrl.split('/').pop();
                        const filePath = `public/${filename}`;
                        
                        console.log('Deleting file from storage:', filePath);
                        
                        const { error: storageDeleteError } = await supabase.storage
                            .from('solemate')
                            .remove([filePath]);
                        
                        if (storageDeleteError) {
                            console.warn(`Failed to delete file ${filePath}:`, storageDeleteError);
                            // Continue with other deletions even if one fails
                        } else {
                            console.log(`Successfully deleted file: ${filePath}`);
                        }
                    } catch (fileError) {
                        console.warn('Error processing image file:', fileError);
                        // Continue with other deletions
                    }
                }
            }
    
            // STEP 3: Delete related records from database (same as before)
            // Delete images metadata
            const { error: imagesError } = await supabase
                .from('P_Images')
                .delete()
                .eq('product_id', productId);
    
            if (imagesError) {
                console.log('Images delete error:', imagesError);
            }
    
            // Delete sizes
            const { error: sizesError } = await supabase
                .from('P_Size')
                .delete()
                .eq('product_id', productId);
    
            if (sizesError) {
                console.log('Sizes delete error:', sizesError);
            }
    
            // Delete categories that reference this product
            const { error: categoriesError } = await supabase
                .from('category')
                .delete()
                .eq('product_p_id', productId);
    
            if (categoriesError) {
                console.log('Categories delete error:', categoriesError);
            }
    
            // Delete main product last
            const { error: productError } = await supabase
                .from('product')
                .delete()
                .eq('p_id', productId);
    
            if (productError) {
                throw new Error(productError.message);
            }
    
            console.log('Product and all associated files deleted successfully');
            return { 
                message: 'Product deleted successfully',
                files_deleted: images ? images.length : 0
            };
        } catch (error) {
            console.log('Delete product error:', error.message);
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }
}

export default new ProductService();