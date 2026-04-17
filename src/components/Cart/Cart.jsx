'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronLeft, Trash2, Minus, Plus, AlertCircle,
    Heart, ShoppingCart, Tag, X, Loader2,
    CheckCircle2, ChevronDown, Gift, Percent, Truck, RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../ProductCard';
import { getProducts } from '../../lib/shopify_utilis';
import {
    colors,
    shippingConfig,
    recommendationsConfig,
    strings,
    routes,
    features,
    ui,
} from '../../config/cart.config';

const ICON_MAP = { percent: Percent, gift: Gift, truck: Truck, tag: Tag };
const ICON_STYLE = {
    percent: { bg: '#EEF2FF', color: '#6366F1', tagColor: '#6366F1' },
    gift: { bg: '#FFF7ED', color: '#F97316', tagColor: '#F97316' },
    truck: { bg: '#F0FDF4', color: '#16A34A', tagColor: '#16A34A' },
    tag: { bg: '#F9FAFB', color: '#6B7280', tagColor: '#6B7280' },
};

function ExpiryTimer({ endsAt }) {
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
        const calc = () => {
            const diff = new Date(endsAt).getTime() - Date.now();
            if (diff <= 0) { setTimeLeft('Expired'); return; }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            if (d > 1) setTimeLeft(`Ends in ${d}d`);
            else if (h >= 1) setTimeLeft(`Ends in ${h}h ${m}m`);
            else setTimeLeft(`Ends in ${m}m`);
        };
        calc();
        const t = setInterval(calc, 30000);
        return () => clearInterval(t);
    }, [endsAt]);
    return (
        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100">
            ⏳ {timeLeft}
        </span>
    );
}

