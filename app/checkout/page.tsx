'use client';

import React, { useState } from 'react';
import { ChevronLeft, Truck, Lock } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

export default function CheckoutPage() {
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setOrderPlaced(true);
    };

    const cartItems = [
        {
            id: '1',
            name: 'Money Tree Plant',
            price: 59,
            quantity: 1,
            image: '/images/White_arch.webp',
        },
    ];

    const subtotal = 59;
    const shipping = 15;
    const tax = (subtotal * 0.08).toFixed(2);
    const total = (subtotal + parseFloat(tax as string) + shipping).toFixed(2);

    if (orderPlaced) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center px-4 py-12">
                    <div className="max-w-lg w-full">
                        {/* Success Animation Container */}
                        <div className="relative">
                            {/* Decorative circles */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
                            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>

                            {/* Main Card */}
                            <div className="relative bg-white backdrop-blur-lg rounded-3xl shadow-2xl shadow-gray-900/20 p-12 border border-gray-200">
                                {/* Success Icon with Animation */}
                                <div className="mb-8 relative">
                                    <div className="mx-auto w-24 h-24 bg-black rounded-full flex items-center justify-center shadow-xl shadow-gray-900/30 animate-[bounce_1s_ease-in-out_3]">
                                        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    {/* Confetti dots */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2">
                                        <div className="absolute w-2 h-2 bg-gray-800 rounded-full animate-ping" style={{ top: '-20px', left: '-30px' }}></div>
                                        <div className="absolute w-2 h-2 bg-gray-700 rounded-full animate-ping" style={{ top: '-25px', left: '30px', animationDelay: '0.2s' }}></div>
                                        <div className="absolute w-2 h-2 bg-gray-600 rounded-full animate-ping" style={{ top: '-15px', left: '50px', animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="text-center space-y-4">
                                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                                        Order Confirmed!
                                    </h1>

                                    <p className="text-lg text-gray-800 font-medium">
                                        Thank you for your purchase
                                    </p>

                                    <p className="text-gray-600 max-w-sm mx-auto">
                                        Your order has been placed successfully and is being processed.
                                    </p>

                                    {/* Order Details Box */}
                                    <div className="bg-gray-50 rounded-2xl p-6 mt-6 border border-gray-200">
                                        <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                                            <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span>Confirmation sent to your email</span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <div className="pt-6">
                                        <Link
                                            href="/"
                                            className="group relative inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl shadow-gray-900/30 hover:shadow-2xl hover:shadow-gray-900/40 hover:scale-105 transition-all duration-300"
                                        >
                                            <span>Continue Shopping</span>
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </Link>
                                    </div>

                                    {/* Secondary Link */}
                                    <div className="pt-4">
                                        <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors underline underline-offset-4">
                                            View order details
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/cart" className="flex items-center text-black hover:text-teal-700 mb-6">
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Back to Cart
                        </Link>
                        <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
                                {/* Shipping Information */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="First Name"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="col-span-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last Name"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="col-span-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            required
                                        />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Street Address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="state"
                                            placeholder="State"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            required
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        placeholder="ZIP Code"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                </div>

                                {/* Payment Information */}
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        placeholder="Card Number"
                                        value={formData.cardNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            placeholder="MM/YY"
                                            value={formData.expiryDate}
                                            onChange={handleInputChange}
                                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="cvv"
                                            placeholder="CVV"
                                            value={formData.cvv}
                                            onChange={handleInputChange}
                                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-3 rounded-lg font-semibold transition flex items-center justify-center"
                                >
                                    <Lock className="w-5 h-5 mr-2" />
                                    Place Order
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg p-8 sticky top-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex justify-between">
                                            <span className="text-gray-600">{item.name} x {item.quantity}</span>
                                            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 pt-4 space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span>${tax}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span className="flex items-center"><Truck className="w-4 h-4 mr-2" /> Shipping</span>
                                        <span>${shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                                        <span className="text-xl font-bold">Total</span>
                                        <span className="text-xl font-bold text-black-600">${total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
