'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { getProductsByCollection, getProducts } from '../../lib/shopify_utilis';

const GAP = 20; // gap between cards in px

export default function IndoorPlantsSlider() {
    const [products, setProducts]         = useState([]);
    const [loading, setLoading]           = useState(true);
    const [cardsPerView, setCardsPerView] = useState(2);
    const [index, setIndex]               = useState(0);
    const [animated, setAnimated]         = useState(false);
    const [isPaused, setIsPaused]         = useState(false);
    const autoRef = useRef(null);

    // ── Fetch with fallbacks ───────────────────────────────────────────────────
    useEffect(() => {
        getProductsByCollection('indoor-plants', 10)
            .then(d => (d?.length > 0 ? d : getProductsByCollection('frontpage', 10)))
            .then(d => (d?.length > 0 ? d : getProducts(10)))
            .then(d => setProducts(d || []))
            .catch(() => getProducts(10).then(setProducts).catch(() => setProducts([])))
            .finally(() => setLoading(false));
    }, []);

    // ── Responsive ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const update = () => setCardsPerView(window.innerWidth < 768 ? 1 : 2);
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    // ── Build looped list: [tail clones | real | head clones] ─────────────────
    const buf = products.length > 0 ? Math.min(cardsPerView + 1, products.length) : 0;
    const loopItems = products.length > 0
        ? [...products.slice(-buf), ...products, ...products.slice(0, buf)]
        : [];

    // ── Seed to first real item (no animation) ────────────────────────────────
    useEffect(() => {
        if (products.length > 0 && buf > 0) {
            setAnimated(false);
            setIndex(buf);
        }
    }, [products.length, buf]);

    // ── Re-enable animation 1 frame after silent teleport ─────────────────────
    useEffect(() => {
        if (animated) return;
        const id = requestAnimationFrame(() => setAnimated(true));
        return () => cancelAnimationFrame(id);
    }, [animated, index]); // include index so it fires after every teleport

    // ── Navigation ─────────────────────────────────────────────────────────────
    const advance = useCallback(() => { setAnimated(true); setIndex(p => p + 1); }, []);
    const retreat = useCallback(() => { setAnimated(true); setIndex(p => p - 1); }, []);

    // ── Teleport when drifting into clone zones ────────────────────────────────
    const onTransitionEnd = useCallback(() => {
        const len = products.length;
        if (!len) return;
        const b   = Math.min(cardsPerView + 1, len);
        const end = b + len;
        setIndex(prev => {
            if (prev < b)    { setAnimated(false); return prev + len; }
            if (prev >= end) { setAnimated(false); return prev - len; }
            return prev;
        });
    }, [products.length, cardsPerView]);

    // ── Auto-advance ───────────────────────────────────────────────────────────
    useEffect(() => {
        if (isPaused || products.length <= cardsPerView) return;
        autoRef.current = setInterval(advance, 4000);
        return () => clearInterval(autoRef.current);
    }, [isPaused, products.length, cardsPerView, advance]);

    // ── CSS: card width and translateX — 100% = overflow container width ───────
    //    (block-level flex containers inherit their parent's content width as 100%)
    const colGap     = (cardsPerView - 1) * GAP;
    const cardW      = `calc((100% - ${colGap}px) / ${cardsPerView})`;
    const translateX = `calc(${index} * -1 * ((100% - ${colGap}px) / ${cardsPerView} + ${GAP}px))`;

    // ── Active dot ─────────────────────────────────────────────────────────────
    const activeDot = products.length > 0
        ? ((index - buf) % products.length + products.length) % products.length
        : 0;

    // ── Dot navigation ─────────────────────────────────────────────────────────
    const goTo = useCallback((i) => { setAnimated(true); setIndex(buf + i); }, [buf]);

    // ── Loading state ──────────────────────────────────────────────────────────
    const sectionStyle = {
        backgroundImage: `url('/images/artificial-green-plant-pot-display-rack-sale.jpg')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    if (loading) return (
        <section className="relative w-full py-20" style={sectionStyle}>
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative flex justify-center py-16">
                <div className="w-10 h-10 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        </section>
    );

    if (!products.length) return null;

    return (
        <section className="relative w-full py-12 md:py-20 overflow-hidden" style={sectionStyle}>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/55" />

            <div className="relative max-w-7xl mx-auto px-4 md:px-6">

                {/* Header */}
                <div className="flex flex-wrap justify-between items-end gap-5 mb-8">
                    <div>
                        <span className="block text-white/75 text-xs tracking-[0.2em] uppercase font-medium mb-2">
                            Handpicked for you
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                            Indoor Plants Collection
                        </h2>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={retreat} aria-label="Previous"
                            className="w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center hover:bg-white/25 active:scale-95 transition-all">
                            <ChevronLeft size={20} className="text-white" />
                        </button>
                        <button onClick={advance} aria-label="Next"
                            className="w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center hover:bg-white/25 active:scale-95 transition-all">
                            <ChevronRight size={20} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Slider */}
                <div className="overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}>
                    <div
                        style={{
                            display: 'flex',
                            gap: `${GAP}px`,
                            transform: `translateX(${translateX})`,
                            transition: animated ? 'transform 480ms cubic-bezier(0.25,1,0.5,1)' : 'none',
                            willChange: 'transform',
                        }}
                        onTransitionEnd={onTransitionEnd}
                    >
                        {loopItems.map((product, i) => (
                            <div key={`${product.id}-${i}`}
                                style={{ width: cardW, flexShrink: 0, flexGrow: 0 }}>
                                <GlassCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-6">
                    {products.map((_, i) => (
                        <button key={i} onClick={() => goTo(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                i === activeDot ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Card ───────────────────────────────────────────────────────────────────────
function GlassCard({ product }) {
    const desc = product.description
        ? product.description.substring(0, 120) + (product.description.length > 120 ? '…' : '')
        : '';

    return (
        <div className="flex flex-col sm:flex-row gap-4 rounded-2xl p-4 sm:p-5 bg-white/10 border border-white/25 backdrop-blur-md overflow-hidden relative transition-transform duration-300 hover:-translate-y-1 h-full"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>

            {/* Mobile: image on top, full width */}
            <div className="block sm:hidden w-full rounded-xl overflow-hidden border border-white/20 relative z-10"
                style={{ height: 180 }}>
                {product.image
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={product.image} alt={product.name || 'Plant'}
                        className="w-full h-full object-cover" loading="eager" />
                    : <div className="w-full h-full flex items-center justify-center text-4xl">🪴</div>
                }
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 flex flex-col justify-between relative z-10">
                <div>
                    <span className="inline-block mb-2.5 px-2.5 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[11px] font-semibold tracking-wide">
                        {product.tag || 'Indoor'}
                    </span>
                    <h3 className="font-bold text-white text-sm sm:text-base leading-snug line-clamp-2 mb-2">
                        {product.title || product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-3 mb-4">{desc}</p>
                </div>
                <Link href={`/products/${product.handle}`}
                    className="btn-primary self-start"
                    style={{ fontSize: 12, padding: '8px 16px' }}>
                    Explore Now <ArrowRight size={12} />
                </Link>
            </div>

            {/* Desktop: image on right side */}
            <div className="hidden sm:block shrink-0 rounded-xl overflow-hidden border border-white/20 relative z-10"
                style={{ width: 128, height: 176 }}>
                {product.image
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={product.image} alt={product.name || 'Plant'}
                        className="w-full h-full object-cover" loading="eager" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl">🪴</div>
                }
            </div>
        </div>
    );
}
