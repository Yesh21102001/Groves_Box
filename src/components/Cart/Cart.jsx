'use client';

import React, { useState } from 'react';
import { ChevronLeft, Gift, Trash2, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../Navbar';
import Footer from '../Footer';

export default function CartPage() {
    const [isGift, setIsGift] = useState(false);
    const [cartItems, setCartItems] = useState([
        {
            id: '1',
            name: 'Money Tree Plant',
            price: 59,
            quantity: 1,
            image: '/images/White_arch.webp',
            size: 'Medium (16"-19" tall) / Isabella (6.25" wide)',
            variant: 'White',
        },
    ]);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 15;
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
        <div>
            <Navbar />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back to shopping link */}
                    <Link href="/collections" className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-8">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Continue Shopping</span>
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Cart Items */}
                        <div className="lg:col-span-2">
                            <h1 className="text-4xl font-serif mb-8">Your cart</h1>

                            {/* Gift Checkbox */}
                            <div className="flex items-center gap-3 mb-6">
                                <input
                                    type="checkbox"
                                    id="gift"
                                    checked={isGift}
                                    onChange={(e) => setIsGift(e.target.checked)}
                                    className="w-4 h-4 border-2 border-gray-300 rounded"
                                />
                                <label htmlFor="gift" className="text-base flex items-center gap-2">
                                    Is this order a gift?
                                </label>
                                <Trash2 className="w-5 h-5 text-gray-400 ml-1" />
                            </div>

                            {/* Cold Weather Notice */}
                            <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-4 mb-6 flex gap-3">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="w-8 h-8 text-cyan-600"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-700">
                                    <strong>Please Note:</strong> A $5 Cold Weather Packaging surcharge is
                                    added per eligible plant. We use special Cold Weather Packaging to
                                    protect your plant during transit.
                                </p>
                            </div>

                            {/* Cart Items */}
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-lg p-6 flex gap-4 items-start mb-4"
                                >
                                    {/* Product Image */}
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-serif mb-1">{item.name}</h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            {item.size} / {item.variant}
                                        </p>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-sm text-gray-500 underline hover:text-gray-700"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    {/* Quantity and Price */}
                                    <div className="flex flex-col items-end gap-4">
                                        <span className="text-lg font-medium">${item.price}</span>
                                        <div className="flex items-center border border-gray-300 rounded">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="px-3 py-2 hover:bg-gray-50"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="px-3 py-2 hover:bg-gray-50"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Don't Forget These Section */}
                            <div className="mt-12">
                                <h2 className="text-2xl font-serif italic mb-2">Don&apos;t Forget These!</h2>
                                <p className="text-gray-600 mb-6">
                                    Make sure you have everything you need to make your plants thrive.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Suggestion Cards */}
                                    <div className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <span className="absolute top-3 left-3 bg-teal-500 text-white text-xs px-2 py-1 rounded">
                                            Best Seller
                                        </span>
                                        <img
                                            src="/suggestion1.jpg"
                                            alt="Accessory"
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>

                                    <div className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <span className="absolute top-3 left-3 bg-teal-500 text-white text-xs px-2 py-1 rounded">
                                            New Arrival
                                        </span>
                                        <img
                                            src="/suggestion2.jpg"
                                            alt="Accessory"
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>

                                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <img
                                            src="/suggestion3.jpg"
                                            alt="Accessory"
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg p-6 sticky top-8">
                                {/* Free Shipping Progress */}
                                {amountUntilFreeShipping > 0 && (
                                    <div className="mb-6">
                                        <p className="text-sm text-gray-700 mb-3">
                                            You are <strong>${amountUntilFreeShipping}</strong> away from
                                            getting Free Shipping
                                        </p>
                                        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-teal-600 transition-all duration-300"
                                                style={{ width: `${shippingProgress}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-end mt-1">
                                            <span className="text-xs text-gray-600">${freeShippingThreshold}</span>
                                        </div>
                                        <div className="flex justify-end mt-1">
                                            <span className="text-xs font-medium text-gray-700">
                                                Free Shipping
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Order Summary */}
                                <h2 className="text-xl font-serif mb-4">Order Summary</h2>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">Subtotal</span>
                                        <span className="font-medium">${subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">Shipping</span>
                                        <span className="font-medium">${shipping}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">Taxes</span>
                                        <span className="font-medium">TBD</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-serif">Estimated Total</span>
                                        <span className="text-2xl font-medium">${estimatedTotal}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Taxes and discounts calculated at checkout
                                    </p>
                                </div>

                                {/* Checkout Button */}
                                <Link href="/checkout" className="inline-block w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-4 rounded-lg transition-colors text-center">
                                    Proceed To Secure Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Widget */}
                <button className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-full shadow-lg hover:bg-gray-800 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                    <span className="text-sm font-medium">Chat with us</span>
                </button>
            </div>
            <Footer />
        </div>
    );
}