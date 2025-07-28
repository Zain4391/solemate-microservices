import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  Menu,
  X,
  LogOut,
  Package
} from 'lucide-react';
import { logoutUser } from '../store/slices/authSlice';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Check admin access
  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const sidebarItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingBag
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: Package
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: Users
    },
    {
      name: 'Payments',
      path: '/admin/payments',
      icon: CreditCard
    }
  ];

  if (!isAuthenticated || !user?.isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Fixed positioning */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 bg-stone-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-stone-700 rounded-lg flex items-center justify-center">
                <span className="text-amber-600 font-bold text-sm">S</span>
              </div>
              <span className="text-white font-semibold text-lg">SoleMate Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-stone-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-amber-600 text-white' 
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-stone-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-stone-700 rounded-full flex items-center justify-center">
                <span className="text-amber-600 font-semibold text-sm">
                  {user?.first_name?.[0] || 'A'}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-stone-400 text-xs">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-stone-300 hover:bg-stone-800 hover:text-white rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 p-2"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Welcome back, {user?.first_name}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;