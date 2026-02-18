'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Heart, User, ShoppingCart, ChevronDown, Menu, X, MapPin, ChevronRight, Minus, Plus, Trash2, Home, Store, LogOut, Package, Settings, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getCollections, customerLogout } from '../lib/shopify_utilis';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
    const accountDropdownRef = useRef(null);

    // Authentication state
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // State for dynamic collections
    const [navCollections, setNavCollections] = useState([]);
    const [loadingCollections, setLoadingCollections] = useState(true);

    // Use real cart data from CartContext
    const { cartItems, updateQuantity, removeFromCart, loading } = useCart();

    // Calculate total items from real cart
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Check authentication status
    useEffect(() => {
        const checkAuth = () => {
            const user = localStorage.getItem('plants-current-user');
            if (user) {
                try {
                    const userData = JSON.parse(user);

                    // Check if access token exists and hasn't expired
                    if (userData.accessToken) {
                        const expiresAt = new Date(userData.expiresAt);
                        const now = new Date();

                        if (expiresAt > now) {
                            // Token is still valid
                            setCurrentUser(userData);
                            setIsLoggedIn(true);
                        } else {
                            // Token expired, clear data
                            localStorage.removeItem('plants-current-user');
                            setIsLoggedIn(false);
                            setCurrentUser(null);
                        }
                    } else {
                        setCurrentUser(userData);
                        setIsLoggedIn(true);
                    }
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    localStorage.removeItem('plants-current-user');
                    setIsLoggedIn(false);
                    setCurrentUser(null);
                }
            } else {
                setIsLoggedIn(false);
                setCurrentUser(null);
            }
        };

        checkAuth();

        // Listen for storage changes (login/logout from other tabs)
        window.addEventListener('storage', checkAuth);

        // Custom event for login/logout in same tab
        window.addEventListener('auth-change', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('auth-change', checkAuth);
        };
    }, []);

    // Fetch top 4 collections
    useEffect(() => {
        async function fetchNavCollections() {
            try {
                setLoadingCollections(true);
                const collections = await getCollections(20);

                const filtered = collections.filter(collection => {
                    const handle = collection.handle.toLowerCase();
                    return handle !== 'best-sellers' &&
                        handle !== 'new-arrivals' &&
                        handle !== 'on-sale';
                });

                const topFour = filtered.slice(0, 4);
                setNavCollections(topFour);
            } catch (error) {
                console.error('Error fetching nav collections:', error);
                setNavCollections([
                    { name: 'Large Plants', handle: 'large-plants', link: '/collections/large-plants' },
                    { name: 'Houseplants', handle: 'houseplants', link: '/collections/houseplants' },
                    { name: 'Outdoor & Patio', handle: 'outdoor-patio', link: '/collections/outdoor-patio' },
                    { name: 'Planters & Care', handle: 'planters-care', link: '/collections/planters-care' },
                ]);
            } finally {
                setLoadingCollections(false);
            }
        }

        fetchNavCollections();
    }, []);

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

    // Handle logout with Shopify API
    const handleLogout = async () => {
        try {
            // Get access token if it exists
            const user = localStorage.getItem('plants-current-user');
            if (user) {
                const userData = JSON.parse(user);
                if (userData.accessToken) {
                    // Call Shopify logout API
                    await customerLogout(userData.accessToken);
                }
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            // Always clear local storage regardless of API call success
            localStorage.removeItem('plants-current-user');
            setIsLoggedIn(false);
            setCurrentUser(null);
            setIsAccountDropdownOpen(false);

            // Dispatch custom event
            window.dispatchEvent(new Event('auth-change'));

            // Show success popup
            setShowLogoutSuccess(true);

            // Auto-close popup and redirect after 2 seconds
            setTimeout(() => {
                setShowLogoutSuccess(false);
                router.push('/');
            }, 2000);
        }
    };

    // Handle close logout success popup
    const handleCloseLogoutSuccess = () => {
        setShowLogoutSuccess(false);
        router.push('/');
    };

    // Handle mobile account click
    const handleMobileAccountClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();
            router.push('/login');
        }
    };

    const handleUpdateQuantity = (lineId, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(lineId, newQuantity);
    };

    const handleRemoveItem = (lineId) => {
        removeFromCart(lineId);
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
        if (isMenuOpen || isCartOpen || showLogoutSuccess) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen, isCartOpen, showLogoutSuccess]);

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
                            <div className="text-2xl md:text-3xl font-bold text-[#007B57] flex items-center gap-2">
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
                                    className="w-full px-4 py-2.5 pl-10 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244033] focus:border-transparent"
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
                            <div className="hidden lg:block relative" ref={accountDropdownRef}>
                                <button
                                    onClick={toggleAccountDropdown}
                                    className="p-2 text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1"
                                >
                                    <User size={22} />
                                    {isLoggedIn && (
                                        <ChevronDown size={16} className={`transition-transform ${isAccountDropdownOpen ? 'rotate-180' : ''}`} />
                                    )}
                                </button>

                                {/* Dropdown Menu */}
                                <div className={`absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 transition-all duration-200 ${isAccountDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                                    }`}>
                                    {isLoggedIn ? (
                                        <>
                                            {/* User Info */}
                                            <div className="px-4 py-3 bg-gradient-to-r from-[#007B57] to-[#009A7B] text-white">
                                                <p className="text-sm font-semibold">{currentUser?.name}</p>
                                                <p className="text-xs opacity-90 truncate">{currentUser?.email}</p>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2">
                                                <Link
                                                    href="/account"
                                                    onClick={() => setIsAccountDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#F0F4F1] transition-colors group"
                                                >
                                                    <div className="w-8 h-8 bg-[#F0F4F1] rounded-lg flex items-center justify-center group-hover:bg-[#007B57] transition-colors">
                                                        <User size={18} className="text-[#007B57] group-hover:text-white transition-colors" />
                                                    </div>
                                                    <span className="font-medium">My Account</span>
                                                </Link>

                                                {/* <Link
                                                    href="/account/orders"
                                                    onClick={() => setIsAccountDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#F0F4F1] transition-colors group"
                                                >
                                                    <div className="w-8 h-8 bg-[#F0F4F1] rounded-lg flex items-center justify-center group-hover:bg-[#244033] transition-colors">
                                                        <Package size={18} className="text-[#244033] group-hover:text-white transition-colors" />
                                                    </div>
                                                    <span className="font-medium">My Orders</span>
                                                </Link> */}
                                            </div>

                                            <div className="border-t border-gray-100 my-1"></div>

                                            <div className="py-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full group"
                                                >
                                                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                                        <LogOut size={18} className="text-red-600" />
                                                    </div>
                                                    <span className="font-medium">Logout</span>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* Welcome Header */}
                                            <div className="px-6 py-5 bg-gradient-to-br from-[#F0F4F1] to-white border-b border-gray-100">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 bg-[#007B57] rounded-full flex items-center justify-center">
                                                        <User size={20} className="text-white" />
                                                    </div>
                                                    <div>
                                                        {/* <h3 className="font-bold text-gray-900">Welcome Back!</h3> */}
                                                        <p className="text-xs text-gray-600 font-bold">
                                                            Sign in to your account
                                                        </p>

                                                    </div>
                                                </div>
                                            </div>

                                            {/* Login/Signup Buttons */}
                                            <div className="p-4 space-y-3">
                                                <Link
                                                    href="/login"
                                                    onClick={() => setIsAccountDropdownOpen(false)}
                                                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#007B57] text-white font-semibold rounded-lg hover:bg-[#009A7B] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                                >
                                                    <LogOut size={18} className="rotate-360" />
                                                    <span>Log In</span>
                                                </Link>
                                                <Link
                                                    href="/signup"
                                                    onClick={() => setIsAccountDropdownOpen(false)}
                                                    className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-[#007B57] text-[#007B57] font-semibold rounded-lg hover:bg-[#F0F4F1] transition-all duration-200"
                                                >
                                                    <span>Create Account</span>
                                                </Link>
                                            </div>

                                            {/* Benefits Footer */}
                                            {/* <div className="px-4 pb-4">
                                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
                                                    <p className="text-xs font-semibold text-green-800 mb-1.5">Member Benefits</p>
                                                    <ul className="space-y-1">
                                                        <li className="flex items-center gap-2 text-xs text-green-700">
                                                            <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                                                            <span>Track your orders</span>
                                                        </li>
                                                        <li className="flex items-center gap-2 text-xs text-green-700">
                                                            <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                                                            <span>Save your wishlist</span>
                                                        </li>
                                                        <li className="flex items-center gap-2 text-xs text-green-700">
                                                            <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                                                            <span>Faster checkout</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div> */}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Shopping Cart with badge */}
                            <button
                                onClick={handleOpenCart}
                                className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#007B57] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Navigation Links - Desktop Only */}
                    <div className="hidden lg:flex justify-center items-center gap-2 pb-4">
                        {loadingCollections ? (
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-8 w-32 bg-gray-200 rounded-full animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            navCollections.map((collection) => {
                                const isActive = pathname === collection.link || pathname?.startsWith(collection.link);
                                return (
                                    <Link
                                        key={collection.handle}
                                        href={collection.link}
                                        className={`flex items-center gap-1 px-4 py-1.5 rounded-full font-medium transition-all duration-200 ${isActive
                                            ? 'bg-[#007B57] text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {collection.name}
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
                <div className="flex items-center justify-around h-16 px-2">
                    <Link href="/" className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${pathname === '/' ? 'text-[#244033]' : 'text-gray-400 hover:text-black'}`}>
                        <Home size={24} />
                        <span className="text-xs mt-1 font-medium">Home</span>
                    </Link>

                    <Link href="/products" className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${pathname?.startsWith('/products') ? 'text-[#244033]' : 'text-gray-400 hover:text-black'}`}>
                        <Store size={24} />
                        <span className="text-xs mt-1 font-medium">Shop</span>
                    </Link>

                    <Link href="/wishlist" className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${pathname === '/wishlist' ? 'text-[#244033]' : 'text-gray-400 hover:text-black'}`}>
                        <Heart size={24} />
                        <span className="text-xs mt-1 font-medium">Wishlist</span>
                    </Link>

                    <Link
                        href={isLoggedIn ? "/account" : "/login"}
                        onClick={handleMobileAccountClick}
                        className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${pathname === '/account' ? 'text-[#244033]' : 'text-gray-400 hover:text-black'}`}
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
                    className={`lg:hidden fixed inset-0 bg-black z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    onClick={handleCloseMenu}
                />

                {/* Sidebar */}
                <div className={`lg:hidden fixed inset-y-0 left-0 w-80 bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="text-2xl font-bold text-[#007B57] flex items-center gap-2">
                            <span className="text-3xl">🌿</span>
                            Groves Box
                        </div>
                        <button onClick={handleCloseMenu} className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* User Info Section (if logged in) */}
                    {isLoggedIn && currentUser && (
                        <div className="p-4 bg-[#F0F4F1] border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#244033] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                    {currentUser.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{currentUser.name}</p>
                                    <p className="text-sm text-gray-600 truncate">{currentUser.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto">
                        {/* Collections Section */}
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-4 text-[#007B57]">Collections</h3>
                            {loadingCollections ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {navCollections.map((collection, index) => {
                                        const colors = [
                                            { bg: 'bg-orange-50', color: '#fb923c' },
                                            { bg: 'bg-teal-100', color: '#15803d' },
                                            { bg: 'bg-purple-100', color: '#2563eb' },
                                            { bg: 'bg-red-50', color: '#ef4444' },
                                        ];
                                        const colorScheme = colors[index % colors.length];

                                        return (
                                            <Link
                                                key={collection.handle}
                                                href={collection.link}
                                                onClick={handleCloseMenu}
                                                className="group"
                                            >
                                                <div className={`relative p-3 ${colorScheme.bg} overflow-hidden transition-transform group-hover:scale-105`} style={{ aspectRatio: '1' }}>
                                                    <div
                                                        className="absolute inset-3 flex items-center justify-center"
                                                        style={{
                                                            backgroundColor: colorScheme.color,
                                                            maskImage: `url(/images/mask${(index % 4) + 1}.svg)`,
                                                            WebkitMaskImage: `url(/images/mask${(index % 4) + 1}.svg)`,
                                                            maskSize: '100% 100%',
                                                            WebkitMaskSize: '100% 100%',
                                                            maskRepeat: 'no-repeat',
                                                            WebkitMaskRepeat: 'no-repeat',
                                                            maskPosition: 'center',
                                                            WebkitMaskPosition: 'center'
                                                        }}
                                                    >
                                                        <span className="text-white text-sm text-center px-2 relative z-10">
                                                            {collection.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Menu Links */}
                        {isLoggedIn && (
                            <>
                                {/* <Link href="/account/orders" onClick={handleCloseMenu} className="flex items-center justify-between px-4 py-4 border-t border-gray-200 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Package size={20} className="text-gray-700" />
                                        <span className="font-medium text-gray-900">My Orders</span>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-400" />
                                </Link> */}
                            </>
                        )}

                        {/* View Wishlist */}
                        <Link href="/wishlist" onClick={handleCloseMenu} className="flex items-center justify-between px-4 py-4 border-t border-gray-200 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <Heart size={20} className="text-gray-700" />
                                <span className="font-medium text-gray-900">Wishlist</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </Link>
                    </div>

                    {/* Bottom Actions - Login/Logout Buttons */}
                    <div className="border-t border-gray-200 p-4 space-y-3">
                        {isLoggedIn && currentUser ? (
                            // USER IS LOGGED IN - Show Account and Logout buttons
                            <>
                                <Link
                                    href="/account"
                                    onClick={handleCloseMenu}
                                    className="block w-full py-3 px-4 bg-[#007B57] text-white text-center font-semibold rounded-lg hover:bg-[#009A7B] transition-colors"
                                >
                                    My Account
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        handleCloseMenu();
                                    }}
                                    className="block w-full py-3 px-4 border-2 border-red-500 text-red-500 text-center font-semibold rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            // USER IS NOT LOGGED IN - Show Login and Sign Up buttons
                            <>
                                <Link
                                    href="/login"
                                    onClick={handleCloseMenu}
                                    className="block w-full py-3 px-4 bg-[#007B57] text-white text-center font-semibold rounded-lg hover:bg-[#009A7B] transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={handleCloseMenu}
                                    className="block w-full py-3 px-4 border-2 border-[#007B57] text-[#007B57] text-center font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </>

            {/* Side Cart */}
            <>
                {/* Backdrop */}
                <div
                    className={`fixed inset-0 bg-black z-50 transition-opacity duration-300 ${isCartOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    onClick={handleCloseCart}
                />

                {/* Cart Sidebar */}
                <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    {/* Cart Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-[#007B57]">Shopping Cart ({cartCount})</h2>
                        <button onClick={handleCloseCart} className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Cart Items - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="w-12 h-12 border-4 border-[#244033] border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-600">Loading cart...</p>
                            </div>
                        ) : cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <ShoppingCart size={64} className="text-gray-300 mb-4" />
                                <p className="text-gray-500 mb-4">Your cart is empty</p>
                                <button
                                    onClick={handleCloseCart}
                                    className="px-6 py-2 bg-[#007B57] text-white rounded-lg hover:bg-[#2F4F3E] transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-3 border border-gray-200 rounded-lg">
                                        {/* Product Image */}
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-[#007B57] truncate">{item.name}</h3>
                                            {item.variant && item.variant !== 'Default Title' && (
                                                <p className="text-sm text-gray-500">Variant: {item.variant}</p>
                                            )}
                                            <p className="text-[#2F4F3E] font-semibold mt-1">Rs. {item.price.toFixed(2)}</p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="flex items-center border border-gray-300 rounded-md">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:bg-gray-100 transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
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

                    {/* Cart Footer */}
                    {cartItems.length > 0 && (
                        <div className="border-t border-gray-200 p-4 space-y-4">
                            {/* Subtotal */}
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-[#007B57]">Subtotal</span>
                                <span className="text-2xl font-bold text-[#007B57]">Rs. {calculateSubtotal()}</span>
                            </div>
                            <p className="text-sm text-gray-500">Shipping and taxes calculated at checkout</p>

                            {/* View Cart Button */}
                            <Link
                                href="/cart"
                                onClick={handleCloseCart}
                                className="block w-full py-3 bg-[#007B57] text-white text-center font-semibold rounded-lg hover:bg-[#009A7B] transition-colors"
                            >
                                View Cart
                            </Link>
                            <button
                                onClick={handleCloseCart}
                                className="w-full py-3 border-2 border-[#007B57] text-[#007B57] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </>

            {/* Logout Success Popup */}
            {showLogoutSuccess && (
                <>
                    {/* Backdrop with blur */}
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                        onClick={handleCloseLogoutSuccess}
                    >
                        {/* Success Modal */}
                        <div
                            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100 animate-fadeIn"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Success Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="text-green-600" size={48} />
                                </div>
                            </div>

                            {/* Success Message */}
                            <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
                                Logged Out Successfully!
                            </h2>
                            <p className="text-center text-gray-600 mb-6">
                                You have been successfully logged out. Thank you for visiting Groves Box!
                            </p>

                            {/* Close Button */}
                            <button
                                onClick={handleCloseLogoutSuccess}
                                className="w-full py-3 bg-[#007B57] text-white font-semibold rounded-lg hover:bg-[#009A7B] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    {/* Add keyframe animation */}
                    <style jsx>{`
                        @keyframes fadeIn {
                            from {
                                opacity: 0;
                                transform: scale(0.9);
                            }
                            to {
                                opacity: 1;
                                transform: scale(1);
                            }
                        }
                        .animate-fadeIn {
                            animation: fadeIn 0.3s ease-out;
                        }
                    `}</style>
                </>
            )}
        </>
    );
}