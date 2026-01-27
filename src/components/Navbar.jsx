'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Heart, User, ShoppingCart, ChevronDown, Menu, X, ChevronRight, ChevronLeft } from 'lucide-react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll event
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navItems = [
        { name: "Valentine's Day", icon: '💚', hasArrow: false },
        { name: 'New Arrivals', hasArrow: true },
        { name: 'Large Plants', hasArrow: false },
        { name: 'Houseplants', hasArrow: true },
        { name: 'Outdoor & Patio', hasArrow: true },
        { name: 'Orchids & Blooms', hasArrow: true },
        { name: 'Gifts', hasArrow: true },
        { name: 'Planters & Care', hasArrow: true },
        { name: 'Corporate Gifts', hasArrow: false },
        { name: 'Sale', hasArrow: false },
    ];

    const dropdownContent = {
        'New Arrivals': [
            { title: 'Team Picks', link: '#' },
            { title: 'New Houseplants', link: '#' },
        ],
        'Houseplants': [
            { title: 'All Houseplants', link: '#' },
            { title: 'Low Light', link: '#' },
            { title: 'Pet Friendly', link: '#' },
        ],
    };

    return (
        <nav className={`sticky top-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-[#fee1d1]'}`}>

            {/* Top Bar */}
            {/* <div className="bg-emerald-700 text-white py-2.5 px-4 relative">
                <button className="absolute left-4 top-1/2 -translate-y-1/2 hover:opacity-80">
                    <ChevronLeft size={20} />
                </button>
                <div className="text-center text-sm font-normal">
                    Free Shipping Over $79 + 30-Day Happiness Guarantee
                </div>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80">
                    <ChevronRight size={20} />
                </button>
            </div> */}

            {/* Main Navbar */}
            <div className="container mx-auto px-4">
                {/* Top Section */}
                <div className="flex items-center justify-between py-4 border-b border-[#0000000D]">

                    {/* Logo */}
                    <div className="flex items-center gap-1">
                        <button
                            className="md:hidden p-2 -ml-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <h1 className="text-3xl font-serif tracking-tight flex items-center">
                            <span className="font-light">Groves Box</span>
                            {/* <span className="ml-3 font-normal">Sill</span> */}
                        </h1>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search for plants ..."
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <Search size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Growing Zone */}
                        <button className="hidden lg:flex items-center gap-2 text-sm hover:text-emerald-600 transition-colors">
                            <MapPin size={18} className="text-emerald-600" />
                            <div className="text-left">
                                <div className="font-medium">Growing Zone</div>
                                <div className="text-xs text-gray-500">Zip Code: 500028</div>
                            </div>
                        </button>

                        {/* Wishlist */}
                        <button className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Heart size={22} className="text-gray-700" />
                        </button>

                        {/* Account */}
                        <button className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <User size={22} className="text-gray-700" />
                        </button>

                        {/* Cart */}
                        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ShoppingCart size={22} className="text-gray-700" />
                            <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                3
                            </span>
                        </button>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:block">
                    <ul className="flex items-center gap-8 py-4 overflow-x-auto">
                        {navItems.map((item, index) => (
                            <li
                                key={index}
                                className="relative whitespace-nowrap"
                                onMouseEnter={() => item.hasArrow && dropdownContent[item.name] && setHoveredItem(item.name)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <a
                                    href="#"
                                    className="flex items-center gap-1.5 text-sm font-medium text-gray-800 hover:text-emerald-600 transition-colors"
                                >
                                    {item.icon && <span className="text-base">{item.icon}</span>}
                                    {item.name}
                                    {item.hasArrow && dropdownContent[item.name] && <ChevronDown size={16} className="ml-0.5" />}
                                </a>

                                {/* Dropdown */}
                                {item.hasArrow && hoveredItem === item.name && dropdownContent[item.name] && (
                                    <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md py-2 min-w-[200px] z-50">
                                        {dropdownContent[item.name].map((subItem, subIndex) => (
                                            <a
                                                key={subIndex}
                                                href={subItem.link}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                            >
                                                {subItem.title}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Mobile Sidebar Menu */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="md:hidden fixed inset-0 bg-white/60 backdrop-blur-sm z-40"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="md:hidden fixed left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white z-50 overflow-y-auto shadow-2xl">

                        {/* Top Bar in Sidebar */}
                        {/* <div className="bg-emerald-700 text-white py-2.5 px-4 relative">
                            <button className="absolute left-4 top-1/2 -translate-y-1/2 hover:opacity-80">
                                <ChevronLeft size={20} />
                            </button>
                            <div className="text-center text-sm font-normal">
                                Free Shipping Over $79 + 30-Day Happiness Guarantee
                            </div>
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-80">
                                <ChevronRight size={20} />
                            </button>
                        </div> */}

                        {/* Logo and Close */}
                        <div className="flex items-center justify-between px-4 py-4 border-b">
                            <button onClick={() => setIsMenuOpen(false)} className="p-1">
                                <X size={24} className="text-gray-700" />
                            </button>
                            <h1 className="text-3xl font-serif tracking-tight flex items-center">
                                <span className="font-light">The</span>
                                <span className="ml-3 font-normal">Sill</span>
                            </h1>
                            <div className="w-6" /> {/* Spacer for balance */}
                        </div>

                        {/* Navigation Items */}
                        <nav className="py-2">
                            {navItems.map((item, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                                >
                                    <span className="flex items-center gap-2.5 text-gray-800 font-normal text-base">
                                        {item.icon && <span className="text-lg">{item.icon}</span>}
                                        {item.name}
                                    </span>
                                    {item.hasArrow && (
                                        <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600" />
                                    )}
                                </a>
                            ))}

                            {/* View Wishlist */}
                            <a
                                href="#"
                                className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                <Heart size={20} className="text-gray-700" />
                                <span className="text-gray-800 font-normal text-base">View Wishlist</span>
                            </a>
                        </nav>

                        {/* Bottom Actions */}
                        <div className="absolute bottom-0 left-0 right-0 border-t bg-white">
                            <div className="grid grid-cols-2 divide-x">
                                <a
                                    href="#"
                                    className="flex items-center justify-center gap-2 py-4 hover:bg-gray-50 transition-colors"
                                >
                                    <User size={20} className="text-gray-700" />
                                    <span className="text-gray-800 text-sm font-normal">Log in</span>
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center justify-center gap-2 py-4 hover:bg-gray-50 transition-colors"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-gray-700"
                                    >
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                        <path d="M2 17l10 5 10-5" />
                                        <path d="M2 12l10 5 10-5" />
                                    </svg>
                                    <span className="text-gray-800 text-sm font-normal">Resources</span>
                                </a>
                            </div>

                            {/* Accessibility Badge */}
                            <div className="flex justify-center py-3 bg-gray-50">
                                <div className="bg-emerald-600 rounded-full w-10 h-10 flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                        <circle cx="12" cy="8" r="2" />
                                        <path d="M12 14c-3 0-5 2-5 4v2h10v-2c0-2-2-4-5-4z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}