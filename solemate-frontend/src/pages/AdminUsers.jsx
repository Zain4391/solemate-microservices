import React, { useState } from 'react';
import { useLoaderData, useFetcher } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search,
  Users,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Shield,
  ShieldCheck
} from 'lucide-react';

const AdminUsers = () => {
  const { users = [] } = useLoaderData();
  const fetcher = useFetcher();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingUser, setDeletingUser] = useState(null);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      setDeletingUser(userId);
      fetcher.submit(
        { userId }, 
        { 
          method: 'delete',
          action: '/admin/users'
        }
      );
    }
  };

  // Reset deleting state when fetcher is done
  React.useEffect(() => {
    if (fetcher.state === 'idle' && deletingUser) {
      setDeletingUser(null);
    }
  }, [fetcher.state, deletingUser]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const adminUsers = users.filter(user => user.is_admin === "Y").length;
    const regularUsers = totalUsers - adminUsers;
    
    return { totalUsers, adminUsers, regularUsers };
  };

  const stats = getUserStats();

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
          <h1 className="text-2xl font-bold text-stone-900">User Management</h1>
          <p className="text-stone-600 mt-1">Manage registered users</p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 text-center">
          <div className="text-2xl font-bold text-stone-900">{stats.totalUsers}</div>
          <div className="text-sm text-stone-600 flex items-center justify-center mt-1">
            <Users className="w-4 h-4 mr-1" />
            Total Users
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 text-center">
          <div className="text-2xl font-bold text-amber-600">{stats.adminUsers}</div>
          <div className="text-sm text-stone-600 flex items-center justify-center mt-1">
            <ShieldCheck className="w-4 h-4 mr-1" />
            Administrators
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.regularUsers}</div>
          <div className="text-sm text-stone-600 flex items-center justify-center mt-1">
            <UserCheck className="w-4 h-4 mr-1" />
            Regular Users
          </div>
        </div>
      </motion.div>

      {/* Search Section */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
        <div className="flex gap-4 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 placeholder:text-stone-500"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 text-stone-700 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors bg-white"
            >
              Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* Error/Success Messages */}
      {fetcher.data?.error && (
        <motion.div 
          variants={itemVariants}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        >
          {fetcher.data.error}
        </motion.div>
      )}

      {fetcher.data?.success && (
        <motion.div 
          variants={itemVariants}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
        >
          User deleted successfully!
        </motion.div>
      )}

      {/* Users Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm border border-stone-200">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-stone-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-stone-900">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-stone-900">Role</th>
                  <th className="text-center py-3 px-4 font-medium text-stone-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => {
                  const isDeleting = deletingUser === user.u_id || fetcher.state === 'submitting';
                  
                  return (
                    <motion.tr
                      key={user.u_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: isDeleting ? 0.5 : 1,
                        y: 0 
                      }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                    >
                      {/* User Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center">
                            <span className="text-stone-700 font-medium text-sm">
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-stone-900">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-stone-500">
                              ID: {user.u_id?.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2 text-stone-700">
                          <Mail className="w-4 h-4 text-stone-400" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {user.is_admin === "Y" ? (
                            <>
                              <Shield className="w-4 h-4 text-amber-600" />
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                Administrator
                              </span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4 text-blue-600" />
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                User
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center">
                        {user.is_admin !== "Y" ? (
                          <button
                            onClick={() => handleDelete(user.u_id, `${user.first_name} ${user.last_name}`)}
                            disabled={isDeleting}
                            className="inline-flex items-center space-x-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-gray-100 text-gray-500 px-3 py-1 rounded text-sm">
                            <Shield className="w-4 h-4" />
                            <span>Protected</span>
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <UserX className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-900 mb-2">
              {searchTerm ? 'No users found' : 'No users registered'}
            </h3>
            <p className="text-stone-500">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Users will appear here when they register'
              }
            </p>
          </div>
        )}
      </motion.div>

      {/* Results Summary */}
      {searchTerm && (
        <motion.div variants={itemVariants} className="text-center text-sm text-stone-600">
          Showing {filteredUsers.length} of {users.length} users
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminUsers;