// Product Page
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Filter, X, Heart, ShoppingCart, ChevronRight } from 'lucide-react';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext'; // ← ADD THIS
import { getProducts, getNewArrivals, getProductsByTag, getProductsByCollection } from '@/src/lib/shopify_utilis';
import { useSearchParams } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    image: string;
    badge?: string;
    badgeColor?: string;
    handle: string;
    tags?: string[];
    variants?: any[]; // ← ADD THIS
    variantId?: string; // ← ADD THIS
}

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const filterParam = searchParams.get('filter');

    const [showFiltersSidebar, setShowFiltersSidebar] = useState(false);
    const [sortBy, setSortBy] = useState('popular');
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToCart, cartItems } = useCart();

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Determine page title based on filter
    const getPageTitle = () => {
        switch (filterParam) {
            case 'new':
                return 'New Arrivals';
            case 'bestseller':
                return 'Best Sellers';
            case 'sale':
                return 'On Sale';
            case 'rare':
                return 'Rare Plants';
            default:
                return 'All Products';
        }
    };

    // Determine page description based on filter
    const getPageDescription = () => {
        switch (filterParam) {
            case 'new':
                return 'Check out our latest additions to the collection.';
            case 'bestseller':
                return 'Our most popular plants, loved by plant parents everywhere.';
            case 'on-sale':
                return 'Great deals on beautiful plants.';
            case 'rare':
                return 'Unique and hard-to-find plants for collectors.';
            default:
                return 'Explore our complete collection of beautiful plants and find your favorites.';
        }
    };

    // Fetch products from Shopify based on filter
    useEffect(() => {
        async function fetchAllProducts() {
            try {
                setLoading(true);
                setError(null);

                let productsData;

                // Fetch based on filter type
                switch (filterParam) {
                    case 'new':
                        productsData = await getProductsByCollection('new-arrivals', 100);
                        break;

                    case 'bestseller':
                        productsData = await getProductsByCollection('best-sellers', 100);
                        break;

                    case 'sale':
                        productsData = await getProductsByCollection('on-sale', 100);
                        break;

                    case 'rare':
                        productsData = await getProductsByCollection('rare', 100);
                        break;

                    default:
                        productsData = await getProducts(100);
                }


                setProducts(productsData);

                // Update price range based on actual products
                if (productsData.length > 0) {
                    const prices = productsData.map((p: any) => p.price);
                    const maxPrice = Math.max(...prices);
                    setPriceRange([0, Math.ceil(maxPrice / 100) * 100]);
                }

            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err instanceof Error ? err.message : 'Failed to load products');
            } finally {
                setLoading(false);
            }
        }

        fetchAllProducts();
    }, [filterParam]);

    const handleAddToCart = (product: Product) => {
        const variantId = product.variants?.[0]?.id;

        if (!variantId) {
            console.error('No variant available for product:', product);
            alert('This product is currently unavailable');
            return;
        }

        addToCart({
            id: product.id,
            variantId: variantId,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            handle: product.handle,
            variants: product.variants
        });
    };

    // Product Card Component - FIXED VERSION
    const ProductCard = ({ product }: { product: Product }) => {
        const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist(); // ← USE WISHLIST CONTEXT
        const wishlisted = isInWishlist(product.id.toString()); // ← CHECK IF IN WISHLIST

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

                    {/* Wishlist Icon - Top Right - FIXED */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (wishlisted) {
                                // Remove from wishlist
                                removeFromWishlist(product.id.toString());
                            } else {
                                // Add to wishlist
                                addToWishlist({
                                    id: product.id.toString(),
                                    variantId: product.variants?.[0]?.id || '',
                                    name: product.name,
                                    price: product.price,
                                    image: product.image,
                                    handle: product.handle,
                                    variants: product.variants
                                });
                            }
                        }}
                        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:bg-[#244033] hover:text-white transition"
                    >
                        <Heart
                            size={18}
                            className={wishlisted ? "fill-current text-red-500" : ""}
                        />
                    </button>

                    {/* Mobile: Small circular button bottom-right, always visible */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                        }}
                        className="absolute bottom-3 right-3 z-10 w-10 h-10 bg-[#244033] text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition md:hidden"
                    >
                        <ShoppingCart size={18} />
                    </button>

                    {/* Desktop: Full button at bottom on hover */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                        }}
                        className="hidden md:flex absolute bottom-3 left-3 right-3 z-10 bg-[#244033] text-white py-2.5 text-sm font-medium hover:bg-[#2F4F3E] transition items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
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
                    <span className="font-medium text-[#244033]">
                        Rs. {product.price}
                    </span>

                    {product.originalPrice && (
                        <span className="text-gray-400 line-through">
                            Rs. {product.originalPrice}
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
        if (sortBy === 'newest') {
            const aIsNew = a.tags?.some(tag => tag.toLowerCase().includes('new'));
            const bIsNew = b.tags?.some(tag => tag.toLowerCase().includes('new'));
            if (aIsNew && !bIsNew) return -1;
            if (!aIsNew && bIsNew) return 1;
            return 0;
        }
        return 0; // Default/popular - keep original order
    });

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#244033] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-[#244033] text-white px-6 py-3 rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`${totalItems > 0 ? 'pb-20' : ''}`}>
            <div className="min-h-screen bg-white py-8 md:py-12 lg:py-16">
                <div className="w-full px-4 md:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* BREADCRUMBS */}
                        <div className="py-4">
                            <nav className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                <Link href="/" className="hover:text-[#2F4F3E]">
                                    Home
                                </Link>
                                <ChevronRight className="w-4 h-4" />
                                <Link href="/products" className="hover:text-[#2F4F3E]">
                                    Products
                                </Link>
                                {filterParam && (
                                    <>
                                        <ChevronRight className="w-4 h-4" />
                                        <span className="text-[#2F4F3E] font-medium">{getPageTitle()}</span>
                                    </>
                                )}
                            </nav>
                        </div>

                        {/* Header */}
                        <div className="mb-12 md:mb-16">
                            <h1 className="text-2xl md:text-3xl lg:text-3xl 2xl:text-4xl font-lexend font-semibold text-[#2F4F3E] mb-4">
                                {getPageTitle()}
                            </h1>

                            <p className="text-gray-600 text-base md:text-l lg:text-l">
                                {getPageDescription()}
                            </p>

                            {/* Show "View All Products" link when filtering */}
                            {filterParam && (
                                <Link
                                    href="/products"
                                    className="inline-block mt-4 text-[#244033] hover:text-[#2F4F3E] font-medium underline"
                                >
                                    View All Products
                                </Link>
                            )}
                        </div>

                        <div className="mb-8">
                            <button
                                onClick={() => setShowFiltersSidebar(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 border border-[#244033] rounded-md text-[#244033] hover:bg-[#2F4F3E] hover:text-white transition font-medium"
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
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-4">Price Range</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-gray-600 block mb-2">
                                                Min: {priceRange[0]}
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max={products.length > 0 ? Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100 : 500}
                                                value={priceRange[0]}
                                                onChange={(e) =>
                                                    setPriceRange([parseInt(e.target.value), priceRange[1]])
                                                }
                                                className="w-full accent-teal-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-600 block mb-2">
                                                Max: {priceRange[1]}
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max={products.length > 0 ? Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100 : 500}
                                                value={priceRange[1]}
                                                onChange={(e) =>
                                                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                                                }
                                                className="w-full accent-teal-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Footer - Sticky */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-4">
                                <button
                                    onClick={() => {
                                        const maxPrice = products.length > 0 ? Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100 : 500;
                                        setPriceRange([0, maxPrice]);
                                    }}
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
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                                    {sortedProducts.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.handle}`}
                                            className="group"
                                        >
                                            <ProductCard product={product} />
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 lg:py-24">
                                    <p className="text-gray-600 text-lg lg:text-xl mb-4">
                                        No products found {filterParam && `in ${getPageTitle()}`}.
                                    </p>
                                    <button
                                        onClick={() => {
                                            const maxPrice = products.length > 0 ? Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100 : 500;
                                            setPriceRange([0, maxPrice]);
                                        }}
                                        className="text-teal-600 hover:text-teal-700 font-semibold"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Cart Navigator */}
                {totalItems > 0 && (
                    <div
                        className="
      fixed z-50
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
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#244033] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
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
                                className="bg-[#244033] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2F4F3E] transition"
                            >
                                View Cart
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}