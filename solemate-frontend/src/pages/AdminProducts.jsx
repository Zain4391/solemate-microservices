import React, { useState } from 'react';
import { useLoaderData, useSearchParams, Link, useFetcher } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search,
  Plus, 
  Edit, 
  Trash2,
  Package,
  Image as ImageIcon
} from 'lucide-react';

const AdminProducts = () => {
  const { products = [], pagination, categories = [], brands = [], filters, stats } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Ensure arrays are safe
  const safeProducts = Array.isArray(products) ? products : [];

  const handleSearch = (e) => {
    const search = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (search.trim()) {
      newParams.set('search', search);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  const clearSearch = () => {
    setSearchParams({});
  };

  const handleDelete = (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      setDeletingProduct(productId);
      fetcher.submit(
        { productId }, 
        { 
          method: 'delete',
          action: '/admin/products'
        }
      );
    }
  };

  // Reset deleting state when fetcher is done
  React.useEffect(() => {
    if (fetcher.state === 'idle' && deletingProduct) {
      setDeletingProduct(null);
    }
  }, [fetcher.state, deletingProduct]);

  const getStockStatus = (product) => {
    const totalStock = product.stock || 0;
    if (totalStock === 0) return { status: 'out', color: 'bg-red-100 text-red-800', text: 'Out of Stock' };
    if (totalStock <= 10) return { status: 'low', color: 'bg-yellow-100 text-yellow-800', text: 'Low Stock' };
    return { status: 'good', color: 'bg-green-100 text-green-800', text: 'In Stock' };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Product Management</h1>
          <p className="text-stone-600 mt-1">Manage your product catalog</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link
            to="/admin/products/new"
            className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 text-center">
          <div className="text-2xl font-bold text-stone-900">{stats?.total || 0}</div>
          <div className="text-sm text-stone-600">Total Products</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 text-center">
          <div className="text-2xl font-bold text-green-600">{safeProducts.filter(p => getStockStatus(p).status === 'good').length}</div>
          <div className="text-sm text-stone-600">In Stock</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 text-center">
          <div className="text-2xl font-bold text-yellow-600">{safeProducts.filter(p => getStockStatus(p).status === 'low').length}</div>
          <div className="text-sm text-stone-600">Low Stock</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 text-center">
          <div className="text-2xl font-bold text-red-600">{safeProducts.filter(p => getStockStatus(p).status === 'out').length}</div>
          <div className="text-sm text-stone-600">Out of Stock</div>
        </div>
      </motion.div>

      {/* Search Section */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
        <div className="flex gap-4 max-w-md">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              defaultValue={filters?.search || ''}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 placeholder:text-stone-500"
            />
          </div>

          {/* Clear Search */}
          {filters?.search && (
            <button
              onClick={clearSearch}
              className="px-4 py-2 text-stone-700 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors bg-white"
            >
              Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* Error Message */}
      {fetcher.data?.error && (
        <motion.div 
          variants={itemVariants}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        >
          {fetcher.data.error}
        </motion.div>
      )}

      {/* Success Message */}
      {fetcher.data?.success && (
        <motion.div 
          variants={itemVariants}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
        >
          Product deleted successfully!
        </motion.div>
      )}

      {/* Products Grid */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-stone-200">
        {safeProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {safeProducts.map((product, index) => {
              const stockStatus = getStockStatus(product);
              const isDeleting = deletingProduct === product.p_id || fetcher.state === 'submitting';
              
              return (
                <motion.div
                  key={product.p_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: isDeleting ? 0.5 : 1, 
                    scale: isDeleting ? 0.95 : 1 
                  }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-stone-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-stone-100 relative">
                    {product.P_Images?.[0]?.image_url ? (
                      <img
                        src={product.P_Images[0].image_url}
                        alt={product.p_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-stone-400" />
                      </div>
                    )}
                    {/* Stock Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-stone-900 mb-1 truncate">
                      {product.p_name}
                    </h3>
                    <p className="text-sm text-stone-600 mb-2">
                      {product.brand}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-stone-900">
                        ${product.price?.toFixed(2) || '0.00'}
                      </span>
                      <span className="text-sm text-stone-600">
                        Stock: {product.stock || 0}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(product.p_id, product.p_name)}
                        disabled={isDeleting}
                        className="flex-1 flex items-center justify-center space-x-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-2 rounded text-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                      </button>
                      <Link
                        to={`/admin/products/${product.p_id}/edit`}
                        className="flex-1 flex items-center justify-center space-x-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded text-sm transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-900 mb-2">No products found</h3>
            <p className="text-stone-500 mb-4">
              {filters?.search
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first product'
              }
            </p>
            <Link
              to="/admin/products/new"
              className="inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="px-6 py-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-stone-700">
                Showing {((filters?.page || 1) - 1) * 12 + 1} to{' '}
                {Math.min((filters?.page || 1) * 12, stats?.total || 0)} of{' '}
                {stats?.total || 0} products
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange((filters?.page || 1) - 1)}
                  disabled={(filters?.page || 1) <= 1}
                  className="px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-stone-700"
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(pagination.total_pages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          page === (filters?.page || 1)
                            ? 'bg-amber-600 text-white'
                            : 'border border-stone-300 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange((filters?.page || 1) + 1)}
                  disabled={(filters?.page || 1) >= pagination.total_pages}
                  className="px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-stone-700"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminProducts;