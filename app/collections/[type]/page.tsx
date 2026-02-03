'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Star, Filter, X, Heart, ShoppingCart, ChevronRight } from 'lucide-react';
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
    const { cartItems, addToCart } = useCart();
    const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(new Set());

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const collectionType = params?.type as string;
    const collectionInfo = collectionMapping[collectionType] || { name: 'Collection', category: 'houseplants', description: 'Explore our collection' };

    // Filter products by category
    const filteredProducts = products.filter(product => {
        if (product.category !== collectionInfo.category) return false;
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
        return true;
    });

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation(); // Stop event bubbling
        addToCart({
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
        });
    };

    const toggleWishlist = (e: React.MouseEvent, productId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setWishlistedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.id.localeCompare(a.id);
        return 0;
    });

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

    return (
        <div className={`flex flex-col min-h-screen ${totalItems > 0 ? 'pb-20' : ''}`}>

            <main className="flex-1 bg-white py-8 md:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    {/* BREADCRUMBS */}
                    <div className="py-4">
                        <nav className="flex items-center justify-center  space-x-2 text-sm text-gray-600">
                            <Link href="/" className="hover:text-gray-900">
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href="/collections" className="hover:text-gray-900">
                                Collections
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-gray-900 font-medium">{collectionInfo.name}</span>
                        </nav>
                    </div>

                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-sans font-light text-gray-900 mb-4">
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
                                        {/* Image Card */}
                                        <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[3/4] mb-4">

                                            {/* Badge */}
                                            {product.reviews > 400 && (
                                                <span className="absolute top-3 left-3 z-10 px-3 py-1 text-xs font-medium rounded-full bg-gray-900 text-white">
                                                    Best Seller
                                                </span>
                                            )}

                                            {product.originalPrice > product.price && product.reviews <= 400 && (
                                                <span className="absolute top-3 left-3 z-10 px-3 py-1 text-xs font-medium rounded-full bg-red-600 text-white">
                                                    On Sale
                                                </span>
                                            )}

                                            {product.category === 'large-plants' && (
                                                <span className="absolute top-3 left-3 z-10 px-3 py-1 text-xs font-medium rounded-full bg-purple-600 text-white">
                                                    Rare Plant
                                                </span>
                                            )}

                                            {/* Wishlist */}
                                            <button
                                                onClick={(e) => toggleWishlist(e, product.id)}
                                                className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:bg-black hover:text-white transition"
                                            >
                                                <Heart
                                                    size={18}
                                                    className={wishlistedItems.has(product.id) ? "fill-current text-red-500" : ""}
                                                />
                                            </button>

                                            {/* Image */}
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            {/* DESKTOP: Quick Add bar */}
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="hidden md:flex absolute bottom-3 left-3 right-3 z-10 bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                                            >
                                                <ShoppingCart size={16} />
                                                Quick Add
                                            </button>

                                            {/* MOBILE: Floating cart icon */}
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="md:hidden absolute bottom-3 right-3 w-11 h-11 bg-black text-white rounded-full flex items-center justify-center shadow-lg"
                                            >
                                                🛒
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-1">
                                            <h3 className="font-sans text-[17px] text-gray-900">
                                                {product.name}
                                            </h3>

                                            <p className="text-sm text-gray-500 italic line-clamp-1">
                                                {product.description}
                                            </p>

                                            <p className="text-sm font-medium text-gray-900 pt-1">
                                                From ${product.price}
                                                {product.originalPrice && (
                                                    <span className="ml-2 text-gray-400 line-through">
                                                        ${product.originalPrice}
                                                    </span>
                                                )}
                                            </p>
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

        </div>
    );
}