'use client';

import { useState } from 'react';

interface ShippingMethod {
    name: string;
    duration: string;
    cost: string;
    description: string;
}

interface ReturnStep {
    step: number;
    title: string;
    description: string;
}

const shippingMethods: ShippingMethod[] = [
    {
        name: 'Standard Shipping',
        duration: '5-7 Business Days',
        cost: 'Free on orders over 50',
        description: 'Our standard shipping option is reliable and cost-effective for most deliveries.'
    },
    {
        name: 'Express Shipping',
        duration: '2-3 Business Days',
        cost: '9.99',
        description: 'Get your order faster with our express shipping service.'
    },
    {
        name: 'Overnight Shipping',
        duration: '1 Business Day',
        cost: '24.99',
        description: 'Need it urgently? Choose overnight delivery for next-day arrival.'
    },
    {
        name: 'International Shipping',
        duration: '7-14 Business Days',
        cost: 'Varies by location',
        description: 'We ship worldwide with reliable international carriers.'
    }
];

const returnSteps: ReturnStep[] = [
    {
        step: 1,
        title: 'Initiate Your Return',
        description: 'Log into your account and navigate to your order history. Select the items you wish to return and provide a reason.'
    },
    {
        step: 2,
        title: 'Print Return Label',
        description: 'Download and print your prepaid return shipping label from your account dashboard or the email we send you.'
    },
    {
        step: 3,
        title: 'Pack Your Items',
        description: 'Securely pack your items in the original packaging if possible. Attach the return label to the outside of the box.'
    },
    {
        step: 4,
        title: 'Ship Your Return',
        description: 'Drop off your package at any authorized shipping location. You\'ll receive tracking information via email.'
    },
    {
        step: 5,
        title: 'Receive Your Refund',
        description: 'Once we receive and inspect your return, your refund will be processed within 5-7 business days.'
    }
];

