'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { getProductsByCollection } from '../../lib/shopify_utilis';

// ─── Infinite-scroll slider ────────────────────────────────────────────────────
// Strategy: triple the product list  [clone | real | clone]
// Start in the middle. On transitionend, if we've drifted into a clone set,
// silently teleport back to the matching real position so it feels endless.

export default function IndoorPlantsSlider() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cardsPerView, setCardsPerView] = useState(2);
    const [index, setIndex] = useState(0);          // logical index into tripled array
    const [animated, setAnimated] = useState(true); // false during silent teleport
    const [isPaused, setIsPaused] = useState(false);
    const autoRef = useRef(null);
    const trackRef = useRef(null);

    useEffect(() => {
        getProductsByCollection('indoor-plants', 10)
            .then(d => setProducts(d || []))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    // Seed index to middle copy once products load
    useEffect(() => {
        if (products.length > 0) setIndex(products.length);
    }, [products.length]);

    useEffect(() => {
        const update = () => setCardsPerView(window.innerWidth < 768 ? 1 : 2);
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const tripled = products.length > 0
        ? [...products, ...products, ...products]
        : [];

    // Advance one step (wraps around via clone logic)
    const advance = useCallback(() => {
        setAnimated(true);
        setIndex(prev => prev + 1);
    }, []);

    const retreat = useCallback(() => {
        setAnimated(true);
        setIndex(prev => prev - 1);
    }, []);

    // After each animated transition check if we need to teleport
    const onTransitionEnd = useCallback(() => {
        const len = products.length;
        if (len === 0) return;
        setIndex(prev => {
            if (prev <= len - 1) {
                setAnimated(false);
                return prev + len;          // teleport forward into real set
            }
            if (prev >= len * 2) {
                setAnimated(false);
                return prev - len;          // teleport back into real set
            }
            return prev;
        });
    }, [products.length]);

    // Re-enable animation after a teleport (one rAF is enough)
    useEffect(() => {
        if (!animated) {
            const id = requestAnimationFrame(() => setAnimated(true));
            return () => cancelAnimationFrame(id);
        }
    }, [animated]);

    // Auto-advance
    useEffect(() => {
        if (isPaused || products.length <= cardsPerView) return;
        autoRef.current = setInterval(advance, 4000);
        return () => clearInterval(autoRef.current);
    }, [isPaused, products.length, cardsPerView, advance]);

    const cardWidth = `calc((100% - ${(cardsPerView - 1) * 24}px) / ${cardsPerView})`;
    const translateX = `calc(-${index} * (${cardWidth} + 24px))`;

    const dotCount = products.length;
    const activeDot = ((index % products.length) + products.length) % products.length;

    if (loading) return (
        <section
            className="relative w-full py-20 px-6 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url('/images/artificial-green-plant-pot-display-rack-sale.jpg')` }}
        >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative max-w-7xl mx-auto flex justify-center py-16">
                <div className="w-11 h-11 border-[3px] border-white/40 border-t-white rounded-full animate-spin" />
            </div>
        </section>
    );

    if (products.length === 0) return null;

    return (
        <section
            className="relative w-full py-16 md:py-20 px-4 md:px-6 bg-cover bg-center bg-fixed overflow-hidden"
            style={{ backgroundImage: `url('/images/artificial-green-plant-pot-display-rack-sale.jpg')` }}
        >
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-end gap-5 mb-9">
                    <div>
                        <span className="text-white/85 text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
                            Handpicked for you
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2 leading-tight">
                            Indoor Plants Collection
                        </h2>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={retreat}
                            aria-label="Previous"
                            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-200 hover:bg-white/25 hover:border-white/50 active:scale-95"
                        >
                            <ChevronLeft size={22} className="text-white" />
                        </button>
                        <button
                            onClick={advance}
                            aria-label="Next"
                            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-200 hover:bg-white/25 hover:border-white/50 active:scale-95"
                        >
                            <ChevronRight size={22} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Slider track */}
                <div
                    className="overflow-hidden pb-2"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div
                        ref={trackRef}
                        className={animated ? 'transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]' : ''}
                        style={{
                            display: 'flex',
                            gap: '24px',
                            transform: `translateX(${translateX})`,
                        }}
                        onTransitionEnd={onTransitionEnd}
                    >
                        {tripled.map((product, i) => (
                            <div
                                key={`${product.id}-${i}`}
                                style={{ flex: `0 0 ${cardWidth}`, minWidth: 0 }}
                            >
                                <GlassCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dot indicators */}
                <div className="flex justify-center gap-2 mt-7">
                    {Array.from({ length: dotCount }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => { setAnimated(true); setIndex(products.length + i); }}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                i === activeDot ? 'w-7 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Glass card ────────────────────────────────────────────────────────────────
function GlassCard({ product }) {
    const truncate = (text, len = 110) => {
        if (!text) return '';
        return text.length > len ? text.substring(0, len).trim() + '…' : text;
    };

    return (
        <div className="
            relative overflow-hidden
            backdrop-blur-[9px] backdrop-saturate-[1.4]
            bg-white/10
            border border-white/30
            rounded-2xl p-6
            flex gap-4 min-h-[220px] h-full
            shadow-[0_8px_32px_rgba(0,0,0,0.25)]
            transition-all duration-300
            hover:-translate-y-1
            hover:shadow-[0_14px_40px_rgba(0,0,0,0.35)]
            hover:border-white/50
            before:content-[''] before:absolute before:inset-0
            before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-transparent
            before:opacity-60 before:pointer-events-none before:rounded-2xl
        ">
            {/* Shine blob */}
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none" />

            {/* Text */}
            <div className="relative flex-1 min-w-0 flex flex-col justify-between z-10">
                <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-white text-[11px] font-semibold tracking-wide mb-3.5">
                        {product.tag || 'More'}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-2.5 leading-tight line-clamp-2 drop-shadow-sm">
                        {product.title || product.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/90 mb-4">
                        {truncate(product.description)}
                    </p>
                </div>
                <Link
                    href={`/products/${product.handle}`}
                    className="btn-primary self-start"
                >
                    Explore Now <ArrowRight size={14} />
                </Link>
            </div>

            {/* Image */}
            <div className="relative w-32 md:w-36 flex-shrink-0 rounded-xl overflow-hidden border border-white/20 z-10">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.imageAlt || product.name || 'Plant'}
                        fill
                        sizes="144px"
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50 text-xs">No image</div>
                )}
            </div>
        </div>
    );
}
