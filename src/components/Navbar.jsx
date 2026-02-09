'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, User, ShoppingCart, ChevronDown, Menu, X, MapPin, ChevronRight, Minus, Plus, Trash2, Home, Store } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [cartCount, setCartCount] = useState(3);
    const accountDropdownRef = useRef(null);

    // Sample cart items - replace with your actual cart data
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Monstera Deliciosa', price: 45.00, quantity: 1, image: '/placeholder-plant.jpg', size: 'Medium' },
        { id: 2, name: 'Snake Plant', price: 32.00, quantity: 2, image: '/placeholder-plant.jpg', size: 'Small' },
        { id: 3, name: 'Pothos', price: 28.00, quantity: 1, image: '/placeholder-plant.jpg', size: 'Medium' }
    ]);

    const navItems = [
        { name: 'Large Plants', href: '/collections/large-plants' },
        { name: 'Houseplants', href: '/collections/houseplants' },
        { name: 'Outdoor & Patio', href: '/collections/outdoor-patio' },
        { name: 'Planters & Care', href: '/collections/planters-care' },
    ];

    const handleOpenMenu = () => {
        setIsMenuOpen(true);
    };

    const handleCloseMenu = () => {
        setIsMenuOpen(false);
    };

    const handleOpenCart = (e) => {
        e.preventDefault();
        setIsCartOpen(true);
    };

    const handleCloseCart = () => {
        setIsCartOpen(false);
    };

    const toggleAccountDropdown = () => {
        setIsAccountDropdownOpen(!isAccountDropdownOpen);
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
        setCartCount(prev => prev - 1);
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    };

    // Close account dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
                setIsAccountDropdownOpen(false);
            }
        };

        if (isAccountDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAccountDropdownOpen]);

    // Prevent scroll when menu or cart is open
    useEffect(() => {
        if (isMenuOpen || isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen, isCartOpen]);

    return (
        <>
            <nav className="bg-[#F0F4F1] border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Top section with logo, search and icons */}
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Mobile Menu Toggle - Left Side */}
                        <button
                            onClick={handleOpenMenu}
                            className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <div className="text-2xl md:text-3xl font-bold text-[#2F4F3E] flex items-center gap-2">
                                <span className="text-3xl md:text-4xl">🌿</span>
                                <span className="hidden sm:inline">Groves Box</span>
                                <span className="sm:hidden">GB</span>
                            </div>
                        </Link>

                        {/* Center Search - Hidden on mobile */}
                        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
                            <div className="w-full relative">
                                <input
                                    type="text"
                                    placeholder="Search plants, planters, and more..."
                                    className="w-full px-4 py-2.5 pl-10  border border-[#2F4F3E]-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244033] focus:border-transparent"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Heart - Wishlist - Desktop Only */}
                            <Link href="/wishlist" className="hidden lg:block p-2 text-gray-700 hover:text-gray-900 transition-colors">
                                <Heart size={22} />
                            </Link>

                            {/* User Account Dropdown - Desktop Only */}
                            <div className="hidden lg:block relative group" ref={accountDropdownRef}>
                                <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
                                    <User size={22} />
                                </button>

                                <div
                                    className="
            absolute right-0 mt-2
            w-64
            bg-white
            rounded-lg
            shadow-lg
            border border-gray-200
            py-2
            z-50

            whitespace-nowrap
            opacity-0 invisible translate-y-1
            group-hover:opacity-100
            group-hover:visible
            group-hover:translate-y-0
            transition-all duration-200
        "
                                >
                                    <Link
                                        href="/login"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                                    >
                                        Log In
                                    </Link>

                                    <Link
                                        href="/signup"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            </div>



                            {/* Shopping Cart with badge */}
                            <button
                                onClick={handleOpenCart}
                                className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#244033] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Navigation Links - Desktop Only */}
                    <div className="hidden lg:flex justify-center items-center gap-2 pb-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-1 px-4 py-1.5 rounded-full font-medium transition-all duration-200 ${isActive
                                        ? 'bg-black text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {item.name}
                                    {item.hasArrow && (
                                        <ChevronDown size={16} className={isActive ? 'text-white' : 'text-gray-500'} />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
                <div className="flex items-center justify-around h-16 px-2">
                    {/* Home */}
                    <Link
                        href="/"
                        className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${pathname === '/'
                            ? 'text-black'
                            : 'text-gray-400 hover:text-black'
                            }`}
                    >
                        <Home size={24} />
                        <span className="text-xs mt-1 font-medium">Home</span>
                    </Link>

                    {/* Shop */}
                    <Link
                        href="/collections"
                        className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${pathname?.startsWith('/collections')
                            ? 'text-black'
                            : 'text-gray-400 hover:text-black'
                            }`}
                    >
                        <Store size={24} />
                        <span className="text-xs mt-1 font-medium">Shop</span>
                    </Link>

                    {/* Wishlist */}
                    <Link
                        href="/wishlist"
                        className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${pathname === '/wishlist'
                            ? 'text-black'
                            : 'text-gray-400 hover:text-black'
                            }`}
                    >
                        <Heart size={24} />
                        <span className="text-xs mt-1 font-medium">Wishlist</span>
                    </Link>

                    {/* Account */}
                    <Link
                        href="/account"
                        className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${pathname === '/account'
                            ? 'text-black'
                            : 'text-gray-400 hover:text-black'
                            }`}
                    >
                        <User size={24} />
                        <span className="text-xs mt-1 font-medium">Account</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Sidebar Menu */}
            <>
                {/* Backdrop */}
                <div
                    className={`lg:hidden fixed inset-0 bg-black z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                    onClick={handleCloseMenu}
                />

                {/* Sidebar */}
                <div
                    className={`lg:hidden fixed inset-y-0 left-0 w-80 bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="text-2xl font-bold text-[#2F4F3E] flex items-center gap-2">
                            <span className="text-3xl">🌿</span>
                            Groves Box
                        </div>
                        <button
                            onClick={handleCloseMenu}
                            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto">
                        {/* Collections Section */}
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-4 text-[#2F4F3E]">Collections</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Large Plants - Arch shape */}
                                <Link
                                    href="/collections/large-plants"
                                    onClick={handleCloseMenu}
                                    className="group"
                                >
                                    <div className="relative p-3 bg-orange-50 overflow-hidden transition-transform group-hover:scale-105" style={{ aspectRatio: '1' }}>
                                        <div
                                            className="absolute inset-3 flex items-center justify-center"
                                            style={{
                                                backgroundColor: '#fb923c',
                                                maskImage: 'url(/images/mask1.svg)',
                                                WebkitMaskImage: 'url(/images/mask1.svg)',
                                                maskSize: '100% 100%',
                                                WebkitMaskSize: '100% 100%',
                                                maskRepeat: 'no-repeat',
                                                WebkitMaskRepeat: 'no-repeat',
                                                maskPosition: 'center',
                                                WebkitMaskPosition: 'center'
                                            }}
                                        >
                                            <span className="text-white text-sm text-center px-2 relative z-10">
                                                Large Plants
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                {/* Houseplants - Rounded rectangle */}
                                <Link
                                    href="/collections/houseplants"
                                    onClick={handleCloseMenu}
                                    className="group"
                                >
                                    <div className="relative p-3 bg-teal-100 overflow-hidden transition-transform group-hover:scale-105" style={{ aspectRatio: '1' }}>
                                        <div
                                            className="absolute inset-3 flex items-center justify-center"
                                            style={{
                                                backgroundColor: '#15803d',
                                                maskImage: 'url(/images/mask2.svg)',
                                                WebkitMaskImage: 'url(/images/mask2.svg)',
                                                maskSize: '100% 100%',
                                                WebkitMaskSize: '100% 100%',
                                                maskRepeat: 'no-repeat',
                                                WebkitMaskRepeat: 'no-repeat',
                                                maskPosition: 'center',
                                                WebkitMaskPosition: 'center'
                                            }}
                                        >
                                            <span className="text-white text-sm text-center px-2 relative z-10">
                                                Houseplants
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                {/* Outdoor & Patio - Hourglass shape */}
                                <Link
                                    href="/collections/outdoor-patio"
                                    onClick={handleCloseMenu}
                                    className="group"
                                >
                                    <div className="relative p-3 bg-purple-100 overflow-hidden transition-transform group-hover:scale-105" style={{ aspectRatio: '1' }}>
                                        <div
                                            className="absolute inset-3 flex items-center justify-center"
                                            style={{
                                                backgroundColor: '#2563eb',
                                                maskImage: 'url(/images/mask3.svg)',
                                                WebkitMaskImage: 'url(/images/mask3.svg)',
                                                maskSize: '100% 100%',
                                                WebkitMaskSize: '100% 100%',
                                                maskRepeat: 'no-repeat',
                                                WebkitMaskRepeat: 'no-repeat',
                                                maskPosition: 'center',
                                                WebkitMaskPosition: 'center'
                                            }}
                                        >
                                            <span className="text-white text-sm text-center px-2 relative z-10">
                                                Outdoor & Patio
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                {/* Planters & Care - Blob/organic shape */}
                                <Link
                                    href="/collections/planters-care"
                                    onClick={handleCloseMenu}
                                    className="group"
                                >
                                    <div className="relative p-3 bg-red-50 overflow-hidden transition-transform group-hover:scale-105" style={{ aspectRatio: '1' }}>
                                        <div
                                            className="absolute inset-3 flex items-center justify-center"
                                            style={{
                                                backgroundColor: '#ef4444',
                                                maskImage: 'url(/images/mask4.svg)',
                                                WebkitMaskImage: 'url(/images/mask4.svg)',
                                                maskSize: '100% 100%',
                                                WebkitMaskSize: '100% 100%',
                                                maskRepeat: 'no-repeat',
                                                WebkitMaskRepeat: 'no-repeat',
                                                maskPosition: 'center',
                                                WebkitMaskPosition: 'center'
                                            }}
                                        >
                                            <span className="text-white text-sm text-center px-2 relative z-10">
                                                Planters & Care
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* View Wishlist */}
                        <Link
                            href="/wishlist"
                            onClick={handleCloseMenu}
                            className="flex items-center justify-between px-4 py-4 border-t border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Heart size={20} className="text-gray-700" />
                                <span className="font-medium text-gray-900">Wishlist</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </Link>
                    </div>

                    {/* Bottom Actions - Fixed at Bottom */}
                    <div className="border-t border-gray-200 p-4 space-y-3">
                        <Link
                            href="/login"
                            onClick={handleCloseMenu}
                            className="block w-full py-3 px-4 bg-[#244033] text-white text-center font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            onClick={handleCloseMenu}
                            className="block w-full py-3 px-4 border-2 border-[#244033] text-[#244033] text-center font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </>

            {/* Side Cart */}
            <>
                {/* Backdrop */}
                <div
                    className={`fixed inset-0 bg-black z-50 transition-opacity duration-300 ${isCartOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                    onClick={handleCloseCart}
                />

                {/* Cart Sidebar - Slides from Right */}
                <div
                    className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {/* Cart Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-[#2F4F3E]">Shopping Cart ({cartCount})</h2>
                        <button
                            onClick={handleCloseCart}
                            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Cart Items - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <ShoppingCart size={64} className="text-gray-300 mb-4" />
                                <p className="text-[#2F4F3E]-500 mb-4">Your cart is empty</p>
                                <button
                                    onClick={handleCloseCart}
                                    className="px-6 py-2 bg-[#244033] text-white rounded-lg hover:bg-[#2F4F3E] transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-3 border border-gray-200 rounded-lg">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                                            <div className="w-full h-full flex items-center justify-center text-4xl">
                                                🌿
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-[#2F4F3E] truncate">{item.name}</h3>
                                            <p className="text-sm text-gray-500">Size: {item.size}</p>
                                            <p className="text-[#2F4F3E] font-semibold mt-1">${item.price.toFixed(2)}</p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="flex items-center border border-gray-300 rounded-md">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart Footer - Fixed at Bottom */}
                    {cartItems.length > 0 && (
                        <div className="border-t border-gray-200 p-4 space-y-4">
                            {/* Subtotal */}
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-[#2F4F3E]">Subtotal</span>
                                <span className="text-2xl font-bold text-[#2F4F3E]">${calculateSubtotal()}</span>
                            </div>
                            <p className="text-sm text-gray-500">Shipping and taxes calculated at checkout</p>

                            {/* View Cart Button */}
                            <button
                                onClick={handleCloseCart}
                                href="/cart"
                                className="w-full py-3 bg-[#244033] text-white font-semibold rounded-lg hover:bg-black-700 transition-colors"
                            >
                                View Cart
                            </button>
                            <button
                                onClick={handleCloseCart}
                                className="w-full py-3 border-2 border-[#244033] text-[#244033] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </>
        </>
    );
}