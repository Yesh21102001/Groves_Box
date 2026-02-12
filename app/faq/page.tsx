'use client';

import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqData: FAQItem[] = [
    {
        category: 'General',
        question: 'What is GrovesBox?',
        answer: 'GrovesBox is a premium subscription service that delivers curated boxes of sustainable, eco-friendly products directly to your door. Each box is thoughtfully designed to bring nature-inspired items into your daily life.'
    },
    {
        category: 'General',
        question: 'How does the subscription work?',
        answer: 'Choose your preferred plan (monthly, quarterly, or annual), and we\'ll deliver a carefully curated box to your doorstep. You can pause, skip, or cancel your subscription at any time from your account dashboard.'
    },
    {
        category: 'Shipping',
        question: 'Where do you ship?',
        answer: 'We currently ship to all 50 US states, Canada, and select European countries. International shipping rates vary by location and will be calculated at checkout.'
    },
    {
        category: 'Shipping',
        question: 'How long does shipping take?',
        answer: 'Domestic orders typically arrive within 3-5 business days. International orders may take 7-14 business days depending on customs processing and your location.'
    },
    {
        category: 'Shipping',
        question: 'Do you offer expedited shipping?',
        answer: 'Yes! We offer express shipping options at checkout for customers who need their boxes sooner. Express shipping typically delivers within 1-2 business days domestically.'
    },
    {
        category: 'Products',
        question: 'Are your products eco-friendly?',
        answer: 'Absolutely! Sustainability is at our core. All products are carefully vetted to ensure they meet our environmental standards, including recyclable packaging, ethical sourcing, and minimal environmental impact.'
    },
    {
        category: 'Products',
        question: 'Can I customize my box?',
        answer: 'While our standard boxes are pre-curated, premium subscribers can access our customization portal to adjust preferences and swap certain items before each shipment.'
    },
    {
        category: 'Products',
        question: 'What if I receive a damaged item?',
        answer: 'We take great care in packaging, but if something arrives damaged, please contact us within 48 hours with photos. We\'ll send a replacement immediately at no additional cost.'
    },
    {
        category: 'Account',
        question: 'How do I cancel my subscription?',
        answer: 'You can cancel anytime from your account settings. Simply navigate to "Subscription Management" and click "Cancel Subscription." You\'ll continue to receive boxes until the end of your current billing period.'
    },
    {
        category: 'Account',
        question: 'Can I pause my subscription?',
        answer: 'Yes! You can pause your subscription for up to 3 months. This is perfect for vacations or when you need a break. Just reactivate whenever you\'re ready to resume.'
    },
    {
        category: 'Payment',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, and Google Pay for your convenience.'
    },
    {
        category: 'Payment',
        question: 'When will I be charged?',
        answer: 'Your card is charged when your box ships. For subscriptions, billing occurs on the same day each billing cycle. You\'ll receive an email notification 3 days before each charge.'
    }
];

const categories = ['All', ...Array.from(new Set(faqData.map(faq => faq.category)))];

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFAQs = faqData.filter(faq => {
        const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
        const matchesSearch = searchQuery === '' ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#F0F4F1] py-10 sm:py-12 lg:py-16">

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-[#244033]">
                        <span className="text-sm font-medium text-[#244033]">Help Center</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light text-[#2F4F3E] mb-6 tracking-tight">
                        Frequently Asked
                        <span className="block mt-2 bg-[#2F4F3E] bg-clip-text text-transparent font-normal">
                            Questions
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-black-300 max-w-3xl mx-auto mb-10">
                        Find answers to common questions about our products, shipping, and services.
                    </p>

                    {/* Search Bar */}

                </div>
            </section>

            {/* Category Filter */}
            <section className="sticky top-[80px] z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${activeCategory === category
                                    ? 'bg-[#244033] text-white shadow-lg scale-105'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {filteredFAQs.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-medium text-gray-900 mb-3">No results found</h3>
                            <p className="text-gray-600">Try adjusting your search or filter to find what you're looking for.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredFAQs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="group bg-white rounded-2xl border-2 border-gray-200 overflow-hidden transition-all duration-300 hover:border-gray-300 hover:shadow-lg"
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full flex items-center justify-between p-6 sm:p-8 text-left transition-colors"
                                    >
                                        <div className="flex-1 pr-4">
                                            <span className="inline-block px-3 py-1 bg-[#244033] text-white text-xs font-semibold rounded-full mb-3">
                                                {faq.category}
                                            </span>
                                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                                                {faq.question}
                                            </h3>
                                        </div>
                                        <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 transition-all duration-300 ${openIndex === index ? 'rotate-180 bg-gray-900' : 'group-hover:bg-gray-200'
                                            }`}>
                                            <svg
                                                className={`w-5 h-5 transition-colors ${openIndex === index ? 'text-white' : 'text-gray-600'
                                                    }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </button>

                                    <div className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}>
                                        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
                                            <div className="border-t border-gray-200 pt-6">
                                                <p className="text-gray-600 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Contact CTA Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-[#F0F4F1] relative overflow-hidden">

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                        <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#2F4F3E] mb-4">
                        Still have questions?
                    </h2>
                    <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
                        Can't find the answer you're looking for? Our friendly team is here to help.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">

                        <a
                            href="mailto:support@grovesbox.com"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#244033] backdrop-blur-sm text-white  rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                        >
                            Email Us
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
}