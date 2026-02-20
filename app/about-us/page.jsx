"use client";

import Image from 'next/image';
import Link from 'next/link';

import {
    colors,
    typography,
    layout,
    images,
    meta,
    heroContent,
    founderContent,
    ctaContent,
    features,
    transitions,
} from '../../src/config/About-Us.config';

// ── Metadata (driven by config) ───────────────────────────────────────────────
// export const metadata = {
//     title: meta.title,
//     description: meta.description,
// };

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Renders a paragraph that may be a plain string or an object with inline parts */
function RichParagraph({ paragraph }) {
    // Plain string
    if (typeof paragraph === 'string') {
        return (
            <p style={{ color: colors.text.body, lineHeight: typography.lineHeight.relaxed }}>
                {paragraph}
            </p>
        );
    }

    // Paragraph with inline link
    if (paragraph.linkText) {
        return (
            <p style={{ color: colors.text.body, lineHeight: typography.lineHeight.relaxed }}>
                {paragraph.before}
                <a
                    href={paragraph.linkHref}
                    className={transitions.link}
                    style={{ color: colors.accent, textDecoration: 'underline', fontWeight: typography.weights.medium }}
                    onMouseOver={e => e.currentTarget.style.color = colors.accentHover}
                    onMouseOut={e => e.currentTarget.style.color = colors.accent}
                >
                    {paragraph.linkText}
                </a>
                {paragraph.after}
            </p>
        );
    }

    // Paragraph with multiple inline parts (text / link / italic)
    if (paragraph.parts) {
        return (
            <p style={{ color: colors.text.body, lineHeight: typography.lineHeight.relaxed }}>
                {paragraph.parts.map((part, i) => {
                    if (part.type === 'link') {
                        return (
                            <a
                                key={i}
                                href={part.href}
                                className={transitions.link}
                                style={{ color: colors.accent, textDecoration: 'underline' }}
                                onMouseOver={e => e.currentTarget.style.color = colors.accentHover}
                                onMouseOut={e => e.currentTarget.style.color = colors.accent}
                            >
                                {part.value}
                            </a>
                        );
                    }
                    if (part.type === 'italic') {
                        return (
                            <span key={i} style={{ fontStyle: 'italic', color: colors.text.muted }}>
                                {part.value}
                            </span>
                        );
                    }
                    return <span key={i}>{part.value}</span>;
                })}
            </p>
        );
    }

    return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// AboutUs Page
// ─────────────────────────────────────────────────────────────────────────────
export default function AboutUs() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.page }}>

            {/* ── HERO SECTION ──────────────────────────────────────────────────── */}
            {features.showHeroSection && (
                <section
                    className="grid lg:grid-cols-2"
                    style={{ minHeight: layout.hero.minHeight }}
                >
                    {/* Image panel */}
                    <div
                        className="relative lg:min-h-screen"
                        style={{
                            height: layout.hero.imageHeightMobile,
                            order: layout.hero.imageOrder.mobile,
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-16">
                            <div className="relative w-full h-full max-w-2xl">
                                <Image
                                    src={images.hero.src}
                                    alt={images.hero.alt}
                                    fill
                                    className="object-cover"
                                    style={{
                                        objectFit: images.hero.objectFit,
                                        borderRadius: layout.borderRadius.image,
                                    }}
                                    priority={images.hero.priority}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content panel */}
                    <div
                        className="flex items-center justify-center"
                        style={{
                            background: `linear-gradient(135deg, ${colors.heroRight}, ${colors.heroRightVia}, ${colors.heroRight})`,
                            padding: `${layout.hero.contentPadding.y.base} ${layout.hero.contentPadding.x.base}`,
                            order: layout.hero.contentOrder.mobile,
                            textAlign: layout.hero.contentAlign,
                        }}
                    >
                        <div style={{ maxWidth: layout.maxWidth.heroText }}>
                            <h1
                                className="font-serif font-light leading-tight mb-8"
                                style={{
                                    fontFamily: typography.fonts.heading,
                                    fontSize: typography.sizes.heroHeading.base,
                                    fontWeight: typography.weights.light,
                                    color: colors.text.heading,
                                    lineHeight: typography.lineHeight.tight,
                                }}
                            >
                                {heroContent.heading}
                                {features.showTrademark && (
                                    <sup style={{ fontSize: typography.sizes.superscript.base }}>®</sup>
                                )}
                            </h1>

                            <div className="space-y-6">
                                {heroContent.paragraphs.map((para, i) => (
                                    <RichParagraph key={i} paragraph={para} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── FOUNDER'S NOTE SECTION ────────────────────────────────────────── */}
            {features.showFounderNote && (
                <section
                    style={{
                        paddingTop: layout.founder.padding.y.base,
                        paddingBottom: layout.founder.padding.y.base,
                        paddingLeft: layout.founder.padding.x.base,
                        paddingRight: layout.founder.padding.x.base,
                        background: `linear-gradient(to bottom, ${colors.founderBg}, ${colors.founderBgVia}, ${colors.founderBgVia})`,
                    }}
                >
                    <div style={{ maxWidth: layout.maxWidth.content, margin: '0 auto' }}>

                        {/* Founder image */}
                        <div
                            className="relative w-full overflow-hidden"
                            style={{
                                height: layout.founder.imageHeight.base,
                                marginBottom: layout.founder.imageMarginBottom,
                                borderRadius: layout.founder.imageRadius,
                                boxShadow: layout.founder.imageShadow,
                            }}
                        >
                            <Image
                                src={images.founder.src}
                                alt={images.founder.alt}
                                fill
                                style={{ objectFit: images.founder.objectFit }}
                                priority={images.founder.priority}
                            />
                        </div>

                        {/* Founder note text */}
                        <div>
                            <h2
                                className="font-serif font-light mb-12"
                                style={{
                                    fontFamily: typography.fonts.heading,
                                    fontSize: typography.sizes.sectionHeading.base,
                                    fontWeight: typography.weights.light,
                                    color: colors.text.heading,
                                }}
                            >
                                {founderContent.sectionHeading}
                            </h2>

                            <div className="space-y-6">
                                {founderContent.paragraphs.map((para, i) => (
                                    <RichParagraph key={i} paragraph={para} />
                                ))}
                            </div>

                            {/* Sign-off */}
                            <div style={{ marginTop: '3rem' }}>
                                <p
                                    className="font-serif font-light"
                                    style={{
                                        fontSize: typography.sizes.founderSign.base,
                                        color: colors.text.body,
                                        marginBottom: '0.5rem',
                                    }}
                                >
                                    {founderContent.signOff.line1}
                                </p>
                                <p
                                    className="font-serif font-light"
                                    style={{
                                        fontSize: typography.sizes.founderSign.base,
                                        color: colors.text.body,
                                    }}
                                >
                                    {founderContent.signOff.line2}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA SECTION ───────────────────────────────────────────────────── */}
            {features.showCtaSection && (
                <section
                    style={{
                        paddingTop: layout.cta.padding.y,
                        paddingBottom: layout.cta.padding.y,
                        paddingLeft: layout.cta.padding.x.base,
                        paddingRight: layout.cta.padding.x.base,
                        backgroundColor: colors.ctaBg,
                        textAlign: layout.cta.textAlign,
                    }}
                >
                    <div style={{ maxWidth: layout.maxWidth.content, margin: '0 auto' }}>
                        <h2
                            className="font-serif"
                            style={{
                                fontFamily: typography.fonts.heading,
                                fontSize: typography.sizes.ctaHeading.base,
                                fontWeight: typography.weights.black,
                                color: colors.text.ctaHeading,
                                marginBottom: '1.5rem',
                            }}
                        >
                            {ctaContent.heading}
                        </h2>

                        <p
                            style={{
                                fontSize: typography.sizes.ctaBody.base,
                                color: colors.text.ctaBody,
                                marginBottom: '2.5rem',
                                maxWidth: '42rem',
                                margin: '0 auto 2.5rem',
                                lineHeight: typography.lineHeight.relaxed,
                            }}
                        >
                            {ctaContent.subtext}
                        </p>

                        <div
                            className="flex flex-col sm:flex-row gap-4 items-center"
                            style={{ justifyContent: layout.cta.textAlign === 'center' ? 'center' : 'flex-start' }}
                        >
                            {ctaContent.buttons.map((btn, i) => (
                                <Link
                                    key={i}
                                    href={btn.href}
                                    className={`${transitions.button} ${transitions.buttonHover} w-full sm:w-auto inline-block text-center`}
                                    style={{
                                        backgroundColor: btn.style === 'primary' ? colors.button.bg : 'transparent',
                                        color: btn.style === 'primary' ? colors.button.text : colors.button.bg,
                                        border: btn.style === 'outline' ? `2px solid ${colors.button.bg}` : 'none',
                                        padding: '1rem 2rem',
                                        borderRadius: layout.borderRadius.button,
                                        fontWeight: typography.weights.medium,
                                        fontFamily: typography.fonts.body,
                                    }}
                                >
                                    {btn.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

        </div>
    );
}