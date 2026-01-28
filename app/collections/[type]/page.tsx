'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { ChevronLeft, Star, Filter, X } from 'lucide-react';
import { products } from '@/src/data/products';

const collectionMapping: { [key: string]: { name: string; category: string; description: string } } = {
    'houseplants': { name: 'Houseplants', category: 'houseplants', description: 'Beautiful plants for your indoor spaces' },
    'large-plants': { name: 'Large Plants', category: 'large-plants', description: 'Make a statement with big, bold plants' },
    'low-light': { name: 'Low Light Plants', category: 'low-light', description: 'Perfect for rooms with limited natural light' },
    'valentines-day': { name: 'Valentine\'s Day', category: 'houseplants', description: 'Perfect gifts for your loved ones' },
    'new-arrivals': { name: 'New Arrivals', category: 'houseplants', description: 'Fresh plants just added to our collection' },
    'outdoor-patio': { name: 'Outdoor & Patio', category: 'large-plants', description: 'Transform your outdoor spaces' },
    'orchids-blooms': { name: 'Orchids & Blooms', category: 'houseplants', description: 'Elegant flowering plants' },
    'gifts': { name: 'Gifts', category: 'houseplants', description: 'Premium gift sets and bundles' },
    'planters-care': { name: 'Planters & Care', category: 'houseplants', description: 'Everything you need to care for your plants' },
    'corporate-gifts': { name: 'Corporate Gifts', category: 'houseplants', description: 'Impress your clients and employees' },
    'sale': { name: 'Sale', category: 'houseplants', description: 'Amazing deals on selected items' },
};

export default function CollectionDetailPage() {
    const params = useParams();
    const [showFiltersSidebar, setShowFiltersSidebar] = useState(false);
    const [sortBy, setSortBy] = useState('popular');
    const [priceRange, setPriceRange] = useState([0, 200]);
    const [loading, setLoading] = useState(true);

    const collectionType = params?.type as string;
    const collectionInfo = collectionMapping[collectionType] || { name: 'Collection', category: 'houseplants', description: 'Explore our collection' };

    // Filter products by category
    const filteredProducts = products.filter(product => {
        if (product.category !== collectionInfo.category) return false;
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
        return true;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.id.localeCompare(a.id);
        return 0;
    });

    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <p className="text-gray-600">Loading...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-white py-8 md:py-12 lg:py-16">
                <div className="w-full px-4 md:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Back Link */}
                        <Link href="/collections" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 text-base">
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Back to Collections
                        </Link>

                        {/* Header */}
                        <div className="mb-12 md:mb-16">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-gray-900 mb-4">
                                {collectionInfo.name}
                            </h1>
                            <p className="text-gray-600 text-base md:text-lg">
                                {collectionInfo.description}
                            </p>
                        </div>

                        <div className="mb-8">
                            <button
                                onClick={() => setShowFiltersSidebar(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-md text-gray-900 hover:bg-gray-50 transition font-medium"
                            >
                                <Filter size={20} />
                                Filter and sort
                            </button>
                            <span className="ml-4 text-gray-600 font-medium">
                                {sortedProducts.length} products
                            </span>
                        </div>

                        {/* Filter Sidebar Overlay */}
                        {showFiltersSidebar && (
                            <div
                                className="fixed inset-0 bg-black/30 z-40"
                                onClick={() => setShowFiltersSidebar(false)}
                            />
                        )}

                        {/* Filter Sidebar */}
                        <div
                            className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-lg transform transition-transform duration-300 ${showFiltersSidebar ? 'translate-x-0' : 'translate-x-full'
                                } overflow-y-auto`}
                        >
                            {/* Sidebar Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Filter and sort</h2>
                                <button
                                    onClick={() => setShowFiltersSidebar(false)}
                                    className="p-2 hover:bg-gray-100 rounded-md transition"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Sidebar Content */}
                            <div className="p-6 space-y-8">
                                {/* Sort By */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center justify-between">
                                        Sort by
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </h3>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-teal-600"
                                    >
                                        <option value="popular">Featured</option>
                                        <option value="newest">Newest</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Highest Rated</option>
                                    </select>
                                </div>

                                {/* Category */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center justify-between cursor-pointer">
                                        Category
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </h3>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-4">Price Range</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-gray-600 block mb-2">
                                                Min: ${priceRange[0]}
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="200"
                                                value={priceRange[0]}
                                                onChange={(e) =>
                                                    setPriceRange([parseInt(e.target.value), priceRange[1]])
                                                }
                                                className="w-full accent-teal-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 block mb-2">
                                                Max: ${priceRange[1]}
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="200"
                                                value={priceRange[1]}
                                                onChange={(e) =>
                                                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                                                }
                                                className="w-full accent-teal-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Plant Benefits */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center justify-between cursor-pointer">
                                        Plant Benefits
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </h3>
                                </div>

                                {/* Light Requirements */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center justify-between cursor-pointer">
                                        Light Requirements
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </h3>
                                </div>

                                {/* Plant Type */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center justify-between cursor-pointer">
                                        Plant Type
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </h3>
                                </div>
                            </div>

                            {/* Sidebar Footer - Sticky */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-4">
                                <button
                                    onClick={() => setPriceRange([0, 200])}
                                    className="flex-1 text-center text-gray-900 hover:text-gray-600 font-medium text-base"
                                >
                                    Remove All
                                </button>
                                <button
                                    onClick={() => setShowFiltersSidebar(false)}
                                    className="flex-1 bg-teal-600 text-white font-medium text-base rounded-md hover:bg-teal-700 transition py-3"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="w-full">
                            {sortedProducts.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                                    {sortedProducts.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.id}`}
                                            className="group"
                                        >
                                            <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4 h-48 md:h-56 lg:h-64">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                                />
                                            </div>
                                            <h3 className="font-serif font-light text-lg text-gray-900 mb-2 line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            className={`${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-600">({product.reviews})</span>
                                            </div>
                                            <div>
                                                <p className="text-gray-900 font-medium text-lg">${product.price}</p>
                                                <p className="text-gray-500 text-sm line-through">${product.originalPrice}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 lg:py-24">
                                    <p className="text-gray-600 text-lg lg:text-xl mb-4">
                                        No products found in this collection.
                                    </p>
                                    <Link href="/collections" className="text-teal-600 hover:text-teal-700 font-semibold">
                                        Back to Collections
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <Footer />
                </div >
            </div >
        </div>
    );
}
