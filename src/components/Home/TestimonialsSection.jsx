"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
    {
        id: 1,
        name: "Frank Klin",
        role: "Designer",
        rating: 4,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        social: "instagram",
    },
    {
        id: 2,
        name: "Linda Anand",
        role: "Doctor",
        rating: 5,
        text: "Abore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris.",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        social: "facebook",
    },
    {
        id: 3,
        name: "David Gueta",
        role: "Artist",
        rating: 5,
        text: "Exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor reprehenderit.",
        avatar: "https://randomuser.me/api/portraits/men/65.jpg",
        social: "twitter",
    },
    {
        id: 4,
        name: "Soda Lanna",
        role: "Designer",
        rating: 3,
        text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        social: "facebook",
    },
    {
        id: 5,
        name: "Zoom Chat",
        role: "Developer",
        rating: 4,
        text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est.",
        avatar: "https://randomuser.me/api/portraits/men/11.jpg",
        social: "facebook",
    },
    {
        id: 6,
        name: "Aria Wells",
        role: "Entrepreneur",
        rating: 5,
        text: "Sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit sed do eiusmod.",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg",
        social: "twitter",
    },
];

/* ── Social icons ── */
const InstagramIcon = () => (
    <span
        className="inline-flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
        style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}
    >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
    </span>
);

const FacebookIcon = () => (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 bg-[#1877F2]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    </span>
);

const TwitterIcon = () => (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 bg-[#1DA1F2]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
    </span>
);

const SocialIcon = ({ type }) => {
    if (type === "instagram") return <InstagramIcon />;
    if (type === "facebook") return <FacebookIcon />;
    return <TwitterIcon />;
};

/* ── Star rating ── */
const StarRating = ({ rating }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
            <svg key={s} width="15" height="15" viewBox="0 0 24 24" fill={s <= rating ? "#2BBFA4" : "#E5E7EB"}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ))}
    </div>
);

