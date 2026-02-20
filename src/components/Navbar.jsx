'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Search, Heart, User, ShoppingCart, ChevronDown, Menu, X,
    ChevronRight, Minus, Plus, Trash2, Home, Store, LogOut, CheckCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getCollections, customerLogout } from '../lib/shopify_utilis';
import { navbarConfig } from '../config/Navbar.config';

// ── Mobile icon map ───────────────────────────────────────────────────
const MobileIconMap = { Home, Store, Heart, User };

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const cfg = navbarConfig;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
    const accountDropdownRef = useRef(null);

    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [navCollections, setNavCollections] = useState([]);
    const [loadingCollections, setLoadingCollections] = useState(true);

    const { cartItems, updateQuantity, removeFromCart, loading } = useCart();
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // ── Auth check ───────────────────────────────────────────────────
    useEffect(() => {
        const checkAuth = () => {
            const user = localStorage.getItem('plants-current-user');
            if (user) {
                try {
                    const userData = JSON.parse(user);
                    if (userData.accessToken) {
                        if (new Date(userData.expiresAt) > new Date()) {
                            setCurrentUser(userData);
                            setIsLoggedIn(true);
                        } else {
                            localStorage.removeItem('plants-current-user');
                            setIsLoggedIn(false);
                            setCurrentUser(null);
                        }
                    } else {
                        setCurrentUser(userData);
                        setIsLoggedIn(true);
                    }
                } catch {
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
        window.addEventListener('storage', checkAuth);
        window.addEventListener('auth-change', checkAuth);
        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('auth-change', checkAuth);
        };
    }, []);

    // ── Fetch nav collections ─────────────────────────────────────────
    useEffect(() => {
        async function fetchNavCollections() {
            try {
                setLoadingCollections(true);
                const collections = await getCollections(cfg.collectionPills.fetchLimit);
                const filtered = collections
                    .filter(c => !cfg.collectionPills.excludeHandles.includes(c.handle.toLowerCase()))
                    .slice(0, cfg.collectionPills.displayLimit);
                setNavCollections(filtered);
            } catch {
                setNavCollections(cfg.collectionPills.fallback);
            } finally {
                setLoadingCollections(false);
            }
        }
        fetchNavCollections();
    }, []);

    // ── Body scroll lock ──────────────────────────────────────────────
    useEffect(() => {
        document.body.style.overflow = (isMenuOpen || isCartOpen || showLogoutSuccess) ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMenuOpen, isCartOpen, showLogoutSuccess]);

    // ── Close dropdown on outside click ──────────────────────────────
    useEffect(() => {
        const handler = (e) => {
            if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target))
                setIsAccountDropdownOpen(false);
        };
        if (isAccountDropdownOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isAccountDropdownOpen]);

    // ── Logout ────────────────────────────────────────────────────────
    const handleLogout = async () => {
        try {
            const user = localStorage.getItem('plants-current-user');
            if (user) {
                const userData = JSON.parse(user);
                if (userData.accessToken) await customerLogout(userData.accessToken);
            }
        } catch { /* ignore */ } finally {
            localStorage.removeItem('plants-current-user');
            setIsLoggedIn(false);
            setCurrentUser(null);
            setIsAccountDropdownOpen(false);
            window.dispatchEvent(new Event('auth-change'));
            setShowLogoutSuccess(true);
            setTimeout(() => {
                setShowLogoutSuccess(false);
                router.push(cfg.logoutModal.redirectTo);
            }, cfg.logoutModal.autoCloseDuration);
        }
    };

    const handleCloseLogoutSuccess = () => {
        setShowLogoutSuccess(false);
        router.push(cfg.logoutModal.redirectTo);
    };

    const calculateSubtotal = () =>
        cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    const { cartSidebar: cs, mobileSidebar: ms, accountDropdown: ad } = cfg;

    return (
        <>
            {/* ══════════════════════════════════════════════════════════
                MAIN NAVBAR
            ══════════════════════════════════════════════════════════ */}
            <nav
                className={`border-b ${cfg.topBar.sticky ? 'sticky top-0' : ''} ${cfg.topBar.zIndex}`}
                style={{ backgroundColor: cfg.topBar.bg, borderColor: cfg.topBar.borderColor }}
            >
                <div className={`${cfg.topBar.maxWidth} mx-auto px-4 sm:px-6 lg:px-8`}>

                    {/* Top row */}
                    <div className={`flex items-center justify-between ${cfg.topBar.height}`}>

                        {/* Hamburger */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="lg:hidden p-2 transition-colors"
                            style={{ color: cfg.icons.color }}
                        >
                            <Menu size={24} />
                        </button>

                        {/* Brand */}
                        <Link href={cfg.brand.href} className="flex-shrink-0">
                            <div
                                className={`${cfg.brand.fontSize} ${cfg.brand.fontWeight} flex items-center gap-2`}
                                style={{ color: cfg.brand.color }}
                            >
                                <span className={cfg.brand.emojiSize}>{cfg.brand.emoji}</span>
                                <span className="hidden sm:inline">{cfg.brand.name}</span>
                                <span className="sm:hidden">{cfg.brand.mobileShort}</span>
                            </div>
                        </Link>

                        {/* Search */}
                        <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
                            <div className="w-full relative">
                                <input
                                    type="text"
                                    placeholder={cfg.search.placeholder}
                                    className={`w-full ${cfg.search.padding} border ${cfg.search.borderRadius} focus:outline-none focus:ring-2`}
                                    style={{ borderColor: cfg.search.borderColor }}
                                />
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2"
                                    size={20}
                                    style={{ color: cfg.search.iconColor }}
                                />
                            </div>
                        </div>

                        {/* Right actions */}
                        <div className="flex items-center gap-3 sm:gap-4">

                            {/* Wishlist - desktop */}
                            <Link href={cfg.icons.wishlistHref} className="hidden lg:block p-2 transition-colors" style={{ color: cfg.icons.color }}>
                                <Heart size={cfg.icons.size} />
                            </Link>

                            {/* Account dropdown - desktop */}
                            <div className="hidden lg:block relative" ref={accountDropdownRef}>
                                <button
                                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                                    className="p-2 transition-colors flex items-center gap-1"
                                    style={{ color: cfg.icons.color }}
                                >
                                    <User size={cfg.icons.size} />
                                    {isLoggedIn && (
                                        <ChevronDown size={16} className={`transition-transform ${isAccountDropdownOpen ? 'rotate-180' : ''}`} />
                                    )}
                                </button>

                                {/* Dropdown */}
                                <div
                                    className={`absolute right-0 mt-2 ${ad.width} bg-white ${ad.borderRadius} border ${ad.shadow} overflow-hidden z-50 transition-all duration-200 ${isAccountDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                                    style={{ borderColor: ad.borderColor }}
                                >
                                    {isLoggedIn ? (
                                        <>
                                            {/* Logged-in header */}
                                            <div
                                                className="px-4 py-3 text-white"
                                                style={{ background: `linear-gradient(to right, ${ad.loggedInGradientFrom}, ${ad.loggedInGradientTo})` }}
                                            >
                                                <p className="text-sm font-semibold">{currentUser?.name}</p>
                                                <p className="text-xs opacity-90 truncate">{currentUser?.email}</p>
                                            </div>
                                            <div className="py-2">
                                                <Link
                                                    href={ad.myAccountHref}
                                                    onClick={() => setIsAccountDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 transition-colors group"
                                                    style={{ color: '#374151' }}
                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = ad.itemHoverBg}
                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                                                        style={{ backgroundColor: ad.itemIconBg }}>
                                                        <User size={18} style={{ color: ad.itemIconColor }} />
                                                    </div>
                                                    <span className="font-medium">{ad.myAccountLabel}</span>
                                                </Link>
                                            </div>
                                            <div className="border-t my-1" style={{ borderColor: ad.borderColor }} />
                                            <div className="py-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-3 w-full transition-colors"
                                                    style={{ color: ad.logoutTextColor }}
                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = ad.logoutHoverBg}
                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                        style={{ backgroundColor: ad.logoutIconBg }}>
                                                        <LogOut size={18} style={{ color: ad.logoutTextColor }} />
                                                    </div>
                                                    <span className="font-medium">Logout</span>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* Guest header */}
                                            <div className="px-6 py-5 border-b" style={{ backgroundColor: ad.guestHeaderBg, borderColor: ad.borderColor }}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: ad.loginBg }}>
                                                        <User size={20} style={{ color: ad.loginTextColor }} />
                                                    </div>
                                                    <p className="text-xs font-bold" style={{ color: '#4B5563' }}>{ad.guestSubtitle}</p>
                                                </div>
                                            </div>
                                            <div className="p-4 space-y-3">
                                                <Link
                                                    href={ad.loginHref}
                                                    onClick={() => setIsAccountDropdownOpen(false)}
                                                    className="flex items-center justify-center gap-2 w-full py-3 px-4 font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                                    style={{ backgroundColor: ad.loginBg, color: ad.loginTextColor }}
                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = ad.loginHoverBg}
                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = ad.loginBg}
                                                >
                                                    <LogOut size={18} />
                                                    <span>{ad.loginLabel}</span>
                                                </Link>
                                                <Link
                                                    href={ad.signupHref}
                                                    onClick={() => setIsAccountDropdownOpen(false)}
                                                    className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 font-semibold rounded-lg transition-all duration-200"
                                                    style={{ borderColor: ad.signupBorderColor, color: ad.signupTextColor }}
                                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = ad.signupHoverBg}
                                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    <span>{ad.signupLabel}</span>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Cart button */}
                            <button
                                onClick={(e) => { e.preventDefault(); setIsCartOpen(true); }}
                                className="relative p-2 transition-colors"
                                style={{ color: cfg.icons.color }}
                            >
                                <ShoppingCart size={cfg.icons.size} />
                                {cartCount > 0 && (
                                    <span
                                        className={`absolute -top-1 -right-1 ${cfg.cartBadge.fontSize} ${cfg.cartBadge.fontWeight} rounded-full h-5 w-5 flex items-center justify-center`}
                                        style={{ backgroundColor: cfg.cartBadge.bg, color: cfg.cartBadge.textColor }}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Desktop collection pills */}
                    <div className={`hidden lg:flex justify-center items-center ${cfg.collectionPills.gap} pb-4`}>
                        {loadingCollections ? (
                            [1, 2, 3, 4].map(i => <div key={i} className="h-8 w-32 bg-gray-200 rounded-full animate-pulse" />)
                        ) : (
                            navCollections.map((col) => {
                                const isActive = pathname === col.link || pathname?.startsWith(col.link);
                                return (
                                    <Link
                                        key={col.handle}
                                        href={col.link}
                                        className={`flex items-center gap-1 ${cfg.collectionPills.padding} ${cfg.collectionPills.borderRadius} ${cfg.collectionPills.fontWeight} ${cfg.collectionPills.fontSize} transition-all duration-200`}
                                        style={{
                                            backgroundColor: isActive ? cfg.collectionPills.activeBg : cfg.collectionPills.inactiveBg,
                                            color: isActive ? cfg.collectionPills.activeText : cfg.collectionPills.inactiveText,
                                        }}
                                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = cfg.collectionPills.hoverBg; }}
                                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = cfg.collectionPills.inactiveBg; }}
                                    >
                                        {col.name}
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            </nav>

            {/* ══════════════════════════════════════════════════════════
                MOBILE BOTTOM NAV
            ══════════════════════════════════════════════════════════ */}
            <div
                className={`lg:hidden fixed bottom-0 left-0 right-0 border-t z-40 shadow-lg`}
                style={{ backgroundColor: cfg.mobileBottomNav.bg, borderColor: cfg.mobileBottomNav.borderColor }}
            >
                <div className={`flex items-center justify-around ${cfg.mobileBottomNav.height} px-2`}>
                    {cfg.mobileBottomNav.items.map(({ label, icon, href, authHref }) => {
                        const Icon = MobileIconMap[icon];
                        const resolvedHref = authHref && !isLoggedIn ? authHref : href;
                        const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
                        return (
                            <Link
                                key={label}
                                href={resolvedHref}
                                className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors`}
                                style={{ color: isActive ? cfg.mobileBottomNav.activeColor : cfg.mobileBottomNav.inactiveColor }}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = cfg.mobileBottomNav.hoverColor; }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = cfg.mobileBottomNav.inactiveColor; }}
                            >
                                {Icon && <Icon size={cfg.mobileBottomNav.iconSize} />}
                                <span className={`${cfg.mobileBottomNav.labelFontSize} ${cfg.mobileBottomNav.labelMarginTop} ${cfg.mobileBottomNav.labelFontWeight}`}>
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                MOBILE SIDEBAR MENU
            ══════════════════════════════════════════════════════════ */}
            <div
                className={`lg:hidden fixed inset-0 bg-black z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            />
            <div
                className={`lg:hidden fixed inset-y-0 left-0 ${ms.width} ${ms.shadow} z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{ backgroundColor: ms.bg }}
            >
                {/* Sidebar header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className={`text-2xl font-bold flex items-center gap-2`} style={{ color: ms.brandColor }}>
                        <span className="text-3xl">{ms.brandEmoji}</span>
                        {ms.brandName}
                    </div>
                    <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {/* Logged-in user info */}
                {isLoggedIn && currentUser && (
                    <div className="p-4 border-b border-gray-200" style={{ backgroundColor: ms.userSectionBg }}>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold"
                                style={{ backgroundColor: ms.userAvatarBg, color: ms.userAvatarTextColor }}>
                                {currentUser.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{currentUser.name}</p>
                                <p className="text-sm text-gray-600 truncate">{currentUser.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto">
                    {/* Collections */}
                    <div className="p-4">
                        <h3
                            className={`${ms.sectionTitleSize} ${ms.sectionTitleWeight} mb-4`}
                            style={{ color: ms.sectionTitleColor }}
                        >
                            {ms.sectionTitle}
                        </h3>
                        {loadingCollections ? (
                            <div className="grid grid-cols-2 gap-3">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {navCollections.map((col, i) => {
                                    const scheme = ms.cardColors[i % ms.cardColors.length];
                                    return (
                                        <Link key={col.handle} href={col.link} onClick={() => setIsMenuOpen(false)} className="group">
                                            <div className={`relative p-3 ${scheme.bg} overflow-hidden transition-transform group-hover:scale-105`} style={{ aspectRatio: '1' }}>
                                                <div
                                                    className="absolute inset-3 flex items-center justify-center"
                                                    style={{
                                                        backgroundColor: scheme.color,
                                                        maskImage: `url(/images/mask${(i % 4) + 1}.svg)`,
                                                        WebkitMaskImage: `url(/images/mask${(i % 4) + 1}.svg)`,
                                                        maskSize: '100% 100%', WebkitMaskSize: '100% 100%',
                                                        maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
                                                        maskPosition: 'center', WebkitMaskPosition: 'center',
                                                    }}
                                                >
                                                    <span className="text-white text-sm text-center px-2 relative z-10">{col.name}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Extra links */}
                    {ms.extraLinks.map(({ label, icon, href }) => {
                        const Icon = MobileIconMap[icon];
                        return (
                            <Link
                                key={label}
                                href={href}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-between px-4 py-4 border-t hover:bg-gray-50 transition-colors"
                                style={{ borderColor: ms.extraLinkBorderColor }}
                            >
                                <div className="flex items-center gap-3">
                                    {Icon && <Icon size={20} style={{ color: ms.extraLinkTextColor }} />}
                                    <span className={`${ms.extraLinkFontWeight}`} style={{ color: ms.extraLinkTextColor }}>{label}</span>
                                </div>
                                <ChevronRight size={20} style={{ color: ms.extraLinkChevronColor }} />
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom buttons */}
                <div className="border-t border-gray-200 p-4 space-y-3">
                    {isLoggedIn ? (
                        <>
                            <Link
                                href={ms.myAccountHref}
                                onClick={() => setIsMenuOpen(false)}
                                className="block w-full py-3 px-4 text-center font-semibold rounded-lg transition-colors"
                                style={{ backgroundColor: ms.myAccountBg, color: ms.myAccountTextColor }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = ms.myAccountHoverBg}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = ms.myAccountBg}
                            >
                                {ms.myAccountLabel}
                            </Link>
                            <button
                                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                className="block w-full py-3 px-4 border-2 text-center font-semibold rounded-lg transition-colors"
                                style={{ borderColor: ms.logoutBorderColor, color: ms.logoutTextColor }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = ms.logoutHoverBg}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                {ms.logoutLabel}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href={ms.loginHref}
                                onClick={() => setIsMenuOpen(false)}
                                className="block w-full py-3 px-4 text-center font-semibold rounded-lg transition-colors"
                                style={{ backgroundColor: ms.loginBg, color: ms.loginTextColor }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = ms.loginHoverBg}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = ms.loginBg}
                            >
                                {ms.loginLabel}
                            </Link>
                            <Link
                                href={ms.signupHref}
                                onClick={() => setIsMenuOpen(false)}
                                className="block w-full py-3 px-4 border-2 text-center font-semibold rounded-lg transition-colors"
                                style={{ borderColor: ms.signupBorderColor, color: ms.signupTextColor }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = ms.signupHoverBg}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                {ms.signupLabel}
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                CART SIDEBAR
            ══════════════════════════════════════════════════════════ */}
            <div
                className={`fixed inset-0 bg-black z-50 transition-opacity duration-300 ${isCartOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsCartOpen(false)}
            />
            <div
                className={`fixed inset-y-0 right-0 ${cs.width} bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Cart header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold" style={{ color: cs.headerTitleColor }}>
                        {cs.headerTitle} ({cartCount})
                    </h2>
                    <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {/* Cart items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: '#244033', borderTopColor: 'transparent' }} />
                            <p className="text-gray-600">Loading cart...</p>
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingCart size={64} className="text-gray-300 mb-4" />
                            <p className="text-gray-500 mb-4">{cs.emptyMessage}</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="px-6 py-2 rounded-lg transition-colors"
                                style={{ backgroundColor: cs.emptyButtonBg, color: '#ffffff' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = cs.emptyButtonHoverBg}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = cs.emptyButtonBg}
                            >
                                {cs.emptyButtonLabel}
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 border rounded-lg" style={{ borderColor: cs.itemBorderColor }}>
                                <div className="w-20 h-20 rounded-lg flex-shrink-0 overflow-hidden" style={{ backgroundColor: cs.itemImageBg }}>
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold truncate" style={{ color: cs.itemNameColor }}>{item.name}</h3>
                                    {item.variant && item.variant !== 'Default Title' && (
                                        <p className="text-sm text-gray-500">Variant: {item.variant}</p>
                                    )}
                                    <p className="font-semibold mt-1" style={{ color: cs.itemPriceColor }}>Rs. {item.price.toFixed(2)}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center border rounded-md" style={{ borderColor: cs.qtyBorderColor }}>
                                            <button onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-100 transition-colors" disabled={item.quantity <= 1}>
                                                <Minus size={16} />
                                            </button>
                                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-100 transition-colors">
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="p-1 rounded-md transition-colors" style={{ color: cs.removeIconColor }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = cs.removeHoverBg}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Cart footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-gray-200 p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold" style={{ color: cs.subtotalColor }}>{cs.subtotalLabel}</span>
                            <span className="text-2xl font-bold" style={{ color: cs.subtotalColor }}>Rs. {calculateSubtotal()}</span>
                        </div>
                        <p className="text-sm" style={{ color: cs.subtotalNoteColor }}>{cs.subtotalNote}</p>
                        <Link
                            href={cs.viewCartHref}
                            onClick={() => setIsCartOpen(false)}
                            className="block w-full py-3 text-center font-semibold rounded-lg transition-colors"
                            style={{ backgroundColor: cs.viewCartBg, color: cs.viewCartTextColor }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = cs.viewCartHoverBg}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = cs.viewCartBg}
                        >
                            {cs.viewCartLabel}
                        </Link>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="w-full py-3 border-2 font-semibold rounded-lg transition-colors"
                            style={{ borderColor: cs.continueBorderColor, color: cs.continueTextColor }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = cs.continueHoverBg}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            {cs.continueLabel}
                        </button>
                    </div>
                )}
            </div>

            {/* ══════════════════════════════════════════════════════════
                LOGOUT SUCCESS MODAL
            ══════════════════════════════════════════════════════════ */}
            {showLogoutSuccess && (
                <div
                    className={`fixed inset-0 ${cfg.logoutModal.backdropColor} ${cfg.logoutModal.backdropBlur} z-[60] flex items-center justify-center p-4`}
                    onClick={handleCloseLogoutSuccess}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
                        style={{ animation: 'fadeIn 0.3s ease-out' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: cfg.logoutModal.iconBg }}>
                                <CheckCircle size={cfg.logoutModal.iconSize} style={{ color: cfg.logoutModal.iconColor }} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-center mb-3" style={{ color: cfg.logoutModal.titleColor }}>
                            {cfg.logoutModal.title}
                        </h2>
                        <p className="text-center mb-6" style={{ color: cfg.logoutModal.messageColor }}>
                            {cfg.logoutModal.message}
                        </p>
                        <button
                            onClick={handleCloseLogoutSuccess}
                            className="w-full py-3 font-semibold rounded-lg transition-colors"
                            style={{ backgroundColor: cfg.logoutModal.closeBg, color: cfg.logoutModal.closeTextColor }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = cfg.logoutModal.closeHoverBg}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = cfg.logoutModal.closeBg}
                        >
                            {cfg.logoutModal.closeLabel}
                        </button>
                    </div>
                    <style jsx>{`
                        @keyframes fadeIn {
                            from { opacity: 0; transform: scale(0.9); }
                            to   { opacity: 1; transform: scale(1);   }
                        }
                    `}</style>
                </div>
            )}
        </>
    );
}