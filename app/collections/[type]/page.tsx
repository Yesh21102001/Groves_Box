'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Filter, X, Heart, ShoppingCart, ChevronRight } from 'lucide-react';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';
import { getCollection } from '@/src/lib/shopify_utilis';

// TypeScript Interfaces
interface ProductVariant {
    id: string;
    title: string;
    price: number;
    availableForSale: boolean;
}

interface Product {
    id: string;
    name: string;
    handle: string;
    price: number;
    originalPrice?: number;
    image: string;
    description?: string;
    badge?: string;
    badgeColor?: string;
    variants?: ProductVariant[];
}

interface Collection {
    id: string;
    name: string;
    description?: string;
    handle: string;
    image?: string;
    imageAlt?: string;
    link: string;
    products: Product[];
}

// Star Rating Mini Component
const StarRatingMini = ({ rating = 4.5 }: { rating?: number }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill={star <= Math.round(rating) ? '#2F8C6E' : '#E5E7EB'}
                    stroke={star <= Math.round(rating) ? '#2F8C6E' : '#E5E7EB'}
                    strokeWidth="1"
                />
            </svg>
        ))}
    </div>
);

export default function CollectionDetailPage() {
    const params = useParams();
    const [showFiltersSidebar, setShowFiltersSidebar] = useState(false);
    const [sortBy, setSortBy] = useState('popular');
    const { cartItems, addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const [collection, setCollection] = useState<Collection | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number | typeof Infinity]>([0, Infinity]);

    const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    const collectionHandle = params?.type as string;

    // Fetch collection and products from Shopify
    useEffect(() => {
        async function fetchCollectionData() {
            try {
                setLoading(true);
                setError(null);
                const collectionData = await getCollection(collectionHandle);
                if (collectionData) {
                    setCollection(collectionData as Collection);
                    setProducts((collectionData as Collection).products || []);
                } else {
                    setError('Collection not found');
                }
            } catch (err) {
                console.error('Error fetching collection:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }
        if (collectionHandle) {
            fetchCollectionData();
        }
    }, [collectionHandle]);

    // Filter products by price range
    const filteredProducts = products.filter((product: Product) => {
        const price = product.price;
        return price >= priceRange[0] && (priceRange[1] === Infinity || price <= priceRange[1]);
    });

    // Handle add to cart
    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();
        const variantId = product.variants?.[0]?.id;
        if (!variantId) {
            alert('This product is currently unavailable');
            return;
        }
        addToCart({
            id: product.id,
            variantId,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            handle: product.handle,
            variants: product.variants,
        });
    };

    // Handle wishlist toggle
    const toggleWishlist = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();
        const productId = product.id.toString();
        const variantId = product.variants?.[0]?.id || product.id;
        if (isInWishlist(productId)) {
            removeFromWishlist(productId);
        } else {
            addToWishlist({
                id: productId,
                variantId,
                name: product.name,
                price: product.price,
                image: product.image,
                handle: product.handle,
            });
        }
    };

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') return b.id.localeCompare(a.id);
        return 0;
    });

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        document.body.style.overflow = showFiltersSidebar ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [showFiltersSidebar]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#244033] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading collection...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <Link href="/collections" className="text-[#244033] underline">Back to Collections</Link>
                </div>
            </div>
        );
    }

    // Collection not found
    if (!collection) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Collection not found</p>
                    <Link href="/collections" className="text-[#244033] underline">Back to Collections</Link>
                </div>
            </div>
        );
    }

    const maxProductPrice = products.length > 0
        ? Math.ceil(Math.max(...products.map((p: Product) => p.price)) / 100) * 100
        : 100000;

    return (
        <div className={`flex flex-col min-h-screen ${totalItems > 0 ? 'pb-20' : ''}`}>
            <main className="flex-1 bg-white py-8 md:py-12 lg:py-16">
                <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-24">

                    {/* BREADCRUMBS */}
                    <div className="py-4">
                        <nav className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                            <Link href="/" className="hover:text-[#007B57]">Home</Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href="/collections" className="hover:text-[#007B57]">Collections</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-[#007B57] font-medium">{collection.name}</span>
                        </nav>
                    </div>

                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-sans font-light text-[#007B57] mb-4">
                            {collection.name}
                        </h1>
                        <p className="text-gray-600 text-base md:text-lg max-w-xl">
                            {collection.description || `Explore our ${collection.name} collection`}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            {products.length} product{products.length !== 1 ? 's' : ''} in this collection
                        </p>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                        <button
                            onClick={() => setShowFiltersSidebar(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 border border-[#007B57] rounded-md text-[#007B57] hover:bg-[#007B57] hover:text-white transition-colors font-medium"
                        >
                            <Filter size={20} />
                            Filter and sort
                        </button>
                        <span className="text-gray-600 font-medium">
                            {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
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
                    <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${showFiltersSidebar ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>

                        {/* Sidebar Header */}
                        <div className="bg-gradient-to-r from-[#244033] to-[#007B57] p-6 flex items-center justify-between flex-shrink-0">
                            <div>
                                <h2 className="text-xl font-semibold text-white">Filters & Sort</h2>
                                <p className="text-sm text-white/80 mt-1">Customize your search</p>
                            </div>
                            <button
                                onClick={() => setShowFiltersSidebar(false)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Sidebar Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">

                            {/* Sort By */}
                            <div className="bg-white rounded-xl p-5 shadow-sm">
                                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#244033] rounded-full" />
                                    Sort by
                                </h3>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#244033] focus:border-transparent bg-white text-gray-900 font-medium cursor-pointer"
                                >
                                    <option value="popular">✨ Featured</option>
                                    <option value="newest">🆕 Newest First</option>
                                    <option value="price-low">💰 Price: Low to High</option>
                                    <option value="price-high">💎 Price: High to Low</option>
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="bg-white rounded-xl p-5 shadow-sm">
                                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#244033] rounded-full" />
                                    Price Range
                                </h3>

                                <div className="bg-gradient-to-r from-[#244033]/5 to-[#007B57]/5 rounded-lg p-4 mb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-center flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Minimum</p>
                                            <p className="text-lg font-bold text-[#244033]">₹{priceRange[0]}</p>
                                        </div>
                                        <div className="w-px h-8 bg-gray-300 mx-3" />
                                        <div className="text-center flex-1">
                                            <p className="text-xs text-gray-500 mb-1">Maximum</p>
                                            <p className="text-lg font-bold text-[#244033]">
                                                {priceRange[1] === Infinity ? '∞' : `₹${priceRange[1]}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs font-medium text-gray-600">Min Price</label>
                                            <span className="text-xs text-[#244033] font-semibold">₹{priceRange[0]}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max={maxProductPrice}
                                            step="100"
                                            value={priceRange[0]}
                                            onChange={(e) => {
                                                const newMin = parseInt(e.target.value);
                                                if (priceRange[1] === Infinity || newMin <= priceRange[1]) {
                                                    setPriceRange([newMin, priceRange[1]]);
                                                }
                                            }}
                                            className="w-full h-2 bg-gradient-to-r from-[#244033] to-[#007B57] rounded-full appearance-none cursor-pointer slider-thumb"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs font-medium text-gray-600">Max Price</label>
                                            <span className="text-xs text-[#244033] font-semibold">
                                                {priceRange[1] === Infinity ? '∞' : `₹${priceRange[1]}`}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max={maxProductPrice}
                                            step="100"
                                            value={priceRange[1] === Infinity ? maxProductPrice : priceRange[1]}
                                            onChange={(e) => {
                                                const newMax = parseInt(e.target.value);
                                                if (newMax >= priceRange[0]) {
                                                    setPriceRange([priceRange[0], newMax]);
                                                }
                                            }}
                                            className="w-full h-2 bg-gradient-to-r from-[#244033] to-[#007B57] rounded-full appearance-none cursor-pointer slider-thumb"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Active Filters Count */}
                            <div className="bg-[#244033]/5 rounded-lg p-4 border border-[#244033]/10">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold text-[#244033]">{filteredProducts.length}</span> products match your filters
                                </p>
                            </div>
                        </div>

                        {/* Sidebar Footer */}
                        <div className="bg-white border-t border-gray-200 p-6 flex gap-3 flex-shrink-0">
                            <button
                                onClick={() => { setPriceRange([0, Infinity]); setSortBy('popular'); }}
                                className="flex-1 text-center px-6 py-3 border-2 border-[#244033] rounded-lg text-[#244033] hover:bg-[#244033]/5 font-semibold transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setShowFiltersSidebar(false)}
                                className="flex-1 bg-[#244033] text-white font-semibold rounded-lg hover:bg-[#007B57] transition-colors py-3 shadow-lg"
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    {/* Custom Slider Styles */}
                    <style jsx>{`
                        .slider-thumb::-webkit-slider-thumb {
                            appearance: none;
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            background: white;
                            border: 3px solid #244033;
                            cursor: pointer;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                            transition: all 0.2s ease;
                        }
                        .slider-thumb::-webkit-slider-thumb:hover {
                            transform: scale(1.1);
                            box-shadow: 0 3px 6px rgba(0,0,0,0.3);
                        }
                        .slider-thumb::-moz-range-thumb {
                            width: 20px;
                            height: 20px;
                            border-radius: 50%;
                            background: white;
                            border: 3px solid #244033;
                            cursor: pointer;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                            transition: all 0.2s ease;
                        }
                        .slider-thumb::-moz-range-thumb:hover {
                            transform: scale(1.1);
                            box-shadow: 0 3px 6px rgba(0,0,0,0.3);
                        }
                    `}</style>

                    {/* Products Grid */}
                    <div className="w-full">
                        {sortedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 xl:gap-10">
                                {sortedProducts.map((product: Product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.handle}`}
                                        className="group block"
                                    >
                                        {/* Image Container */}
                                        <div className="relative overflow-hidden bg-gray-50 aspect-[3/4] mb-3">

                                            {/* Badge */}
                                            {product.badge && (
                                                <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-[#2BBFA4] text-white px-3 py-1 text-xs font-medium rounded-full shadow-sm">
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                    {product.badge}
                                                </div>
                                            )}

                                            {/* Wishlist — fades in on hover */}
                                            <button
                                                onClick={(e) => toggleWishlist(e, product)}
                                                className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            >
                                                <Heart
                                                    size={15}
                                                    className={isInWishlist(product.id.toString()) ? 'fill-red-500 text-red-500' : 'text-gray-500'}
                                                />
                                            </button>

                                            {/* Desktop: slide-up Quick Add bar */}
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="hidden md:flex absolute bottom-3 left-3 right-3 z-10 bg-[#007B57] text-white py-2.5 text-sm font-medium hover:bg-[#009A7B] items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                                            >
                                                <ShoppingCart size={14} /> Quick Add
                                            </button>

                                            {/* Mobile: circular button */}
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="absolute bottom-3 right-3 z-10 w-9 h-9 bg-[#007B57] text-white rounded-full flex items-center justify-center md:hidden"
                                            >
                                                <ShoppingCart size={14} />
                                            </button>

                                            {/* Product Image */}
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>

                                        {/* Info below image */}
                                        <div className="space-y-1.5">
                                            <h3 className={`text-sm md:text-base font-normal leading-snug ${product.originalPrice ? 'text-[#2F8C6E]' : 'text-gray-900'}`}>
                                                {product.name}
                                            </h3>

                                            {product.description && (
                                                <p className="text-xs text-gray-400 italic leading-tight line-clamp-1">
                                                    {product.description}
                                                </p>
                                            )}

                                            <StarRatingMini rating={4.5} />

                                            <div className="flex items-center gap-2 pt-0.5">
                                                <span className={`text-sm font-medium ${product.originalPrice ? 'text-[#2F8C6E]' : 'text-gray-900'}`}>
                                                    {product.originalPrice ? `Rs. ${product.price}` : `Rs. ${product.price}`}
                                                </span>
                                                {product.originalPrice && (
                                                    <span className="text-xs text-gray-400 line-through">
                                                        Rs. {product.originalPrice}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-gray-600 text-lg mb-4">No products match your filters.</p>
                                <p className="text-sm text-gray-500 mb-4">Try adjusting your price range or clearing filters.</p>
                                <button
                                    onClick={() => { setPriceRange([0, Infinity]); setSortBy('popular'); }}
                                    className="text-[#244033] hover:text-[#007B57] font-semibold underline"
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
                <div className="fixed z-40 bg-[#F0F4F1] border-t border-gray-200 shadow-lg bottom-[70px] left-3 right-3 sm:bottom-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px] sm:rounded-t-[20px] sm:rounded-b-none p-5 rounded-[20px] sm:p-4 sm:rounded-[16px]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#244033] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                                {totalItems}
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
                                <p className="font-semibold">Rs. {totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                        <Link
                            href="/cart"
                            className="bg-[#244033] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#007B57] transition"
                        >
                            View Cart
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}