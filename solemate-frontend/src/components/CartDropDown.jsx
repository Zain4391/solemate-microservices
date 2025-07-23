import { Footprints, Package, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom'
import React from 'react';

const CartDropDown = ({ totalItems, totalAmount, items = [] }) => {
    if(totalItems === 0) {
        return (
            <div className='absolute right-0 w-80 z-50 my-2 bg-white rounded-md border-stone-300 shadow-lg'>
                <div className='p-6 text-center'>
                    <div className="flex items-center justify-center mx-auto mb-3 rounded-full w-12 h-12 bg-stone-100">
                        <ShoppingCart className='w-6 h-6 text-stone-400' />
                    </div>
                    <h3 className="font-medium text-stone-800 mb-1">Your cart is empty</h3>
                    <p className="text-sm text-stone-500 mb-4">Add some products to get started</p>
                    <Link 
                        to="/products"
                        className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }
  return (
    <div className='absolute right-0 w-80 z-50 my-2 bg-white rounded-md border-stone-300 shadow-lg'>
      {/*Header*/}
      <div className='px-6 py-6 border-b border-stone-100'>
        <div className='flex items-center justify-between'>
            <h3 className='font-semibold flex items-center text-stone-600'>
                <ShoppingCart className='w-4 h-4 mr-2'/>
                Shopping Cart
            </h3>
            <span className='text-stone-600 px-2 py-1'>
                {totalItems} {totalItems === 1 ? 'item': 'items'}
            </span>
        </div>
      </div>

      {/*Cart Preview*/}
      <div className='max-h-64 overflow-y-auto'>
        {items.length > 0 ? (
            items.slice(0, 3).map((item, index) => (
                <div key={index} className='px-4 py-3 border-b border-stone-50 hover:bg-stone-100 transition-colors'>
                    <div className="flex items-center space-x-3">
                        <div className='w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center'>
                            <Footprints className='w-5 h-5 text-stone-500'/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className='text-sm font-medium text-stone-600 truncate'>
                                {item?.product?.p_name || "Product Name"}
                            </p>
                            <p className='text-xs text-stone-500'>
                                Size {item.size} • Qty {item.quantity}
                            </p>
                        </div>
                        <div className="text-sm font-medium text-stone-800">
                            ${(item.quantity * (item.product?.price || 0)).toFixed(2)}
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <div className="px-4 py-6 text-center">
                <Package className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-sm text-stone-500">Loading cart items...</p>
            </div>
        )}
      </div>
        {items.length > 3 && (
            <div className="px-4 py-2 text-center text-xs text-stone-500 bg-stone-25">
                +{items.length - 3} more {items.length - 3 === 1 ? 'item' : 'items'}
            </div>
        )}

    <div className='px-4 py-4 border-t border-stone-100 bg-stone-25'>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-stone-600">Total:</span>
          <span className="text-lg font-bold text-stone-800">${totalAmount?.toFixed(2) || '0.00'}</span>
        </div>
        
                <div className="flex space-x-2">
                    <Link 
                        to="/cart"
                        className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                    >
                        View Cart
                    </Link>
                    <Link 
                        to='/checkout'
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                        Checkout
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
      </div>

    </div>
  );
}

export default CartDropDown
