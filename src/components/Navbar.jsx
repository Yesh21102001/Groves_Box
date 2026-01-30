'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, User, ShoppingCart, ChevronDown, Menu, X, MapPin, ChevronRight, Minus, Plus, Trash2 } from 'lucide-react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCartClosing, setIsCartClosing] = useState(false);
    const [cartCount, setCartCount] = useState(3);

    // Sample cart items - replace with your actual cart data
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Monstera Deliciosa', price: 45.00, quantity: 1, image: '/placeholder-plant.jpg', size: 'Medium' },
        { id: 2, name: 'Snake Plant', price: 32.00, quantity: 2, image: '/placeholder-plant.jpg', size: 'Small' },
        { id: 3, name: 'Pothos', price: 28.00, quantity: 1, image: '/placeholder-plant.jpg', size: 'Medium' }
    ]);

    const navItems = [
        { name: 'Large Plants', href: '/collections/large-plants' },
        { name: 'Houseplants', href: '/collections/houseplants', hasArrow: true },
        { name: 'Outdoor & Patio', href: '/collections/outdoor-patio', hasArrow: true },
        { name: 'Planters & Care', href: '/collections/planters-care', hasArrow: true },
    ];

    const collections = [
        { name: 'Large Plants', color: 'bg-orange-400', shape: 'rounded-t-full', href: '/collections/large-plants' },
        { name: 'Houseplants', color: 'bg-green-700', shape: 'rounded-br-[40%]', href: '/collections' },
        { name: 'Outdoor & Patio', color: 'bg-blue-600', shape: 'rounded-br-[50%] rounded-tl-[50%]', href: '/collections' },
        { name: 'Planters & Care', color: 'bg-red-500', shape: 'rounded-full', href: '/collections' },
    ];

    const handleCloseMenu = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsMenuOpen(false);
            setIsClosing(false);
        }, 300);
    };

    const handleOpenCart = (e) => {
        e.preventDefault();
        setIsCartOpen(true);
    };

    const handleCloseCart = () => {
        setIsCartClosing(true);
        setTimeout(() => {
            setIsCartOpen(false);
            setIsCartClosing(false);
        }, 300);
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
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Top section with logo, search and icons */}
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Mobile Menu Toggle - Left Side */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <div className="text-2xl md:text-3xl font-bold text-green-700 flex items-center gap-2">
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
                                    className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            {/* Growing Zone - Desktop Only */}
                            <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
                                <MapPin size={18} className="text-green-700" />
                                <div className="text-left">
                                    <div className="text-xs text-gray-600">Growing Zone</div>
                                    <div className="text-sm font-semibold text-green-700">Zip Code: 500038</div>
                                </div>
                                <ChevronDown size={16} className="text-gray-500" />
                            </div>

                            {/* Search - Mobile Only */}
                            <button className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors">
                                <Search size={22} />
                            </button>

                            {/* Location - Mobile Only */}
                            <button className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors">
                                <MapPin size={22} />
                            </button>

                            {/* Heart - Wishlist */}
                            <Link href="/wishlist" className="hidden sm:block p-2 text-gray-700 hover:text-gray-900 transition-colors">
                                <Heart size={22} />
                            </Link>

                            {/* User Account */}
                            <Link href="/account" className="hidden sm:block p-2 text-gray-700 hover:text-gray-900 transition-colors">
                                <User size={22} />
                            </Link>

                            {/* Shopping Cart with badge */}
                            <button
                                onClick={handleOpenCart}
                                className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Navigation Links - Desktop (Centered) */}
                    <div className="hidden lg:flex justify-center items-center space-x-8 pb-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:text-green-700 font-medium transition-colors flex items-center gap-1 group"
                            >
                                {item.name}
                                {item.hasArrow && (
                                    <ChevronDown size={16} className="text-gray-500 group-hover:text-green-700" />
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a2e] text-white z-50 border-t border-gray-700">
                <div className="flex items-center justify-around h-16 px-2">
                    {/* Home */}
                    <Link href="/" className="flex flex-col items-center justify-center flex-1 py-2">
                        <div className="relative">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                            </svg>
                        </div>
                        <span className="text-xs mt-1">Home</span>
                    </Link>

                    {/* Camera/Scan */}
                    <button className="flex flex-col items-center justify-center flex-1 py-2">
                        <div className="relative">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span className="text-xs mt-1">Scan</span>
                    </button>

                    {/* Menu */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex flex-col items-center justify-center flex-1 py-2"
                    >
                        <div className="relative">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </div>
                        <span className="text-xs mt-1">Menu</span>
                    </button>

                    {/* Settings */}
                    <button className="flex flex-col items-center justify-center flex-1 py-2">
                        <div className="relative">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span className="text-xs mt-1">Settings</span>
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar Menu */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className={`lg:hidden fixed inset-0 bg-black z-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-50'
                            }`}
                        onClick={handleCloseMenu}
                    />

                    {/* Sidebar */}
                    <div
                        className={`lg:hidden fixed inset-y-0 left-0 w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isClosing ? '-translate-x-full' : 'translate-x-0'
                            }`}
                    >
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div className="text-2xl font-bold text-green-700 flex items-center gap-2">
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
                                <h3 className="text-lg font-semibold mb-4 text-gray-900">Collections</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {collections.map((collection) => (
                                        <Link
                                            key={collection.name}
                                            href={collection.href}
                                            onClick={handleCloseMenu}
                                            className="group"
                                        >
                                            <div className={`${collection.color} ${collection.shape} h-24 mb-2 transition-transform group-hover:scale-105`} />
                                            <p className="text-sm font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                                                {collection.name}
                                            </p>
                                        </Link>
                                    ))}
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
                                    <span className="font-medium text-gray-900">View Wishlist</span>
                                </div>
                                <ChevronRight size={20} className="text-gray-400" />
                            </Link>
                        </div>

                        {/* Bottom Actions - Fixed at Bottom */}
                        <div className="border-t border-gray-200 p-4 space-y-3">
                            <Link
                                href="/account"
                                onClick={handleCloseMenu}
                                className="block w-full py-3 px-4 bg-green-600 text-white text-center font-semibold rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/resources"
                                onClick={handleCloseMenu}
                                className="block w-full py-3 px-4 border-2 border-green-600 text-green-600 text-center font-semibold rounded-lg hover:bg-green-50 transition-colors"
                            >
                                Resources
                            </Link>
                        </div>
                    </div>
                </>
            )}

            {/* Side Cart */}
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 bg-black z-50 transition-opacity duration-300 ${isCartClosing ? 'opacity-0' : 'opacity-50'
                            }`}
                        onClick={handleCloseCart}
                    />

                    {/* Cart Sidebar - Slides from Right */}
                    <div
                        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isCartClosing ? 'translate-x-full' : 'translate-x-0'
                            }`}
                    >
                        {/* Cart Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Shopping Cart ({cartCount})</h2>
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
                                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                                    <button
                                        onClick={handleCloseCart}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                                                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                                                <p className="text-sm text-gray-500">Size: {item.size}</p>
                                                <p className="text-green-600 font-semibold mt-1">${item.price.toFixed(2)}</p>

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
                                    <span className="text-lg font-semibold text-gray-900">Subtotal</span>
                                    <span className="text-2xl font-bold text-green-600">${calculateSubtotal()}</span>
                                </div>
                                <p className="text-sm text-gray-500">Shipping and taxes calculated at checkout</p>

                                {/* View Cart Button */}
                                <button
                                    onClick={handleCloseCart}
                                    className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    View Cart
                                </button>
                                <button
                                    onClick={handleCloseCart}
                                    className="w-full py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Add padding to bottom of page for mobile nav */}
            <div className="lg:hidden h-16" />
        </>
    );
}