'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { ChevronLeft, Filter, X, Heart, ShoppingCart, ChevronRight } from 'lucide-react';
import { products } from '@/src/data/products';
import { useCart } from '@/src/context/CartContext';

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    description: string;
    image: string;
    badge?: string;
    badgeColor?: string;
}

export default function ProductsPage() {
    const [showFiltersSidebar, setShowFiltersSidebar] = useState(false);
    const [sortBy, setSortBy] = useState('popular');
    const [priceRange, setPriceRange] = useState([0, 200]);
    const { addToCart, cartItems } = useCart();

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleAddToCart = (product: Product) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
        });
    };

    // Product Card Component
    const ProductCard = ({ product }: { product: Product }) => {
        const [isWishlisted, setIsWishlisted] = useState(false);

        return (
            <div className="group">
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-4">
                    {/* Badge */}
                    {product.badge && (
                        <div
                            className={`absolute top-3 left-3 z-10 ${product.badgeColor} text-white px-3 py-1 text-xs rounded-full`}
                        >
                            {product.badge}
                        </div>
                    )}

                    {/* Wishlist Icon - Top Right */}
                    <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:bg-black hover:text-white transition"
                    >
                        <Heart
                            size={18}
                            className={isWishlisted ? "fill-current text-red-500" : ""}
                        />
                    </button>

                    {/* Quick Add Button */}
                    {/* Mobile: Small circular button bottom-right, always visible */}
                    <button
                        onClick={() => handleAddToCart(product)}
                        className="absolute bottom-3 right-3 z-10 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition md:hidden"
                    >
                        <ShoppingCart size={18} />
                    </button>

                    {/* Desktop: Full button at bottom on hover */}
                    <button
                        onClick={() => handleAddToCart(product)}
                        className="hidden md:flex absolute bottom-3 left-3 right-3 z-10 bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                    >
                        <ShoppingCart size={16} />
                        Quick Add
                    </button>

                    {/* Product Image */}
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* Product Info */}
                <h3 className="text-sm md:text-base font-sans font-light text-gray-900 mb-1">
                    {product.name}
                </h3>

                <p className="text-xs md:text-sm italic text-gray-500 mb-2 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-900">
                        From ${product.price}
                    </span>

                    {product.originalPrice && (
                        <span className="text-gray-400 line-through">
                            ${product.originalPrice}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    // Filter products by price
    const filteredProducts = products.filter(product => {
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

    // Transform products to match ProductCard format
    const transformedProducts = sortedProducts.map(product => ({
        ...product,
        badge: product.price < 50 ? 'Best Seller' : product.rating >= 4.8 ? 'Top Rated' : undefined,
        badgeColor: product.price < 50 ? 'bg-gray-800' : product.rating >= 4.8 ? 'bg-green-600' : undefined,
    }));

    return (
        <div className={`${totalItems > 0 ? 'pb-20' : ''}`}>
            <Navbar />
            <div className="min-h-screen bg-white py-8 md:py-12 lg:py-16">
                <div className="w-full px-4 md:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* BREADCRUMBS */}
                        <div className="py-4">
                            <nav className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                <Link href="/" className="hover:text-gray-900">
                                    Home
                                </Link>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-gray-900 font-medium">Products</span>
                            </nav>
                        </div>

                        {/* Header */}
                        <div className="mb-12 md:mb-16">
                            <h1 className="text-2xl md:text-3xl lg:text-3xl 2xl:text-4xl font-lexend font-semibold text-gray-900 mb-4">
                                All Products
                            </h1>

                            <p className="text-gray-600 text-base md:text-l lg:text-l">
                                Explore our complete collection of beautiful plants and find your favorites.
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
                            {transformedProducts.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                                    {transformedProducts.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.id}`}
                                            className="group"
                                        >
                                            <ProductCard product={product} />
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 lg:py-24">
                                    <p className="text-gray-600 text-lg lg:text-xl mb-4">
                                        No products found.
                                    </p>
                                    <Link href="/" className="text-teal-600 hover:text-teal-700 font-semibold">
                                        Back to Home
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Cart Navigator */}
                {totalItems > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                                    {totalItems}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
                                    <p className="font-semibold">${totalPrice.toFixed(2)}</p>
                                </div>
                            </div>
                            <Link
                                href="/cart"
                                className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                            >
                                View Cart
                            </Link>
                        </div>
                    </div>
                )}

                <Footer />
            </div>
        </div>
    );
}
