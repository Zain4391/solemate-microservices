import React, { useState } from 'react';
import { useLoaderData, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Hash,
  Filter
} from 'lucide-react';

const AdminPayments = () => {
  const { payments = [], pagination, stats } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);


  // Ensure arrays are safe
  const safePayments = Array.isArray(payments) ? payments : [];

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

  const handleStatusFilter = (status) => {
    const newParams = new URLSearchParams(searchParams);
    if (status) {
      newParams.set('status', status);
    } else {
      newParams.delete('status');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'COMPLETED': { 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle, 
        text: 'Completed' 
      },
      'PENDING': { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: Clock, 
        text: 'Pending' 
      },
      'FAILED': { 
        color: 'bg-red-100 text-red-800', 
        icon: XCircle, 
        text: 'Failed' 
      },
      'CANCELLED': { 
        color: 'bg-gray-100 text-gray-800', 
        icon: XCircle, 
        text: 'Cancelled' 
      },
      'REFUNDED': { 
        color: 'bg-blue-100 text-blue-800', 
        icon: AlertCircle, 
        text: 'Refunded' 
      }
    };
    
    return statusMap[status] || { 
      color: 'bg-gray-100 text-gray-800', 
      icon: AlertCircle, 
      text: status || 'Unknown' 
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount, currency = 'usd') => {
    if (!amount) return '$0.00';
    const value = parseFloat(amount);
    
    // Handle different currency formats
    if (currency.toLowerCase() === 'usd') {
      return `${value.toFixed(2)}`;
    }
    
    return `${value.toFixed(2)} ${currency.toUpperCase()}`;
  };

  const currentFilters = {
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    page: parseInt(searchParams.get('page')) || 1
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
          <h1 className="text-2xl font-bold text-stone-900">Payment Management</h1>
          <p className="text-stone-600 mt-1">Monitor and manage all payments</p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 text-center">
          <div className="text-2xl font-bold text-stone-900">{stats?.total || 0}</div>
          <div className="text-sm text-stone-600 flex items-center justify-center mt-1">
            <CreditCard className="w-4 h-4 mr-1" />
            Total Payments
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 text-center">
          <div className="text-2xl font-bold text-green-600">{stats?.completed || 0}</div>
          <div className="text-sm text-stone-600 flex items-center justify-center mt-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            Completed
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</div>
          <div className="text-sm text-stone-600 flex items-center justify-center mt-1">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 text-center">
          <div className="text-2xl font-bold text-red-600">{stats?.failed || 0}</div>
          <div className="text-sm text-stone-600 flex items-center justify-center mt-1">
            <XCircle className="w-4 h-4 mr-1" />
            Failed
          </div>
        </div>
      </motion.div>

      {/* Payments Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-stone-200">
        {safePayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-stone-900">Payment ID</th>
                  <th className="text-left py-3 px-4 font-medium text-stone-900">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-stone-900">User ID</th>
                  <th className="text-left py-3 px-4 font-medium text-stone-900">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-stone-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-stone-900">Method</th>
                  <th className="text-left py-3 px-4 font-medium text-stone-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {safePayments.map((payment, index) => {
                  const statusInfo = getStatusInfo(payment.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <motion.tr
                      key={payment.payment_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                    >
                      {/* Payment ID */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4 text-stone-400" />
                          <span className="font-mono text-sm text-stone-900">
                            {payment.payment_id?.slice(0, 8)}...
                          </span>
                        </div>
                      </td>

                      {/* Order ID */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm text-stone-700">
                            {payment.order_o_id?.slice(0, 8)}...
                          </span>
                        </div>
                      </td>

                      {/* User ID */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-stone-400" />
                          <span className="font-mono text-sm text-stone-700">
                            {payment.user_id?.slice(0, 8)}...
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-stone-900">
                            {formatAmount(payment.payment_amount, payment.currency)}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="w-4 h-4" />
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span>
                        </div>
                      </td>

                      {/* Payment Method */}
                      <td className="py-4 px-4">
                        <div className="text-sm text-stone-700">
                          {payment.payment_method || 'Stripe'}
                          {payment.stripe_payment_intent_id && (
                            <div className="text-xs text-stone-500 font-mono">
                              {payment.stripe_payment_intent_id.slice(0, 12)}...
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2 text-stone-600">
                          <Calendar className="w-4 h-4 text-stone-400" />
                          <div>
                            <div className="text-sm">{formatDate(payment.payment_date || payment.created_at)}</div>
                            {payment.updated_at !== payment.created_at && (
                              <div className="text-xs text-stone-500">
                                Updated: {formatDate(payment.updated_at)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-900 mb-2">No payments found</h3>
            <p className="text-stone-500 mb-4">
              {currentFilters.search || currentFilters.status
                ? 'Try adjusting your filters'
                : 'Payments will appear here when customers make purchases'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="px-6 py-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-stone-700">
                Showing {((currentFilters.page - 1) * 10) + 1} to{' '}
                {Math.min(currentFilters.page * 10, pagination.total_items || 0)} of{' '}
                {pagination.total_items || 0} payments
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentFilters.page - 1)}
                  disabled={currentFilters.page <= 1}
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
                          page === currentFilters.page
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
                  onClick={() => handlePageChange(currentFilters.page + 1)}
                  disabled={currentFilters.page >= pagination.total_pages}
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

export default AdminPayments;