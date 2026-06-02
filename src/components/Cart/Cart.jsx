'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronLeft, Trash2, Minus, Plus, AlertCircle,
    ShoppingCart, Tag, X, Loader2,
    CheckCircle2, ChevronDown, Gift, Percent, Truck, RefreshCw, ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import ProductCard from '../ProductCard';
import { getProducts } from '../../lib/shopify_utilis';
import {
    shippingConfig,
    recommendationsConfig,
    strings,
    routes,
    features,
} from '../../config/cart.config';

const ICON_MAP = { percent: Percent, gift: Gift, truck: Truck, tag: Tag };
const OFFER_ICON_STYLE = {
    percent: { bg: 'bg-indigo-50', color: 'text-indigo-500', tag: 'bg-indigo-50 text-indigo-500' },
    gift:    { bg: 'bg-orange-50', color: 'text-orange-500', tag: 'bg-orange-50 text-orange-500' },
    truck:   { bg: 'bg-green-50',  color: 'text-green-600',  tag: 'bg-green-50 text-green-600' },
    tag:     { bg: 'bg-gray-50',   color: 'text-gray-500',   tag: 'bg-gray-100 text-gray-500' },
};

// ── Expiry timer pill ─────────────────────────────────────────────────────────
function ExpiryTimer({ endsAt }) {
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
        const calc = () => {
            const diff = new Date(endsAt).getTime() - Date.now();
            if (diff <= 0) { setTimeLeft('Expired'); return; }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            if (d > 1) setTimeLeft(`${d}d left`);
            else if (h >= 1) setTimeLeft(`${h}h ${m}m left`);
            else setTimeLeft(`${m}m left`);
        };
        calc();
        const t = setInterval(calc, 30000);
        return () => clearInterval(t);
    }, [endsAt]);
    return (
        <span className="inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100">
            ⏳ {timeLeft}
        </span>
    );
}

