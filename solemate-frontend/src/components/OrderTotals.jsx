import React from 'react'

const OrderTotals = ({ totalItems, tax, shipping, grandTotal, subtotal}) => {
  return (
    <div className="border-t border-stone-200 pt-6">
        <div className="space-y-2">
            <div className="flex justify-between text-stone-600">
                <span>Subtotal ({totalItems} items)</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="border-t border-stone-200 pt-2">
                <div className="flex justify-between text-lg font-semibold text-stone-800">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default OrderTotals
