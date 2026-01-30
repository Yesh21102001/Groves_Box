'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { ChevronLeft, Star, Filter, X } from 'lucide-react';
import { products } from '@/src/data/products';
import { useCart } from '@/src/context/CartContext';

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

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (showFiltersSidebar) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showFiltersSidebar]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-600">Loading...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 bg-white py-8 md:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    {/* Back Link */}
                    <Link
                        href="/collections"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 text-base transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to Collections
                    </Link>

                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-gray-900 mb-4">
                            {collectionInfo.name}
                        </h1>
                        <p className="text-gray-600 text-base md:text-l max-w-xl">
                            {collectionInfo.description}
                        </p>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                        <button
                            onClick={() => setShowFiltersSidebar(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-md text-gray-900 hover:bg-gray-50 transition-colors font-medium"
                        >
                            <Filter size={20} />
                            Filter and sort
                        </button>
                        <span className="text-gray-600 font-medium">
                            {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
                        </span>
                    </div>

                    {/* Filter Sidebar Overlay */}
                    {showFiltersSidebar && (
                        <div
                            className="fixed inset-0 bg-black/30 z-40 transition-opacity"
                            onClick={() => setShowFiltersSidebar(false)}
                        />
                    )}

                    {/* Filter Sidebar */}
                    <div
                        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${showFiltersSidebar ? 'translate-x-0' : 'translate-x-full'
                            } flex flex-col`}
                    >
                        {/* Sidebar Header */}
                        <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between flex-shrink-0">
                            <h2 className="text-lg font-semibold text-gray-900">Filter and sort</h2>
                            <button
                                onClick={() => setShowFiltersSidebar(false)}
                                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                aria-label="Close filters"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Sidebar Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Sort By */}
                            <div>
                                <h3 className="text-base font-semibold text-gray-900 mb-4">
                                    Sort by
                                </h3>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white"
                                >
                                    <option value="popular">Featured</option>
                                    <option value="newest">Newest</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="text-base font-semibold text-gray-900 mb-4">Price Range</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm text-gray-600 block mb-2">
                                            Min: ${priceRange[0]}
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="200"
                                            value={priceRange[0]}
                                            onChange={(e) => {
                                                const newMin = parseInt(e.target.value);
                                                if (newMin <= priceRange[1]) {
                                                    setPriceRange([newMin, priceRange[1]]);
                                                }
                                            }}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
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
                                            onChange={(e) => {
                                                const newMax = parseInt(e.target.value);
                                                if (newMax >= priceRange[0]) {
                                                    setPriceRange([priceRange[0], newMax]);
                                                }
                                            }}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600 pt-2">
                                        <span>${priceRange[0]}</span>
                                        <span>-</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Category - Collapsed sections with chevrons */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center justify-between cursor-pointer">
                                    Category
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </h3>
                                <p className="text-sm text-gray-500">Expand to view options</p>
                            </div>

                            {/* Plant Benefits */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center justify-between cursor-pointer">
                                    Plant Benefits
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </h3>
                                <p className="text-sm text-gray-500">Expand to view options</p>
                            </div>

                            {/* Light Requirements */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center justify-between cursor-pointer">
                                    Light Requirements
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </h3>
                                <p className="text-sm text-gray-500">Expand to view options</p>
                            </div>

                            {/* Plant Type */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center justify-between cursor-pointer">
                                    Plant Type
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </h3>
                                <p className="text-sm text-gray-500">Expand to view options</p>
                            </div>
                        </div>

                        {/* Sidebar Footer - Sticky */}
                        <div className="bg-white border-t border-gray-200 p-6 flex gap-4 flex-shrink-0">
                            <button
                                onClick={() => {
                                    setPriceRange([0, 200]);
                                    setSortBy('popular');
                                }}
                                className="flex-1 text-center px-6 py-3 border border-gray-300 rounded-md text-gray-900 hover:bg-gray-50 font-medium text-base transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setShowFiltersSidebar(false)}
                                className="flex-1 bg-teal-600 text-white font-medium text-base rounded-md hover:bg-teal-700 transition-colors py-3"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="w-full">
                        {sortedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {sortedProducts.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.id}`}
                                        className="group block"
                                    >
                                        <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4 aspect-square">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <h3 className="font-serif font-light text-base md:text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={`${i < Math.floor(product.rating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'fill-gray-200 text-gray-200'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-600">({product.reviews})</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-gray-900 font-semibold text-lg">${product.price}</p>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <p className="text-gray-400 text-sm line-through">${product.originalPrice}</p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 lg:py-24">
                                <p className="text-gray-600 text-lg lg:text-xl mb-4">
                                    No products found matching your filters.
                                </p>
                                <button
                                    onClick={() => {
                                        setPriceRange([0, 200]);
                                        setSortBy('popular');
                                    }}
                                    className="text-teal-600 hover:text-teal-700 font-semibold underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}