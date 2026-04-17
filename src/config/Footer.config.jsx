// ============================================================
//  FOOTER CONFIG — src/config/Footer.config.js
//  Change ANYTHING here → footer updates automatically
//  No need to touch Footer.jsx at all
// ============================================================

export const footerConfig = {

    // ── Background Image & Border ──────────────────────────
    backgroundImage: '/images/2148488544.jpg',   // ← your forest/nature image
    bg: 'transparent',                            // fallback if no image
    borderColor: 'rgba(255, 255, 255, 0.1)',

    // ── Brand ─────────────────────────────────────────────
    brand: {
        name: 'Groves Box',
        emoji: '🌿',
        description:
            'Your premier destination for all things eco-friendly and environmentally conscious. We are your one-stop source for a greener, healthier, and more sustainable world.',
        copyright: '© 2025 GreenNest. All rights reserved',

        // Text styles
        nameColor: '#ffffff',
        nameMobileColor: '#ffffff',
        nameFontSize: 'text-3xl',
        nameFontWeight: 'font-bold',
        descColor: 'rgba(255, 255, 255, 0.80)',
        descFontSize: 'text-sm',
        copyrightColor: 'rgba(255, 255, 255, 0.75)',
        copyrightFontSize: 'text-sm',
        copyrightMobileFontSize: 'text-xs',
        emojiSize: 'text-3xl',
    },

    // ── Navigation Columns ────────────────────────────────
    columns: [
        {
            title: 'Information',
            links: [
                { label: 'Shop', href: '/shop' },
                { label: 'Blog', href: '/blog' },
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'About us', href: '/about-us' },
                { label: 'Contact us', href: '/contact-us' },
            ],
        },
        {
            title: 'Support',
            links: [
                { label: 'Account', href: '/account' },
                { label: 'Support Center', href: '/support' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms & Conditions', href: '/terms' },
            ],
        },
        {
            title: 'Community',
            links: [
                { label: 'Refer A Friend', href: '/refer' },
                { label: 'Gift Card', href: '/gift-card' },
            ],
        },
    ],

    // Column text styles
    columnStyles: {
        titleColor: '#ffffff',
        titleFontSize: 'text-base',
        titleFontWeight: 'font-bold',
        titleAlign: 'text-left',
        titleMarginB: 'mb-5',
        linkColor: 'rgba(255, 255, 255, 0.80)',
        linkHoverColor: '#ffffff',
        linkFontSize: 'text-sm',
        linkSpacing: 'space-y-3',
    },

    // Mobile accordion styles
    accordionStyles: {
        buttonTextColor: '#ffffff',
        buttonFontWeight: 'font-semibold',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        paddingX: 'px-6',
        paddingY: 'py-4',
        listPaddingX: 'px-6',
        listPaddingB: 'pb-4',
        listSpacing: 'space-y-3',
        iconSize: 18,
    },

    // ── Newsletter ────────────────────────────────────────
    newsletter: {
        title: 'Stay Connected',
        description: 'Subscribe for eco-tips and exclusive member offers',
        placeholder: 'Your email address',
        buttonText: 'Subscribe',

        // Button colors
        buttonBg: '#6B9238',
        buttonHoverBg: '#C2DEA3',
        buttonTextColor: '#ffffff',
        buttonHoverTextColor: '#2D4A14',  // dark green for contrast on light hover bg

        // Input styles
        inputBorderColor: 'rgba(255, 255, 255, 0.25)',
        inputFocusBorder: '#ffffff',
        inputFontSize: 'text-sm',
        inputPadding: 'px-4 py-2.5',

        // Desktop text styles
        titleColor: '#ffffff',
        titleFontSize: 'text-base',
        titleFontWeight: 'font-bold',
        titleMarginB: 'mb-4',
        titleAlign: 'text-left',
        descColor: 'rgba(255, 255, 255, 0.75)',
        descFontSize: 'text-sm',
        descMarginB: 'mb-4',
        descAlign: 'text-left',

        // Mobile text styles
        mobileTitleSize: 'text-2xl',
        mobileTitleWeight: 'font-light',
        mobileTitleColor: '#ffffff',
        mobileTitleMarginB: 'mb-2',
        mobileDescColor: 'rgba(255, 255, 255, 0.75)',
        mobileDescFontSize: 'text-sm',
        mobileDescMarginB: 'mb-4',
        mobileAlign: 'text-left',
    },

    // ── Social Links ──────────────────────────────────────
    // icon options: "facebook" | "instagram" | "youtube" | "twitter" | "linkedin"
    socials: [
        { icon: 'facebook', href: '#' },
        { icon: 'twitter', href: '#' },
        { icon: 'instagram', href: '#' },
        { icon: 'linkedin', href: '#' },
        { icon: 'youtube', href: '#' },
    ],

    socialStyles: {
        iconColor: '#ffffff',
        iconHoverColor: '#ffffff',
        iconSize: 16,
        gap: 'gap-3',
        mobileMarginT: 'mb-0',
    },

    // ── Bottom Bar ────────────────────────────────────────
    bottomBar: {
        borderColor: 'rgba(255, 255, 255, 0.12)',
        paddingTop: 'pt-6',
        // "between" | "center" | "start" | "end"
        desktopJustify: 'center',
    },

    // ── Spacing ───────────────────────────────────────────
    spacing: {
        desktopPaddingX: 'px-8 xl:px-16 2xl:px-24',
        desktopPaddingY: 'py-14',
        mobilePaddingX: 'px-6',
        mobileSectionY: 'py-8',
        mobileBottomY: 'py-6',
        columnGap: 'gap-12 xl:gap-16 2xl:gap-20',
        sectionBottomGap: 'mb-10',
    },

};