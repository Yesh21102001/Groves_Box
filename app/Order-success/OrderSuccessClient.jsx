'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Truck, MapPin, ArrowRight } from 'lucide-react';
import { useCart } from '../../src/context/CartContext';

export default function OrderSuccessClient() {
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const [visible, setVisible] = useState(false);

    const orderNumber = searchParams.get('order_number') || searchParams.get('order') || '';
    const email = searchParams.get('email') || '';
    const name = searchParams.get('name') || '';

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        clearCart();
        return () => clearTimeout(t);
    }, []);

    const steps = [
        { icon: CheckCircle, label: 'Order Placed', active: true },
        { icon: Package, label: 'Preparing', active: false },
        { icon: Truck, label: 'On the Way', active: false },
        { icon: MapPin, label: 'Delivered', active: false },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F0F4F1] via-[#E8F0EA] to-[#F0F4F1] flex items-center justify-center px-4 py-12">
            <div
                className={`max-w-lg w-full transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
            >
                <div className="relative bg-white rounded-3xl shadow-2xl shadow-green-900/10 border border-green-100 overflow-hidden">

                    <div className="h-1.5 w-full bg-gradient-to-r from-[#007B57] via-[#009A7B] to-[#00C89A]" />

                    <div className="p-8 sm:p-10">

                        {/* Animated checkmark */}
                        <div className="flex justify-center mb-7">
                            <div className="relative">
                                <span className="absolute inset-0 rounded-full bg-[#007B57]/20 animate-ping" />
                                <span className="absolute inset-3 rounded-full bg-[#007B57]/10 animate-ping" style={{ animationDelay: '0.4s' }} />
                                <div className="relative w-24 h-24 bg-gradient-to-br from-[#007B57] to-[#009A7B] rounded-full flex items-center justify-center shadow-xl shadow-green-900/25">
                                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center mb-7">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                                Order Confirmed! 🌿
                            </h1>
                            <p className="text-gray-500 text-sm sm:text-base">
                                {name ? `Thank you, ${name}!` : 'Thank you!'} Your plants are on their way.
                            </p>
                        </div>

                        {/* Order details */}
                        <div className="bg-[#F0F4F1] rounded-2xl p-5 mb-7 space-y-3">
                            {orderNumber && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Order Number</span>
                                    <span className="font-bold text-gray-900 tracking-wider">#{orderNumber}</span>
                                </div>
                            )}
                            {email && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Confirmation sent to</span>
                                    <span className="font-medium text-gray-700 truncate max-w-[180px]">{email}</span>
                                </div>
                            )}
                            {!orderNumber && !email && (
                                <p className="text-sm text-gray-600 text-center">
                                    A confirmation email has been sent to you.
                                </p>
                            )}
                        </div>

                        {/* Order journey tracker */}
                        <div className="mb-7">
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
                                Order Journey
                            </p>
                            <div className="relative">
                                <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100" />
                                <div className="absolute top-5 left-5 h-0.5 bg-[#007B57] z-0" style={{ width: '8%' }} />
                                <div className="relative z-10 grid grid-cols-4 gap-2">
                                    {steps.map((step, i) => {
                                        const Icon = step.icon;
                                        return (
                                            <div key={i} className="flex flex-col items-center text-center gap-2">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step.active
                                                    ? 'bg-[#007B57] border-[#007B57] text-white shadow-md shadow-green-900/20'
                                                    : 'bg-white border-gray-200 text-gray-300'
                                                    }`}>
                                                    <Icon size={17} />
                                                </div>
                                                <p className={`text-[10px] sm:text-xs font-semibold leading-tight ${step.active ? 'text-[#007B57]' : 'text-gray-400'
                                                    }`}>
                                                    {step.label}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Care tip */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 mb-7 flex gap-3 items-start">
                            <span className="text-2xl flex-shrink-0">🌱</span>
                            <div>
                                <p className="text-sm font-semibold text-[#007B57] mb-0.5">Quick Care Tip</p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    When your plant arrives, keep it in indirect sunlight for 2–3 days before watering to help it settle in.
                                </p>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="space-y-3">
                            <Link
                                href="/products"
                                className="flex items-center justify-center gap-2 w-full bg-[#007B57] text-white py-4 rounded-2xl font-semibold text-base hover:bg-[#009A7B] active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
                            >
                                Continue Shopping
                                <ArrowRight size={18} />
                            </Link>

                            {/* ✅ Fixed: orderNumber from searchParams instead of order.id */}
                            <Link
                                href={orderNumber ? `/track-order?order=${orderNumber}` : '/track-order'}
                                className="flex items-center justify-center w-full border border-gray-200 text-gray-600 py-3.5 rounded-2xl text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                Track Order
                            </Link>
                        </div>

                        <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
                            Questions?{' '}
                            <a href="mailto:support@yourstore.com" className="text-[#007B57] hover:underline">
                                Contact support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}