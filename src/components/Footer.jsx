'use client';

import Link from 'next/link';
import { Facebook, Instagram, Youtube, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
    const [openSection, setOpenSection] = useState(null);

    const handleNewsletterSubscribe = (e) => {
        e.preventDefault();
    };

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <footer className="bg-[#F0F4F1] border-t border-gray-200">
            {/* Mobile Newsletter */}
            <div className="lg:hidden w-full px-6 py-8 border-b border-gray-200">
                <h2 className="text-2xl font-light mb-2 ">Stay Connected</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Subscribe for updates and exclusive offers
                </p>
                <form onSubmit={handleNewsletterSubscribe} className="space-y-3">
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-900"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#007B57] text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-[#2F4F3E] transition"
                    >
                        Subscribe
                    </button>
                </form>
            </div>

            {/* Mobile Accordion */}
            <div className="lg:hidden border-b border-gray-200">
                {/* Customer Service */}
                <div className="border-b border-gray-200">
                    <button
                        onClick={() => toggleSection('customer')}
                        className="w-full px-6 py-4 flex justify-between items-center"
                    >
                        <span className="font-medium text-[#2F4F3E]">Customer Service</span>
                        <ChevronDown
                            size={18}
                            className={`transition-transform ${openSection === 'customer' ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {openSection === 'customer' && (
                        <ul className="px-6 pb-4 space-y-2.5">
                            <li><Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900">FAQ</Link></li>
                            <li><Link href="/shipping" className="text-sm text-gray-600 hover:text-gray-900">Shipping & Returns</Link></li>
                            <li><Link href="/track-order" className="text-sm text-gray-600 hover:text-gray-900">Track Order</Link></li>
                        </ul>
                    )}
                </div>

                {/* Company */}
                <div className="border-b border-gray-200">
                    <button
                        onClick={() => toggleSection('company')}
                        className="w-full px-6 py-4 flex justify-between items-center"
                    >
                        <span className="font-medium text-[#2F4F3E]">Company</span>
                        <ChevronDown
                            size={18}
                            className={`transition-transform ${openSection === 'company' ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {openSection === 'company' && (
                        <ul className="px-6 pb-4 space-y-2.5">
                            <li><Link href="/about-us" className="text-sm text-gray-600 hover:text-gray-900">About Us</Link></li>
                            <li><Link href="/contact-us" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</Link></li>
                        </ul>
                    )}
                </div>

                {/* Policy Pages */}
                <div>
                    <button
                        onClick={() => toggleSection('policy')}
                        className="w-full px-6 py-4 flex justify-between items-center"
                    >
                        <span className="font-medium text-[#2F4F3E]">Legal</span>
                        <ChevronDown
                            size={18}
                            className={`transition-transform ${openSection === 'policy' ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {openSection === 'policy' && (
                        <ul className="px-6 pb-4 space-y-2.5">
                            <li><Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
                            <li><Link href="/terms-service" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</Link></li>
                            <li><Link href="/refund-policy" className="text-sm text-gray-600 hover:text-gray-900">Refund Policy</Link></li>
                        </ul>
                    )}
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block px-8 xl:px-16 2xl:px-24 py-12">
                <div className="w-full">
                    <div className="grid grid-cols-5 gap-12 xl:gap-16 2xl:gap-20 mb-12">
                        {/* Logo & Description */}
                        <div className="col-span-1">
                            <div className="text-2xl font-bold flex items-center gap-2">
                                <span className="text-3xl">🌿</span>
                                Groves Box
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 leading-relaxed mt-4">
                                    Bringing nature to your doorstep with premium plants and expert care guides.
                                </p>
                            </div>
                        </div>

                        {/* Customer Service */}
                        <div>
                            <h3 className="font-semibold mb-4">Customer Service</h3>
                            <ul className="space-y-2.5">
                                <li><Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900 transition">FAQ</Link></li>
                                <li><Link href="/shipping" className="text-sm text-gray-600 hover:text-gray-900 transition">Shipping & Returns</Link></li>
                                <li><Link href="/track-order" className="text-sm text-gray-600 hover:text-gray-900 transition">Track Order</Link></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-2.5">
                                <li><Link href="/about-us" className="text-sm text-gray-600 hover:text-gray-900 transition">About Us</Link></li>
                                <li><Link href="/contact-us" className="text-sm text-gray-600 hover:text-gray-900 transition">Contact Us</Link></li>
                            </ul>
                        </div>

                        {/* Policy Pages */}
                        <div>
                            <h3 className="font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2.5">
                                <li><Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-gray-900 transition">Privacy Policy</Link></li>
                                <li><Link href="/terms-service" className="text-sm text-gray-600 hover:text-gray-900 transition">Terms of Service</Link></li>
                                <li><Link href="/refund-policy" className="text-sm text-gray-600 hover:text-gray-900 transition">Refund Policy</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className="font-semibold mb-4">Stay Connected</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Subscribe for updates and exclusive offers
                            </p>
                            <form onSubmit={handleNewsletterSubscribe} className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-900"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-[#007B57] text-white px-6 py-2.5 text-sm font-medium rounded hover:bg-[#009A7B] transition"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="border-t border-gray-200 pt-8">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">© 2026 Groves Box. All rights reserved.</p>

                            {/* Social Icons */}
                            <div className="flex gap-4">
                                <a href="#" className="text-gray-500 hover:text-gray-900 transition">
                                    <Facebook size={20} />
                                </a>
                                <a href="#" className="text-gray-500 hover:text-gray-900 transition">
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="text-gray-500 hover:text-gray-900 transition">
                                    <Youtube size={20} />
                                </a>
                                <a href="#" className="text-gray-500 hover:text-gray-900 transition">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 2H1L9.26086 13.0145L1.44995 21.9999H4.09998L10.4883 14.651L16 22H23L14.3917 10.5223L21.8001 2H19.1501L13.1643 8.88578L8 2ZM17 20L5 4H7L19 20H17Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom */}
            <div className="lg:hidden px-6 py-6 border-t border-gray-200">
                <h2 className="text-xl font-light text-[#2F4F3E] mb-2">Groves Box</h2>
                <p className="text-xs text-gray-500 mb-6">© 2026 Groves Box. All rights reserved.</p>

                {/* Social Icons */}
                <div className="flex gap-4">
                    <a href="#" className="text-gray-500 hover:text-gray-900 transition">
                        <Facebook size={20} />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-900 transition">
                        <Instagram size={20} />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-900 transition">
                        <Youtube size={20} />
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-900 transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 2H1L9.26086 13.0145L1.44995 21.9999H4.09998L10.4883 14.651L16 22H23L14.3917 10.5223L21.8001 2H19.1501L13.1643 8.88578L8 2ZM17 20L5 4H7L19 20H17Z" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}