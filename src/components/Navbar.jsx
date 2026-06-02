'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Search, Heart, User, ShoppingCart, ChevronDown,
    Menu, X, ChevronRight, Minus, Plus, Trash2, LogOut, CheckCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getCollections, customerLogout } from '../lib/shopify_utilis';
import { navbarConfig } from '../config/Navbar.config.jsx';

// ─── Brand SVG leaf icon ───────────────────────────────────────────────────
function LeafIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="rgba(255,255,255,0.15)" />
            <path d="M16 26 C16 26 8 20 8 13 C8 9 11.5 6 16 6 C20.5 6 24 9 24 13 C24 20 16 26 16 26Z" fill="white" opacity="0.9" />
            <path d="M16 14 L16 26" stroke="#78a240" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 17 C13.5 15 15 14 16 14" stroke="#78a240" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M20 17 C18.5 15 17 14 16 14" stroke="#78a240" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
    );
}

// ─── Config ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
    { label: 'Root', href: '/collections/root' },
    { label: 'Planters', href: '/collections/planters' },
    { label: 'Herbs', href: '/collections/herbs' },
    { label: 'Shrubs', href: '/collections/shrubs' },
    { label: 'More', href: '/collections', hasArrow: true },
];

const GREEN = '#78a240';
const GREEN_DARK = '#5e7e30';
const GREEN_DEEP = '#244033';
const WHITE = '#ffffff';
const ICON_HOVER = 'rgba(255,255,255,0.15)';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [navCollections, setNavCollections] = useState([]);
    const [loadingCollections, setLoadingCollections] = useState(true);

    const accountRef = useRef(null);

    const { cartItems, updateQuantity, removeFromCart, loading } = useCart();
    const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
    const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2);

    // scroll
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    // auth
    useEffect(() => {
        const check = () => {
            const raw = localStorage.getItem('plants-current-user');
            if (!raw) { setIsLoggedIn(false); setCurrentUser(null); return; }
            try {
                const u = JSON.parse(raw);
                if (u.accessToken && new Date(u.expiresAt) <= new Date()) {
                    localStorage.removeItem('plants-current-user');
                    setIsLoggedIn(false); setCurrentUser(null);
                } else {
                    setCurrentUser(u); setIsLoggedIn(true);
                }
            } catch {
                localStorage.removeItem('plants-current-user');
                setIsLoggedIn(false); setCurrentUser(null);
            }
        };
        check();
        window.addEventListener('storage', check);
        window.addEventListener('auth-change', check);
        return () => {
            window.removeEventListener('storage', check);
            window.removeEventListener('auth-change', check);
        };
    }, []);

    // collections
    useEffect(() => {
        getCollections(20)
            .then(cols => {
                setNavCollections(
                    cols.filter(c => !['all', 'frontpage'].includes(c.handle.toLowerCase())).slice(0, 7)
                );
            })
            .catch(() => setNavCollections([]))
            .finally(() => setLoadingCollections(false));
    }, []);

    const displayedNavLinks = navCollections.length > 0
        ? navCollections.map((c) => ({ label: c.name, href: `/collections/${c.handle}` }))
        : NAV_LINKS;

    // scroll lock
    useEffect(() => {
        document.body.style.overflow =
            (isMenuOpen || isCartOpen || showLogoutSuccess) ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen, isCartOpen, showLogoutSuccess]);

    // outside click for account dropdown
    useEffect(() => {
        const h = e => {
            if (accountRef.current && !accountRef.current.contains(e.target))
                setIsAccountOpen(false);
        };
        if (isAccountOpen) document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [isAccountOpen]);

    // programmatic navigation helper
    const goTo = (href) => {
        setIsAccountOpen(false);
        setIsMenuOpen(false);
        setIsCartOpen(false);
        router.push(href);
    };

    // logout
    const handleLogout = async () => {
        try {
            const raw = localStorage.getItem('plants-current-user');
            if (raw) {
                const u = JSON.parse(raw);
                if (u.accessToken) await customerLogout(u.accessToken);
            }
        } catch { /* ignore */ } finally {
            localStorage.removeItem('plants-current-user');
            setIsLoggedIn(false); setCurrentUser(null);
            setIsAccountOpen(false);
            window.dispatchEvent(new Event('auth-change'));
            setShowLogoutSuccess(true);
            setTimeout(() => { setShowLogoutSuccess(false); router.push('/'); }, 2500);
        }
    };

    // navbar bg
    const navBg = scrolled ? WHITE : GREEN;
    const iconColor = scrolled ? GREEN_DEEP : WHITE;
    const textColor = scrolled ? GREEN_DEEP : WHITE;

    // ── Bottom nav items — now pulled straight from config ──────────────
    const bottomNavItems = navbarConfig.mobileBottomNav.items;
    const bottomNavCfg = navbarConfig.mobileBottomNav;

    return (
        <>
            {/* ═══ Single global style block (all CSS combined) ═══ */}
            <style jsx global>{`
                .mobile-bottom-nav,
                .mobile-bottom-nav-spacer {
                    display: flex;
                }
                .desktop-only-wishlist {
                    display: flex;
                }
                @media (max-width: 1023px) {
                    .desktop-only-wishlist {
                        display: none !important;
                    }
                }
                @media (min-width: 1024px) {
                    .mobile-bottom-nav,
                    .mobile-bottom-nav-spacer {
                        display: none !important;
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            {/* ═══════════════════════════  NAVBAR  ═══════════════════════════ */}
            <nav style={{
                backgroundColor: navBg,
                borderBottom: `1px solid ${scrolled ? '#e2e8f0' : '#6b9238'}`,
                position: 'sticky', top: 0,
                zIndex: 40,
                transition: 'background-color 0.3s, border-color 0.3s',
            }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', height: 56, gap: 24 }}>

                        {/* Hamburger (mobile) */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="lg:hidden"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: iconColor }}
                        >
                            <Menu size={22} />
                        </button>

                        {/* Brand */}
                        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <LeafIcon />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: 18, fontWeight: 700, color: textColor, letterSpacing: 0.3, lineHeight: 1.1 }}>
                                    Groves Box
                                </span>
                            </div>
                        </Link>

                        {/* Desktop nav links */}
                        <div className="hidden lg:flex" style={{ flex: 1, justifyContent: 'center', gap: 2 }}>
                            {displayedNavLinks.map(({ label, href }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    style={{
                                        color: textColor,
                                        textDecoration: 'none',
                                        fontSize: 13.5,
                                        fontWeight: 500,
                                        padding: '6px 14px',
                                        borderRadius: 4,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3,
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = scrolled ? 'rgba(120,162,64,0.1)' : ICON_HOVER}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>

                        {/* Right actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 'auto' }}>

                            {/* Search */}
                            <button
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 7, borderRadius: 4, color: iconColor, display: 'flex', alignItems: 'center' }}
                                onMouseEnter={e => e.currentTarget.style.background = scrolled ? 'rgba(120,162,64,0.1)' : ICON_HOVER}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <Search size={20} />
                            </button>

                            {/* Wishlist (desktop only) */}
                            <Link
                                href="/wishlist"
                                className="desktop-only-wishlist"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 7,
                                    borderRadius: 4,
                                    color: iconColor,
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = scrolled ? 'rgba(120,162,64,0.1)' : ICON_HOVER}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <Heart size={20} />
                            </Link>

                            {/* Account dropdown (desktop) */}
                            <div className="hidden lg:block" style={{ position: 'relative' }} ref={accountRef}>
                                <button
                                    onClick={() => {
                                        if (isLoggedIn) setIsAccountOpen(p => !p);
                                        else router.push('/account');
                                    }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 7, borderRadius: 4, color: iconColor, display: 'flex', alignItems: 'center', gap: 2 }}
                                    onMouseEnter={e => e.currentTarget.style.background = scrolled ? 'rgba(120,162,64,0.1)' : ICON_HOVER}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <User size={20} />
                                    {isLoggedIn && <ChevronDown size={14} style={{ transform: isAccountOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}
                                </button>

                                {/* Dropdown */}
                                {isAccountOpen && (
                                    <div style={{
                                        position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                                        width: 220, background: WHITE, borderRadius: 10,
                                        border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                        overflow: 'hidden', zIndex: 50,
                                    }}>
                                        {isLoggedIn ? (
                                            <>
                                                <div style={{ padding: '12px 16px', background: `linear-gradient(to right, ${GREEN}, ${GREEN_DARK})`, color: WHITE }}>
                                                    <p style={{ fontSize: 14, fontWeight: 600 }}>{currentUser?.name}</p>
                                                    <p style={{ fontSize: 12, opacity: 0.85, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser?.email}</p>
                                                </div>
                                                <button
                                                    onClick={() => goTo('/account')}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#374151', fontSize: 14, textAlign: 'left' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <User size={16} /> My Account
                                                </button>
                                                <div style={{ borderTop: '1px solid #e2e8f0' }} />
                                                <button onClick={handleLogout}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 14 }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                    <LogOut size={16} /> Logout
                                                </button>
                                            </>
                                        ) : (
                                            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                <button
                                                    onClick={() => goTo('/account')}
                                                    style={{ display: 'flex', justifyContent: 'center', padding: '10px 16px', background: GREEN, color: WHITE, border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                                                    Login
                                                </button>
                                                <button
                                                    onClick={() => goTo('/account')}
                                                    style={{ display: 'flex', justifyContent: 'center', padding: '10px 16px', border: `2px solid ${GREEN}`, color: GREEN, background: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                                                    Sign Up
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Cart */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 7, borderRadius: 4, color: iconColor, display: 'flex', alignItems: 'center', position: 'relative' }}
                                onMouseEnter={e => e.currentTarget.style.background = scrolled ? 'rgba(120,162,64,0.1)' : ICON_HOVER}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <ShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span style={{
                                        position: 'absolute', top: 2, right: 2,
                                        background: '#e74c3c', color: WHITE,
                                        fontSize: 10, fontWeight: 700,
                                        width: 16, height: 16, borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ═══════════════════════  MOBILE SIDEBAR  ══════════════════════ */}
            {isMenuOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50 }}
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
            <div style={{
                position: 'fixed', insetY: 0, left: 0, top: 0, bottom: 0,
                width: 300, background: WHITE, zIndex: 51,
                display: 'flex', flexDirection: 'column',
                transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease-in-out',
                boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <LeafIcon />
                        <span style={{ fontSize: 18, fontWeight: 700, color: GREEN }}>Groves Box</span>
                    </div>
                    <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                        <X size={22} />
                    </button>
                </div>

                {isLoggedIn && currentUser && (
                    <div style={{ padding: 16, background: '#f0f7e6', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: GREEN, color: WHITE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 18 }}>
                            {currentUser.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>{currentUser.name}</p>
                            <p style={{ fontSize: 12, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{currentUser.email}</p>
                        </div>
                    </div>
                )}

                <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                    {displayedNavLinks.map(({ label, href }) => (
                        <Link key={label} href={href} onClick={() => setIsMenuOpen(false)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', textDecoration: 'none', color: '#374151', fontSize: 15, fontWeight: 500, borderBottom: '1px solid #f3f4f6' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            {label}
                            <ChevronRight size={16} color="#9ca3af" />
                        </Link>
                    ))}
                </div>

                <div style={{ padding: 16, borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {isLoggedIn ? (
                        <>
                            <button
                                onClick={() => goTo('/account')}
                                style={{ display: 'block', padding: '12px 16px', background: GREEN, color: WHITE, border: 'none', borderRadius: 8, fontWeight: 600, textAlign: 'center', fontSize: 14, cursor: 'pointer' }}>
                                My Account
                            </button>
                            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                style={{ padding: '12px 16px', border: `2px solid #dc2626`, color: '#dc2626', background: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => goTo('/account')}
                                style={{ display: 'block', padding: '12px 16px', background: GREEN, color: WHITE, border: 'none', borderRadius: 8, fontWeight: 600, textAlign: 'center', fontSize: 14, cursor: 'pointer' }}>
                                Login
                            </button>
                            <button
                                onClick={() => goTo('/account')}
                                style={{ display: 'block', padding: '12px 16px', border: `2px solid ${GREEN}`, color: GREEN, background: 'none', borderRadius: 8, fontWeight: 600, textAlign: 'center', fontSize: 14, cursor: 'pointer' }}>
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* ════════════════════════  CART SIDEBAR  ════════════════════════ */}
            {isCartOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,17,0.45)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 50, transition: 'opacity 0.3s ease' }}
                    onClick={() => setIsCartOpen(false)}
                />
            )}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(420px, 100vw)', background: '#f7f9f4', zIndex: 51,
                display: 'flex', flexDirection: 'column',
                transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
                boxShadow: '-12px 0 40px rgba(36,64,51,0.18)',
            }}>
                {/* Header */}
                <div style={{ background: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`, padding: '20px 20px 18px', color: WHITE, flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShoppingCart size={20} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>Your Cart</h2>
                                <span style={{ fontSize: 12.5, opacity: 0.85 }}>{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
                            </div>
                        </div>
                        <button onClick={() => setIsCartOpen(false)} aria-label="Close cart"
                            style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.16)', border: 'none', cursor: 'pointer', color: WHITE, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
                            <div style={{ width: 40, height: 40, border: `3px solid ${GREEN}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                            <p style={{ color: '#6b7280' }}>Loading cart…</p>
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14, textAlign: 'center' }}>
                            <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#eef5e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShoppingCart size={44} color={GREEN} />
                            </div>
                            <div>
                                <p style={{ color: GREEN_DEEP, fontWeight: 700, fontSize: 16, margin: '0 0 4px' }}>Your cart is empty</p>
                                <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>Start adding some greens 🌿</p>
                            </div>
                            <button onClick={() => setIsCartOpen(false)}
                                style={{ padding: '12px 28px', background: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`, color: WHITE, border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 20px rgba(94,126,48,0.3)' }}>
                                Shop Now
                            </button>
                        </div>
                    ) : cartItems.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: 12, padding: 12, background: WHITE, border: '1px solid #eceee8', borderRadius: 16, boxShadow: '0 2px 8px rgba(36,64,51,0.04)' }}>
                            <div style={{ width: 76, height: 76, borderRadius: 12, overflow: 'hidden', background: '#eef5e6', flexShrink: 0 }}>
                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                    <p style={{ fontWeight: 600, fontSize: 13.5, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                                    <button onClick={() => removeFromCart(item.id)} aria-label="Remove item"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0c4bb', padding: 2, flexShrink: 0, transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#c0c4bb'}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                {item.variant && item.variant !== 'Default Title' && (
                                    <p style={{ fontSize: 12, color: '#6b7280', margin: '3px 0 0' }}>{item.variant}</p>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5ec', borderRadius: 10, padding: 2 }}>
                                        <button onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                                            style={{ background: WHITE, border: 'none', cursor: 'pointer', width: 28, height: 28, borderRadius: 8, color: GREEN_DEEP, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
                                            <Minus size={14} />
                                        </button>
                                        <span style={{ padding: '0 12px', fontSize: 13.5, fontWeight: 700, color: GREEN_DEEP, minWidth: 18, textAlign: 'center' }}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            style={{ background: WHITE, border: 'none', cursor: 'pointer', width: 28, height: 28, borderRadius: 8, color: GREEN_DEEP, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <p style={{ fontWeight: 700, color: GREEN_DEEP, fontSize: 15, margin: 0 }}>Rs. {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div style={{ padding: 18, background: WHITE, borderTop: '1px solid #eceee8', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 -6px 20px rgba(36,64,51,0.06)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ fontWeight: 600, color: '#6b7280', fontSize: 14 }}>Subtotal</span>
                            <span style={{ fontSize: 24, fontWeight: 800, color: GREEN_DEEP }}>Rs. {subtotal}</span>
                        </div>
                        <p style={{ fontSize: 11.5, color: '#9ca3af', margin: 0 }}>Taxes &amp; shipping calculated at checkout</p>
                        <Link href="/cart" onClick={() => setIsCartOpen(false)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '15px 16px', background: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`, color: WHITE, textDecoration: 'none', borderRadius: 14, fontWeight: 700, fontSize: 15, boxShadow: '0 8px 20px rgba(94,126,48,0.32)' }}>
                            Checkout
                        </Link>
                        <button onClick={() => setIsCartOpen(false)}
                            style={{ padding: '12px 16px', border: 'none', color: GREEN_DEEP, background: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>

            {/* ═══════════════════  LOGOUT SUCCESS MODAL  ════════════════════ */}
            {showLogoutSuccess && (
                <div
                    onClick={() => { setShowLogoutSuccess(false); router.push('/'); }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
                >
                    <div onClick={e => e.stopPropagation()} style={{ background: WHITE, borderRadius: 20, padding: 40, maxWidth: 400, width: '100%', textAlign: 'center', animation: 'fadeIn 0.3s ease-out' }}>
                        <div style={{ width: 72, height: 72, background: '#f0f7e6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <CheckCircle size={38} color={GREEN} />
                        </div>
                        <h2 style={{ fontSize: 22, fontWeight: 700, color: GREEN_DEEP, marginBottom: 10 }}>Logged Out Successfully</h2>
                        <p style={{ color: '#6b7280', marginBottom: 24 }}>You have been signed out. See you again soon!</p>
                        <button
                            onClick={() => { setShowLogoutSuccess(false); router.push('/'); }}
                            style={{ width: '100%', padding: '13px 16px', background: GREEN, color: WHITE, border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════════════════  MOBILE BOTTOM NAV (< 1024px only) ═══════════════════ */}
            <nav
                className="mobile-bottom-nav"
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 64,
                    background: bottomNavCfg.bg,
                    borderTop: `1px solid ${bottomNavCfg.borderColor}`,
                    boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
                    zIndex: 45,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                }}
            >
                {bottomNavItems.map(({ label, href, icon, authHref }) => {
                    // If user is not logged in and item has authHref, redirect to it
                    const finalHref = (!isLoggedIn && authHref) ? authHref : href;

                    const active =
                        href === '/'
                            ? pathname === '/'
                            : pathname === href || pathname.startsWith(href + '/');

                    const iconColor = active
                        ? bottomNavCfg.activeColor
                        : bottomNavCfg.inactiveColor;

                    return (
                        <Link
                            key={label}
                            href={finalHref}
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 3,
                                textDecoration: 'none',
                                color: iconColor,
                                fontSize: 11,
                                fontWeight: active ? 600 : 500,
                                height: '100%',
                                position: 'relative',
                                transition: 'color 0.2s',
                            }}
                        >
                            {active && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 32,
                                        height: 3,
                                        background: bottomNavCfg.activeColor,
                                        borderRadius: '0 0 4px 4px',
                                    }}
                                />
                            )}

                            {/* Icon rendered as CSS mask → color changes with activeColor */}
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: bottomNavCfg.iconSize,
                                    height: bottomNavCfg.iconSize,
                                    backgroundColor: iconColor,
                                    WebkitMaskImage: `url(${icon})`,
                                    maskImage: `url(${icon})`,
                                    WebkitMaskSize: 'contain',
                                    maskSize: 'contain',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskRepeat: 'no-repeat',
                                    WebkitMaskPosition: 'center',
                                    maskPosition: 'center',
                                    transition: 'background-color 0.2s',
                                }}
                            />

                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

        </>
    );
}