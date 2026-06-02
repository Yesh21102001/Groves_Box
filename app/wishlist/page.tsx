'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';
import ProductCard from '@/src/components/ProductCard';

export default function WishlistPage() {
    const { wishlistItems } = useWishlist();
    const { cartItems } = useCart();

    const totalItems = cartItems.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
    );

    const totalPrice = cartItems.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl lg:text-4xl font-bold text-[#6b9238] mb-4">
                        My Wishlist
                    </h1>
                    <p className="text-l text-gray-600 max-w-xl mx-auto">
                        Your saved plants and favorites. Keep track of items you love and add them to your cart when ready.
                    </p>
                </div>

                {/* Empty State */}
                {wishlistItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-[#6b9238] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#6b9238] mb-4">
                            Your wishlist is empty
                        </h2>
                        <Link
                            href="/products"
                            className="btn-primary"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (

                    /* Product Grid */
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {wishlistItems.map((item) => (
                            <ProductCard
                                key={item.id}
                                product={{
                                    id: item.id,
                                    name: item.name,
                                    handle: item.handle,
                                    image: item.image,
                                    variants: item.variants,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Cart Navigator */}
            {totalItems > 0 && (
                <div
                    className="
      fixed z-40
      bg-[#F0F4F1] border-t border-gray-200 shadow-lg

      bottom-[70px] left-3 right-3          /* mobile */
      
     sm:bottom-0 
sm:left-1/2 
sm:-translate-x-1/2 
sm:w-[500px] 
sm:rounded-t-[20px] 
sm:rounded-b-none
                    /* desktop width */

      p-5 rounded-[20px]
      sm:p-4 sm:rounded-[16px]
    "
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#6b9238] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                                {totalItems}
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    {totalItems} item{totalItems > 1 ? "s" : ""}
                                </p>
                                <p className="font-semibold">Rs. {totalPrice.toFixed(2)}</p>
                            </div>
                        </div>

                        <Link
                            href="/cart"
                            className="btn-primary"
                        >
                            View Cart
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}