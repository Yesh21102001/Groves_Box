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
                <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="mb-6">
                            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
                        <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
                        <p className="text-sm text-gray-500 mb-8">Order confirmation has been sent to your email.</p>
                        <Link
                            href="/"
                            className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition"
                        >
                            Continue Shopping
                        </Link>
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
                        <Link href="/cart" className="flex items-center text-teal-600 hover:text-teal-700 mb-6">
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
                                    className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center justify-center"
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
                                        <span className="text-xl font-bold text-teal-600">${total}</span>
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
