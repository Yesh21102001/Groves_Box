'use client';

import React, { useState } from 'react';
import { ChevronLeft, Truck, Lock, ShoppingCart } from 'lucide-react';
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

    // ── Totals from real cart ─────────────────────────────────────────────────
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 79 ? 0 : 15;
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const total = (subtotal + tax + shipping).toFixed(2);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ── If you want Shopify native checkout, redirect straight away ───────────
    // Uncomment below and remove the form if you'd rather redirect:
    // useEffect(() => { if (checkoutUrl) window.location.href = checkoutUrl; }, [checkoutUrl]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // If you want to redirect to Shopify at submission instead:
        // if (checkoutUrl) { window.location.href = checkoutUrl; return; }
        setOrderPlaced(true);
    };

    // ── Order confirmed screen ────────────────────────────────────────────────
    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center px-4 py-12">
                <div className="max-w-lg w-full">
                    <div className="relative">
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />

                        <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-900/20 p-12 border border-gray-200">
                            <div className="mb-8 relative">
                                <div className="mx-auto w-24 h-24 bg-[#007B57] rounded-full flex items-center justify-center shadow-xl animate-[bounce_1s_ease-in-out_3]">
                                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2">
                                    <div className="absolute w-2 h-2 bg-[#007B57] rounded-full animate-ping" style={{ top: '-20px', left: '-30px' }} />
                                    <div className="absolute w-2 h-2 bg-[#009A7B] rounded-full animate-ping" style={{ top: '-25px', left: '30px', animationDelay: '0.2s' }} />
                                    <div className="absolute w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ top: '-15px', left: '50px', animationDelay: '0.4s' }} />
                                </div>
                            </div>

                            <div className="text-center space-y-4">
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
                                <p className="text-lg text-gray-800 font-medium">Thank you for your purchase</p>
                                <p className="text-gray-600 max-w-sm mx-auto">Your order has been placed successfully and is being processed.</p>

                                <div className="bg-gray-50 rounded-2xl p-6 mt-6 border border-gray-200">
                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                                        <svg className="w-5 h-5 text-[#007B57]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span>Confirmation sent to <strong>{formData.email}</strong></span>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <Link href="" className="group relative inline-flex items-center gap-2 bg-[#007B57] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:bg-[#009A7B] hover:scale-105 transition-all duration-300">
                                        <span>Continue Shopping</span>
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Empty cart guard ──────────────────────────────────────────────────────
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#F0F4F1] flex items-center justify-center px-4">
                <div className="text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some plants before checking out.</p>
                    <Link href="/products" className="inline-block bg-[#007B57] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#009A7B] transition">
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }

    // ── Main checkout ─────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#F0F4F1]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <Link href="/cart" className="flex items-center text-gray-600 hover:text-[#007B57] mb-6 transition-colors">
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Back to Cart
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── Checkout Form ── */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-8">

                            {/* Shipping */}
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">Shipping Information</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange}
                                            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007B57] focus:border-transparent transition" required />
                                        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange}
                                            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007B57] focus:border-transparent transition" required />
                                    </div>
                                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007B57] focus:border-transparent transition" required />
                                    <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007B57] focus:border-transparent transition" required />
                                    <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007B57] focus:border-transparent transition" required />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange}
                                            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007B57] focus:border-transparent transition" required />
                                        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange}
                                            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007B57] focus:border-transparent transition" required />
                                    </div>
                                    <input type="text" name="zipCode" placeholder="ZIP / Postal Code" value={formData.zipCode} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007B57] focus:border-transparent transition" required />
                                </div>
                            </section>

                            {/* Payment */}
                            <section>
                                <h2 className="text-xl font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">Payment Information</h2>
                                <div className="space-y-4">
                                    <input type="text" name="cardNumber" placeholder="Card Number (16 digits)" maxLength={19}
                                        value={formData.cardNumber}
                                        onChange={(e) => {
                                            // Auto-format: 1234 5678 9012 3456
                                            const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                                            const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
                                            setFormData(prev => ({ ...prev, cardNumber: formatted }));
                                        }}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007B57] focus:border-transparent transition font-mono tracking-widest" required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" name="expiryDate" placeholder="MM / YY" maxLength={5}
                                            value={formData.expiryDate}
                                            onChange={(e) => {
                                                const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                const formatted = raw.length > 2 ? `${raw.slice(0, 2)} / ${raw.slice(2)}` : raw;
                                                setFormData(prev => ({ ...prev, expiryDate: formatted }));
                                            }}
                                            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007B57] focus:border-transparent transition font-mono" required />
                                        <input type="password" name="cvv" placeholder="CVV" maxLength={4}
                                            value={formData.cvv}
                                            onChange={(e) => {
                                                const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                setFormData(prev => ({ ...prev, cvv: raw }));
                                            }}
                                            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007B57] focus:border-transparent transition font-mono" required />
                                    </div>
                                </div>
                            </section>

                            {/* Submit */}
                            <button type="submit"
                                className="w-full bg-[#007B57] text-white py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#009A7B] active:scale-[0.98] transition-all shadow-md hover:shadow-lg">
                                <Lock className="w-5 h-5" />
                                Place Order — ₹{total}
                            </button>

                            <p className="text-center text-xs text-gray-400 -mt-4">
                                Your payment info is encrypted and secure.
                            </p>
                        </form>
                    </div>

                    {/* ── Order Summary ── */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            {/* ✅ Real cart items from CartContext */}
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">{item.name}</p>
                                            {item.variant && item.variant !== 'Default Title' && (
                                                <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Price breakdown */}
                            <div className="border-t border-gray-100 pt-4 space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tax (8%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span className="flex items-center gap-1.5">
                                        <Truck className="w-4 h-4" /> Shipping
                                    </span>
                                    {shipping === 0
                                        ? <span className="text-green-600 font-medium">FREE</span>
                                        : <span>₹{shipping.toFixed(2)}</span>}
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-lg font-bold text-[#007B57]">₹{total}</span>
                                </div>
                            </div>

                            {/* Shopify native checkout option */}
                            {checkoutUrl && (
                                <div className="mt-5 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-2 text-center">Or checkout securely with Shopify</p>
                                    <a href={checkoutUrl}
                                        className="flex items-center justify-center gap-2 w-full border border-[#007B57] text-[#007B57] py-3 rounded-xl text-sm font-semibold hover:bg-[#007B57] hover:text-white transition-all">
                                        <Lock className="w-4 h-4" />
                                        Shopify Checkout
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}