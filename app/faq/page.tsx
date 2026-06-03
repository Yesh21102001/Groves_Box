'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown, Leaf, Truck, Sprout, Droplets } from 'lucide-react';

interface FAQItem {
    category: string;
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    // Plant Care
    {
        category: 'Plant Care',
        question: 'How often should I water my plants?',
        answer: 'It depends on the plant type, pot size, soil, and humidity. Most indoor plants prefer soil that is moist but not waterlogged. Check soil moisture by inserting your finger 1-2 inches deep — if it feels dry, water. Overwatering is the most common plant killer, so when in doubt, wait a day and check again.'
    },
    {
        category: 'Plant Care',
        question: 'How much light do indoor plants need?',
        answer: 'Different plants have different light needs. Most common indoor plants prefer indirect sunlight (bright but not direct rays). Place them near a window with filtered light, or 3-6 feet away from a sunny window. Low-light plants like snake plants and pothos can tolerate darker corners, while succulents need more direct sun.'
    },
    {
        category: 'Plant Care',
        question: 'What should I do if my plant is turning yellow?',
        answer: 'Yellow leaves can indicate overwatering, poor drainage, nutrient deficiency, or low light. Check if the soil is soggy (overwatering), ensure your pot has drainage holes, and move the plant to brighter light if needed. If leaves continue yellowing, try fertilizing with a balanced plant food.'
    },
    {
        category: 'Plant Care',
        question: 'How do I know if my plant is getting the right humidity?',
        answer: 'Most tropical plants prefer humidity around 50-60%. Signs of low humidity include crispy leaf tips and slow growth. Increase humidity by misting leaves, grouping plants together, or placing them on a pebble tray with water. You can also run a humidifier nearby.'
    },
    {
        category: 'Plant Care',
        question: 'Is it okay to move my plant to a different location?',
        answer: 'Yes, but do it gradually. Plants need time to adjust to new light and temperature conditions. If moving from low to bright light, acclimate over 1-2 weeks by slowly increasing exposure. Avoid moving plants too frequently, as frequent relocations cause stress.'
    },

    // Orders & Shipping
    {
        category: 'Orders & Shipping',
        question: 'How long do plants take to arrive?',
        answer: 'Most orders are processed and shipped within 1-2 business days. Delivery times vary by location: metro cities (2-4 days), tier 2 & 3 cities (4-7 days), and remote areas (7-10 days). You\'ll receive a tracking number via email as soon as your order ships.'
    },
    {
        category: 'Orders & Shipping',
        question: 'Do you offer free shipping?',
        answer: 'Yes! We offer free shipping on orders over ₹799. For orders below ₹799, a flat shipping fee of ₹79 applies. Bulky items may have additional handling charges, which are shown at checkout.'
    },
    {
        category: 'Orders & Shipping',
        question: 'What if my plant arrives damaged?',
        answer: 'We take special care when packing, but if your plant arrives damaged or unhealthy, contact us within 48 hours with photos. We\'ll investigate and send a replacement or refund immediately at no extra cost.'
    },
    {
        category: 'Orders & Shipping',
        question: 'Can I track my order?',
        answer: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email. You can also track it from our Track Order page in your account. If you don\'t receive a tracking number within 48 hours of ordering, contact our support team.'
    },
    {
        category: 'Orders & Shipping',
        question: 'Do you ship internationally?',
        answer: 'Currently, we ship within India only. We\'re working on expanding to international locations soon. If you\'d like to be notified when international shipping becomes available, reach out to our team.'
    },

    // Returns & Refunds
    {
        category: 'Returns & Refunds',
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return window from the date of delivery. Plants must be in original condition with proper care instructions. If a plant arrives unhealthy or damaged, we replace it free of charge. Final sale items and opened soil bags cannot be returned.'
    },
    {
        category: 'Returns & Refunds',
        question: 'How do I initiate a return?',
        answer: 'Log into your account, go to "My Orders," select the order, and click "Request Return." Print the prepaid return label we provide and drop off your package at any courier location. Refunds are processed 5-7 business days after we receive and inspect your return.'
    },
    {
        category: 'Returns & Refunds',
        question: 'What if I received the wrong item?',
        answer: 'We apologize! Contact our support team immediately with your order number and photos. We\'ll send the correct item right away via express shipping at no cost. You can return the incorrect item using the prepaid label we provide.'
    },

    // Account & Payment
    {
        category: 'Account & Payment',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI, net banking, digital wallets (Google Pay, Apple Pay, PhonePe), and buy now pay later (BNPL) options.'
    },
    {
        category: 'Account & Payment',
        question: 'Is my payment information secure?',
        answer: 'Yes, all transactions are encrypted using SSL (Secure Sockets Layer) technology. We do not store your full credit card details — only the last 4 digits are saved for your convenience. Your payment is processed by trusted payment gateways.'
    },
    {
        category: 'Account & Payment',
        question: 'How do I create an account?',
        answer: 'Click "Sign Up" on our homepage, enter your email and create a password. You\'ll receive a verification email — click the link to confirm. You can also sign up using your Google or Apple account for faster checkout.'
    },
    {
        category: 'Account & Payment',
        question: 'Can I use a discount code?',
        answer: 'Yes! If you have a discount code, enter it at checkout in the "Promo Code" field. The discount will be applied to your order total. Check our email newsletters and social media for exclusive codes and promotions.'
    },

    // General
    {
        category: 'General',
        question: 'Do you sell rare or exotic plants?',
        answer: 'We specialize in hardy, beginner-friendly indoor plants that are easy to care for. Our collection includes popular varieties like pothos, snake plants, monstera, and succulents. We carefully source from trusted nurseries to ensure quality and health.'
    },
    {
        category: 'General',
        question: 'Are your plants organic and chemical-free?',
        answer: 'Yes! All plants are grown using sustainable, eco-friendly practices without harmful pesticides. Soil is nutrient-rich and prepared without synthetic chemicals. We\'re committed to delivering healthy, clean plants to your home.'
    },
    {
        category: 'General',
        question: 'Do you offer bulk or corporate orders?',
        answer: 'Absolutely! We offer special pricing and customized packaging for bulk orders (10+ plants) and corporate gifts. Contact our bulk sales team at bulk@grovesbox.com or use our contact form with details about your needs.'
    },
    {
        category: 'General',
        question: 'How do I contact customer support?',
        answer: 'You can reach us via email at support@grovesbox.com, WhatsApp for instant support, or through our contact form. Our team responds within 24 hours. Visit our Contact Us page for all available channels.'
    },
];

const categories = ['All', ...Array.from(new Set(faqData.map(faq => faq.category)))];

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const filteredFAQs = useMemo(() => {
        return faqData.filter(faq => {
            const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
            const matchesSearch = searchQuery === '' ||
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, activeCategory]);

    const categoryIcons: { [key: string]: React.ReactNode } = {
        'Plant Care': <Leaf size={16} />,
        'Orders & Shipping': <Truck size={16} />,
        'Returns & Refunds': <Sprout size={16} />,
        'Account & Payment': <Droplets size={16} />,
        'General': <Leaf size={16} />,
    };

    return (
        <div className="min-h-screen bg-white">

            {/* ── HERO ───────────────────────────────────────────────────── */}
            <section className="w-full bg-[#6b9238] px-5 sm:px-8 lg:px-12 py-16 md:py-20">
                <div className="max-w-7xl mx-auto">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/70 mb-3">
                        Help Center
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4 max-w-xl">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-white/80 text-lg max-w-lg leading-relaxed mb-8">
                        Find answers to common questions about plant care, orders, shipping, and more.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder:text-white/50 outline-none focus:border-white/60 transition-colors text-sm"
                        />
                    </div>
                </div>
            </section>

            {/* ── CATEGORY TABS ──────────────────────────────────────────── */}
            <section className="w-full px-5 sm:px-8 lg:px-12 py-6 border-b border-gray-200 sticky top-0 z-40 bg-white/95 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                    activeCategory === cat
                                        ? 'bg-[#6b9238] text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ACCORDION ──────────────────────────────────────────── */}
            <section className="w-full px-5 sm:px-8 lg:px-12 py-14">
                <div className="max-w-4xl mx-auto">

                    {filteredFAQs.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <Leaf size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                            <p className="text-gray-500">Try adjusting your search or browsing a different category.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredFAQs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#6b9238] hover:shadow-sm transition-all"
                                >
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="w-full flex items-start justify-between p-5 text-left gap-4"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[#6b9238]">{categoryIcons[faq.category]}</span>
                                                <span className="text-xs font-semibold text-[#6b9238] uppercase tracking-wide">
                                                    {faq.category}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-[#6b9238] transition-colors text-sm sm:text-base">
                                                {faq.question}
                                            </h3>
                                        </div>
                                        <div className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-[#6b9238] transition-all ${openIndex === index ? 'rotate-180' : ''}`}>
                                            <ChevronDown
                                                size={18}
                                                className={`transition-colors ${openIndex === index ? 'text-white' : 'text-gray-600 group-hover:text-white'}`}
                                            />
                                        </div>
                                    </button>

                                    {openIndex === index && (
                                        <div className="px-5 pb-5 pt-0 border-t border-gray-100">
                                            <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── CTA SECTION ────────────────────────────────────────────── */}
            <section className="w-full px-5 sm:px-8 lg:px-12 py-14 bg-[#F5F7F2]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                        Didn't Find Your Answer?
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
                        Our plant experts are here to help. Get instant support via email, WhatsApp, or our contact form.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="/contact-us"
                            className="btn-primary">
                            Contact Us
                        </a>
                        <a href="https://wa.me/91XXXXXXXXXX"
                            target="_blank" rel="noopener noreferrer"
                            className="btn-outline">
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
}
