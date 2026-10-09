'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function CartConfirmationBar() {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    document.body.classList.toggle('has-cart-confirmation', totalItems > 0);
    return () => document.body.classList.remove('has-cart-confirmation');
  }, [totalItems]);

  return (
    <>
      {totalItems > 0 && (
        <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-3 right-3 z-40 rounded-[20px] border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:p-3.5 md:bottom-4 md:left-1/2 md:right-auto md:w-[min(380px,calc(100%-2rem))] md:-translate-x-1/2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#2d5a3d] text-sm font-semibold text-white">
                {totalItems}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-600">
                  {totalItems} item{totalItems === 1 ? '' : 's'}
                </p>
                <p className="text-sm font-bold text-gray-900">₹ {totalPrice.toFixed(2)}</p>
              </div>
            </div>
            <Link
              href="/cart"
              className="inline-flex min-h-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#2d5a3d] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1f4028]"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
