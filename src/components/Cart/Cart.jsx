'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Trash2, Minus, Plus, AlertCircle, Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
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

// ─────────────────────────────────────────────────────────────────────────────
// ProductCard
// ─────────────────────────────────────────────────────────────────────────────
function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const wishlisted = isInWishlist(product.id.toString());

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const variantId = product.variants?.[0]?.id;
        if (!variantId) { alert(strings.recommendations.unavailable); return; }
        addToCart({
            id: product.id,
            variantId,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            handle: product.handle,
            variants: product.variants,
        });
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        wishlisted
            ? removeFromWishlist(product.id.toString())
            : addToWishlist({
                id: product.id.toString(),
                variantId: product.variants?.[0]?.id,
                name: product.name,
                price: product.price,
                image: product.image,
                handle: product.handle,
                variants: product.variants,
            });
    };

    return (
        <Link href={routes.productDetail(product.handle)} className="group block">
            <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-3">
                {/* Badge */}
                {product.badge && (
                    <div
                        className="absolute top-2 left-2 z-10 px-2 py-0.5 text-[10px] sm:text-xs rounded-full font-medium"
                        style={{ backgroundColor: product.badgeColor, color: '#fff' }}
                    >
                        {product.badge}
                    </div>
                )}

                {/* Wishlist */}
                {features.showWishlistOnCards && (
                    <button
                        onClick={handleWishlistToggle}
                        className="absolute top-2 right-2 z-10 w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center shadow transition"
                        style={{ '--hover-bg': colors.primary }}
                    >
                        <Heart
                            size={16}
                            className={`sm:w-[18px] sm:h-[18px] ${wishlisted ? 'fill-current text-red-500' : ''}`}
                        />
                    </button>
                )}

                {/* Quick Add – mobile */}
                <button
                    onClick={handleQuickAdd}
                    className="absolute bottom-2 right-2 z-10 w-9 h-9 sm:w-10 sm:h-10 text-white rounded-full flex items-center justify-center transition active:scale-95 md:hidden"
                    style={{ backgroundColor: colors.primary }}
                >
                    <ShoppingCart size={16} />
                </button>

                {/* Quick Add – desktop hover */}
                <button
                    onClick={handleQuickAdd}
                    className={`hidden md:flex absolute bottom-3 left-3 right-3 z-10 text-white py-2.5 text-sm font-medium items-center justify-center gap-2 ${ui.transitions.slideUp}`}
                    style={{ backgroundColor: colors.primary }}
                >
                    <ShoppingCart size={16} />
                    {strings.recommendations.quickAdd}
                </button>

                <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover ${ui.transitions.groupImg}`}
                />
            </div>

            <h3 className="text-xs sm:text-sm md:text-base font-sans font-light text-gray-900 mb-1 line-clamp-1">
                {product.name}
            </h3>
            <p className="text-[10px] sm:text-xs md:text-sm italic text-gray-500 mb-1.5 line-clamp-2">
                {product.description}
            </p>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                <span className="font-medium text-gray-900">
                    {shippingConfig.currency}{product.price}
                </span>
                {product.originalPrice && (
                    <span className="text-gray-400 line-through text-[10px] sm:text-xs">
                        {shippingConfig.currency}{product.originalPrice}
                    </span>
                )}
            </div>
        </Link>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// CartPage
// ─────────────────────────────────────────────────────────────────────────────
export default function CartPage() {
    const [products, setProducts] = useState([]);

    const {
        cartItems,
        loading,
        updateQuantity,
        removeFromCart,
        addToCart,
        checkoutUrl,
    } = useCart();

    // ── Totals ────────────────────────────────────────────────────────────────
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= shippingConfig.freeShippingThreshold ? 0 : shippingConfig.standardShippingCost;
    const amountUntilFreeShipping = Math.max(0, shippingConfig.freeShippingThreshold - subtotal);
    const estimatedTotal = subtotal + shipping;
    const shippingProgress = Math.min(100, (subtotal / shippingConfig.freeShippingThreshold) * 100);

    // ── Recommended products ──────────────────────────────────────────────────
    useEffect(() => {
        if (!features.showRecommendations) return;
        async function loadProducts() {
            try {
                const data = await getProducts(recommendationsConfig.fetchCount);
                setProducts(data);
            } catch (err) {
                console.error('Error loading products:', err);
            }
        }
        loadProducts();
    }, []);

    const recommendedProducts = products
        .filter((p) => !cartItems.some((c) => c.name === p.name))
        .slice(0, recommendationsConfig.displayCount)
        .map((p) => {
            const isBestSeller = p.price < recommendationsConfig.badgeRules.bestSeller.maxPrice;
            const isTopRated = p.rating >= recommendationsConfig.badgeRules.topRated.minRating;
            return {
                ...p,
                badge: isBestSeller ? 'Best Seller' : isTopRated ? 'Top Rated' : undefined,
                badgeColor: isBestSeller ? colors.badge.bestSeller.bg : isTopRated ? colors.badge.topRated.bg : undefined,
            };
        });

    // ── Handlers ──────────────────────────────────────────────────────────────
    const increaseQty = (id, qty) => updateQuantity(id, qty + 1);
    const decreaseQty = (id, qty) => updateQuantity(id, qty - 1);
    const removeItem = (id) => removeFromCart(id);

    const handleCheckout = () => {
        if (checkoutUrl) window.location.href = checkoutUrl;
        else console.error('No Shopify checkout URL available.');
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.surface.page }}>
                <div className="text-center">
                    <div
                        className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                        style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}
                    />
                    <p style={{ color: colors.text.muted }}>{strings.loading}</p>
                </div>
            </div>
        );
    }

    // ── Empty cart ────────────────────────────────────────────────────────────
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen" style={{ backgroundColor: colors.surface.page }}>
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
                    <div className="text-center py-16">
                        <ShoppingCart className="w-16 h-16 mx-auto mb-4" style={{ color: colors.text.muted }} />
                        <h2 className="text-2xl font-semibold mb-2" style={{ color: colors.text.body }}>
                            {strings.empty.heading}
                        </h2>
                        <p className="mb-6" style={{ color: colors.text.muted }}>{strings.empty.subtext}</p>
                        <Link
                            href={routes.products}
                            className="inline-block text-white px-8 py-3 rounded-lg font-medium transition"
                            style={{ backgroundColor: colors.primary }}
                        >
                            {strings.empty.cta}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── Recommendations grid (shared between mobile + desktop) ────────────────
    const RecommendationsGrid = ({ extraClass = '' }) =>
        features.showRecommendations && recommendedProducts.length > 0 ? (
            <div className={`mt-8 sm:mt-10 md:mt-12 ${extraClass}`}>
                <h2 className="text-xl sm:text-2xl font-sans mb-1 sm:mb-2" style={{ color: colors.text.heading }}>
                    {strings.recommendations.title}
                </h2>
                <p className="text-sm sm:text-base mb-4 sm:mb-6" style={{ color: colors.text.muted }}>
                    {strings.recommendations.subtitle}
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {recommendedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
            </div>
        ) : null;

    // ── Main render ───────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.surface.page }}>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">

                {/* Back link */}
                <Link
                    href={routes.products}
                    className="inline-flex items-center transition-colors mb-4 sm:mb-6 group active:scale-95"
                    style={{ color: colors.text.muted }}
                >
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs sm:text-sm font-medium">{strings.page.backLabel}</span>
                </Link>

                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">

                    {/* ── LEFT: Cart Items ── */}
                    <div className="lg:col-span-8 order-1">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans" style={{ color: colors.text.heading }}>
                                {strings.page.title}
                            </h1>
                            <span className="text-xs sm:text-sm ml-2" style={{ color: colors.text.muted }}>
                                {cartItems.length} {cartItems.length === 1 ? strings.page.itemSingular : strings.page.itemPlural}
                            </span>
                        </div>

                        {/* Cold weather notice */}
                        {features.showColdWeatherNotice && (
                            <div
                                className="rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border"
                                style={{ backgroundColor: colors.notice.cold.bg, borderColor: colors.notice.cold.border }}
                            >
                                <div className="flex gap-2 sm:gap-3">
                                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: colors.notice.cold.icon }} />
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium mb-0.5 sm:mb-1" style={{ color: colors.notice.cold.title }}>
                                            {strings.coldWeather.title}
                                        </p>
                                        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: colors.notice.cold.body }}>
                                            {strings.coldWeather.body}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cart item list */}
                        <div className="space-y-3 sm:space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border hover:shadow-md transition-shadow"
                                    style={{ backgroundColor: colors.surface.card, borderColor: colors.border.default }}
                                >
                                    <div className="flex gap-3 sm:gap-4 md:gap-6">
                                        {/* Image */}
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg flex-shrink-0 overflow-hidden" style={{ backgroundColor: colors.surface.muted }}>
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-grow flex flex-col min-w-0">
                                            <div className="flex justify-between items-start mb-2 gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 line-clamp-2" style={{ color: colors.text.heading }}>
                                                        {item.name}
                                                    </h3>
                                                    {item.size && (
                                                        <p className="text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-1" style={{ color: colors.text.body }}>
                                                            {item.size}
                                                        </p>
                                                    )}
                                                    {item.variant && item.variant !== 'Default Title' && (
                                                        <p className="text-xs sm:text-sm line-clamp-1" style={{ color: colors.text.muted }}>
                                                            {item.variant}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="text-base sm:text-lg md:text-xl font-semibold flex-shrink-0" style={{ color: colors.text.price }}>
                                                    {shippingConfig.currency}{(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Qty + Remove */}
                                            <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 gap-2">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-colors active:scale-95"
                                                    style={{ color: colors.text.danger }}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    <span className="hidden xs:inline">Remove</span>
                                                </button>

                                                <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: colors.border.default }}>
                                                    <button
                                                        onClick={() => decreaseQty(item.id, item.quantity)}
                                                        className="px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: colors.text.muted }} />
                                                    </button>
                                                    <span
                                                        className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border-x min-w-[3rem] sm:min-w-[3.5rem] md:min-w-[4rem] text-center"
                                                        style={{ borderColor: colors.border.default, color: colors.text.body }}
                                                    >
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => increaseQty(item.id, item.quantity)}
                                                        className="px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                                                    >
                                                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: colors.text.muted }} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recommendations – desktop */}
                        <RecommendationsGrid extraClass="hidden lg:block" />
                    </div>

                    {/* ── RIGHT: Order Summary ── */}
                    <div className="lg:col-span-4 order-2">
                        <div
                            className="rounded-lg sm:rounded-xl border p-4 sm:p-5 md:p-6 lg:sticky lg:top-8"
                            style={{ backgroundColor: colors.surface.card, borderColor: colors.border.default }}
                        >
                            <h2 className="text-lg sm:text-xl font-sans mb-4 sm:mb-6" style={{ color: colors.text.heading }}>
                                {strings.summary.title}
                            </h2>

                            {/* Free shipping progress */}
                            {features.enableFreeShippingProgress && (
                                amountUntilFreeShipping > 0 ? (
                                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: colors.surface.muted }}>
                                        <p className="text-xs sm:text-sm mb-2 sm:mb-3" style={{ color: colors.text.body }}>
                                            Add{' '}
                                            <span className="font-bold" style={{ color: colors.primary }}>
                                                {shippingConfig.currency}{amountUntilFreeShipping.toFixed(2)}
                                            </span>{' '}
                                            more for free shipping!
                                        </p>
                                        <div className="relative h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.progressBar.track }}>
                                            <div
                                                className="absolute top-0 left-0 h-full transition-all duration-500 ease-out"
                                                style={{
                                                    width: `${shippingProgress}%`,
                                                    background: `linear-gradient(to right, ${colors.progressBar.fillFrom}, ${colors.progressBar.fillTo})`,
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center mt-1.5 sm:mt-2">
                                            <span className="text-[10px] sm:text-xs" style={{ color: colors.text.muted }}>
                                                {shippingConfig.currency}{subtotal.toFixed(2)}
                                            </span>
                                            <span className="text-[10px] sm:text-xs font-semibold" style={{ color: colors.primary }}>
                                                {strings.summary.freeShippingLabel}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border"
                                        style={{ backgroundColor: colors.notice.freeShipping.bg, borderColor: colors.notice.freeShipping.border }}
                                    >
                                        <p className="text-xs sm:text-sm font-medium flex items-center gap-2" style={{ color: colors.notice.freeShipping.text }}>
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {strings.summary.freeShippingUnlocked}
                                        </p>
                                    </div>
                                )
                            )}

                            {/* Price breakdown */}
                            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                {[
                                    { label: strings.summary.subtotal, value: `${shippingConfig.currency}${subtotal.toFixed(2)}` },
                                    {
                                        label: strings.summary.shipping,
                                        value: shipping === 0
                                            ? <span style={{ color: '#16A34A' }}>{strings.summary.shippingFree}</span>
                                            : `${shippingConfig.currency}${shipping.toFixed(2)}`,
                                    },
                                    { label: strings.summary.taxes, value: <span style={{ color: colors.text.muted, fontSize: '0.75rem' }}>{strings.summary.taxesNote}</span> },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between items-center text-xs sm:text-sm">
                                        <span style={{ color: colors.text.muted }}>{label}</span>
                                        <span className="font-medium" style={{ color: colors.text.body }}>{value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="pt-3 sm:pt-4 mb-4 sm:mb-6 border-t" style={{ borderColor: colors.border.default }}>
                                <div className="flex justify-between items-center">
                                    <span className="text-base sm:text-lg font-semibold" style={{ color: colors.primary }}>
                                        {strings.summary.total}
                                    </span>
                                    <span className="text-xl sm:text-2xl font-bold" style={{ color: colors.primary }}>
                                        {shippingConfig.currency}{estimatedTotal.toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-[10px] sm:text-xs mt-1.5 sm:mt-2" style={{ color: colors.text.muted }}>
                                    {strings.summary.totalNote}
                                </p>
                            </div>

                            {/* Checkout button */}
                            <button
                                onClick={handleCheckout}
                                disabled={!checkoutUrl}
                                className="block w-full text-white font-semibold py-3 sm:py-3.5 md:py-4 rounded-lg transition-all text-center text-sm sm:text-base shadow-sm hover:shadow-md active:scale-[0.98] touch-manipulation disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{ backgroundColor: colors.primary }}
                            >
                                {checkoutUrl ? strings.checkout.proceed : strings.checkout.loading}
                            </button>

                            {/* Security badge */}
                            <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs" style={{ color: colors.text.muted }}>
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <span>{strings.checkout.security}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommendations – mobile */}
                <RecommendationsGrid extraClass="lg:hidden order-3" />

            </div>
        </div>
    );
}