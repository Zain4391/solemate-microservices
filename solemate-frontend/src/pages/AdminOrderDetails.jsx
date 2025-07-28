import React from 'react';
import { useLoaderData, Link, Form, useNavigation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Package,
  User,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  Save,
  Loader2
} from 'lucide-react';

const AdminOrderDetails = () => {
  const { order, orderItems } = useLoaderData();
  const navigation = useNavigation();
  const isUpdating = navigation.state === 'submitting';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (isComplete) => {
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
        isComplete 
          ? 'bg-green-100 text-green-800' 
          : 'bg-yellow-100 text-yellow-800'
      }`}>
        {isComplete ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
        <span>{isComplete ? 'Completed' : 'Pending'}</span>
      </span>
    );
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.od_price * item.quantity), 0);
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
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/admin/orders"
            className="flex items-center space-x-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Orders</span>
          </Link>
          <div className="h-6 w-px bg-stone-300"></div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">
              Order #{order.o_id?.slice(-8)}
            </h1>
            <p className="text-stone-600">Order details and management</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(order.is_complete)}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-stone-200">
            <div className="px-6 py-4 border-b border-stone-200">
              <h2 className="text-lg font-semibold text-stone-900 flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Order Items</span>
              </h2>
            </div>
            <div className="divide-y divide-stone-200">
              {orderItems.map((item, index) => (
                <motion.div
                  key={item.od_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 flex items-center space-x-4"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {item.product?.P_Images?.[0]?.image_url ? (
                      <img
                        src={item.product.P_Images[0].image_url}
                        alt={item.product.p_name}
                        className="w-16 h-16 bg-stone-100 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-stone-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-stone-900">
                      {item.product?.p_name || 'Product Name'}
                    </h3>
                    <p className="text-sm text-stone-500">
                      Brand: {item.product?.brand || 'N/A'}
                    </p>
                    <p className="text-sm text-stone-500">
                      Size: {item.size || 'N/A'}
                    </p>
                    <p className="text-sm text-stone-500">
                      Category: {item.product?.category?.description || 'N/A'}
                    </p>
                  </div>
                  
                  {/* Quantity and Price */}
                  <div className="text-right">
                    <p className="text-sm font-medium text-stone-900">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-stone-500">
                      ${item.od_price?.toFixed(2)} each
                    </p>
                    <p className="text-sm font-semibold text-stone-900">
                      ${(item.od_price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {/* Order Total */}
              <div className="px-6 py-4 bg-stone-50">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-stone-900">Total Amount:</span>
                  <span className="text-lg font-bold text-stone-900">
                    ${order.total_amount?.toFixed(2) || calculateSubtotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status Management */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-stone-200">
            <div className="px-6 py-4 border-b border-stone-200">
              <h3 className="text-lg font-semibold text-stone-900">Order Status</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-700">Current Status:</span>
                  {getStatusBadge(order.is_complete)}
                </div>
                
                {/* Status Update Form */}
                <Form method="post" className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="status"
                      id="orderComplete"
                      defaultChecked={order.is_complete}
                      disabled={isUpdating}
                      className="w-4 h-4 text-amber-600 bg-white border-stone-300 rounded focus:ring-amber-500 focus:ring-2 disabled:cursor-not-allowed"
                    />
                    <label 
                      htmlFor="orderComplete" 
                      className={`text-sm font-medium ${isUpdating ? 'text-stone-400' : 'text-stone-700'}`}
                    >
                      Mark as Completed
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Update Status</span>
                      </>
                    )}
                  </button>
                </Form>
              </div>
            </div>
          </motion.div>

          {/* Order Information */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-stone-200">
            <div className="px-6 py-4 border-b border-stone-200">
              <h3 className="text-lg font-semibold text-stone-900">Order Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-stone-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-stone-700">Customer ID</p>
                  <p className="text-sm text-stone-900">{order.user_u_id?.slice(-8) || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-stone-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-stone-700">Order Date</p>
                  <p className="text-sm text-stone-900">{formatDate(order.order_date)}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-stone-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-stone-700">Promised Date</p>
                  <p className="text-sm text-stone-900">
                    {order.promised_date ? formatDate(order.promised_date) : 'Not set'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-stone-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-stone-700">Delivery Address</p>
                  <p className="text-sm text-stone-900">{order.address || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <DollarSign className="w-5 h-5 text-stone-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-stone-700">Total Amount</p>
                  <p className="text-sm font-semibold text-stone-900">
                    ${order.total_amount?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminOrderDetails;