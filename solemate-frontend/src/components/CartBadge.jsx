// src/components/CartBadge.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart } from 'lucide-react';
import CartDropDown from './CartDropDown';
import { fetchItemsFromCart } from '../store/slices/cartSlice.js';

const CartBadge = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems, isLoading, totalAmount, items } = useSelector(state => state.cart);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  // handles dropdown closing when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen]);

  // handles cart refetching when page refreshes or token expires
  useEffect(() => {
    if(isAuthenticated && user && items.length === 0) {
      dispatch(fetchItemsFromCart(user.userId));
    }
  }, [isAuthenticated, user, dispatch])

  // Don't render if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleCartClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Cart Button */}
      <button
        onClick={handleCartClick}
        disabled={isLoading}
        className={`relative p-2.5 rounded-full transition-all duration-200 border-2 ${
          isLoading 
            ? 'bg-stone-200 border-stone-300 text-stone-400 cursor-not-allowed opacity-60'
            : 'bg-white border-stone-300 hover:border-amber-300 hover:bg-amber-50 text-stone-700 hover:text-amber-700 shadow-sm hover:shadow-md'
        }`}
      >
        <ShoppingCart className="w-5 h-5" />
        
        {/* Badge with count - Only show if totalItems > 0 or loading */}
        {(totalItems > 0 || isLoading) && (
          <span className={`absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full text-xs font-bold flex items-center justify-center px-1.5 transition-all duration-200 border-2 border-white ${
            isLoading
              ? 'bg-stone-400 text-white'
              : totalItems > 0 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'bg-stone-400 text-white'
          }`}>
            {isLoading ? '•••' : totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      {/* Cart Dropdown - We'll build this in next step */}
      {isCartOpen && (
        <div className='animate-in slide-in-from-top-2 fade-in duration-200'>
          <CartDropDown totalItems={totalItems} totalAmount={totalAmount} items={items}/>
        </div>
      )}
    </div>
  );
};

export default CartBadge;