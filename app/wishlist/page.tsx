'use client';

import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { useWishlist } from '@/src/context/WishlistContext';

export default function WishlistPage() {
    const { wishlistItems, removeFromWishlist } = useWishlist();

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {/* Header */}
                <div className="mb-8 lg:mb-12">
                    <div className="text-center">
                        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                            My Wishlist
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Your saved plants and favorites. Keep track of items you love and add them to your cart when ready.
                        </p>
                    </div>
                </div>

                {/* Wishlist Items */}
                {wishlistItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-8">Start adding plants you love to your wishlist!</p>
                        <Link
                            href="/products"
                            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                        >
                            Browse Plants
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative h-56 bg-gradient-to-br from-green-100 to-teal-100 overflow-hidden">
                                    <div className="w-full h-full flex items-center justify-center text-6xl">
                                        🌿
                                    </div>
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="absolute top-3 right-3 p-2.5 bg-white rounded-full shadow-lg hover:bg-red-50 transition-all duration-200 group"
                                    >
                                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-2xl font-bold text-green-600 mb-4">${item.price}</p>
                                    <button className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                                        <ShoppingCart className="w-5 h-5" />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}