function OffersDropdown({ applyDiscount, discountLoading, discountCodes, discountError }) {
    const [isOpen, setIsOpen] = useState(false);
    const [offers, setOffers] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [fetchErr, setFetchErr] = useState(null);
    const [applyingId, setApplyingId] = useState(null);
    const dropdownRef = useRef(null);

    const appliedCodes = discountCodes.filter((d) => d.applicable).map((d) => d.code.toUpperCase());

    const fetchOffers = async () => {
        setFetching(true);
        setFetchErr(null);
        try {
            const res = await fetch('/api/discounts');
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Failed to load offers');
            setOffers(json.offers || []);
        } catch (err) {
            setFetchErr(err.message || 'Could not load offers.');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (isOpen && offers.length === 0 && !fetching) fetchOffers();
    }, [isOpen]);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleApply = async (offer) => {
        if (appliedCodes.includes(offer.code.toUpperCase())) return;
        setApplyingId(offer.id);
        await applyDiscount(offer.code);
        setApplyingId(null);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className="mb-4 sm:mb-5 relative">
            <button
                onClick={() => setIsOpen((p) => !p)}
                className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-dashed transition-all"
                style={{
                    borderColor: isOpen ? colors.primary : colors.border?.default || '#E5E7EB',
                    backgroundColor: isOpen ? `${colors.primary}08` : colors.surface?.muted || '#F9FAFB',
                }}
            >
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.primary}18` }}>
                        <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: colors.primary }} />
                    </div>
                    <div className="text-left">
                        <p className="text-xs sm:text-sm font-semibold" style={{ color: colors.text?.heading }}>View Available Offers</p>
                        <p className="text-[10px] sm:text-xs" style={{ color: colors.text?.muted }}>
                            {fetching ? 'Loading offers…' : offers.length > 0 ? `${offers.length} offer${offers.length > 1 ? 's' : ''} available` : 'Tap to see available offers'}
                        </p>
                    </div>
                </div>
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 flex-shrink-0" style={{ color: colors.primary, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {appliedCodes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {appliedCodes.map((code) => (
                        <span key={code} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold" style={{ backgroundColor: '#F0FDF4', color: '#16A34A', border: '1px solid #86EFAC' }}>
                            <CheckCircle2 className="w-3 h-3" />{code} Applied!
                        </span>
                    ))}
                </div>
            )}

            {discountError && (
                <p className="mt-1.5 text-[10px] sm:text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{discountError}
                </p>
            )}

            {isOpen && (
                <div className="absolute left-0 right-0 z-50 mt-2 rounded-xl border shadow-2xl overflow-hidden" style={{ backgroundColor: colors.surface?.card || '#fff', borderColor: colors.border?.default || '#E5E7EB', top: '100%' }}>
                    <div className="px-3 sm:px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: colors.border?.default || '#E5E7EB', background: `linear-gradient(135deg, ${colors.primary}12, ${colors.primary}04)` }}>
                        <p className="text-xs sm:text-sm font-semibold" style={{ color: colors.text?.heading }}>🎁 Available Offers</p>
                        <div className="flex items-center gap-2">
                            <button onClick={(e) => { e.stopPropagation(); fetchOffers(); }} disabled={fetching} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-100 transition" title="Refresh">
                                <RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin' : ''}`} style={{ color: colors.text?.muted }} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
                                <X className="w-3.5 h-3.5" style={{ color: colors.text?.muted }} />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                        {fetching && (
                            <div className="flex flex-col items-center justify-center py-8 gap-2">
                                <Loader2 className="w-6 h-6 animate-spin" style={{ color: colors.primary }} />
                                <p className="text-xs" style={{ color: colors.text?.muted }}>Fetching latest offers…</p>
                            </div>
                        )}
                        {!fetching && fetchErr && (
                            <div className="flex flex-col items-center justify-center py-8 gap-3 px-4 text-center">
                                <AlertCircle className="w-6 h-6 text-red-400" />
                                <p className="text-xs text-red-500">{fetchErr}</p>
                                <button onClick={fetchOffers} className="text-xs font-medium px-3 py-1.5 rounded-lg border" style={{ color: colors.primary, borderColor: colors.primary }}>Try Again</button>
                            </div>
                        )}
                        {!fetching && !fetchErr && offers.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 gap-2 px-4 text-center">
                                <Tag className="w-8 h-8 opacity-20" style={{ color: colors.text?.muted }} />
                                <p className="text-xs font-medium" style={{ color: colors.text?.body }}>No offers available right now</p>
                                <p className="text-[10px]" style={{ color: colors.text?.muted }}>Check back soon for exciting deals!</p>
                            </div>
                        )}
                        {!fetching && !fetchErr && offers.length > 0 && (
                            <div className="divide-y" style={{ borderColor: colors.border?.default }}>
                                {offers.map((offer) => {
                                    const iconKey = offer.icon || 'tag';
                                    const Icon = ICON_MAP[iconKey] || Tag;
                                    const style = ICON_STYLE[iconKey] || ICON_STYLE.tag;
                                    const isApplied = appliedCodes.includes(offer.code.toUpperCase());
                                    const isApplying = applyingId === offer.id;
                                    return (
                                        <div key={offer.id} className="px-3 sm:px-4 py-3 sm:py-3.5 flex items-start gap-3 transition-colors" style={{ backgroundColor: isApplied ? '#F0FDF4' : 'transparent' }}>
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: style.bg }}>
                                                <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: style.color }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                                    <span className="font-bold text-xs sm:text-sm font-mono tracking-wide" style={{ color: colors.text?.heading }}>{offer.code}</span>
                                                    {offer.tag && (
                                                        <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: `${style.tagColor}18`, color: style.tagColor }}>{offer.tag}</span>
                                                    )}
                                                    {offer.endsAt && <ExpiryTimer endsAt={offer.endsAt} />}
                                                </div>
                                                <p className="text-[10px] sm:text-xs font-semibold mb-0.5" style={{ color: colors.text?.body }}>{offer.title}</p>
                                                <p className="text-[10px] sm:text-xs leading-relaxed" style={{ color: colors.text?.muted }}>{offer.description}</p>
                                            </div>
                                            <div className="flex-shrink-0 self-center">
                                                {isApplied ? (
                                                    <span className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold" style={{ color: '#16A34A' }}>
                                                        <CheckCircle2 className="w-4 h-4" />Applied
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleApply(offer)}
                                                        disabled={discountLoading || !!isApplying}
                                                        className="px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition active:scale-95 disabled:opacity-60 flex items-center gap-1"
                                                        style={{ backgroundColor: `${colors.primary}12`, color: colors.primary, border: `1.5px solid ${colors.primary}40` }}
                                                    >
                                                        {isApplying ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="px-3 sm:px-4 py-2 border-t" style={{ borderColor: colors.border?.default || '#E5E7EB', backgroundColor: colors.surface?.muted || '#F9FAFB' }}>
                        <p className="text-[10px] sm:text-xs text-center" style={{ color: colors.text?.muted }}>💡 Tap Apply to instantly use an offer at checkout</p>
                    </div>
                </div>
            )}
        </div>
    );
}



