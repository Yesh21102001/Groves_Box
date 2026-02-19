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
    } = footerConfig;

    const toggleSection = (title) => setOpenSection(openSection === title ? null : title);

    const handleSubmit = (e) => e.preventDefault();

    // ── Reusable: Social row ──────────────────────────────────────────
    const SocialRow = () => (
        <div className={`flex ${socialStyles.gap}`}>
            {socials.map(({ icon, href }) => {
                const Icon = SocialIconMap[icon];
                return (
                    <a
                        key={icon}
                        href={href}
                        style={{ color: socialStyles.iconColor }}
                        onMouseEnter={e => e.currentTarget.style.color = socialStyles.iconHoverColor}
                        onMouseLeave={e => e.currentTarget.style.color = socialStyles.iconColor}
                        className="transition-colors"
                    >
                        {Icon && <Icon size={socialStyles.iconSize} />}
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
                style={{ borderColor: newsletter.inputBorderColor }}
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
        <footer style={{ backgroundColor: bg, borderTopColor: borderColor }} className="border-t">

            {/* ══════════════════════════════════════════════
                MOBILE — Newsletter banner
            ══════════════════════════════════════════════ */}
            <div className={`lg:hidden w-full ${spacing.mobilePaddingX} ${spacing.mobileSectionY} border-b`}
                style={{ borderColor: accordionStyles.borderColor }}>
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
            <div className="lg:hidden border-b" style={{ borderColor: accordionStyles.borderColor }}>
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
                DESKTOP — Main grid
            ══════════════════════════════════════════════ */}
            <div className={`hidden lg:block ${spacing.desktopPaddingX} ${spacing.desktopPaddingY}`}>
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
                    </div>

                    {/* Nav columns — generated from config */}
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

                {/* Bottom bar */}
                <div
                    className={`border-t ${bottomBar.paddingTop} flex items-center ${justifyMap[bottomBar.desktopJustify]}`}
                    style={{ borderColor: bottomBar.borderColor }}
                >
                    <p className={`${brand.copyrightFontSize}`} style={{ color: brand.copyrightColor }}>
                        {brand.copyright}
                    </p>
                    <SocialRow />
                </div>
            </div>

            {/* ══════════════════════════════════════════════
                MOBILE — Bottom bar
            ══════════════════════════════════════════════ */}
            <div
                className={`lg:hidden ${spacing.mobilePaddingX} ${spacing.mobileBottomY} border-t`}
                style={{ borderColor: borderColor }}
            >
                <h2
                    className={`text-xl font-light mb-2`}
                    style={{ color: brand.nameMobileColor }}
                >
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

        </footer>
    );
}