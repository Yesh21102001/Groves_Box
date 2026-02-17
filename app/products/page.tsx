// Product Page
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft, Filter, X, Heart, ShoppingCart, ChevronRight } from 'lucide-react';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';
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
    variants?: any[];
    variantId?: string;
}

function ProductsPageContent() {
    const searchParams = useSearchParams();
    const filterParam = searchParams.get('filter');

    const [showFiltersSidebar, setShowFiltersSidebar] = useState(false);
    const [sortBy, setSortBy] = useState('popular');
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToCart, cartItems } = useCart();

    const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

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

    // Star Rating mini component
    const StarRatingMini = ({ rating = 4, count = 0 }: { rating?: number; count?: number }) => (
        <div className="flex items-center gap-1.5">
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
            {count > 0 && (
                <span className="text-xs text-gray-500">{count} review{count !== 1 ? 's' : ''}</span>
            )}
        </div>
    );


    // Product Card Component
    const ProductCard = ({ product }: { product: Product }) => {
        const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
        const wishlisted = isInWishlist(product.id.toString());
        const isOnSale = !!product.originalPrice;

        return (
            <div className="group">
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
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (wishlisted) {
                                removeFromWishlist(product.id.toString());
                            } else {
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
                        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                        <Heart size={15} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
                    </button>

                    {/* Desktop: slide-up Quick Add bar */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                        }}
                        className="hidden md:flex absolute bottom-3 left-3 right-3 z-10 bg-[#007B57] text-white py-2.5 text-sm font-medium hover:bg-[#009A7B] items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                    >
                        <ShoppingCart size={14} /> Quick Add
                    </button>

                    {/* Mobile: circular button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                        }}
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
                    <h3 className={`text-sm md:text-base font-normal leading-snug ${isOnSale ? 'text-[#2F8C6E]' : 'text-gray-900'}`}>
                        {product.name}
                    </h3>

                    {product.description && (
                        <p className="text-xs text-gray-400 italic leading-tight line-clamp-1">
                            {product.description}
                        </p>
                    )}

                    <StarRatingMini rating={4.5} count={0} />

                    <div className="flex items-center gap-2 pt-0.5">
                        <span className={`text-sm font-medium ${isOnSale ? 'text-[#2F8C6E]' : 'text-gray-900'}`}>
                            {isOnSale ? ` Rs. ${product.price}` : `Rs. ${product.price}`}
                        </span>
                        {isOnSale && (
                            <span className="text-xs text-gray-400 line-through">Rs. {product.originalPrice}</span>
                        )}
                    </div>
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
                    <div className="w-16 h-16 border-4 border-[#007B57] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
                        className="bg-[#007B57] text-white px-6 py-3 rounded"
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
                    <div className="max-w-[1600px] mx-auto">
                        {/* BREADCRUMBS */}
                        <div className="py-4">
                            <nav className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                <Link href="/" className="hover:text-[#007B57]">
                                    Home
                                </Link>
                                <ChevronRight className="w-4 h-4" />
                                <Link href="/products" className="hover:text-[#007B57]">
                                    Products
                                </Link>
                                {filterParam && (
                                    <>
                                        <ChevronRight className="w-4 h-4" />
                                        <span className="text-[#007B57] font-medium">{getPageTitle()}</span>
                                    </>
                                )}
                            </nav>
                        </div>

                        {/* Header */}
                        <div className="mb-12 md:mb-16">
                            <h1 className="text-2xl md:text-3xl lg:text-3xl 2xl:text-4xl font-lexend font-semibold text-[#007B57] mb-4">
                                {getPageTitle()}
                            </h1>

                            <p className="text-gray-600 text-base md:text-l lg:text-l">
                                {getPageDescription()}
                            </p>

                            {/* Show "View All Products" link when filtering */}
                            {filterParam && (
                                <Link
                                    href="/products"
                                    className="inline-block mt-4 text-[#007B57] hover:text-[#007B57] font-medium underline"
                                >
                                    View All Products
                                </Link>
                            )}
                        </div>

                        <div className="mb-8">
                            <button
                                onClick={() => setShowFiltersSidebar(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 border border-[#007B57] rounded-md text-[#007B57] hover:bg-[#007B57] hover:text-white transition font-medium"
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
                            className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${showFiltersSidebar ? 'translate-x-0' : 'translate-x-full'
                                } flex flex-col`}
                        >
                            {/* Sidebar Header */}
                            <div className="bg-gradient-to-r from-[#007B57] to-[#007B57] p-6 flex items-center justify-between flex-shrink-0">
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
                                        <span className="w-1.5 h-1.5 bg-[#007B57] rounded-full"></span>
                                        Sort by
                                    </h3>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#007B57] focus:border-transparent bg-white text-gray-900 font-medium cursor-pointer"
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
                                        <span className="w-1.5 h-1.5 bg-[#007B57] rounded-full"></span>
                                        Price Range
                                    </h3>

                                    {/* Price Range Display */}
                                    <div className="bg-gradient-to-r from-[#007B57]/5 to-[#007B57]/5 rounded-lg p-4 mb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-center flex-1">
                                                <p className="text-xs text-gray-500 mb-1">Minimum</p>
                                                <p className="text-lg font-bold text-[#007B57]">₹{priceRange[0]}</p>
                                            </div>
                                            <div className="w-px h-8 bg-gray-300 mx-3"></div>
                                            <div className="text-center flex-1">
                                                <p className="text-xs text-gray-500 mb-1">Maximum</p>
                                                <p className="text-lg font-bold text-[#007B57]">₹{priceRange[1]}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dual Range Slider */}
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-medium text-gray-600">Min Price</label>
                                                <span className="text-xs text-[#007B57] font-semibold">₹{priceRange[0]}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max={products.length > 0 ? Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100 : 500}
                                                step="100"
                                                value={priceRange[0]}
                                                onChange={(e) => {
                                                    const newMin = parseInt(e.target.value);
                                                    if (newMin <= priceRange[1]) {
                                                        setPriceRange([newMin, priceRange[1]]);
                                                    }
                                                }}
                                                className="w-full h-2 bg-gradient-to-r from-[#007B57] to-[#007B57] rounded-full appearance-none cursor-pointer slider-thumb"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-medium text-gray-600">Max Price</label>
                                                <span className="text-xs text-[#007B57] font-semibold">₹{priceRange[1]}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max={products.length > 0 ? Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100 : 500}
                                                step="100"
                                                value={priceRange[1]}
                                                onChange={(e) => {
                                                    const newMax = parseInt(e.target.value);
                                                    if (newMax >= priceRange[0]) {
                                                        setPriceRange([priceRange[0], newMax]);
                                                    }
                                                }}
                                                className="w-full h-2 bg-gradient-to-r from-[#007B57] to-[#007B57] rounded-full appearance-none cursor-pointer slider-thumb"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Active Filters Count */}
                                <div className="bg-[#007B57]/5 rounded-lg p-4 border border-[#007B57]/10">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold text-[#007B57]">{filteredProducts.length}</span> products match your filters
                                    </p>
                                </div>
                            </div>

                            {/* Sidebar Footer */}
                            <div className="bg-white border-t border-gray-200 p-6 flex gap-3 flex-shrink-0">
                                <button
                                    onClick={() => {
                                        const maxPrice = products.length > 0 ? Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100 : 500;
                                        setPriceRange([0, maxPrice]);
                                        setSortBy('popular');
                                    }}
                                    className="flex-1 text-center px-6 py-3 border-2 border-[#007B57] rounded-lg text-[#007B57] hover:bg-[#007B57]/5 font-semibold transition-colors"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={() => setShowFiltersSidebar(false)}
                                    className="flex-1 bg-[#007B57] text-white font-semibold rounded-lg hover:bg-[#007B57] transition-colors py-3 shadow-lg"
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
                                border: 3px solid #007B57;
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
                                border: 3px solid #007B57;
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
                                <div className="bg-[#007B57] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
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
                                className="bg-[#007B57] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#007B57] transition"
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

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#007B57] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        }>
            <ProductsPageContent />
        </Suspense>
    );
}