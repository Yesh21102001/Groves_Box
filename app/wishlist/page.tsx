'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useWishlist } from '@/src/context/WishlistContext';
import ProductCard from '@/src/components/ProductCard';

export default function WishlistPage() {
    const { wishlistItems } = useWishlist();
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl lg:text-4xl font-bold text-[#2d5a3d] mb-4">
                        My Wishlist
                    </h1>
                    <p className="text-l text-gray-600 max-w-xl mx-auto">
                        Your saved plants and favorites. Keep track of items you love and add them to your cart when ready.
                    </p>
                </div>

                {/* Empty State */}
                {wishlistItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-[#2d5a3d] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#2d5a3d] mb-4">
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

        </div>
    );
}