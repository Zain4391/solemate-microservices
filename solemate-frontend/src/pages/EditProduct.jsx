import React, { useState } from 'react';
import { useNavigate, useLoaderData, Form, useActionData, useNavigation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  X, 
  Plus,
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { product, categories, brands } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  
  // Initialize form data with existing product data
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formCategories, setFormCategories] = useState(product.category || []);
  const [formSizes, setFormSizes] = useState(product.P_Size || []);
  const [existingImages, setExistingImages] = useState(product.P_Images || []);
  
  // Category form state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    c_name: '',
    user_preference: 'M',
    description: ''
  });
  
  // Size form state
  const [showSizeForm, setShowSizeForm] = useState(false);
  const [newSize, setNewSize] = useState({
    size: '',
    stock: ''
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if adding new images would exceed limit
    const totalImages = existingImages.length + selectedImages.length + files.length;
    if (totalImages > 3) {
      alert(`Cannot add ${files.length} images. Maximum 3 images allowed. Currently have ${existingImages.length + selectedImages.length} images.`);
      return;
    }
    
    // Validate file types
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );
    
    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Please upload only images under 5MB.');
    }
    
    setSelectedImages(prev => [...prev, ...validFiles]);
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, {
          file,
          preview: e.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const addCategory = () => {
    if (newCategory.c_name.trim()) {
      setFormCategories(prev => [...prev, { ...newCategory }]);
      setNewCategory({ c_name: '', user_preference: 'M', description: '' });
      setShowCategoryForm(false);
    }
  };

  const removeCategory = (index) => {
    setFormCategories(prev => prev.filter((_, i) => i !== index));
  };

  const addSize = () => {
    if (newSize.size.trim() && newSize.stock) {
      setFormSizes(prev => [...prev, { ...newSize, stock: parseInt(newSize.stock) }]);
      setNewSize({ size: '', stock: '' });
      setShowSizeForm(false);
    }
  };

  const removeSize = (index) => {
    setFormSizes(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center space-x-2 text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Edit Product</h1>
          <p className="text-stone-600">Update product information</p>
        </div>
      </div>

      {/* Show errors from action */}
      {actionData?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {actionData.error}
        </div>
      )}

      <Form method="put" encType="multipart/form-data" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Product Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
              <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="p_name"
                    defaultValue={product.p_name}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 placeholder:text-stone-500"
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Brand *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    defaultValue={product.brand}
                    required
                    list="brands-list"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 placeholder:text-stone-500"
                    placeholder="Enter or select brand"
                  />
                  <datalist id="brands-list">
                    {brands?.map((brand, index) => (
                      <option key={index} value={brand} />
                    ))}
                  </datalist>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                    <input
                      type="number"
                      name="price"
                      defaultValue={product.price}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 placeholder:text-stone-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-stone-900 flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Categories
                </h2>
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(true)}
                  className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>
              
              {/* Hidden inputs for categories */}
              {formCategories.map((category, index) => (
                <div key={`category-${index}`}>
                  <input type="hidden" name={`categories[${index}][c_name]`} value={category.c_name} />
                  <input type="hidden" name={`categories[${index}][user_preference]`} value={category.user_preference} />
                  <input type="hidden" name={`categories[${index}][description]`} value={category.description} />
                </div>
              ))}
              
              {/* Category List */}
              <div className="space-y-2 mb-4">
                {formCategories.map((category, index) => (
                  <div key={`cat-display-${index}`} className="flex items-center justify-between bg-stone-50 p-3 rounded-lg">
                    <div>
                      <div className="font-medium text-stone-900">{category.c_name}</div>
                      <div className="text-sm text-stone-600">
                        {category.user_preference} • {category.description}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Add Category Form */}
              {showCategoryForm && (
                <div className="border border-stone-200 rounded-lg p-4 space-y-3">
                  <div>
                    <input
                      type="text"
                      value={newCategory.c_name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, c_name: e.target.value }))}
                      placeholder="Category name"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 placeholder:text-stone-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={newCategory.user_preference}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, user_preference: e.target.value }))}
                      className="px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900"
                    >
                      <option value="M">M</option>
                      <option value="F">F</option>
                      <option value="K">K</option>
                      <option value="U">U</option>
                    </select>
                    <input
                      type="text"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description"
                      className="px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 placeholder:text-stone-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={addCategory}
                      className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCategoryForm(false)}
                      className="px-3 py-1 border border-stone-300 text-stone-700 rounded text-sm hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sizes & Stock */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-stone-900">Sizes & Stock</h2>
                <button
                  type="button"
                  onClick={() => setShowSizeForm(true)}
                  className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Size</span>
                </button>
              </div>
              
              {/* Hidden inputs for sizes */}
              {formSizes.map((size, index) => (
                <div key={`size-${index}`}>
                  <input type="hidden" name={`sizes[${index}][size]`} value={size.size} />
                  <input type="hidden" name={`sizes[${index}][stock]`} value={size.stock} />
                </div>
              ))}
              
              {/* Size List */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {formSizes.map((size, index) => (
                  <div key={`size-display-${index}`} className="flex items-center justify-between bg-stone-50 p-3 rounded-lg">
                    <div>
                      <div className="font-medium text-stone-900">{size.size}</div>
                      <div className="text-sm text-stone-600">Stock: {size.stock}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Add Size Form */}
              {showSizeForm && (
                <div className="border border-stone-200 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newSize.size}
                      onChange={(e) => setNewSize(prev => ({ ...prev, size: e.target.value }))}
                      placeholder="Size (e.g., XL, 42, 10.5)"
                      className="px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 placeholder:text-stone-500"
                    />
                    <input
                      type="number"
                      value={newSize.stock}
                      onChange={(e) => setNewSize(prev => ({ ...prev, stock: e.target.value }))}
                      placeholder="Stock quantity"
                      min="0"
                      className="px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 placeholder:text-stone-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={addSize}
                      className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSizeForm(false)}
                      className="px-3 py-1 border border-stone-300 text-stone-700 rounded text-sm hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-6">
            {/* Existing Images */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
              <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                Current Images ({existingImages.length}/3)
              </h2>
              
              {/* Hidden inputs for images to delete */}
              <input 
                type="hidden" 
                name="imagesToDelete" 
                value={JSON.stringify(
                  (product.P_Images || [])
                    .filter(img => !existingImages.find(existing => existing.id === img.id))
                    .map(img => img.id)
                )} 
              />
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {existingImages.map((image, index) => (
                  <div key={`existing-img-${image.id || index}`} className="relative">
                    <img
                      src={image.image_url}
                      alt="Product"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.id)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* New Images Upload */}
            {existingImages.length + selectedImages.length < 3 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Add New Images
                </h2>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center mb-4">
                  <input
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="text-stone-600">Click to upload images</p>
                    <p className="text-xs text-stone-500 mt-1">
                      PNG, JPG up to 5MB each ({3 - existingImages.length - selectedImages.length} remaining)
                    </p>
                  </label>
                </div>
                
                {/* New Image Previews */}
                <div className="grid grid-cols-2 gap-3">
                  {imagePreviews.map((item, index) => (
                    <div key={`preview-${index}`} className="relative">
                      <img
                        src={item.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Updating Product...' : 'Update Product'}</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="w-full border border-stone-300 text-stone-700 px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </motion.div>
  );
};

export default EditProduct;