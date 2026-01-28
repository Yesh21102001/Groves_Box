'use client';

import Link from 'next/link';
import { Facebook, Instagram, Youtube, Twitter, Mail } from 'lucide-react';

export default function Footer() {
    const handleNewsletterSubscribe = (e) => {
        e.preventDefault();
    };

    return (
        <footer className="bg-white border-t border-gray-200">
            {/* Newsletter Section */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="w-full px-4 md:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
                    <div className="max-w-7xl mx-auto max-w-md lg:max-w-lg">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-6 md:mb-8 text-gray-900">Get the Dirt.</h2>
                        <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10">
                            Get plant care tips, exclusive offers, & 10% off your first order straight to your inbox. No spam, ever.
                        </p>
                        <form onSubmit={handleNewsletterSubscribe} className="flex gap-2 md:gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 md:px-5 py-3 md:py-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-gray-900 text-white px-6 md:px-8 py-3 md:py-4 font-medium hover:bg-gray-800 transition rounded-md text-base"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="w-full px-4 md:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-16 mb-12 md:mb-16 lg:mb-20">
                        {/* Customer Service */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-6 md:mb-8 text-lg">Customer Service</h3>
                            <ul className="space-y-3 md:space-y-4">
                                <li>
                                    <Link href="#" className="text-base text-gray-600 hover:text-gray-900 transition">
                                        FAQ
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-base text-gray-600 hover:text-gray-900 transition">
                                        Shipping & Returns
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-base text-gray-600 hover:text-gray-900 transition">
                                        30-Day Happiness Guarantee
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-base text-gray-600 hover:text-gray-900 transition">
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-6 md:mb-8 text-lg">Resources</h3>
                            <ul className="space-y-3 md:space-y-4">
                                <li>
                                    <Link href="#" className="text-base text-gray-600 hover:text-gray-900 transition">
                                        Plant Care Library
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-base text-gray-600 hover:text-gray-900 transition">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-base text-gray-600 hover:text-gray-900 transition">
                                        Workshops
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-base text-gray-600 hover:text-gray-900 transition">
                                        Plant Parenthood®
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* My Sill */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-6 md:mb-8 text-lg">My Sill</h3>
                            <ul className="space-y-3 md:space-y-4">
                                <li>
                                    <Link href="/account" className="text-base text-gray-600 hover:text-gray-900 transition">
                                        My Account
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-base text-gray-600 hover:text-gray-900 transition">
                                        Orders
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/account" className="text-base text-gray-600 hover:text-gray-900 transition">
                                        Wishlist
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Explore */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-6 md:mb-8 text-lg">Explore</h3>
                            <ul className="space-y-3 md:space-y-4">
                                <li>
                                    <Link href="#" className="text-base text-gray-600 hover:text-gray-900 transition">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-base text-gray-600 hover:text-gray-900 transition">
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-base text-gray-600 hover:text-gray-900 transition">
                                        Corporate Gifting
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Follow Us */}
                        <div>
                            <h3 className="font-medium text-gray-900 mb-6 md:mb-8 text-lg">#PlantsMakePeopleHappy</h3>
                            <div className="flex gap-6">
                                <a href="#" className="text-gray-600 hover:text-gray-900 transition">
                                    <Facebook size={24} />
                                </a>
                                <a href="#" className="text-gray-600 hover:text-gray-900 transition">
                                    <Instagram size={24} />
                                </a>
                                <a href="#" className="text-gray-600 hover:text-gray-900 transition">
                                    <Youtube size={24} />
                                </a>
                                <a href="#" className="text-gray-600 hover:text-gray-900 transition">
                                    <Twitter size={24} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-200 w-full px-4 md:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
                        <p className="text-base text-gray-600">
                            Copyright 2026 — The Sill, Inc.
                        </p>
                        <div className="flex gap-8 md:gap-10">
                            <Link href="#" className="text-base text-gray-600 hover:text-gray-900 transition">
                                Terms of Use
                            </Link>
                            <Link href="#" className="text-base text-gray-600 hover:text-gray-900 transition">
                                Privacy Policy
                            </Link>
                            <Link href="#" className="text-base text-gray-600 hover:text-gray-900 transition">
                                Accessibility
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
