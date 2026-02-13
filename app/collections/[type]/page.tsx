'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Star, Filter, X, Heart, ShoppingCart, ChevronRight } from 'lucide-react';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';
import { getCollection } from '@/src/lib/shopify_utilis';

export default function CollectionDetailPage() {
    const params = useParams();
    const [showFiltersSidebar, setShowFiltersSidebar] = useState(false);
    const [sortBy, setSortBy] = useState('popular');
    const { cartItems, addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const [collection, setCollection] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [priceRange, setPriceRange] = useState([0, Infinity]); // Show all products by default

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const collectionHandle = params?.type as string;

    // Fetch collection and products from Shopify
    useEffect(() => {
        async function fetchCollectionData() {
            try {
                setLoading(true);
                setError(null);

                const collectionData = await getCollection(collectionHandle);

                if (collectionData) {
                    setCollection(collectionData);
                    setProducts(collectionData.products || []);
                } else {
                    setError('Collection not found');
                }
            } catch (err) {
                console.error('Error fetching collection:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (collectionHandle) {
            fetchCollectionData();
        }
    }, [collectionHandle]);

    // Filter products by price range
    const filteredProducts = products.filter(product => {
        const price = product.price;
        return price >= priceRange[0] && (priceRange[1] === Infinity || price <= priceRange[1]);
    });

    // Handle add to cart
    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();

        const variantId = product.variants?.[0]?.id;

        if (!variantId) {
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

    // Handle wishlist toggle
    const toggleWishlist = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();

        const productId = product.id.toString();

        if (isInWishlist(productId)) {
            removeFromWishlist(productId);
        } else {
            addToWishlist({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                handle: product.handle,
            });
        }
    };

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
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

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#244033] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
                    <Link href="/collections" className="text-[#244033] underline">
                        Back to Collections
                    </Link>
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
                    <Link href="/collections" className="text-[#244033] underline">
                        Back to Collections
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col min-h-screen ${totalItems > 0 ? 'pb-20' : ''}`}>
            <main className="flex-1 bg-white py-8 md:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    {/* BREADCRUMBS */}
                    <div className="py-4">
                        <nav className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                            <Link href="/" className="hover:text-[#2F4F3E]">
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href="/collections" className="hover:text-[#2F4F3E]">
                                Collections
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-[#2F4F3E] font-medium">{collection.name}</span>
                        </nav>
                    </div>

                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-sans font-light text-[#2F4F3E] mb-4">
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
                            className="inline-flex items-center gap-2 px-6 py-3 border border-[#244033] rounded-md text-[#244033] hover:bg-[#244033] hover:text-white transition-colors font-medium"
                        >
                            <Filter size={20} />
                            Filter and sort
                        </button>
                        <span className="text-gray-600 font-medium">
                            {products.length} product{products.length !== 1 ? 's' : ''}
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
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Sidebar Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Sort By */}
                            <div>
                                <h3 className="text-base font-semibold text-gray-900 mb-4">Sort by</h3>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#244033] bg-white"
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
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm text-gray-600 block mb-2">
                                            Min: Rs. {priceRange[0]}
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max={products.length > 0 ? Math.max(...products.map(p => p.price)) : 100000}
                                            step="100"
                                            value={priceRange[0]}
                                            onChange={(e) => {
                                                const newMin = parseInt(e.target.value);
                                                if (priceRange[1] === Infinity || newMin <= priceRange[1]) {
                                                    setPriceRange([newMin, priceRange[1]]);
                                                }
                                            }}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#244033]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 block mb-2">
                                            Max: {priceRange[1] === Infinity ? 'No limit' : `Rs. ${priceRange[1]}`}
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max={products.length > 0 ? Math.max(...products.map(p => p.price)) : 100000}
                                            step="100"
                                            value={priceRange[1] === Infinity ? (products.length > 0 ? Math.max(...products.map(p => p.price)) : 100000) : priceRange[1]}
                                            onChange={(e) => {
                                                const newMax = parseInt(e.target.value);
                                                if (newMax >= priceRange[0]) {
                                                    setPriceRange([priceRange[0], newMax]);
                                                }
                                            }}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#244033]"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600 pt-2">
                                        <span>Rs. {priceRange[0]}</span>
                                        <span>-</span>
                                        <span>{priceRange[1] === Infinity ? 'No limit' : `Rs. ${priceRange[1]}`}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Footer */}
                        <div className="bg-white border-t border-gray-200 p-6 flex gap-4 flex-shrink-0">
                            <button
                                onClick={() => {
                                    setPriceRange([0, Infinity]);
                                    setSortBy('popular');
                                }}
                                className="flex-1 text-center px-6 py-3 border border-gray-300 rounded-md text-gray-900 hover:bg-gray-50 font-medium transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setShowFiltersSidebar(false)}
                                className="flex-1 bg-[#244033] text-white font-medium rounded-md hover:bg-[#2F4F3E] transition-colors py-3"
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
                                        href={`/products/${product.handle}`}
                                        className="group block"
                                    >
                                        <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-[3/4] mb-4">
                                            {/* Badge */}
                                            {product.badge && (
                                                <span className={`absolute top-3 left-3 z-10 px-3 py-1 text-xs font-medium rounded-full ${product.badgeColor} text-white`}>
                                                    {product.badge}
                                                </span>
                                            )}

                                            {/* Wishlist */}
                                            <button
                                                onClick={(e) => toggleWishlist(e, product)}
                                                className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:bg-[#244033] hover:text-white transition"
                                            >
                                                <Heart
                                                    size={18}
                                                    className={isInWishlist(product.id.toString()) ? "fill-current text-red-500" : ""}
                                                />
                                            </button>

                                            {/* Image */}
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            {/* DESKTOP: Quick Add */}
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="hidden md:flex absolute bottom-3 left-3 right-3 z-10 bg-[#244033] text-white py-2.5 text-sm font-medium hover:bg-[#2F4F3E] transition items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                                            >
                                                <ShoppingCart size={16} />
                                                Quick Add
                                            </button>

                                            {/* MOBILE: Cart button */}
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="md:hidden absolute bottom-3 right-3 z-10 w-10 h-10 bg-[#244033] text-white rounded-full flex items-center justify-center"
                                            >
                                                <ShoppingCart size={18} />
                                            </button>
                                        </div>

                                        {/* Product Info */}
                                        <h3 className="text-sm md:text-base font-sans font-light text-gray-900 mb-1">
                                            {product.name}
                                        </h3>

                                        {/* <p className="text-xs md:text-sm italic text-gray-500 mb-2 line-clamp-2">
                                            {product.description}
                                        </p> */}

                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-medium text-gray-900">
                                                Rs. {product.price}
                                            </span>
                                            {product.originalPrice && (
                                                <span className="text-gray-400 line-through">
                                                    Rs. {product.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-gray-600 text-lg mb-4">
                                    No products match your filters.
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Try adjusting your price range or clearing filters.
                                </p>
                                <button
                                    onClick={() => {
                                        setPriceRange([0, Infinity]);
                                        setSortBy('popular');
                                    }}
                                    className="text-[#244033] hover:text-[#2F4F3E] font-semibold underline"
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
    );
}