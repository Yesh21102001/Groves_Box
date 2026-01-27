'use client';

import { useState } from 'react';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

export default function Footer() {
    const [openSection, setOpenSection] = useState(null);
    const [email, setEmail] = useState('');

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const footerSections = {
        customerService: {
            title: 'Customer Service',
            links: [
                { name: 'FAQ', href: '#' },
                { name: 'Shipping & Handling', href: '#' },
                { name: '30-Day Guarantee', href: '#' },
                { name: 'Contact Us', href: '#' },
            ],
        },
        resources: {
            title: 'Resources',
            links: [
                { name: 'Find Your Plant', href: '#' },
                { name: 'Plant Care Library', href: '#' },
                { name: 'Blog', href: '#' },
                { name: 'Free Online Courses', href: '#' },
            ],
        },
        mySill: {
            title: 'My Sill',
            links: [
                { name: 'My Account', href: '#' },
                { name: 'Workshops', href: '#' },
                { name: 'Track My Order', href: '#' },
            ],
        },
        explore: {
            title: 'Explore',
            links: [
                { name: 'Our Story', href: '#' },
                { name: 'Careers', href: '#' },
                { name: 'Corporate Gifting', href: '#' },
            ],
        },
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        console.log('Subscribe with email:', email);
    };

    return (
        <footer className="bg-[#fee1d1]">
            {/* Desktop Footer */}
            <div className="hidden md:block">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-12 gap-8">
                        {/* Customer Service */}
                        <div className="col-span-2">
                            <h3 className="font-serif text-lg font-normal mb-4 text-gray-800">
                                {footerSections.customerService.title}
                            </h3>
                            <ul className="space-y-2.5">
                                {footerSections.customerService.links.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className="text-gray-600 text-sm hover:text-emerald-600 transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div className="col-span-2">
                            <h3 className="font-serif text-lg font-normal mb-4 text-gray-800">
                                {footerSections.resources.title}
                            </h3>
                            <ul className="space-y-2.5">
                                {footerSections.resources.links.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className="text-gray-600 text-sm hover:text-emerald-600 transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* My Sill */}
                        <div className="col-span-2">
                            <h3 className="font-serif text-lg font-normal mb-4 text-gray-800">
                                {footerSections.mySill.title}
                            </h3>
                            <ul className="space-y-2.5">
                                {footerSections.mySill.links.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className="text-gray-600 text-sm hover:text-emerald-600 transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Explore */}
                        <div className="col-span-2">
                            <h3 className="font-serif text-lg font-normal mb-4 text-gray-800">
                                {footerSections.explore.title}
                            </h3>
                            <ul className="space-y-2.5">
                                {footerSections.explore.links.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className="text-gray-600 text-sm hover:text-emerald-600 transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter Signup */}
                        <div className="col-span-4">
                            <h2 className="font-serif text-3xl font-normal mb-3 text-gray-800">
                                Get the Dirt.
                            </h2>
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                                Get plant care tips, exclusive offers, & 10% off your first order
                                straight to your inbox. No spam, ever.
                            </p>
                            <form onSubmit={handleSubscribe} className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email here ..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-emerald-700 text-white py-3 font-medium hover:bg-emerald-800 transition-colors text-sm"
                                >
                                    Subscribe
                                </button>
                            </form>

                            {/* Social Icons */}
                            <div className="flex items-center gap-4 mt-8">
                                <a href="#" className="text-gray-800 hover:text-emerald-600 transition-colors">
                                    <Facebook size={20} fill="currentColor" />
                                </a>
                                <a href="#" className="text-gray-800 hover:text-emerald-600 transition-colors">
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="text-gray-800 hover:text-emerald-600 transition-colors">
                                    <Youtube size={20} fill="currentColor" />
                                </a>
                                <a href="#" className="text-gray-800 hover:text-emerald-600 transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-800 hover:text-emerald-600 transition-colors">
                                    <Twitter size={20} />
                                </a>
                                <a href="#" className="text-gray-800 hover:text-emerald-600 transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                    </svg>
                                </a>
                            </div>

                            {/* Decorative Plant Image */}
                            {/* <div className="mt-6">
                                <div className="w-32 h-32 bg-emerald-700 rounded-full opacity-20"></div>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-300">
                    <div className="container mx-auto px-6 py-6">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-1">
                                    <h1 className="text-4xl font-serif tracking-tight flex items-center">
                                        <span className="font-light">The</span>
                                        <span className="ml-3 font-normal border-b-2 border-gray-800 pb-1">Sill</span>
                                    </h1>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Copyright 2026 — GRoves Box, Inc.
                                </p>
                            </div>

                            {/* Legal Links */}
                            <div className="flex items-center gap-6">
                                <a href="#" className="text-gray-700 text-sm hover:text-emerald-600 transition-colors">
                                    Affiliate Program
                                </a>
                                <a href="#" className="text-gray-700 text-sm hover:text-emerald-600 transition-colors">
                                    Terms of Use
                                </a>
                                <a href="#" className="text-gray-700 text-sm hover:text-emerald-600 transition-colors">
                                    Privacy Policy
                                </a>
                                <a href="#" className="text-gray-700 text-sm hover:text-emerald-600 transition-colors">
                                    Accessibility
                                </a>
                                <a href="#" className="text-gray-700 text-sm hover:text-emerald-600 transition-colors">
                                    Do Not Sell My Info
                                </a>
                                {/* Accessibility Badge */}
                                {/* <div className="bg-emerald-600 rounded-full w-8 h-8 flex items-center justify-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                        <circle cx="12" cy="8" r="2" />
                                        <path d="M12 14c-3 0-5 2-5 4v2h10v-2c0-2-2-4-5-4z" />
                                    </svg>
                                </div> */}
                                {/* Chat Button */}
                                {/* <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <div className="bg-gray-900 rounded-full w-6 h-6 flex items-center justify-center">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h10V12C22 6.48 17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8v8h-8z" />
                                            <circle cx="9" cy="12" r="1.5" />
                                            <circle cx="15" cy="12" r="1.5" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">Chat with us</span>
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Footer */}
            <div className="md:hidden">
                {/* Newsletter Section */}
                <div className="px-6 py-8 bg-white">
                    <h2 className="font-serif text-3xl font-normal mb-3 text-gray-800">
                        Get the Dirt.
                    </h2>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                        Get plant care tips, exclusive offers, & 10% off your first order
                        straight to your inbox. No spam, ever.
                    </p>
                    <form onSubmit={handleSubscribe} className="space-y-3">
                        <input
                            type="email"
                            placeholder="Enter your email here ..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-emerald-700 text-white py-3 font-medium hover:bg-emerald-800 transition-colors text-sm"
                        >
                            Subscribe
                        </button>
                    </form>

                    {/* Social Icons */}
                    <div className="flex items-center justify-center gap-6 mt-8 pt-8 border-t border-gray-200">
                        <a href="#" className="text-gray-800 hover:text-emerald-600 transition-colors">
                            <Facebook size={22} fill="currentColor" />
                        </a>
                        <a href="#" className="text-gray-800 hover:text-emerald-600 transition-colors">
                            <Instagram size={22} />
                        </a>
                        <a href="#" className="text-gray-800 hover:text-emerald-600 transition-colors">
                            <Youtube size={22} fill="currentColor" />
                        </a>
                        <a href="#" className="text-gray-800 hover:text-emerald-600 transition-colors">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-800 hover:text-emerald-600 transition-colors">
                            <Twitter size={22} />
                        </a>
                        <a href="#" className="text-gray-800 hover:text-emerald-600 transition-colors">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Accordion Sections */}
                <div className="bg-stone-100 border-t border-gray-200">
                    {/* Customer Service */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('customerService')}
                            className="w-full flex items-center justify-between px-6 py-5 text-left"
                        >
                            <h3 className="font-serif text-lg font-normal text-gray-800">
                                Customer Service
                            </h3>
                            <ChevronDown
                                size={20}
                                className={`text-gray-600 transition-transform ${openSection === 'customerService' ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {openSection === 'customerService' && (
                            <div className="px-6 pb-5">
                                <ul className="space-y-3">
                                    {footerSections.customerService.links.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                href={link.href}
                                                className="text-gray-600 text-sm hover:text-emerald-600 transition-colors block"
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Resources */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('resources')}
                            className="w-full flex items-center justify-between px-6 py-5 text-left"
                        >
                            <h3 className="font-serif text-lg font-normal text-gray-800">
                                Resources
                            </h3>
                            <ChevronDown
                                size={20}
                                className={`text-gray-600 transition-transform ${openSection === 'resources' ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {openSection === 'resources' && (
                            <div className="px-6 pb-5">
                                <ul className="space-y-3">
                                    {footerSections.resources.links.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                href={link.href}
                                                className="text-gray-600 text-sm hover:text-emerald-600 transition-colors block"
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* My Sill */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('mySill')}
                            className="w-full flex items-center justify-between px-6 py-5 text-left"
                        >
                            <h3 className="font-serif text-lg font-normal text-gray-800">
                                Groves Box
                            </h3>
                            <ChevronDown
                                size={20}
                                className={`text-gray-600 transition-transform ${openSection === 'mySill' ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {openSection === 'mySill' && (
                            <div className="px-6 pb-5">
                                <ul className="space-y-3">
                                    {footerSections.mySill.links.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                href={link.href}
                                                className="text-gray-600 text-sm hover:text-emerald-600 transition-colors block"
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Explore */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('explore')}
                            className="w-full flex items-center justify-between px-6 py-5 text-left"
                        >
                            <h3 className="font-serif text-lg font-normal text-gray-800">
                                Explore
                            </h3>
                            <ChevronDown
                                size={20}
                                className={`text-gray-600 transition-transforms ${openSection === 'explore' ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {openSection === 'explore' && (
                            <div className="px-6 pb-5">
                                <ul className="space-y-3">
                                    {footerSections.explore.links.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                href={link.href}
                                                className="text-gray-600 text-sm hover:text-emerald-600 transition-colors block"
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Bottom Section */}
                <div className="bg-[#fee1d1] px-6 py-8">
                    {/* Logo */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-4xl font-serif tracking-tight flex items-center">
                            <span className="font-light">Groves Box</span>
                            {/* <span className="ml-3 font-normal border-b-2 border-gray-800 pb-1">Sill</span> */}
                        </h1>
                    </div>

                    {/* Copyright */}
                    <p className="text-gray-600 text-sm mb-6">
                        Copyright 2026 — GRoves Box, Inc.
                    </p>

                    {/* Legal Links */}
                    <div className="space-y-3 mb-8">
                        <a href="#" className="block text-gray-700 text-sm hover:text-emerald-600 transition-colors">
                            Affiliate Program
                        </a>
                        <a href="#" className="block text-gray-700 text-sm hover:text-emerald-600 transition-colors">
                            Terms of Use
                        </a>
                        <a href="#" className="block text-gray-700 text-sm hover:text-emerald-600 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="block text-gray-700 text-sm hover:text-emerald-600 transition-colors">
                            Accessibility
                        </a>
                        <a href="#" className="block text-gray-700 text-sm hover:text-emerald-600 transition-colors">
                            Do Not Sell My Info
                        </a>
                    </div>

                    {/* Chat & Accessibility */}
                    {/* <div className="flex items-center gap-4">
                        <div className="bg-emerald-600 rounded-full w-10 h-10 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <circle cx="12" cy="8" r="2" />
                                <path d="M12 14c-3 0-5 2-5 4v2h10v-2c0-2-2-4-5-4z" />
                            </svg>
                        </div>
                        <button className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-md hover:shadow-lg transition-shadow flex-1 justify-center">
                            <div className="bg-gray-900 rounded-full w-6 h-6 flex items-center justify-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h10V12C22 6.48 17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8v8h-8z" />
                                    <circle cx="9" cy="12" r="1.5" />
                                    <circle cx="15" cy="12" r="1.5" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-900">Chat with us</span>
                        </button>
                    </div> */}
                </div>
            </div>
        </footer>
    );
}