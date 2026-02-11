'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Trash2, Minus, Plus, AlertCircle, Package, Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { getProducts } from "../../lib/shopify_utilis";

export default function CartPage() {
    const [isGift, setIsGift] = useState(false);
    const [products, setProducts] = useState([]);

    // ✅ Use unified CartContext
    const {
        cartItems,
        loading,
        updateQuantity,
        removeFromCart,
        addToCart,
        checkoutUrl
    } = useCart();

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 79 ? 0 : 15;
    const freeShippingThreshold = 79;
    const amountUntilFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    const estimatedTotal = subtotal + shipping;
    const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

    // Load recommended products
    useEffect(() => {
        async function loadProducts() {
            try {
                const productsData = await getProducts(8);
                setProducts(productsData);
            } catch (error) {
                console.error('Error loading products:', error);
            }
        }
        loadProducts();
    }, []);

    const increaseQty = (lineId, currentQty) => {
        updateQuantity(lineId, currentQty + 1);
    };

    const decreaseQty = (lineId, currentQty) => {
        updateQuantity(lineId, currentQty - 1);
    };

    const removeItem = (lineId) => {
        removeFromCart(lineId);
    };

    const handleAddToCart = (product) => {
        const variantId = product.variants && product.variants.length > 0
            ? product.variants[0].id
            : null;

        if (!variantId) {
            console.error('No variant found for product:', product);
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

    // Recommended products (filter out items already in cart)
    const recommendedProducts = products
        .filter(product => !cartItems.some(cartItem => cartItem.name === product.name))
        .slice(0, 4)
        .map(product => ({
            ...product,
            badge: product.price < 50 ? 'Best Seller' : product.rating >= 4.8 ? 'Top Rated' : undefined,
            badgeColor: product.price < 50 ? 'bg-gray-800' : product.rating >= 4.8 ? 'bg-green-600' : undefined,
        }));

    // Product Card Component
    const ProductCard = ({ product }) => {
        const [isWishlisted, setIsWishlisted] = useState(false);

        const handleAddToCart = (e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image,
            });
        };

        return (
            <Link href={`/products/${product.handle}`} className="group block">
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-3">
                    {/* Badge */}
                    {product.badge && (
                        <div
                            className={`absolute top-2 left-2 z-10 ${product.badgeColor} text-white px-2 py-0.5 text-[10px] sm:text-xs rounded-full font-medium`}
                        >
                            {product.badge}
                        </div>
                    )}

                    {/* Wishlist Icon - Top Right */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsWishlisted(!isWishlisted);
                        }}
                        className="absolute top-2 right-2 z-10 w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center shadow hover:bg-[#244033] hover:text-white transition"
                    >
                        <Heart
                            size={16}
                            className={`sm:w-[18px] sm:h-[18px] ${isWishlisted ? "fill-current text-red-500" : ""}`}
                        />
                    </button>

                    {/* Quick Add Button */}
                    {/* Mobile: Small circular button bottom-right, always visible */}
                    <button
                        onClick={handleAddToCart}
                        className="absolute bottom-2 right-2 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition active:scale-95 md:hidden"
                    >
                        <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>

                    {/* Desktop: Full button at bottom on hover */}
                    <button
                        onClick={handleAddToCart}
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
                <h3 className="text-xs sm:text-sm md:text-base font-sans font-light text-gray-900 mb-1 line-clamp-1">
                    {product.name}
                </h3>

                <p className="text-[10px] sm:text-xs md:text-sm italic text-gray-500 mb-1.5 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <span className="font-medium text-gray-900">
                        {product.price}
                    </span>

                    {product.originalPrice && (
                        <span className="text-gray-400 line-through text-[10px] sm:text-xs">
                            {product.originalPrice}
                        </span>
                    )}
                </div>
            </Link>
        );
    };

    // Loading state
    if (loading) {
        return (
            <div className="bg-[#F0F4F1] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#244033] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading cart...</p>
                </div>
            </div>
        );
    }

    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <div className="bg-[#F0F4F1] min-h-screen">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
                    <div className="text-center py-16">
                        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add some plants to get started!</p>
                        <Link
                            href="/products"
                            className="inline-block bg-[#244033] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2F4F3E] transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F0F4F1] min-h-screen">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
                {/* Back Button */}
                <Link
                    href="/products"
                    className="inline-flex items-center text-gray-600 hover:text-[#244033] transition-colors mb-4 sm:mb-6 group active:scale-95"
                >
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs sm:text-sm font-medium">Continue Shopping</span>
                </Link>

                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                    {/* Left Column - Cart Items */}
                    <div className="lg:col-span-8 order-1">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans text-[#2F4F3E]">Shopping Cart</h1>
                            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap ml-2">
                                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>

                        {/* Cold Weather Notice */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                            <div className="flex gap-2 sm:gap-3">
                                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs sm:text-sm text-blue-900 font-medium mb-0.5 sm:mb-1">Cold Weather Protection</p>
                                    <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                                        A 50 surcharge applies for special packaging to protect your plants during cold weather transit.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-3 sm:space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex gap-3 sm:gap-4 md:gap-6">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-grow flex flex-col min-w-0">
                                            <div className="flex justify-between items-start mb-2 gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2F4F3E] mb-1 line-clamp-2">
                                                        {item.name}
                                                    </h3>
                                                    {item.size && (
                                                        <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1 line-clamp-1">
                                                            {item.size}
                                                        </p>
                                                    )}
                                                    {item.variant && item.variant !== 'Default Title' && (
                                                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">
                                                            {item.variant}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="text-base sm:text-lg md:text-xl font-semibold text-[#2F4F3E] flex-shrink-0">
                                                    {item.price.toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Quantity and Remove */}
                                            <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 gap-2">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium transition-colors active:scale-95"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    <span className="hidden xs:inline">Remove</span>
                                                </button>

                                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => decreaseQty(item.id, item.quantity)}
                                                        className="px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                                                    </button>
                                                    <span className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-900 border-x border-gray-300 min-w-[3rem] sm:min-w-[3.5rem] md:min-w-[4rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => increaseQty(item.id, item.quantity)}
                                                        className="px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                                                    >
                                                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recommendations - Desktop Only */}
                        {recommendedProducts.length > 0 && (
                            <div className="mt-8 sm:mt-10 md:mt-12 hidden lg:block">
                                <h2 className="text-xl sm:text-2xl font-sans text-[#2F4F3E] mb-1 sm:mb-2">You Might Also Like</h2>
                                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                    Complete your plant collection with these essentials
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                                    {recommendedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-4 order-2">
                        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 lg:sticky lg:top-8">
                            <h2 className="text-lg sm:text-xl font-sans text-[#2F4F3E] mb-4 sm:mb-6">Order Summary</h2>

                            {/* Free Shipping Progress */}
                            {amountUntilFreeShipping > 0 ? (
                                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">
                                        Add <span className="font-bold text-[#244033]">{amountUntilFreeShipping.toFixed(2)}</span> more for free shipping!
                                    </p>
                                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#244033] to-[#2F4F3E] transition-all duration-500 ease-out"
                                            style={{ width: `${shippingProgress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-1.5 sm:mt-2">
                                        <span className="text-[10px] sm:text-xs text-gray-600">{subtotal.toFixed(2)}</span>
                                        <span className="text-[10px] sm:text-xs font-semibold text-[#244033]">79 Free Shipping</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-xs sm:text-sm font-medium text-green-800 flex items-center gap-2">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        You've qualified for free shipping!
                                    </p>
                                </div>
                            )}

                            {/* Price Breakdown */}
                            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    {shipping === 0 ? (
                                        <span className="font-medium text-green-600">FREE</span>
                                    ) : (
                                        <span className="font-medium text-gray-900">{shipping.toFixed(2)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <span className="text-gray-600">Taxes</span>
                                    <span className="text-gray-500 text-xs">Calculated at checkout</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t border-gray-200 pt-3 sm:pt-4 mb-4 sm:mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-base sm:text-lg font-semibold text-[#244033]">Total</span>
                                    <span className="text-xl sm:text-2xl font-bold text-[#244033]">{estimatedTotal.toFixed(2)}</span>
                                </div>
                                <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2">
                                    Final amount calculated at checkout
                                </p>
                            </div>

                            {/* Checkout Button */}
                            <Link
                                href="/checkout"
                                className="block w-full bg-[#244033] text-white font-semibold py-3 sm:py-3.5 md:py-4 rounded-lg hover:bg-[#2F4F3E] transition-all text-center text-sm sm:text-base shadow-sm hover:shadow-md active:scale-[0.98] touch-manipulation"
                            >
                                Proceed to Checkout
                            </Link>

                            {/* Security Badge */}
                            <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <span>Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommendations - Mobile Only (appears after Order Summary) */}
                {recommendedProducts.length > 0 && (
                    <div className="mt-8 sm:mt-10 lg:hidden order-3">
                        <h2 className="text-xl sm:text-2xl font-sans text-gray-900 mb-1 sm:mb-2">You Might Also Like</h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                            Complete your plant collection with these essentials
                        </p>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {recommendedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}