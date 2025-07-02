// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice.js';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsOpen(false);
    dispatch(logoutUser());
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    setIsOpen(false);
    navigate('/dashboard/profile');
  };

  // Profile SVG Component
  const ProfileIcon = ({ className = "w-6 h-6" }) => (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  );

  return (
    <nav className="bg-stone-100 border-b border-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-amber-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="ml-2 text-xl font-bold text-stone-800 hidden sm:block">
                SOLEMATE
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                to="/" 
                className="text-stone-700 hover:text-amber-800 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-t-2 border-transparent hover:border-amber-800"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-stone-700 hover:text-amber-800 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-t-2 border-transparent hover:border-amber-800"
              >
                About
              </Link>
              <Link 
                to="/products" 
                className="text-stone-700 hover:text-amber-800 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-t-2 border-transparent hover:border-amber-800"
              >
                Products
              </Link>
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-amber-800 hover:bg-amber-900 text-white p-2 rounded-full transition-colors flex items-center space-x-2"
                  >
                    <ProfileIcon />
                    {user?.email && (
                      <span className="hidden lg:block text-sm font-medium">
                        {user.email.split('@')[0]}
                      </span>
                    )}
                  </button>
                  
                  {/* Desktop Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-stone-200 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 text-xs text-stone-500 border-b border-stone-200">
                          {user?.email || 'User'}
                        </div>
                        <button
                          onClick={handleProfileClick}
                          className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-800"
                        >
                          Profile
                        </button>
                        <Link
                          to="/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-800"
                        >
                          Dashboard
                        </Link>
                        <hr className="my-1 border-stone-200" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors border-t-2 border-transparent hover:border-amber-200"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-stone-200 inline-flex items-center justify-center p-2 rounded-md text-stone-700 hover:text-amber-800 hover:bg-stone-300 transition-colors"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-stone-50 border-t border-stone-300">
            <Link
              to="/"
              className="text-stone-700 hover:text-amber-800 block px-3 py-2 rounded-md text-base font-medium border-t-2 border-transparent hover:border-amber-800 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-stone-700 hover:text-amber-800 block px-3 py-2 rounded-md text-base font-medium border-t-2 border-transparent hover:border-amber-800 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/products"
              className="text-stone-700 hover:text-amber-800 block px-3 py-2 rounded-md text-base font-medium border-t-2 border-transparent hover:border-amber-800 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            
            {/* Mobile Auth Section */}
            {isAuthenticated ? (
              <>
                <div className="border-t border-stone-300 pt-3 mt-3">
                  <div className="px-3 py-2 text-xs text-stone-500">
                    {user?.email || 'User'}
                  </div>
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left text-stone-700 hover:text-amber-800 block px-3 py-2 rounded-md text-base font-medium border-t-2 border-transparent hover:border-amber-800 transition-all duration-200"
                  >
                    Profile
                  </button>
                  <Link
                    to="/dashboard"
                    className="text-stone-700 hover:text-amber-800 block px-3 py-2 rounded-md text-base font-medium border-t-2 border-transparent hover:border-amber-800 transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:text-red-700 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-amber-800 text-white block px-3 py-2 rounded-md text-base font-medium mt-4 text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;