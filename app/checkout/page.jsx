'use client';

import React, { useState } from 'react';
import { ChevronLeft, Truck, Lock, ShoppingCart, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../../src/context/CartContext';

export default function CheckoutPage() {
    const { cartItems, checkoutUrl } = useCart();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });
    const [orderPlaced, setOrderPlaced] = useState(false);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 79 ? 0 : 15;
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const total = (subtotal + tax + shipping).toFixed(2);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setOrderPlaced(true);
    };

    // ── Order Success Screen
    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
                <div className="max-w-lg w-full text-center">
                    <div className="mb-8">
                        <div className="w-20 h-20 bg-[#2d5a3d] rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                        <h1
                            className="text-4xl font-bold text-gray-900 mb-3"
                            style={{ fontFamily: "Georgia, serif" }}
                        >
                            Order Confirmed!
                        </h1>
                        <p className="text-lg text-gray-600 mb-2">Thank you for your purchase</p>
                        <p className="text-gray-500">Your order has been placed successfully and is being processed.</p>
                    </div>

                    <div className="bg-[#F0F4F1] rounded-lg p-6 mb-8 border border-[#e5f0eb]">
                        <p className="text-sm text-gray-700">
                            Confirmation email sent to <br />
                            <span className="font-semibold text-[#2d5a3d]">{formData.email}</span>
                        </p>
                    </div>

                    <Link
                        href="/products"
                        className="inline-block px-8 py-3 bg-[#2d5a3d] text-white font-semibold rounded-lg hover:bg-[#1f4028] transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    // ── Empty Cart
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some plants before checking out.</p>
                    <Link href="/products" className="inline-block px-8 py-3 bg-[#2d5a3d] text-white font-semibold rounded-lg hover:bg-[#1f4028] transition-colors">
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }

    // ── Main Checkout
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8 lg:py-12">

                {/* Header */}
                <div className="mb-8 lg:mb-12">
                    <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#2d5a3d] mb-6 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Cart
                    </Link>
                    <h1
                        className="text-4xl md:text-5xl font-bold text-gray-900"
                        style={{ fontFamily: "Georgia, serif" }}
                    >
                        Checkout
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* ── Left: Checkout Form ── */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Shipping Section */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
                                <h2
                                    className="text-2xl font-bold text-gray-900 mb-6"
                                    style={{ fontFamily: "Georgia, serif" }}
                                >
                                    Shipping Address
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="First Name"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="px-4 py-3.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last Name"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="px-4 py-3.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition"
                                            required
                                        />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Street Address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition"
                                        required
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="px-4 py-3.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="state"
                                            placeholder="State"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="px-4 py-3.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition"
                                            required
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        placeholder="ZIP / Postal Code"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
                                <h2
                                    className="text-2xl font-bold text-gray-900 mb-6"
                                    style={{ fontFamily: "Georgia, serif" }}
                                >
                                    Payment Method
                                </h2>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        placeholder="Card Number (16 digits)"
                                        maxLength={19}
                                        value={formData.cardNumber}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                                            const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
                                            setFormData(prev => ({ ...prev, cardNumber: formatted }));
                                        }}
                                        className="w-full px-4 py-3.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition font-mono"
                                        required
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            placeholder="MM / YY"
                                            maxLength={5}
                                            value={formData.expiryDate}
                                            onChange={(e) => {
                                                const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                const formatted = raw.length > 2 ? `${raw.slice(0, 2)} / ${raw.slice(2)}` : raw;
                                                setFormData(prev => ({ ...prev, expiryDate: formatted }));
                                            }}
                                            className="px-4 py-3.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition font-mono"
                                            required
                                        />
                                        <input
                                            type="password"
                                            name="cvv"
                                            placeholder="CVV"
                                            maxLength={4}
                                            value={formData.cvv}
                                            onChange={(e) => {
                                                const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                setFormData(prev => ({ ...prev, cvv: raw }));
                                            }}
                                            className="px-4 py-3.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition font-mono"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full px-8 py-4 bg-[#2d5a3d] text-white font-semibold rounded-lg hover:bg-[#1f4028] transition-colors flex items-center justify-center gap-2"
                            >
                                <Lock className="w-5 h-5" />
                                Place Order — ₹{total}
                            </button>

                            <p className="text-center text-xs text-gray-500">
                                Your payment info is encrypted and secure.
                            </p>
                        </form>
                    </div>

                    {/* ── Right: Order Summary ── */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#F0F4F1] rounded-lg border border-gray-200 p-6 sticky top-8">
                            <h2
                                className="text-xl font-bold text-gray-900 mb-6"
                                style={{ fontFamily: "Georgia, serif" }}
                            >
                                Order Summary
                            </h2>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-200 last:border-b-0">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-200">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 pt-4 border-t border-gray-300">
                                <div className="flex justify-between text-sm text-gray-700">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-700">
                                    <span>Tax (8%)</span>
                                    <span className="font-semibold">₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-700">
                                    <span className="flex items-center gap-1.5">
                                        <Truck className="w-4 h-4" /> Shipping
                                    </span>
                                    <span className={`font-semibold ${shipping === 0 ? 'text-[#2d5a3d]' : ''}`}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                                    </span>
                                </div>

                                {/* Total */}
                                <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-[#2d5a3d]">₹{total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