export default function CartPage() {
    const [products, setProducts] = useState([]);
    const { cartItems, loading, updateQuantity, removeFromCart, checkoutUrl, discountCodes, discountAmount, discountError, discountLoading, applyDiscount } = useCart();

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= shippingConfig.freeShippingThreshold ? 0 : shippingConfig.standardShippingCost;
    const amountUntilFreeShipping = Math.max(0, shippingConfig.freeShippingThreshold - subtotal);
    const estimatedTotal = Math.max(0, subtotal + shipping - discountAmount);
    const shippingProgress = Math.min(100, (subtotal / shippingConfig.freeShippingThreshold) * 100);
    const appliedCodes = discountCodes.filter((d) => d.applicable);

    useEffect(() => {
        if (!features.showRecommendations) return;
        getProducts(recommendationsConfig.fetchCount).then(setProducts).catch(console.error);
    }, []);

    const recommendedProducts = products
        .filter((p) => !cartItems.some((c) => c.name === p.name))
        .slice(0, recommendationsConfig.displayCount)
        .map((p) => {
            const isBestSeller = p.price < recommendationsConfig.badgeRules.bestSeller.maxPrice;
            const isTopRated = p.rating >= recommendationsConfig.badgeRules.topRated.minRating;
            return { ...p, badge: isBestSeller ? 'Best Seller' : isTopRated ? 'Top Rated' : undefined, badgeColor: isBestSeller ? colors.badge?.bestSeller?.bg : isTopRated ? colors.badge?.topRated?.bg : undefined };
        });

    const handleCheckout = () => { if (checkoutUrl) window.location.href = checkoutUrl; };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.surface?.page }}>
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: colors.primary, borderTopColor: 'transparent' }} />
                <p style={{ color: colors.text?.muted }}>{strings.loading}</p>
            </div>
        </div>
    );

    if (cartItems.length === 0) return (
        <div className="min-h-screen" style={{ backgroundColor: colors.surface?.page }}>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
                <div className="text-center py-16">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4" style={{ color: colors.text?.muted }} />
                    <h2 className="text-2xl font-semibold mb-2" style={{ color: colors.text?.body }}>{strings.empty.heading}</h2>
                    <p className="mb-6" style={{ color: colors.text?.muted }}>{strings.empty.subtext}</p>
                    <Link href={routes.products} className="inline-block text-white px-8 py-3 rounded-lg font-medium transition" style={{ backgroundColor: colors.primary }}>{strings.empty.cta}</Link>
                </div>
            </div>
        </div>
    );

    const RecommendationsGrid = ({ extraClass = '' }) =>
        features.showRecommendations && recommendedProducts.length > 0 ? (
            <div className={`mt-8 sm:mt-10 md:mt-12 ${extraClass}`}>
                <h2 className="text-xl sm:text-2xl font-sans mb-1 sm:mb-2" style={{ color: colors.text?.heading }}>{strings.recommendations.title}</h2>
                <p className="text-sm sm:text-base mb-4 sm:mb-6" style={{ color: colors.text?.muted }}>{strings.recommendations.subtitle}</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {recommendedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
            </div>
        ) : null;

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.surface?.page }}>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
                <Link href={routes.products} className="inline-flex items-center transition-colors mb-4 sm:mb-6 group active:scale-95" style={{ color: colors.text?.muted }}>
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs sm:text-sm font-medium">{strings.page.backLabel}</span>
                </Link>

                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                    <div className="lg:col-span-8 order-1">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans" style={{ color: colors.text?.heading }}>{strings.page.title}</h1>
                            <span className="text-xs sm:text-sm ml-2" style={{ color: colors.text?.muted }}>{cartItems.length} {cartItems.length === 1 ? strings.page.itemSingular : strings.page.itemPlural}</span>
                        </div>

                        {features.showColdWeatherNotice && (
                            <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border" style={{ backgroundColor: colors.notice?.cold?.bg, borderColor: colors.notice?.cold?.border }}>
                                <div className="flex gap-2 sm:gap-3">
                                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: colors.notice?.cold?.icon }} />
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium mb-0.5 sm:mb-1" style={{ color: colors.notice?.cold?.title }}>{strings.coldWeather.title}</p>
                                        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: colors.notice?.cold?.body }}>{strings.coldWeather.body}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3 sm:space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border hover:shadow-md transition-shadow" style={{ backgroundColor: colors.surface?.card, borderColor: colors.border?.default }}>
                                    <div className="flex gap-3 sm:gap-4 md:gap-6">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg flex-shrink-0 overflow-hidden" style={{ backgroundColor: colors.surface?.muted }}>
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow flex flex-col min-w-0">
                                            <div className="flex justify-between items-start mb-2 gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 line-clamp-2" style={{ color: colors.text?.heading }}>{item.name}</h3>
                                                    {item.size && <p className="text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-1" style={{ color: colors.text?.body }}>{item.size}</p>}
                                                    {item.variant && item.variant !== 'Default Title' && <p className="text-xs sm:text-sm line-clamp-1" style={{ color: colors.text?.muted }}>{item.variant}</p>}
                                                </div>
                                                <span className="text-base sm:text-lg md:text-xl font-semibold flex-shrink-0" style={{ color: colors.text?.price }}>{shippingConfig.currency}{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 gap-2">
                                                <button onClick={() => removeFromCart(item.id)} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-colors active:scale-95" style={{ color: colors.text?.danger }}>
                                                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    <span className="hidden xs:inline">Remove</span>
                                                </button>
                                                <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: colors.border?.default }}>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation" disabled={item.quantity <= 1}>
                                                        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: colors.text?.muted }} />
                                                    </button>
                                                    <span className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border-x min-w-[3rem] sm:min-w-[3.5rem] md:min-w-[4rem] text-center" style={{ borderColor: colors.border?.default, color: colors.text?.body }}>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation">
                                                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: colors.text?.muted }} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <RecommendationsGrid extraClass="hidden lg:block" />
                    </div>

                    <div className="lg:col-span-4 order-2">
                        <div className="rounded-lg sm:rounded-xl border p-4 sm:p-5 md:p-6 lg:sticky lg:top-8" style={{ backgroundColor: colors.surface?.card, borderColor: colors.border?.default }}>
                            <h2 className="text-lg sm:text-xl font-sans mb-4 sm:mb-5" style={{ color: colors.text?.heading }}>{strings.summary.title}</h2>

                            {features.enableFreeShippingProgress && (
                                amountUntilFreeShipping > 0 ? (
                                    <div className="mb-4 sm:mb-5 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: colors.surface?.muted }}>
                                        <p className="text-xs sm:text-sm mb-2 sm:mb-3" style={{ color: colors.text?.body }}>
                                            Add <span className="font-bold" style={{ color: colors.primary }}>{shippingConfig.currency}{amountUntilFreeShipping.toFixed(2)}</span> more for free shipping!
                                        </p>
                                        <div className="relative h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.progressBar?.track }}>
                                            <div className="absolute top-0 left-0 h-full transition-all duration-500 ease-out" style={{ width: `${shippingProgress}%`, background: `linear-gradient(to right, ${colors.progressBar?.fillFrom}, ${colors.progressBar?.fillTo})` }} />
                                        </div>
                                        <div className="flex justify-between items-center mt-1.5 sm:mt-2">
                                            <span className="text-[10px] sm:text-xs" style={{ color: colors.text?.muted }}>{shippingConfig.currency}{subtotal.toFixed(2)}</span>
                                            <span className="text-[10px] sm:text-xs font-semibold" style={{ color: colors.primary }}>{strings.summary.freeShippingLabel}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-4 sm:mb-5 p-3 sm:p-4 rounded-lg border" style={{ backgroundColor: colors.notice?.freeShipping?.bg, borderColor: colors.notice?.freeShipping?.border }}>
                                        <p className="text-xs sm:text-sm font-medium flex items-center gap-2" style={{ color: colors.notice?.freeShipping?.text }}>
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            {strings.summary.freeShippingUnlocked}
                                        </p>
                                    </div>
                                )
                            )}

                            {/* ── OFFERS DROPDOWN (fetches real Shopify discounts) ── */}
                            <OffersDropdown applyDiscount={applyDiscount} discountLoading={discountLoading} discountCodes={discountCodes} discountError={discountError} />

                            <div className="border-t mb-4 sm:mb-5" style={{ borderColor: colors.border?.default }} />

                            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5">
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <span style={{ color: colors.text?.muted }}>{strings.summary.subtotal}</span>
                                    <span className="font-medium" style={{ color: colors.text?.body }}>{shippingConfig.currency}{subtotal.toFixed(2)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-xs sm:text-sm">
                                        <span className="flex items-center gap-1.5 font-medium" style={{ color: '#16A34A' }}>
                                            <Tag className="w-3 h-3" />Offer Discount
                                            {appliedCodes.length > 0 && <span className="text-[10px] font-normal opacity-75">({appliedCodes.map((d) => d.code).join(', ')})</span>}
                                        </span>
                                        <span className="font-semibold" style={{ color: '#16A34A' }}>−{shippingConfig.currency}{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <span style={{ color: colors.text?.muted }}>{strings.summary.shipping}</span>
                                    <span className="font-medium">{shipping === 0 ? <span style={{ color: '#16A34A' }}>{strings.summary.shippingFree}</span> : <span style={{ color: colors.text?.body }}>{shippingConfig.currency}{shipping.toFixed(2)}</span>}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <span style={{ color: colors.text?.muted }}>{strings.summary.taxes}</span>
                                    <span style={{ color: colors.text?.muted, fontSize: '0.75rem' }}>{strings.summary.taxesNote}</span>
                                </div>
                            </div>

                            <div className="pt-3 sm:pt-4 mb-4 sm:mb-5 border-t" style={{ borderColor: colors.border?.default }}>
                                <div className="flex justify-between items-center">
                                    <span className="text-base sm:text-lg font-semibold" style={{ color: colors.primary }}>{strings.summary.total}</span>
                                    <div className="text-right">
                                        {discountAmount > 0 && <p className="text-[10px] sm:text-xs line-through mb-0.5" style={{ color: colors.text?.muted }}>{shippingConfig.currency}{(subtotal + shipping).toFixed(2)}</p>}
                                        <span className="text-xl sm:text-2xl font-bold" style={{ color: colors.primary }}>{shippingConfig.currency}{estimatedTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                {discountAmount > 0 && <p className="text-[10px] sm:text-xs mt-1.5 font-medium" style={{ color: '#16A34A' }}>🎉 You're saving {shippingConfig.currency}{discountAmount.toFixed(2)} on this order!</p>}
                                <p className="text-[10px] sm:text-xs mt-1.5" style={{ color: colors.text?.muted }}>{strings.summary.totalNote}</p>
                            </div>

                            <button onClick={handleCheckout} disabled={!checkoutUrl} className="block w-full text-white font-semibold py-3 sm:py-3.5 md:py-4 rounded-lg transition-all text-center text-sm sm:text-base shadow-sm hover:shadow-md active:scale-[0.98] touch-manipulation disabled:opacity-60 disabled:cursor-not-allowed" style={{ backgroundColor: colors.primary }}>
                                {checkoutUrl ? strings.checkout.proceed : strings.checkout.loading}
                            </button>

                            <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs" style={{ color: colors.text?.muted }}>
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <span>{strings.checkout.security}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <RecommendationsGrid extraClass="lg:hidden order-3" />
            </div>
        </div>
    );
}