export default function ShippingReturnsPage() {
    const [activeTab, setActiveTab] = useState<'shipping' | 'returns'>('shipping');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const faqs = [
        {
            question: 'How can I track my order?',
            answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history.'
        },
        {
            question: 'What if my package is lost or damaged?',
            answer: 'If your package is lost in transit or arrives damaged, please contact our customer service team within 48 hours. We\'ll work with the carrier to resolve the issue and send a replacement or refund.'
        },
        {
            question: 'Do you ship to P.O. boxes?',
            answer: 'Yes, we ship to P.O. boxes using USPS. However, expedited shipping options are not available for P.O. box addresses.'
        },
        {
            question: 'What items are eligible for return?',
            answer: 'Most items can be returned within 30 days of delivery in their original condition with tags attached. Final sale items, personalized products, and opened hygiene items cannot be returned.'
        },
        {
            question: 'How long does it take to get my refund?',
            answer: 'Refunds are processed within 5-7 business days after we receive and inspect your return. The refund will be credited to your original payment method.'
        },
        {
            question: 'Can I exchange an item?',
            answer: 'Currently, we don\'t offer direct exchanges. Please return the original item and place a new order for the item you want. We\'ll process your refund as soon as we receive your return.'
        }
    ];

    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-[#F0F4F1] relative overflow-hidden">

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-block mb-6 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-[#244033]">
                        <p className="text-sm font-semibold text-[#244033] tracking-wide">DELIVERY & RETURNS</p>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#2F4F3E] mb-6 tracking-tight">
                        Shipping &

                        Returns Policy

                    </h1>

                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                        Fast, reliable shipping and hassle-free returns. Your satisfaction is our priority.
                    </p>
                </div>
            </section>

            {/* Tab Navigation */}
            <section className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center gap-2 py-6">
                        <button
                            onClick={() => setActiveTab('shipping')}
                            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'shipping'
                                ? 'bg-[#244033] text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                Shipping Info
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('returns')}
                            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'returns'
                                ? 'bg-[#244033] text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                Returns Policy
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Shipping Content */}
            {activeTab === 'shipping' && (
                <>
                    {/* Shipping Methods */}
                    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#2F4F3E] mb-4">
                                    Shipping Options
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Choose the shipping method that works best for you
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {shippingMethods.map((method, index) => (
                                    <div
                                        key={index}
                                        className="group bg-[#F0F4F1] rounded-2xl  p-8 hover:border-gray-900 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-[#244033] transition-colors">
                                                <svg className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{method.name}</h3>
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-2xl font-bold text-gray-900">{method.cost}</span>
                                        </div>
                                        <p className="text-sm font-semibold text-emerald-600 mb-3">{method.duration}</p>
                                        <p className="text-gray-600 text-sm leading-relaxed">{method.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Shipping Features */}
                    <section className="py-16 sm:py-20 lg:py-24 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-6">
                                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#2F4F3E] mb-3">Order Tracking</h3>
                                    <p className="text-gray-600">Track your package in real-time from our warehouse to your doorstep.</p>
                                </div>

                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#2F4F3E] mb-3">Secure Packaging</h3>
                                    <p className="text-gray-600">All orders are carefully packed to ensure safe delivery of your items.</p>
                                </div>

                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6">
                                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#2F4F3E] mb-3">Global Shipping</h3>
                                    <p className="text-gray-600">We deliver to over 50 countries worldwide with reliable carriers.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* Returns Content */}
            {activeTab === 'returns' && (
                <>
                    {/* Return Process */}
                    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-4">
                                    How to Return
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Simple steps to return your items hassle-free
                                </p>
                            </div>

                            <div className="max-w-4xl mx-auto">
                                {returnSteps.map((item, index) => (
                                    <div key={index} className="relative mb-8 last:mb-0">
                                        {index !== returnSteps.length - 1 && (
                                            <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-transparent"></div>
                                        )}

                                        <div className="flex gap-6 group">
                                            <div className="flex-shrink-0">
                                                <div className="relative w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                                                    <span className="text-2xl font-bold text-white">{item.step}</span>
                                                </div>
                                            </div>

                                            <div className="flex-1 bg-white rounded-2xl border-2 border-gray-200 p-8 group-hover:border-gray-900 group-hover:shadow-xl transition-all duration-300">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Return Policy Highlights */}
                    <section className="py-16 sm:py-20 lg:py-24 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-gray-200 p-8 sm:p-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Return Policy Highlights</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2">30-Day Return Window</h3>
                                            <p className="text-gray-600 text-sm">Return items within 30 days of delivery for a full refund.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2">Free Return Shipping</h3>
                                            <p className="text-gray-600 text-sm">We provide prepaid return labels for all eligible returns.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2">Original Condition Required</h3>
                                            <p className="text-gray-600 text-sm">Items must be unused with original tags and packaging.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2">Fast Refund Processing</h3>
                                            <p className="text-gray-600 text-sm">Refunds processed within 5-7 business days of receipt.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* FAQ Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-light text-[#2F4F3E] mb-4">
                            Common Questions
                        </h2>
                        <p className="text-gray-600">
                            Quick answers to frequently asked questions
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                            >
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                                        {faq.question}
                                    </h3>

                                    <div
                                        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 transition-all duration-300 ${expandedFaq === index ? 'rotate-180 bg-[#244033]' : ''
                                            }`}
                                    >
                                        <svg
                                            className={`w-5 h-5 transition-colors ${expandedFaq === index ? 'text-white' : 'text-gray-600'
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </button>


                                <div className={`transition-all duration-300 ease-in-out ${expandedFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                    <div className="px-6 pb-6">
                                        <div className="border-t border-gray-200 pt-4">
                                            <p className="text-gray-600 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Support CTA */}
            <section className="py-16 sm:py-20 lg:py-24 bg-[#F0F4F1] relative overflow-hidden">

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">


                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#2F4F3E] mb-4">
                        Need Help?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Our customer support team is ready to assist you with any shipping or return questions.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#244033] text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105"
                        >
                            Contact Support
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>

                    </div>
                </div>
            </section>

        </div>
    );
}