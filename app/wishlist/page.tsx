'use client';

import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';

export default function WishlistPage() {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart, cartItems } = useCart();

    const totalItems = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                        My Wishlist
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Your saved plants and favorites. Keep track of items you love and add them to your cart when ready.
                    </p>
                </div>

                {/* Empty State */}
                {wishlistItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Your wishlist is empty
                        </h2>
                        <Link
                            href="/products"
                            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (

                    /* Product Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistItems.map((item) => (
                            <Link
                                key={item.id}
                                href={`/products/${item.handle}`}
                                className="group block"
                            >
                                {/* Image Section */}
                                <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-4">

                                    {/* Remove Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            removeFromWishlist(item.id);
                                        }}
                                        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:bg-[#244033] hover:text-white transition"
                                    >
                                        <Heart size={18} className="fill-current text-red-500" />
                                    </button>

                                    {/* Quick Add */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            const variantId = item.variantId;

                                            if (!variantId) {
                                                alert("This product is unavailable");
                                                return;
                                            }

                                            addToCart({
                                                id: item.id,
                                                variantId: variantId,
                                                name: item.name,
                                                price: item.price,
                                                quantity: 1,
                                                image: item.image,
                                                handle: item.handle,
                                                variants: item.variants
                                            });
                                        }}
                                        className="hidden md:flex absolute bottom-3 left-3 right-3 z-10 bg-[#244033] text-white py-2.5 text-sm font-medium hover:bg-[#2F4F3E] transition items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 duration-300"
                                    >
                                        <ShoppingCart size={16} />
                                        Quick Add
                                    </button>

                                    {/* Mobile Quick Add */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            const variantId = item.variantId;

                                            if (!variantId) {
                                                alert("This product is unavailable");
                                                return;
                                            }

                                            addToCart({
                                                id: item.id,
                                                variantId: variantId,
                                                name: item.name,
                                                price: item.price,
                                                quantity: 1,
                                                image: item.image,
                                                handle: item.handle,
                                                variants: item.variants
                                            });
                                        }}
                                        className="absolute bottom-3 right-3 z-10 w-10 h-10 bg-[#244033] text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition md:hidden"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>

                                    {/* Image */}
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                {/* Product Info */}
                                <h3 className="text-sm md:text-base font-light text-gray-900 mb-1">
                                    {item.name}
                                </h3>

                                <div className="text-sm">
                                    <span className="font-medium text-gray-900">
                                        Rs. {item.price}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Cart Navigator */}
            {totalItems > 0 && (
                <div
                    className="
            fixed z-50
            bg-[#F0F4F1] border-t border-gray-200 shadow-lg
            bottom-[70px] left-3 right-3
            sm:bottom-0 
            sm:left-1/2 
            sm:-translate-x-1/2 
            sm:w-[500px] 
            sm:rounded-t-[20px] 
            p-5 rounded-[20px]
          "
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#244033] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                                {totalItems}
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    {totalItems} item{totalItems > 1 ? "s" : ""}
                                </p>
                                <p className="font-semibold">
                                    Rs. {totalPrice.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/cart"
                            className="bg-[#244033] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2F4F3E] transition"
                        >
                            View Cart
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