// ── Offers dropdown ───────────────────────────────────────────────────────────
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
        <div ref={dropdownRef} className="relative mb-5">
            {/* Trigger */}
            <button
                onClick={() => setIsOpen((p) => !p)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-dashed transition-all ${
                    isOpen ? 'border-[#6b9238] bg-green-50/50' : 'border-gray-200 bg-gray-50 hover:border-[#6b9238]/50'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Tag className="w-4 h-4 text-[#6b9238]" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800">View Available Offers</p>
                        <p className="text-xs text-gray-500">
                            {fetching ? 'Loading offers…' : offers.length > 0 ? `${offers.length} offer${offers.length > 1 ? 's' : ''} available` : 'Tap to see available offers'}
                        </p>
                    </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-[#6b9238] transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Applied codes */}
            {appliedCodes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {appliedCodes.map((code) => (
                        <span key={code} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle2 className="w-3 h-3" />{code} Applied!
                        </span>
                    ))}
                </div>
            )}

            {discountError && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{discountError}
                </p>
            )}

            {/* Dropdown panel */}
            {isOpen && (
                <div className="absolute left-0 right-0 z-50 mt-2 rounded-xl border border-gray-200 shadow-2xl bg-white overflow-hidden" style={{ top: '100%' }}>
                    {/* Header */}
                    <div className="px-4 py-2.5 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800">🎁 Available Offers</p>
                        <div className="flex items-center gap-2">
                            <button onClick={(e) => { e.stopPropagation(); fetchOffers(); }} disabled={fetching} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-100 transition" title="Refresh">
                                <RefreshCw className={`w-3.5 h-3.5 text-gray-400 ${fetching ? 'animate-spin' : ''}`} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
                                <X className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                        {fetching && (
                            <div className="flex flex-col items-center justify-center py-8 gap-2">
                                <Loader2 className="w-6 h-6 animate-spin text-[#6b9238]" />
                                <p className="text-xs text-gray-400">Fetching latest offers…</p>
                            </div>
                        )}
                        {!fetching && fetchErr && (
                            <div className="flex flex-col items-center justify-center py-8 gap-3 px-4 text-center">
                                <AlertCircle className="w-6 h-6 text-red-400" />
                                <p className="text-xs text-red-500">{fetchErr}</p>
                                <button onClick={fetchOffers} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#6b9238] text-[#6b9238]">Try Again</button>
                            </div>
                        )}
                        {!fetching && !fetchErr && offers.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 gap-2 px-4 text-center">
                                <Tag className="w-8 h-8 text-gray-200" />
                                <p className="text-xs font-medium text-gray-600">No offers available right now</p>
                                <p className="text-[10px] text-gray-400">Check back soon for exciting deals!</p>
                            </div>
                        )}
                        {!fetching && !fetchErr && offers.length > 0 && (
                            <div className="divide-y divide-gray-100">
                                {offers.map((offer) => {
                                    const iconKey = offer.icon || 'tag';
                                    const Icon = ICON_MAP[iconKey] || Tag;
                                    const s = OFFER_ICON_STYLE[iconKey] || OFFER_ICON_STYLE.tag;
                                    const isApplied = appliedCodes.includes(offer.code.toUpperCase());
                                    const isApplying = applyingId === offer.id;
                                    return (
                                        <div key={offer.id} className={`px-4 py-3.5 flex items-start gap-3 ${isApplied ? 'bg-green-50/50' : 'hover:bg-gray-50'} transition-colors`}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>
                                                <Icon className={`w-5 h-5 ${s.color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                                    <span className="font-bold text-sm font-mono tracking-wide text-gray-800">{offer.code}</span>
                                                    {offer.tag && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${s.tag}`}>{offer.tag}</span>}
                                                    {offer.endsAt && <ExpiryTimer endsAt={offer.endsAt} />}
                                                </div>
                                                <p className="text-xs font-semibold text-gray-700 mb-0.5">{offer.title}</p>
                                                <p className="text-[10px] text-gray-500 leading-relaxed">{offer.description}</p>
                                            </div>
                                            <div className="flex-shrink-0 self-center">
                                                {isApplied ? (
                                                    <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                                                        <CheckCircle2 className="w-4 h-4" />Applied
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleApply(offer)}
                                                        disabled={discountLoading || !!isApplying}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-[#6b9238] border border-[#6b9238]/30 hover:bg-green-100 transition active:scale-95 disabled:opacity-60 flex items-center gap-1"
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

                    <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                        <p className="text-[10px] text-gray-400 text-center">💡 Tap Apply to instantly use an offer at checkout</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Free shipping progress bar ────────────────────────────────────────────────
function ShippingProgress({ subtotal }) {
    const amountLeft = Math.max(0, shippingConfig.freeShippingThreshold - subtotal);
    const progress = Math.min(100, (subtotal / shippingConfig.freeShippingThreshold) * 100);
    const unlocked = amountLeft === 0;

    if (unlocked) {
        return (
            <div className="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-semibold text-green-700">You've unlocked free shipping! 🎉</p>
            </div>
        );
    }

    return (
        <div className="mb-5 px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-600">
                    Add <span className="font-bold text-[#6b9238]">{shippingConfig.currency}{amountLeft.toFixed(2)}</span> for free shipping
                </p>
                <Truck className="w-4 h-4 text-gray-400" />
            </div>
            <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, background: 'linear-gradient(to right, #6b9238, #78a240)' }}
                />
            </div>
            <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-gray-400">{shippingConfig.currency}0</span>
                <span className="text-[10px] font-semibold text-[#6b9238]">{shippingConfig.currency}{shippingConfig.freeShippingThreshold} free shipping</span>
            </div>
        </div>
    );
}

// ── Cart item row ─────────────────────────────────────────────────────────────
function CartItem({ item, onUpdate, onRemove }) {
    return (
        <div className="group flex gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
            {/* Image */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🪴</div>
                )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug line-clamp-2 mb-1">{item.name}</h3>
                    {item.size && <p className="text-xs text-gray-500 mb-0.5">{item.size}</p>}
                    {item.variant && item.variant !== 'Default Title' && (
                        <p className="text-xs text-gray-400">{item.variant}</p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-3 gap-3">
                    {/* Qty stepper */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => onUpdate(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <Minus className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                        <span className="w-9 sm:w-10 text-center text-sm font-semibold text-gray-800 border-x border-gray-200">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => onUpdate(item.id, item.quantity + 1)}
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                    </div>

                    {/* Price + remove */}
                    <div className="flex items-center gap-3">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                            {shippingConfig.currency}{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                            onClick={() => onRemove(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Remove"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Recommendations row ───────────────────────────────────────────────────────
function RecommendationsGrid({ products }) {
    if (!features.showRecommendations || products.length === 0) return null;
    return (
        <div className="mt-10 pt-10 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{strings.recommendations.title}</h2>
            <p className="text-sm text-gray-500 mb-6">{strings.recommendations.subtitle}</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CartPage() {
    const [products, setProducts] = useState([]);
    const {
        cartItems, loading, updateQuantity, removeFromCart,
        checkoutUrl, discountCodes, discountAmount, discountError, discountLoading, applyDiscount,
    } = useCart();

    const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal >= shippingConfig.freeShippingThreshold ? 0 : shippingConfig.standardShippingCost;
    const estimatedTotal = Math.max(0, subtotal + shipping - discountAmount);
    const appliedCodes = discountCodes.filter((d) => d.applicable);

    useEffect(() => {
        if (!features.showRecommendations) return;
        getProducts(recommendationsConfig.fetchCount).then(setProducts).catch(console.error);
    }, []);

    const recommendedProducts = products
        .filter((p) => !cartItems.some((c) => c.name === p.name))
        .slice(0, recommendationsConfig.displayCount);

    const handleCheckout = () => { if (checkoutUrl) window.location.href = checkoutUrl; };

    // ── Loading state ──────────────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen bg-[#F0F4F1] flex items-center justify-center">
            <div className="text-center">
                <div className="w-14 h-14 border-4 border-[#6b9238] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 text-sm">{strings.loading}</p>
            </div>
        </div>
    );

    // ── Empty state ────────────────────────────────────────────────────────────
    if (cartItems.length === 0) return (
        <div className="min-h-screen bg-[#F0F4F1]">
            <div className="max-w-lg mx-auto px-4 py-24 text-center">
                <div className="w-24 h-24 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <ShoppingCart className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{strings.empty.heading}</h2>
                <p className="text-gray-500 mb-8">{strings.empty.subtext}</p>
                <Link
                    href={routes.products}
                    className="inline-block bg-[#6b9238] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#557420] transition-colors shadow-sm"
                >
                    {strings.empty.cta}
                </Link>
            </div>
        </div>
    );

    // ── Filled cart ────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#F0F4F1]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

                {/* Back link */}
                <Link
                    href={routes.products}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    {strings.page.backLabel}
                </Link>

                {/* Page title */}
                <div className="flex items-baseline gap-3 mb-6 lg:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{strings.page.title}</h1>
                    <span className="text-sm text-gray-400 font-medium">
                        {cartItems.length} {cartItems.length === 1 ? strings.page.itemSingular : strings.page.itemPlural}
                    </span>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8">

                    {/* ── Left column: items ──────────────────────────────────── */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-3">

                        {/* Cold weather notice */}
                        {features.showColdWeatherNotice && (
                            <div className="flex gap-3 px-4 py-3.5 rounded-2xl bg-blue-50 border border-blue-100">
                                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-blue-900 mb-0.5">{strings.coldWeather.title}</p>
                                    <p className="text-xs text-blue-700 leading-relaxed">{strings.coldWeather.body}</p>
                                </div>
                            </div>
                        )}

                        {/* Cart items */}
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onUpdate={updateQuantity}
                                onRemove={removeFromCart}
                            />
                        ))}

                        {/* Recommendations — desktop */}
                        <div className="hidden lg:block">
                            <RecommendationsGrid products={recommendedProducts} />
                        </div>
                    </div>

                    {/* ── Right column: summary ────────────────────────────────── */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 lg:sticky lg:top-8">

                            <h2 className="text-lg font-bold text-gray-900 mb-5">{strings.summary.title}</h2>

                            {/* Free shipping progress */}
                            {features.enableFreeShippingProgress && (
                                <ShippingProgress subtotal={subtotal} />
                            )}

                            {/* Offers dropdown */}
                            <OffersDropdown
                                applyDiscount={applyDiscount}
                                discountLoading={discountLoading}
                                discountCodes={discountCodes}
                                discountError={discountError}
                            />

                            {/* Price breakdown */}
                            <div className="space-y-3 mb-5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{strings.summary.subtotal}</span>
                                    <span className="font-semibold text-gray-800">{shippingConfig.currency}{subtotal.toFixed(2)}</span>
                                </div>

                                {discountAmount > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-1.5 text-green-700 font-medium">
                                            <Tag className="w-3.5 h-3.5" />
                                            Discount
                                            {appliedCodes.length > 0 && (
                                                <span className="text-[10px] font-normal text-green-600 opacity-80">
                                                    ({appliedCodes.map((d) => d.code).join(', ')})
                                                </span>
                                            )}
                                        </span>
                                        <span className="font-semibold text-green-700">−{shippingConfig.currency}{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{strings.summary.shipping}</span>
                                    {shipping === 0 ? (
                                        <span className="font-semibold text-green-600">{strings.summary.shippingFree}</span>
                                    ) : (
                                        <span className="font-semibold text-gray-800">{shippingConfig.currency}{shipping.toFixed(2)}</span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{strings.summary.taxes}</span>
                                    <span className="text-xs text-gray-400">{strings.summary.taxesNote}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-5">
                                <span className="text-base font-bold text-gray-900">{strings.summary.total}</span>
                                <div className="text-right">
                                    {discountAmount > 0 && (
                                        <p className="text-xs text-gray-400 line-through mb-0.5">
                                            {shippingConfig.currency}{(subtotal + shipping).toFixed(2)}
                                        </p>
                                    )}
                                    <span className="text-2xl font-bold text-[#6b9238]">
                                        {shippingConfig.currency}{estimatedTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {discountAmount > 0 && (
                                <p className="text-xs text-green-700 font-medium -mt-3 mb-4">
                                    🎉 You're saving {shippingConfig.currency}{discountAmount.toFixed(2)} on this order!
                                </p>
                            )}

                            {/* Checkout button */}
                            <button
                                onClick={handleCheckout}
                                disabled={!checkoutUrl}
                                className="w-full py-3.5 rounded-xl bg-[#6b9238] hover:bg-[#557420] text-white font-semibold text-sm tracking-wide transition-all shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {checkoutUrl ? strings.checkout.proceed : strings.checkout.loading}
                            </button>

                            {/* Security badge */}
                            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-400">
                                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                                {strings.checkout.security}
                            </div>

                            <p className="text-[10px] text-gray-400 text-center mt-2">{strings.summary.totalNote}</p>
                        </div>
                    </div>
                </div>

                {/* Recommendations — mobile */}
                <div className="lg:hidden mt-6">
                    <RecommendationsGrid products={recommendedProducts} />
                </div>
            </div>
        </div>
    );
}
