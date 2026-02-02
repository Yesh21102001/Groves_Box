'use client';

import React, { useState } from 'react';
import { ChevronLeft, Trash2, Minus, Plus, AlertCircle, Package } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../Navbar';

export default function CartPage() {
    const [isGift, setIsGift] = useState(false);
    const [cartItems, setCartItems] = useState([
        {
            id: '1',
            name: 'Money Tree Plant',
            price: 59,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop',
            size: 'Medium (16"-19" tall)',
            variant: 'Isabella (6.25" wide) / White',
        },
    ]);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 79 ? 0 : 15;
    const freeShippingThreshold = 79;
    const amountUntilFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    const estimatedTotal = subtotal + shipping;
    const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

    const updateQuantity = (id, change) => {
        setCartItems(
            cartItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                {/* Back Button */}
                <Link 
                    href="/collections" 
                    className="inline-flex items-center text-gray-600 hover:text-teal-600 transition-colors mb-6 group"
                >
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Continue Shopping</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Cart Items */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl lg:text-4xl font-sans text-gray-900">Shopping Cart</h1>
                            <span className="text-sm text-gray-500">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
                        </div>

                        {/* Gift Option */}
                        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    id="gift"
                                    checked={isGift}
                                    onChange={(e) => setIsGift(e.target.checked)}
                                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:ring-offset-0"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                    This order is a gift
                                </span>
                                <Package className="w-4 h-4 ml-2 text-gray-400" />
                            </label>
                        </div>

                        {/* Cold Weather Notice */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                            <div className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-blue-900 font-medium mb-1">Cold Weather Protection</p>
                                    <p className="text-sm text-blue-800">
                                        A $5 surcharge applies for special packaging to protect your plants during cold weather transit.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex gap-6">
                                        {/* Product Image */}
                                        <div className="w-28 h-28 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-grow flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                                                    <p className="text-sm text-gray-600 mb-1">{item.size}</p>
                                                    <p className="text-sm text-gray-500">{item.variant}</p>
                                                </div>
                                                <span className="text-xl font-semibold text-gray-900">${item.price}</span>
                                            </div>

                                            {/* Quantity and Remove */}
                                            <div className="flex items-center justify-between mt-auto pt-4">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Remove
                                                </button>

                                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    <span className="px-6 py-2 text-sm font-medium text-gray-900 border-x border-gray-300 min-w-[4rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recommendations */}
                        <div className="mt-12">
                            <h2 className="text-2xl font-sans text-gray-900 mb-2">You Might Also Like</h2>
                            <p className="text-gray-600 mb-6">
                                Complete your plant collection with these essentials
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { id: 1, badge: 'Best Seller', badgeColor: 'bg-teal-600', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop', name: 'Plant Food & Nutrients', price: 29 },
                                    { id: 2, badge: 'New', badgeColor: 'bg-purple-600', image: 'https://images.unsplash.com/photo-1606115915090-be18fea23ec7?w=400&h=400&fit=crop', name: 'Decorative Planter', price: 39 },
                                    { id: 3, badge: null, badgeColor: null, image: 'https://images.unsplash.com/photo-1591958911259-bee2173bdccc?w=400&h=400&fit=crop', name: 'Garden Tool Set', price: 24 }
                                ].map((product) => (
                                    <div 
                                        key={product.id}
                                        className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                                    >
                                        {product.badge && (
                                            <span className={`absolute top-3 left-3 ${product.badgeColor} text-white text-xs font-medium px-3 py-1 rounded-full z-10`}>
                                                {product.badge}
                                            </span>
                                        )}
                                        <div className="aspect-square bg-gray-100 overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                                            <p className="text-teal-600 font-semibold mt-1">${product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:sticky lg:top-8">
                            <h2 className="text-xl font-sans text-gray-900 mb-6">Order Summary</h2>

                            {/* Free Shipping Progress */}
                            {amountUntilFreeShipping > 0 ? (
                                <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                                    <p className="text-sm text-gray-700 mb-3">
                                        Add <span className="font-bold text-teal-700">${amountUntilFreeShipping}</span> more for free shipping!
                                    </p>
                                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-500 ease-out"
                                            style={{ width: `${shippingProgress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-600">${subtotal}</span>
                                        <span className="text-xs font-semibold text-teal-700">$79 Free Shipping</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        You've qualified for free shipping!
                                    </p>
                                </div>
                            )}

                            {/* Price Breakdown */}
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    {shipping === 0 ? (
                                        <span className="font-medium text-green-600">FREE</span>
                                    ) : (
                                        <span className="font-medium text-gray-900">${shipping.toFixed(2)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Taxes</span>
                                    <span className="text-gray-500">Calculated at checkout</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-gray-900">${estimatedTotal.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Final amount calculated at checkout
                                </p>
                            </div>

                            {/* Checkout Button */}
                            <Link 
                                href="/checkout" 
                                className="block w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 rounded-lg transition-colors text-center shadow-sm hover:shadow-md"
                            >
                                Proceed to Checkout
                            </Link>

                            {/* Security Badge */}
                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <span>Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}