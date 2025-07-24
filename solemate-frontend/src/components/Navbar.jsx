// src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice.js';
import { ShoppingCart } from 'lucide-react';
import CartBadge from './CartBadge.jsx';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  
  // Separate ref for ONLY the profile dropdown
  const profileDropdownRef = useRef(null);

  // helper to get location for focus effect
  const isActiveLink = (path) => {
    if(path === '/' && location.pathname === '/') {
      return true;
    }
    if(path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }

    return false;
  }


    const getLinkClass = (path) => {
      const baseClass = "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-t-2";
      
      if (isActiveLink(path)) {
          return `${baseClass} text-amber-800 border-amber-800`;
      }
      
      return `${baseClass} text-stone-700 border-transparent hover:text-amber-800 hover:border-amber-800`;
  };

  // Handle profile dropdown click outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if(profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if(isDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  },[isDropdownOpen]);

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
                className={getLinkClass('/')}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={getLinkClass('/about')}
                >
                About
              </Link>
              <Link 
                to="/products" 
                className={getLinkClass('/products')}
                >
                Products
              </Link>
              {isAuthenticated && (
                <>
                  <Link 
                  to="/cart" 
                  className={getLinkClass('/cart')}
                  > 
                    Cart
                  </Link>

                  <Link
                  to="/orders"
                  className={getLinkClass('/orders')}
                  >
                    My Orders
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              
              {/* Cart Badge - Handles its own click outside */}
              <CartBadge />
              
              {isAuthenticated ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-amber-800 hover:bg-amber-900 text-white p-2.5 rounded-full transition-colors border-2 border-amber-700 hover:border-amber-600 shadow-sm hover:shadow-md"
                  >
                    <ProfileIcon className="w-5 h-5" />
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
            <div className="flex items-center space-x-2">
              {/* Mobile Cart Badge */}
              <CartBadge />
              
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
                <Link
                to="/orders"
                className="text-stone-700 hover:text-amber-800 block px-3 py-2 rounded-md text-base font-medium border-t-2 border-transparent hover:border-amber-800 transition-all duration-200"
                onClick={() => setIsOpen(false)}
                >
                  My Orders
                </Link>
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
                  <Link
                    to="/cart"
                    className="text-stone-700 hover:text-amber-800 px-3 py-2 rounded-md text-base font-medium border-t-2 border-transparent hover:border-amber-800 transition-all duration-200 flex items-center justify-between"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Cart
                    </div>
                    {totalItems > 0 && (
                      <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full min-w-[20px] flex items-center justify-center">
                        {totalItems > 99 ? '99+' : totalItems}
                      </span>
                    )}
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