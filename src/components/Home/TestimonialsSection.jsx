"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { homeConfig } from "../../config/home.config";

export default function TestimonialsSection() {
    const { eyebrow, title, titleHighlight, subtitle, bgColor, autoPlayInterval, items: testimonials } = homeConfig.testimonials;

    const total = testimonials.length;
    const [activeIndex, setActiveIndex] = useState(0);
    const autoRef = useRef(null);
    const isAnimating = useRef(false);

    const startAuto = useCallback(() => {
        clearInterval(autoRef.current);
        autoRef.current = setInterval(() => {
            setActiveIndex((p) => (p + 1) % total);
        }, autoPlayInterval);
    }, [total, autoPlayInterval]);

    useEffect(() => {
        startAuto();
        return () => clearInterval(autoRef.current);
    }, [startAuto]);

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

    return (
        <section className="w-full py-20 lg:py-28" style={{ backgroundColor: bgColor }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                    {/* LEFT: Heading Section */}
                    <div className="w-full lg:w-1/4 flex-shrink-0">
                        {eyebrow && (
                            <div className="flex items-center gap-1 mb-3">
                                <span className="text-[#2d5a3d] font-bold text-xs">✓</span>
                                <p className="text-xs font-bold uppercase tracking-wider text-[#2d5a3d]">
                                    {eyebrow}
                                </p>
                            </div>
                        )}
                        <h2
                            className="text-3xl sm:text-4xl font-bold leading-tight mb-4"
                            style={{ fontFamily: "Georgia, serif", color: "#1a3a2a" }}
                        >
                            {title} <br className="hidden sm:block" />
                            <span style={{ color: "#2d5a3d" }}>{titleHighlight}</span>
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed pr-4">
                            {subtitle}
                        </p>
                    </div>

                    {/* RIGHT: Carousel Section */}
                    <div className="w-full lg:flex-1 relative">
                        {/* Carousel */}
                        <div className="relative flex items-center">
                            {/* Left Arrow */}
                            <button
                                onClick={() => goTo(activeIndex - 1)}
                                className="absolute -left-6 top-1/3 z-30 w-9 h-9 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-[#2d5a3d] hover:text-white transition-all shadow-md"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {/* Cards Track */}
                            <div className="w-full overflow-hidden">
                                <div
                                    className="flex gap-5 transition-transform duration-600 ease-out"
                                    style={{
                                        transform: `translateX(calc(-${activeIndex} * (100% + 1.25rem)))`,
                                    }}
                                >
                                    {testimonials.map((t) => (
                                        <div key={t.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3">
                                            {/* Card */}
                                            <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 h-full relative">

                                                {/* Avatar - Large Circular Image */}
                                                <div className="relative mb-3 flex justify-center">
                                                    <div className="relative w-36 h-36 sm:w-44 sm:h-44">
                                                        <img
                                                            src={t.avatar}
                                                            alt={t.name}
                                                            className="w-full h-full rounded-full object-cover border-2 border-[#e8f3ed]"
                                                        />
                                                        {/* Quote Mark - Overlay on right side */}
                                                        <div className="absolute -right-2 top-2 text-5xl sm:text-6xl text-[#2d5a3d] opacity-50 leading-none font-serif">
                                                            "
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Text Content */}
                                                <div className="text-center">
                                                    {/* Testimonial Text */}
                                                    <p className="text-xs sm:text-sm text-gray-700 mb-3 leading-snug line-clamp-3 h-10 sm:h-12">
                                                        {t.text}
                                                    </p>

                                                    {/* Name */}
                                                    <p className="font-bold text-sm sm:text-base text-gray-900 mb-0.5">
                                                        {t.name}
                                                    </p>

                                                    {/* Role - Optional */}
                                                    {t.role && (
                                                        <p className="text-xs text-gray-500 mb-1">
                                                            {t.role}
                                                        </p>
                                                    )}

                                                    {/* Signature */}
                                                    {t.signature && (
                                                        <p
                                                            className="text-[#2d5a3d] italic text-xs"
                                                            style={{ fontFamily: "'Brush Script MT', cursive" }}
                                                        >
                                                            {t.signature}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Arrow */}
                            <button
                                onClick={() => goTo(activeIndex + 1)}
                                className="absolute -right-6 top-1/3 z-30 w-9 h-9 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-[#2d5a3d] hover:text-white transition-all shadow-md"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {/* Dots */}
                        <div className="flex justify-center gap-2 mt-6">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    className={`h-2 rounded-full transition-all ${
                                        i === activeIndex
                                            ? "w-6 bg-[#2d5a3d]"
                                            : "w-2 bg-gray-400 hover:bg-[#2d5a3d]"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
