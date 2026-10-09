// ============================================================
//  FOOTER CONFIG — src/config/Footer.config.js
//  Change ANYTHING here → footer updates automatically
//  No need to touch Footer.jsx at all
// ============================================================

export const footerConfig = {

    // ── Background Image & Border ──────────────────────────
    backgroundImage: null,   // No background image - clean white
    bg: '#ffffff',           // White background
    borderColor: '#e5e7eb',  // Light gray border

    // ── Brand ─────────────────────────────────────────────
    brand: {
        name: 'GrovesBox',
        emoji: '🌿',
        description:
            'Discover your perfect plant companion and transform your space into a thriving green sanctuary.',
        copyright: '© 2024 GrovesBox. All rights reserved',

        // Text styles
        nameColor: '#1a1a1a',
        nameMobileColor: '#1a1a1a',
        nameFontSize: 'text-2xl',
        nameFontWeight: 'font-bold',
        descColor: '#6b7280',
        descFontSize: 'text-sm',
        copyrightColor: '#6b7280',
        copyrightFontSize: 'text-sm',
        copyrightMobileFontSize: 'text-xs',
        emojiSize: 'text-2xl',
    },

    // ── Navigation Columns ────────────────────────────────
    columns: [
        {
            title: 'Shop',
            links: [
                { label: 'All Products', href: '/products' },
                { label: 'Collections', href: '/collections' },
                { label: 'Wishlist', href: '/wishlist' },
                { label: 'Track Order', href: '/track-order' },
            ],
        },
        {
            title: 'Company',
            links: [
                { label: 'About Us', href: '/about-us' },
                { label: 'Contact Us', href: '/contact-us' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Account', href: '/account' },
            ],
        },
        {
            title: 'Policies',
            links: [
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms of Service', href: '/terms-service' },
                { label: 'Refund Policy', href: '/refund-policy' },
                { label: 'Shipping Policy', href: '/shipping' },
            ],
        },
    ],

    // Column text styles
    columnStyles: {
        titleColor: '#1a1a1a',
        titleFontSize: 'text-base',
        titleFontWeight: 'font-bold',
        titleAlign: 'text-left',
        titleMarginB: 'mb-5',
        linkColor: '#6b7280',
        linkHoverColor: '#2d5a3d',
        linkFontSize: 'text-sm',
        linkSpacing: 'space-y-3',
    },

    // Mobile accordion styles
    accordionStyles: {
        buttonTextColor: '#1a1a1a',
        buttonFontWeight: 'font-semibold',
        borderColor: '#e5e7eb',
        paddingX: 'px-6',
        paddingY: 'py-4',
        listPaddingX: 'px-6',
        listPaddingB: 'pb-4',
        listSpacing: 'space-y-3',
        iconSize: 18,
    },

    // ── Newsletter ────────────────────────────────────────
    newsletter: {
        title: 'Stay Connected With Us',
        description: 'Subscribe to our newsletter for plant care tips and exclusive offers.',
        placeholder: 'Enter your email',
        buttonText: 'Subscribe',

        // Button colors
        buttonBg: '#2d5a3d',
        buttonHoverBg: '#1f4028',
        buttonTextColor: '#ffffff',
        buttonHoverTextColor: '#ffffff',

        // Input styles
        inputBorderColor: '#e5e7eb',
        inputFocusBorder: '#2d5a3d',
        inputFontSize: 'text-sm',
        inputPadding: 'px-4 py-2.5',

        // Desktop text styles
        titleColor: '#1a1a1a',
        titleFontSize: 'text-base',
        titleFontWeight: 'font-bold',
        titleMarginB: 'mb-4',
        titleAlign: 'text-left',
        descColor: '#6b7280',
        descFontSize: 'text-sm',
        descMarginB: 'mb-4',
        descAlign: 'text-left',

        // Mobile text styles
        mobileTitleSize: 'text-2xl',
        mobileTitleWeight: 'font-bold',
        mobileTitleColor: '#1a1a1a',
        mobileTitleMarginB: 'mb-2',
        mobileDescColor: '#6b7280',
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
        iconColor: '#6b7280',
        iconHoverColor: '#2d5a3d',
        iconSize: 18,
        gap: 'gap-4',
        mobileMarginT: 'mb-0',
    },

    // ── Bottom Bar ────────────────────────────────────────
    bottomBar: {
        borderColor: '#e5e7eb',
        paddingTop: 'pt-6',
        // "between" | "center" | "start" | "end"
        desktopJustify: 'between',
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