'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { getProductsByCollection } from '../../lib/shopify_utilis';

export default function IndoorPlantsSlider() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [cardsPerView, setCardsPerView] = useState(2);
    const autoScrollRef = useRef(null);

    // Fetch products
    useEffect(() => {
        getProductsByCollection('indoor-plants', 10)
            .then(data => setProducts(data))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    // Responsive cards per view
    useEffect(() => {
        const updateCards = () => {
            if (window.innerWidth < 768) setCardsPerView(1);
            else setCardsPerView(2);
        };
        updateCards();
        window.addEventListener('resize', updateCards);
        return () => window.removeEventListener('resize', updateCards);
    }, []);

    const maxIndex = Math.max(0, products.length - cardsPerView);

    // Auto-scroll every 4 seconds
    useEffect(() => {
        if (isPaused || products.length <= cardsPerView) return;
        autoScrollRef.current = setInterval(() => {
            setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
        }, 4000);
        return () => clearInterval(autoScrollRef.current);
    }, [isPaused, maxIndex, products.length, cardsPerView]);

    const handlePrev = () => setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
    const handleNext = () => setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));

    const truncate = (text, len = 110) => {
        if (!text) return '';
        return text.length > len ? text.substring(0, len).trim() + '…' : text;
    };

    if (loading) {
        return (
            <section
                className="relative w-full py-20 px-6 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: `url('/images/artificial-green-plant-pot-display-rack-sale.jpg')` }}
            >
                {/* Black overlay */}
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative max-w-7xl mx-auto flex justify-center py-16">
                    <div className="w-11 h-11 border-[3px] border-white/40 border-t-white rounded-full animate-spin" />
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section
            className="relative w-full py-16 md:py-20 px-4 md:px-6 bg-cover bg-center bg-fixed overflow-hidden"
            style={{ backgroundImage: `url('/images/artificial-green-plant-pot-display-rack-sale.jpg')` }}
        >
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content wrapper (relative so it sits above overlay) */}
            <div className="relative max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-end gap-5 mb-9">
                    <div>
                        <span className="text-white/85 text-xs md:text-sm tracking-[0.2em] uppercase">
                            Handpicked for you
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2 leading-tight">
                            Indoor Plants Collection
                        </h2>
                    </div>

                    {/* Arrow buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handlePrev}
                            aria-label="Previous"
                            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-200 hover:bg-white/25 hover:border-white/50"
                        >
                            <ChevronLeft size={22} className="text-white" />
                        </button>
                        <button
                            onClick={handleNext}
                            aria-label="Next"
                            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-200 hover:bg-white/25 hover:border-white/50"
                        >
                            <ChevronRight size={22} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Slider */}
                <div
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className="overflow-hidden pb-2"
                >
                    <div
                        className="flex gap-6 transition-transform duration-700 ease-out"
                        style={{
                            transform: `translateX(calc(-${currentIndex} * (100% / ${cardsPerView}) - ${currentIndex * (24 / cardsPerView)}px))`,
                        }}
                    >
                        {products.map(product => (
                            <div
                                key={product.id}
                                className="min-w-0"
                                style={{
                                    flex: `0 0 calc((100% - ${(cardsPerView - 1) * 24}px) / ${cardsPerView})`,
                                }}
                            >
                                <GlassCard product={product} truncate={truncate} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots indicator */}
                {products.length > cardsPerView && (
                    <div className="flex justify-center gap-2 mt-7">
                        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={`h-2.5 rounded-full transition-all duration-300 ${i === currentIndex
                                    ? 'w-7 bg-white'
                                    : 'w-2.5 bg-white/45 hover:bg-white/70'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

// ─── Individual glass card (pure glassmorphism, no bg color) ──────────────
function GlassCard({ product, truncate }) {
    return (
        <div
            className="
                relative overflow-hidden
                backdrop-blur-12 backdrop-saturate-250
                border border-white/25
                rounded-2xl p-6
                flex gap-4 min-h-[220px] h-full
                shadow-[0_8px_32px_rgba(0,0,0,0.25)]
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(0,0,0,0.35)]
                hover:border-white/40
                before:content-['']
                before:absolute before:inset-0
                before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-transparent
                before:pointer-events-none before:rounded-2xl
            "
        >
            {/* Top-left highlight shine */}
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none" />

            {/* Left: text content */}
            <div className="relative flex-1 min-w-0 flex flex-col justify-between z-10">
                <div>
                    {/* Tag */}
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 text-white text-[11px] font-semibold tracking-wide mb-3.5">
                        {product.tag || 'More'}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-2.5 leading-tight line-clamp-2 drop-shadow-sm">
                        {product.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-white/90 mb-4">
                        {truncate(product.description)}
                    </p>
                </div>

                {/* Explore Now button */}
                <Link
                    href={`/products/${product.handle}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#244033] hover:bg-[#78a240] text-white rounded-lg text-sm font-semibold self-start transition-all duration-200 hover:translate-x-0.5"
                >
                    Explore Now <ArrowRight size={14} />
                </Link>
            </div>

            {/* Right: product image */}
            <div className="relative w-32 md:w-36 flex-shrink-0 rounded-xl overflow-hidden border border-white/20 z-10">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.imageAlt}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50 text-xs">No image</div>
                )}
            </div>
        </div>
    );
}