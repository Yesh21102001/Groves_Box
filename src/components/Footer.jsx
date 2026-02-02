'use client';

import Link from 'next/link';
import { Facebook, Instagram, Youtube, Twitter, Mail, ChevronDown } from 'lucide-react';
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
        <footer className="bg-[white]">
            {/* Mobile Newsletter - Visible only on mobile */}
            <div className="lg:hidden w-full px-4 py-8 bg-white border-b border-gray-200">
                <h2 className="text-3xl font-sans font-light mb-3 text-gray-900">Get the Dirt.</h2>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    Get plant care tips, exclusive offers, & 10% off your first order straight to your inbox. No spam, ever.
                </p>
                <form onSubmit={handleNewsletterSubscribe} className="space-y-2">
                    <input
                        type="email"
                        placeholder="Enter your email here ..."
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 placeholder:text-gray-400"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-black text-white px-6 py-3 font-medium transition rounded text-sm"
                    >
                        Subscribe
                    </button>
                </form>

                {/* Social Icons - Mobile */}
                <div className="flex gap-4 mt-6 justify-center">
                    <a href="#" className="text-gray-700 hover:text-gray-900 transition">
                        <Facebook size={20} />
                    </a>
                    <a href="#" className="text-gray-700 hover:text-gray-900 transition">
                        <Instagram size={20} />
                    </a>
                    <a href="#" className="text-gray-700 hover:text-gray-900 transition">
                        <Youtube size={20} />
                    </a>
                    <a href="#" className="text-gray-700 hover:text-gray-900 transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 2H1L9.26086 13.0145L1.44995 21.9999H4.09998L10.4883 14.651L16 22H23L14.3917 10.5223L21.8001 2H19.1501L13.1643 8.88578L8 2ZM17 20L5 4H7L19 20H17Z" />
                        </svg>
                    </a>
                    <a href="#" className="text-gray-700 hover:text-gray-900 transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Mobile Accordion Sections */}
            <div className="lg:hidden border-b border-gray-200 p-4">
                {/* Customer Service */}
                <div className="border-b border-gray-200 p-2">
                    <button
                        onClick={() => toggleSection('customer')}
                        className="w-full px-4 py-4 flex justify-between items-center text-left"
                    >
                        <h3 className="font-medium text-gray-900 text-base">Customer Service</h3>
                        <ChevronDown
                            size={20}
                            className={`transform transition-transform ${openSection === 'customer' ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {openSection === 'customer' && (
                        <ul className="px-4 pb-4 space-y-3">
                            <li>
                                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
                                    Shipping & Handling
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
                                    30-Day Guarantee
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>

                {/* Resources */}
                <div className="border-b border-gray-200 p-2">
                    <button
                        onClick={() => toggleSection('resources')}
                        className="w-full px-4 py-4 flex justify-between items-center text-left"
                    >
                        <h3 className="font-medium text-gray-900 text-base">Resources</h3>
                        <ChevronDown
                            size={20}
                            className={`transform transition-transform ${openSection === 'resources' ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {openSection === 'resources' && (
                        <ul className="px-4 pb-4 space-y-3">
                            <li>
                                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
                                    Find Your Plant
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
                                    Plant Care Library
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
                                    Free Online Courses
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>

                {/* My Sill */}
                <div className="p-2">
                    <button
                        onClick={() => toggleSection('mysill')}
                        className="w-full px-4 py-4 flex justify-between items-center text-left"
                    >
                        <h3 className="font-medium text-gray-900 text-base">My Sill</h3>
                        <ChevronDown
                            size={20}
                            className={`transform transition-transform ${openSection === 'mysill' ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {openSection === 'mysill' && (
                        <ul className="px-4 pb-4 space-y-3">
                            <li>
                                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
                                    My Account
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
                                    Workshops
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
                                    Track My Order
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>

                {/* Explore */}
                {/* <div className="border-b border-gray-200">
                    <button
                        onClick={() => toggleSection('explore')}
                        className="w-full px-4 py-4 flex justify-between items-center text-left"
                    >
                        <h3 className="font-medium text-gray-900 text-base">Explore</h3>
                        <ChevronDown
                            size={20}
                            className={`transform transition-transform ${openSection === 'explore' ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {openSection === 'explore' && (
                        <ul className="px-4 pb-4 space-y-3">
                            <li>
                                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
                                    Our Story
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-gray-700 hover:text-gray-900 transition">
                                    Corporate Gifting
                                </Link>
                            </li>
                        </ul>
                    )}
                </div> */}
            </div>

            {/* Desktop Layout - Hidden on mobile */}
            <div className="hidden lg:block w-full px-4 md:px-6 lg:px-8 xl:px-12 py-8 md:py-10 lg:py-12">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 xl:gap-16 mb-8 md:mb-10">
                        {/* Customer Service */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-3 xl:mb-4 text-sm xl:text-base tracking-wide">Customer Service</h3>
                            <ul className="space-y-2 xl:space-y-3">
                                <li>
                                    <Link href="#" className="text-sm xl:text-base text-gray-700 hover:text-gray-900 transition">
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm xl:text-base text-gray-700 hover:text-gray-900 transition">
                                        Shipping & Handling
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm xl:text-base text-gray-700 hover:text-gray-900 transition">
                                        30-Day Guarantee
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm xl:text-base text-gray-700 hover:text-gray-900 transition">
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-3 xl:mb-4 text-sm xl:text-base tracking-wide">Resources</h3>
                            <ul className="space-y-2 xl:space-y-3">
                                <li>
                                    <Link href="#" className="text-sm xl:text-base text-gray-700 hover:text-gray-900 transition">
                                        Find Your Plant
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm xl:text-base text-gray-700 hover:text-gray-900 transition">
                                        Plant Care Library
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm xl:text-base text-gray-700 hover:text-gray-900 transition">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm xl:text-base text-gray-700 hover:text-gray-900 transition">
                                        Free Online Courses
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* My Sill */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-3 xl:mb-4 text-sm xl:text-base tracking-wide">My Sill</h3>
                            <ul className="space-y-2 xl:space-y-3">
                                <li>
                                    <Link href="#" className="text-sm xl:text-base text-gray-700 hover:text-gray-900 transition">
                                        My Account
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm xl:text-base text-gray-700 hover:text-gray-900 transition">
                                        Workshops
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm xl:text-base text-gray-700 hover:text-gray-900 transition">
                                        Track My Order
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Explore */}
                        {/* <div>
                            <h3 className="font-medium text-gray-900 mb-3 xl:mb-4 text-sm xl:text-base tracking-wide">Explore</h3>
                            <ul className="space-y-2 xl:space-y-3">
                                <li>
                                    <Link href="#" className="text-sm xl:text-base text-gray-700 hover:text-gray-900 transition">
                                        Our Story
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm xl:text-base text-gray-700 hover:text-gray-900 transition">
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-sm xl:text-base text-gray-700 hover:text-gray-900 transition">
                                        Corporate Gifting
                                    </Link>
                                </li>
                            </ul>
                        </div> */}

                        {/* Newsletter Section - Desktop */}
                        <div className="col-span-2 md:col-span-4 lg:col-span-1 xl:min-w-[400px]">
                            <h2 className="text-3xl md:text-4xl xl:text-5xl font-sans font-light mb-3 xl:mb-4 text-gray-900">Get the Dirt.</h2>
                            <p className="text-sm xl:text-base text-gray-700 mb-4 xl:mb-5 leading-relaxed">
                                Get plant care tips, exclusive offers, & 10% off your first order straight to your inbox. No spam, ever.
                            </p>
                            <form onSubmit={handleNewsletterSubscribe} className="space-y-2 xl:space-y-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email here ..."
                                    className="w-full px-4 xl:px-5 py-3 xl:py-3.5 text-sm xl:text-base border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 placeholder:text-gray-400"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white px-6 py-3 xl:py-3.5 font-medium transition rounded text-sm xl:text-base"
                                >
                                    Subscribe
                                </button>
                            </form>

                            {/* Social Icons - Desktop */}
                            <div className="flex gap-4 xl:gap-5 mt-5 xl:mt-6">
                                <a href="#" className="text-gray-700 hover:text-gray-900 transition">
                                    <Facebook size={20} className="xl:w-6 xl:h-6" />
                                </a>
                                <a href="#" className="text-gray-700 hover:text-gray-900 transition">
                                    <Instagram size={20} className="xl:w-6 xl:h-6" />
                                </a>
                                <a href="#" className="text-gray-700 hover:text-gray-900 transition">
                                    <Youtube size={20} className="xl:w-6 xl:h-6" />
                                </a>
                                <a href="#" className="text-gray-700 hover:text-gray-900 transition">
                                    <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 2H1L9.26086 13.0145L1.44995 21.9999H4.09998L10.4883 14.651L16 22H23L14.3917 10.5223L21.8001 2H19.1501L13.1643 8.88578L8 2ZM17 20L5 4H7L19 20H17Z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-700 hover:text-gray-900 transition">
                                    <svg className="w-5 h-5 xl:w-6 xl:h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* The Sill Logo */}
                    <div className="border-t border-gray-300 pt-6 xl:pt-8">
                        <div className="flex items-center justify-between mb-6 xl:mb-8">
                            <div className="text-5xl md:text-6xl xl:text-7xl font-sans text-gray-900">
                                <span className="text-2xl sm:text-3xl md:text-3xl lg:text-3xl 2xl:text-5xl font-sans font-light text-gray-900">Groves Box</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Sill Logo - Mobile */}
            <div className="lg:hidden w-full px-4 py-8">
                <div className="text-5xl font-sans text-gray-900 mb-6">
                    <span className="font-light">Groves Box</span>
                </div>
                <p className="text-xs text-gray-600 mb-6">
                    Copyright 2026 — The Sill, Inc.
                </p>
                <div className="space-y-3 text-sm">
                    <div>
                        <Link href="#" className="text-gray-700 hover:text-gray-900 transition block">
                            Affiliate Program
                        </Link>
                    </div>
                    <div>
                        <Link href="#" className="text-gray-700 hover:text-gray-900 transition block">
                            Terms of Use
                        </Link>
                    </div>
                    <div>
                        <Link href="#" className="text-gray-700 hover:text-gray-900 transition block">
                            Privacy Policy
                        </Link>
                    </div>
                    <div>
                        <Link href="#" className="text-gray-700 hover:text-gray-900 transition block">
                            Accessibility
                        </Link>
                    </div>
                    <div>
                        <Link href="#" className="text-gray-700 hover:text-gray-900 transition block">
                            Do Not Sell My Info
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Desktop Only */}
            <div className="hidden lg:block w-full px-4 md:px-6 lg:px-8 xl:px-12 pb-6 xl:pb-8">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <p className="text-xs xl:text-sm text-gray-600">
                            Copyright 2026 — The Sill, Inc.
                        </p>
                        <div className="flex flex-wrap gap-6 md:gap-8 xl:gap-10 text-xs xl:text-sm">
                            <Link href="#" className="text-gray-600 hover:text-gray-900 transition">
                                Affiliate Program
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-gray-900 transition">
                                Terms of Use
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-gray-900 transition">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-gray-900 transition">
                                Accessibility
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-gray-900 transition">
                                Do Not Sell My Info
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}