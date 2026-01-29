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
        {
            id: 1,
            name: 'Monstera Deliciosa',
            price: 45.00,
            quantity: 1,
            image: '/placeholder-plant.jpg',
            size: 'Medium'
        },
        {
            id: 2,
            name: 'Snake Plant',
            price: 32.00,
            quantity: 2,
            image: '/placeholder-plant.jpg',
            size: 'Small'
        },
        {
            id: 3,
            name: 'Pothos',
            price: 28.00,
            quantity: 1,
            image: '/placeholder-plant.jpg',
            size: 'Medium'
        }
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
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="w-full px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Top section with logo, search and icons */}
                    <div className="flex items-center justify-between py-3 md:py-4 lg:py-4 gap-4">
                        {/* Mobile Menu Toggle - Left Side */}
                        <button
                            className="md:hidden p-2 -ml-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <h1 className="text-2xl md:text-3xl font-serif font-light tracking-widest text-gray-900 hover:opacity-70 transition-opacity">
                                Groves Box
                            </h1>
                        </Link>

                        {/* Center Search - Hidden on mobile */}
                        <div className="hidden md:flex flex-1 max-w-md mx-4 lg:max-w-lg lg:mx-8">
                            <div className="w-full relative">
                                <input
                                    type="text"
                                    placeholder="Search for plants ..."
                                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                                />
                                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
                            {/* Growing Zone - Desktop Only */}
                            <button className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900">
                                <MapPin size={18} />
                                <div className="text-left">
                                    <div className="text-xs text-gray-500">Growing Zone</div>
                                    <div className="text-sm font-medium">Zip Code: 500038</div>
                                </div>
                            </button>

                            {/* Search - Mobile Only */}
                            <button className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors">
                                <Search size={20} className="text-gray-700" />
                            </button>

                            {/* Location - Mobile Only */}
                            <button className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors">
                                <MapPin size={20} className="text-gray-700" />
                            </button>

                            {/* Heart - Wishlist */}
                            <button className="hidden md:flex p-2 hover:bg-gray-100 rounded-md transition-colors">
                                <Heart size={20} className="text-gray-700" />
                            </button>

                            {/* User Account */}
                            <button className="hidden md:flex p-2 hover:bg-gray-100 rounded-md transition-colors">
                                <User size={20} className="text-gray-700" />
                            </button>

                            {/* Shopping Cart with badge */}
                            <button
                                onClick={handleOpenCart}
                                className="p-2 hover:bg-gray-100 rounded-md transition-colors relative"
                            >
                                <ShoppingCart size={20} className="text-gray-700" />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Navigation Links - Desktop (Centered) */}
                    <div className="hidden md:block border-t border-gray-200">
                        <ul className="flex items-center justify-center gap-5 lg:gap-6 xl:gap-7 py-3 overflow-x-auto">
                            {navItems.map((item) => (
                                <li key={item.name} className="flex-shrink-0">
                                    <Link
                                        href={item.href}
                                        className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors whitespace-nowrap"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Menu */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className={`md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity ${isClosing ? 'animate-fade-out' : 'animate-fade-in'
                            }`}
                        onClick={handleCloseMenu}
                    />

                    {/* Sidebar */}
                    <div className={`md:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col ${isClosing ? 'animate-slide-out' : 'animate-slide-in'
                        }`}>
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 flex-shrink-0">
                            <h2 className="text-2xl font-serif font-light tracking-widest text-gray-900">
                                Groves Box
                            </h2>
                            <button
                                onClick={handleCloseMenu}
                                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <X size={24} className="text-gray-700" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto">
                            {/* Collections Section */}
                            <div className="px-4 py-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Collections</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {collections.map((collection) => (
                                        <Link
                                            key={collection.name}
                                            href="/collections"
                                            onClick={handleCloseMenu}
                                            className="relative aspect-square overflow-hidden hover:opacity-90 transition-opacity"
                                            style={{
                                                backgroundColor: collection.color === 'bg-orange-400' ? '#FEF3E2' :
                                                    collection.color === 'bg-green-700' ? '#D4E8E4' :
                                                        collection.color === 'bg-blue-600' ? '#E0E0F5' :
                                                            '#FFE8E8'
                                            }}
                                        >
                                            <div className={`absolute inset-0 flex items-center justify-center ${collection.color} ${collection.shape} transform transition-transform hover:scale-105`}>
                                                <span className="text-white font-semibold text-base px-4 text-center">
                                                    {collection.name}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* View Wishlist */}
                            <div className="px-6 py-4 border-t border-gray-200">
                                <Link
                                    href="/wishlist"
                                    className="flex items-center gap-2 text-base text-gray-800 hover:text-gray-900"
                                    onClick={handleCloseMenu}
                                >
                                    <Heart size={18} className="text-gray-700" />
                                    View Wishlist
                                </Link>
                            </div>
                        </div>

                        {/* Bottom Actions - Fixed at Bottom */}
                        <div className="grid grid-cols-2 border-t border-gray-200 flex-shrink-0 bg-white">
                            <Link
                                href="/login"
                                className="flex items-center justify-center gap-2 px-4 py-4 text-sm text-white bg-black"
                                onClick={handleCloseMenu}
                            >
                                <User size={18} />
                                Log in
                            </Link>
                            <Link
                                href="/resources"
                                className="flex items-center justify-center gap-2 px-4 py-4 text-sm text-gray-800 hover:bg-gray-50"
                                onClick={handleCloseMenu}
                            >
                                <ShoppingCart size={18} />
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
                        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${isCartClosing ? 'animate-fade-out' : 'animate-fade-in'
                            }`}
                        onClick={handleCloseCart}
                    />

                    {/* Cart Sidebar - Slides from Right */}
                    <div className={`fixed right-0 top-0 bottom-0 w-96 max-w-[80vw] bg-white z-50 shadow-2xl flex flex-col ${isCartClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
                        }`}>
                        {/* Cart Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Shopping Cart ({cartCount})
                            </h2>
                            <button
                                onClick={handleCloseCart}
                                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <X size={24} className="text-gray-700" />
                            </button>
                        </div>

                        {/* Cart Items - Scrollable */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {cartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingCart size={64} className="text-gray-300 mb-4" />
                                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                                    <button
                                        onClick={handleCloseCart}
                                        className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200">
                                            {/* Product Image */}
                                            <div className="w-24 h-24 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-green-200 rounded-full"></div>
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 flex flex-col">
                                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
                                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                                    ${item.price.toFixed(2)}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3 mt-2">
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
                            <div className="border-t border-gray-200 bg-white flex-shrink-0">
                                {/* Subtotal */}
                                <div className="px-6 py-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="text-xl font-semibold text-gray-900">
                                            ${calculateSubtotal()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Shipping and taxes calculated at checkout
                                    </p>
                                </div>

                                {/* View Cart Button */}
                                <div className="px-6 pb-6">
                                    <Link
                                        href="/cart"
                                        onClick={handleCloseCart}
                                        className="block w-full py-3 bg-teal-600 text-white text-center font-semibold rounded-md hover:bg-teal-700 transition-colors"
                                    >
                                        View Cart
                                    </Link>
                                    <button
                                        onClick={handleCloseCart}
                                        className="block w-full py-3 mt-2 border border-gray-300 text-gray-700 text-center font-semibold rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            <style jsx>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(-100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                
                @keyframes slide-out {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-100%);
                    }
                }

                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                
                @keyframes slide-out-right {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(100%);
                    }
                }
                
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @keyframes fade-out {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
                
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
                
                .animate-slide-out {
                    animation: slide-out 0.3s ease-in;
                }

                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out;
                }
                
                .animate-slide-out-right {
                    animation: slide-out-right 0.3s ease-in;
                }
                
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                
                .animate-fade-out {
                    animation: fade-out 0.3s ease-in;
                }
            `}</style>
        </nav>
    );
}