/* ── Main component ── */
export default function TestimonialsSection() {
    const total = testimonials.length;
    const [activeIndex, setActiveIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(3);
    const autoRef = useRef(null);
    const isAnimating = useRef(false);
    const touchStartX = useRef(null);

    /* Responsive visible count */
    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            setVisibleCount(w < 640 ? 1 : w < 1024 ? 2 : 3);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    /* Auto-play */
    const startAuto = useCallback(() => {
        clearInterval(autoRef.current);
        autoRef.current = setInterval(() => {
            setActiveIndex((p) => (p + 1) % total);
        }, 4200);
    }, [total]);

    useEffect(() => {
        startAuto();
        return () => clearInterval(autoRef.current);
    }, [startAuto]);

    /* Navigation */
    const goTo = useCallback(
        (raw) => {
            if (isAnimating.current) return;
            isAnimating.current = true;
            setActiveIndex(((raw % total) + total) % total);
            clearInterval(autoRef.current);
            startAuto();
            setTimeout(() => { isAnimating.current = false; }, 650);
        },
        [total, startAuto]
    );

    /* Touch swipe */
    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? goTo(activeIndex + 1) : goTo(activeIndex - 1);
        touchStartX.current = null;
    };

    /* Build visible slots */
    const slots = (() => {
        if (visibleCount === 1) return [{ idx: activeIndex, offset: 0 }];
        if (visibleCount === 2) return [
            { idx: activeIndex % total, offset: 0 },
            { idx: (activeIndex + 1) % total, offset: 1 },
        ];
        return [
            { idx: ((activeIndex - 1) + total) % total, offset: -1 },
            { idx: activeIndex % total, offset: 0 },
            { idx: (activeIndex + 1) % total, offset: 1 },
        ];
    })();

    return (
        <section className="w-full bg-[#F0F4F1] py-16 sm:py-20 lg:py-24 overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">

                {/* ── Heading ── */}
                <div className="text-center mb-12 sm:mb-14 lg:mb-16">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-bold text-[#244033] leading-tight mb-3"
                        style={{ fontFamily: "Georgia, serif" }}>
                        What Our{" "}
                        <span className="text-[#2BBFA4]">Customers Are Saying</span>
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
                        But I must explain to you how all this mistaken idea of denouncing pleasure and praising
                        pain was born and I will give you a complete
                    </p>
                </div>

                {/* ── Slider ── */}
                <div
                    className="relative flex items-center justify-center px-10 sm:px-14 lg:px-16"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Left Arrow */}
                    <button
                        onClick={() => goTo(activeIndex - 1)}
                        aria-label="Previous testimonial"
                        className="
              absolute left-0 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white
              border border-gray-200 flex items-center justify-center
              shadow-md cursor-pointer
              transition-all duration-300 ease-out
              hover:bg-[#2BBFA4] hover:border-[#2BBFA4] hover:scale-110
              hover:shadow-[0_8px_24px_rgba(43,191,164,0.30)]
              group
            "
                    >
                        <ChevronLeft
                            size={20}
                            className="text-[#244033] transition-colors duration-300 group-hover:text-white"
                        />
                    </button>

                    {/* Cards Track */}
                    <div className="flex items-stretch justify-center w-full gap-4 sm:gap-5 lg:gap-6 py-6 sm:py-8">
                        {slots.map(({ idx, offset }) => {
                            const t = testimonials[idx];
                            const isCenter = offset === 0;
                            const isOnly = visibleCount === 1;

                            return (
                                <div
                                    key={`${t.id}-${offset}`}
                                    className={[
                                        /* Base */
                                        "flex flex-col gap-4 bg-white rounded-2xl p-6 sm:p-7 flex-1 min-w-0",
                                        "border-t-[3px]",
                                        /* GPU-composited transition for buttery smoothness */
                                        "will-change-[transform,opacity]",
                                        "transition-[transform,opacity,box-shadow,border-color]",
                                        "duration-[600ms]",
                                        "ease-[cubic-bezier(0.34,1.15,0.64,1)]",
                                        /* State-based styles */
                                        isOnly
                                            ? "scale-100 opacity-100 shadow-[0_14px_44px_rgba(0,0,0,0.12)] border-[#2BBFA4]"
                                            : isCenter
                                                ? "scale-[1.05] -translate-y-1 opacity-100 shadow-[0_20px_56px_rgba(0,0,0,0.13),0_4px_16px_rgba(43,191,164,0.12)] border-[#2BBFA4] z-10"
                                                : "scale-[0.93] translate-y-1.5 opacity-60 shadow-[0_2px_10px_rgba(0,0,0,0.07)] border-transparent",
                                    ].join(" ")}
                                >
                                    {/* Avatar row */}
                                    <div className="flex items-center gap-3.5">
                                        <img
                                            src={t.avatar}
                                            alt={t.name}
                                            className={[
                                                "w-14 h-14 rounded-full object-cover flex-shrink-0",
                                                "border-[2.5px] transition-[border-color] duration-500",
                                                isCenter || isOnly ? "border-[#2BBFA4]" : "border-[#e0f2ed]",
                                            ].join(" ")}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-0.5">
                                                <span className="font-bold text-[15px] text-gray-900 truncate">
                                                    {t.name}
                                                </span>
                                                <SocialIcon type={t.social} />
                                            </div>
                                            <p className="text-[#2BBFA4] text-[10.5px] font-bold uppercase tracking-widest mb-1.5">
                                                {t.role}
                                            </p>
                                            <StarRating rating={t.rating} />
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <hr className="border-t border-gray-100" />

                                    {/* Quote + text */}
                                    <div>
                                        <p
                                            className="text-[#2BBFA4] leading-none mb-[-8px] opacity-75"
                                            style={{ fontSize: 44, fontFamily: "Georgia, serif" }}
                                        >
                                            &ldquo;
                                        </p>
                                        <p className="text-gray-500 text-[13px] sm:text-sm leading-[1.8] italic">
                                            {t.text}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={() => goTo(activeIndex + 1)}
                        aria-label="Next testimonial"
                        className="
              absolute right-0 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white
              border border-gray-200 flex items-center justify-center
              shadow-md cursor-pointer
              transition-all duration-300 ease-out
              hover:bg-[#2BBFA4] hover:border-[#2BBFA4] hover:scale-110
              hover:shadow-[0_8px_24px_rgba(43,191,164,0.30)]
              group
            "
                    >
                        <ChevronRight
                            size={20}
                            className="text-[#244033] transition-colors duration-300 group-hover:text-white"
                        />
                    </button>
                </div>

                {/* ── Dots ── */}
                <div className="flex items-center justify-center gap-2 mt-2">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`Go to testimonial ${i + 1}`}
                            className={[
                                "h-2.5 rounded-full border-none cursor-pointer p-0",
                                "transition-[width,background-color] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                                "hover:bg-[#1aab8e]",
                                i === activeIndex
                                    ? "w-8 bg-[#2BBFA4]"
                                    : "w-2.5 bg-[#c4dfd8]",
                            ].join(" ")}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}