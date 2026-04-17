'use client';

import Link from 'next/link';
import { Facebook, Instagram, Youtube, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { footerConfig } from '../config/Footer.config';

// ── Social icon map ───────────────────────────────────────────────────
const SocialIconMap = {
    facebook: ({ size }) => <Facebook size={size} />,
    instagram: ({ size }) => <Instagram size={size} />,
    youtube: ({ size }) => <Youtube size={size} />,
    twitter: ({ size }) => (
        <svg style={{ width: size, height: size }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 2H1L9.26086 13.0145L1.44995 21.9999H4.09998L10.4883 14.651L16 22H23L14.3917 10.5223L21.8001 2H19.1501L13.1643 8.88578L8 2ZM17 20L5 4H7L19 20H17Z" />
        </svg>
    ),
    linkedin: ({ size }) => (
        <svg style={{ width: size, height: size }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    ),
};

// ── Justify map helper ────────────────────────────────────────────────
const justifyMap = {
    between: 'justify-between',
    center: 'justify-center',
    start: 'justify-start',
    end: 'justify-end',
};

export default function Footer() {
    const [openSection, setOpenSection] = useState(null);

    const {
        bg, borderColor,
        brand, columns, columnStyles, accordionStyles,
        newsletter, socials, socialStyles,
        bottomBar, spacing,
        backgroundImage = '/images/2148488545.jpg',
    } = footerConfig;

    const toggleSection = (title) => setOpenSection(openSection === title ? null : title);
    const handleSubmit = (e) => e.preventDefault();

    // ── Glass styles ──────────────────────────────────────────────────
    const glassStyle = {
        backdropFilter: 'blur(10px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(6px) saturate(1.4)',
        backgroundColor: 'rgba(0, 20, 5, 0.55)',
    };

    const bottomGlassStyle = {
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(6px)',
        backgroundColor: 'rgba(0, 15, 5, 0.60)',
    };

    // ── Social icon wrapper style ─────────────────────────────────────
    const socialIconBg = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        backgroundColor: 'rgba(30, 80, 40, 0.85)',
        transition: 'background-color 0.2s',
    };

    // ── Reusable: Social row ──────────────────────────────────────────
    const SocialRow = () => (
        <div className={`flex ${socialStyles.gap}`}>
            {socials.map(({ icon, href }) => {
                const Icon = SocialIconMap[icon];
                return (
                    <a
                        key={icon}
                        href={href}
                        style={socialIconBg}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(50, 120, 60, 0.95)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(30, 80, 40, 0.85)'}
                        className="transition-colors"
                    >
                        {Icon && (
                            <span style={{ color: socialStyles.iconColor }}>
                                <Icon size={socialStyles.iconSize} />
                            </span>
                        )}
                    </a>
                );
            })}
        </div>
    );

    // ── Reusable: Newsletter form ─────────────────────────────────────
    const NewsletterForm = () => (
        <form onSubmit={handleSubmit} className="space-y-3">
            <input
                type="email"
                placeholder={newsletter.placeholder}
                required
                className={`w-full ${newsletter.inputPadding} ${newsletter.inputFontSize} border rounded focus:outline-none`}
                style={{
                    borderColor: newsletter.inputBorderColor,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                }}
                onFocus={e => e.currentTarget.style.borderColor = newsletter.inputFocusBorder}
                onBlur={e => e.currentTarget.style.borderColor = newsletter.inputBorderColor}
            />
            <button
                type="submit"
                className="w-full px-6 py-2.5 text-sm font-medium rounded transition-colors"
                style={{ backgroundColor: newsletter.buttonBg, color: newsletter.buttonTextColor }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = newsletter.buttonHoverBg}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = newsletter.buttonBg}
            >
                {newsletter.buttonText}
            </button>
        </form>
    );

    return (
        <footer
            className="relative overflow-hidden border-t"
            style={{
                borderTopColor: borderColor,
                // ── Parallax background: stays fixed in the viewport as the
                //    footer scrolls up over it, and is automatically clipped
                //    to the footer's box (so it never bleeds into the rest
                //    of the page). This is what position:fixed inside the
                //    footer cannot do — fixed escapes ancestor clipping.
                ...(backgroundImage && {
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    backgroundRepeat: 'no-repeat',
                }),
            }}
        >
            {/* ── Subtle dark vignette over image ─────────────────── */}
            {backgroundImage && (
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 1,
                        background:
                            'linear-gradient(to bottom, rgba(0,10,0,0.25) 0%, rgba(0,10,0,0.15) 60%, rgba(0,10,0,0.45) 100%)',
                        pointerEvents: 'none',
                    }}
                />
            )}

            {/* ════════════════════════════════════════════════════════
                All content sits above bg layers (z-10)
            ════════════════════════════════════════════════════════ */}
            <div className="relative" style={{ zIndex: 10 }}>

                {/* ══════════════════════════════════════════════
                    MOBILE — Newsletter banner
                ══════════════════════════════════════════════ */}
                <div
                    className={`lg:hidden w-full ${spacing.mobilePaddingX} ${spacing.mobileSectionY} border-b`}
                    style={{ ...glassStyle, borderColor: accordionStyles.borderColor }}
                >
                    <h2
                        className={`${newsletter.mobileTitleSize} ${newsletter.mobileTitleWeight} ${newsletter.mobileTitleMarginB} ${newsletter.mobileAlign}`}
                        style={{ color: newsletter.mobileTitleColor }}
                    >
                        {newsletter.title}
                    </h2>
                    <p
                        className={`${newsletter.mobileDescFontSize} ${newsletter.mobileDescMarginB} ${newsletter.mobileAlign}`}
                        style={{ color: newsletter.mobileDescColor }}
                    >
                        {newsletter.description}
                    </p>
                    <NewsletterForm />
                </div>

                {/* ══════════════════════════════════════════════
                    MOBILE — Accordion columns
                ══════════════════════════════════════════════ */}
                <div
                    className="lg:hidden border-b"
                    style={{ borderColor: accordionStyles.borderColor, ...glassStyle }}
                >
                    {columns.map((col, i) => (
                        <div
                            key={col.title}
                            className={i < columns.length - 1 ? 'border-b' : ''}
                            style={{ borderColor: accordionStyles.borderColor }}
                        >
                            <button
                                onClick={() => toggleSection(col.title)}
                                className={`w-full ${accordionStyles.paddingX} ${accordionStyles.paddingY} flex justify-between items-center`}
                            >
                                <span
                                    className={accordionStyles.buttonFontWeight}
                                    style={{ color: accordionStyles.buttonTextColor }}
                                >
                                    {col.title}
                                </span>
                                <ChevronDown
                                    size={accordionStyles.iconSize}
                                    style={{ color: accordionStyles.buttonTextColor }}
                                    className={`transition-transform ${openSection === col.title ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {openSection === col.title && (
                                <ul className={`${accordionStyles.listPaddingX} ${accordionStyles.listPaddingB} ${accordionStyles.listSpacing}`}>
                                    {col.links.map(({ label, href }) => (
                                        <li key={label}>
                                            <Link
                                                href={href}
                                                className={`${columnStyles.linkFontSize} transition-colors`}
                                                style={{ color: columnStyles.linkColor }}
                                                onMouseEnter={e => e.currentTarget.style.color = columnStyles.linkHoverColor}
                                                onMouseLeave={e => e.currentTarget.style.color = columnStyles.linkColor}
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>

                {/* ══════════════════════════════════════════════
                    DESKTOP — Main glass panel
                ══════════════════════════════════════════════ */}
                <div
                    className={`hidden lg:block ${spacing.desktopPaddingX} ${spacing.desktopPaddingY}`}
                    style={glassStyle}
                >
                    <div
                        className={`grid ${spacing.columnGap} ${spacing.sectionBottomGap}`}
                        style={{ gridTemplateColumns: `1fr repeat(${columns.length}, 1fr) 1fr` }}
                    >
                        {/* Brand column */}
                        <div>
                            <div
                                className={`${brand.nameFontSize} ${brand.nameFontWeight} flex items-center gap-2`}
                                style={{ color: brand.nameColor }}
                            >
                                <span className={brand.emojiSize}>{brand.emoji}</span>
                                {brand.name}
                            </div>
                            <p
                                className={`${brand.descFontSize} leading-relaxed mt-4`}
                                style={{ color: brand.descColor }}
                            >
                                {brand.description}
                            </p>
                            <div className="mt-6">
                                <SocialRow />
                            </div>
                        </div>

                        {/* Nav columns */}
                        {columns.map((col) => (
                            <div key={col.title}>
                                <h3
                                    className={`${columnStyles.titleFontSize} ${columnStyles.titleFontWeight} ${columnStyles.titleAlign} ${columnStyles.titleMarginB}`}
                                    style={{ color: columnStyles.titleColor }}
                                >
                                    {col.title}
                                </h3>
                                <ul className={columnStyles.linkSpacing}>
                                    {col.links.map(({ label, href }) => (
                                        <li key={label}>
                                            <Link
                                                href={href}
                                                className={`${columnStyles.linkFontSize} transition-colors`}
                                                style={{ color: columnStyles.linkColor }}
                                                onMouseEnter={e => e.currentTarget.style.color = columnStyles.linkHoverColor}
                                                onMouseLeave={e => e.currentTarget.style.color = columnStyles.linkColor}
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Newsletter column */}
                        <div>
                            <h3
                                className={`${newsletter.titleFontSize} ${newsletter.titleFontWeight} ${newsletter.titleAlign} ${newsletter.titleMarginB}`}
                                style={{ color: newsletter.titleColor }}
                            >
                                {newsletter.title}
                            </h3>
                            <p
                                className={`${newsletter.descFontSize} ${newsletter.descMarginB} ${newsletter.descAlign}`}
                                style={{ color: newsletter.descColor }}
                            >
                                {newsletter.description}
                            </p>
                            <NewsletterForm />
                        </div>
                    </div>

                    {/* Desktop bottom bar */}
                    <div
                        className={`border-t ${bottomBar.paddingTop} flex items-center ${justifyMap[bottomBar.desktopJustify]}`}
                        style={{ borderColor: bottomBar.borderColor }}
                    >
                        <p className={`${brand.copyrightFontSize}`} style={{ color: brand.copyrightColor }}>
                            {brand.copyright}
                        </p>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════
                    MOBILE — Bottom bar
                ══════════════════════════════════════════════ */}
                <div
                    className={`lg:hidden ${spacing.mobilePaddingX} ${spacing.mobileBottomY} border-t`}
                    style={{ ...bottomGlassStyle, borderColor: borderColor }}
                >
                    <h2 className="text-xl font-light mb-2" style={{ color: brand.nameMobileColor }}>
                        {brand.name}
                    </h2>
                    <p
                        className={`${brand.copyrightMobileFontSize} mb-6`}
                        style={{ color: brand.copyrightColor }}
                    >
                        {brand.copyright}
                    </p>
                    <SocialRow />
                </div>

            </div>
        </footer>
    );
}