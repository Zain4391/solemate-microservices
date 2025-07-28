import React from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  Plus
} from 'lucide-react';

const AdminDashboard = () => {
  const { dashboardData } = useLoaderData();
  const { stats, recentOrders } = dashboardData;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = "amber" }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            {typeof value === 'number' && title.includes('Sales') 
              ? `$${value.toLocaleString()}` 
              : value.toLocaleString()
            }
          </p>
        </div>
        <motion.div 
          whileHover={{ rotate: 5 }}
          className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </motion.div>
      </div>
    </motion.div>
  );

  const OrderRow = ({ order, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              Order #{order.o_id?.slice(-6) || 'N/A'}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(order.order_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            ${order.total_amount?.toFixed(2) || '0.00'}
          </p>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            order.is_complete 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {order.is_complete ? 'Complete' : 'Pending'}
          </span>
        </div>
        <Link
          to={`/admin/orders/${order.o_id}`}
          className="text-amber-600 hover:text-amber-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Section */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white"
      >
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Welcome to SoleMate Admin</h1>
        <p className="text-amber-100 text-sm sm:text-base">
          Here's what's happening with your store today.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <StatCard
          title="Total Sales"
          value={stats.totalSales}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={AlertTriangle}
          color="yellow"
        />
        <StatCard
          title="Completed Orders"
          value={stats.completedOrders}
          icon={Package}
          color="purple"
        />
      </motion.div>

      {/* Recent Orders */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <Link
            to="/admin/orders"
            className="text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentOrders?.length > 0 ? (
            recentOrders.map((order, index) => (
              <OrderRow key={order.o_id} order={order} index={index} />
            ))
          ) : (
            <div className="p-8 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent orders found</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        variants={itemVariants}
        className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center space-y-2 bg-amber-600 hover:bg-amber-700 text-white p-3 sm:p-4 rounded-lg transition-colors"
          >
            <Package className="w-5 h-5" />
            <span className="text-xs sm:text-sm font-medium">Add Product</span>
          </motion.button>
          <Link to="/admin/orders">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700 text-white p-3 sm:p-4 rounded-lg transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs sm:text-sm font-medium">View Orders</span>
            </motion.button>
          </Link>
          <Link to="/admin/users">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex flex-col items-center justify-center space-y-2 bg-green-600 hover:bg-green-700 text-white p-3 sm:p-4 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5" />
              <span className="text-xs sm:text-sm font-medium">Manage Users</span>
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center space-y-2 bg-purple-600 hover:bg-purple-700 text-white p-3 sm:p-4 rounded-lg transition-colors"
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="text-xs sm:text-sm font-medium">Reports</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;