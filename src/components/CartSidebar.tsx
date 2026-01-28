'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/src/context/CartContext';

export default function CartSidebar() {
    const { cartItems, showCart, setShowCart, removeFromCart, updateQuantity, totalPrice } = useCart();

    return (
        <>
            {/* Overlay */}
            {showCart && (
                <div
                    className="fixed inset-0 bg-black/30 z-40"
                    onClick={() => setShowCart(false)}
                />
            )}

            {/* Cart Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-lg transform transition-transform duration-300 overflow-y-auto ${showCart ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Your Cart</h2>
                    <button
                        onClick={() => setShowCart(false)}
                        className="p-2 hover:bg-gray-100 rounded-md transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Cart Items */}
                {cartItems.length > 0 ? (
                    <>
                        <div className="p-6 space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 border-b border-gray-200 pb-6">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                                            {item.name}
                                        </h3>
                                        {item.size && (
                                            <p className="text-xs text-gray-600 mb-1">Size: {item.size}</p>
                                        )}
                                        {item.color && (
                                            <p className="text-xs text-gray-600 mb-2">Color: {item.color}</p>
                                        )}
                                        <p className="font-semibold text-gray-900 mb-3">${item.price}</p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center border border-gray-300 rounded-md">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 hover:bg-gray-100 transition"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="px-3 py-1 text-sm font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:bg-gray-100 transition"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-2 hover:bg-gray-100 rounded-md transition text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 space-y-4">
                            {/* Subtotal */}
                            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                <span className="text-gray-600 font-medium">Subtotal</span>
                                <span className="text-xl font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
                            </div>

                            {/* View Cart Button */}
                            <Link
                                href="/cart"
                                onClick={() => setShowCart(false)}
                                className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition text-center block"
                            >
                                View Cart
                            </Link>

                            {/* Continue Shopping */}
                            <button
                                onClick={() => setShowCart(false)}
                                className="w-full border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6">
                        <div className="text-center">
                            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
                            <button
                                onClick={() => setShowCart(false)}
                                className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
