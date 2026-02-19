// ============================================================
//  FOOTER CONFIG — src/config/footer.config.js
//  Change ANYTHING here → footer updates automatically
//  No need to touch Footer.jsx at all
// ============================================================

export const footerConfig = {

    // ── Section Background & Border ───────────────────────
    bg: "#F0F4F1",
    borderColor: "#E5E7EB",

    // ── Brand ─────────────────────────────────────────────
    brand: {
        name: "Groves Box",
        emoji: "🌿",
        description: "Bringing nature to your doorstep with premium plants and expert care guides.",
        copyright: "© 2026 Groves Box. All rights reserved.",

        // Text styles
        nameColor: "#1a1a1a",
        nameMobileColor: "#2F4F3E",
        nameFontSize: "text-2xl",
        nameFontWeight: "font-bold",
        descColor: "#4B5563",
        descFontSize: "text-sm",
        copyrightColor: "#6B7280",
        copyrightFontSize: "text-sm",
        copyrightMobileFontSize: "text-xs",
        emojiSize: "text-3xl",
    },

    // ── Navigation Columns ────────────────────────────────
    // Add / remove columns and links freely here
    columns: [
        {
            title: "Customer Service",
            links: [
                { label: "FAQ", href: "/faq" },
                { label: "Shipping & Returns", href: "/shipping" },
                { label: "Track Order", href: "/track-order" },
            ],
        },
        {
            title: "Company",
            links: [
                { label: "About Us", href: "/about-us" },
                { label: "Contact Us", href: "/contact-us" },
            ],
        },
        {
            title: "Legal",
            links: [
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms-service" },
                { label: "Refund Policy", href: "/refund-policy" },
            ],
        },
    ],

    // Column text styles
    columnStyles: {
        titleColor: "#111827",
        titleFontSize: "text-base",
        titleFontWeight: "font-semibold",
        titleAlign: "text-left",
        titleMarginB: "mb-4",
        linkColor: "#4B5563",
        linkHoverColor: "#111827",
        linkFontSize: "text-sm",
        linkSpacing: "space-y-2.5",
    },

    // Mobile accordion styles
    accordionStyles: {
        buttonTextColor: "#111827",
        buttonFontWeight: "font-medium",
        borderColor: "#E5E7EB",
        paddingX: "px-6",
        paddingY: "py-4",
        listPaddingX: "px-6",
        listPaddingB: "pb-4",
        listSpacing: "space-y-2.5",
        iconSize: 18,
    },

    // ── Newsletter ────────────────────────────────────────
    newsletter: {
        title: "Stay Connected",
        description: "Subscribe for updates and exclusive offers",
        placeholder: "Your email address",
        buttonText: "Subscribe",

        // Button colors
        buttonBg: "#007B57",
        buttonHoverBg: "#009A7B",
        buttonTextColor: "#ffffff",

        // Input styles
        inputBorderColor: "#D1D5DB",
        inputFocusBorder: "#111827",
        inputFontSize: "text-sm",
        inputPadding: "px-4 py-2.5",

        // Desktop text styles
        titleColor: "#111827",
        titleFontSize: "text-base",
        titleFontWeight: "font-semibold",
        titleMarginB: "mb-4",
        titleAlign: "text-left",
        descColor: "#4B5563",
        descFontSize: "text-sm",
        descMarginB: "mb-4",
        descAlign: "text-left",

        // Mobile text styles
        mobileTitleSize: "text-2xl",
        mobileTitleWeight: "font-light",
        mobileTitleColor: "#111827",
        mobileTitleMarginB: "mb-2",
        mobileDescColor: "#4B5563",
        mobileDescFontSize: "text-sm",
        mobileDescMarginB: "mb-4",
        mobileAlign: "text-left",
    },

    // ── Social Links ──────────────────────────────────────
    // icon options: "facebook" | "instagram" | "youtube" | "twitter"
    socials: [
        { icon: "facebook", href: "#" },
        { icon: "instagram", href: "#" },
        { icon: "youtube", href: "#" },
        { icon: "twitter", href: "#" },
    ],

    socialStyles: {
        iconColor: "#6B7280",
        iconHoverColor: "#111827",
        iconSize: 20,
        gap: "gap-4",
        mobileMarginT: "mb-0",
    },

    // ── Bottom Bar ────────────────────────────────────────
    bottomBar: {
        borderColor: "#E5E7EB",
        paddingTop: "pt-8",
        // "between" | "center" | "start" | "end"
        desktopJustify: "between",
    },

    // ── Spacing ───────────────────────────────────────────
    spacing: {
        desktopPaddingX: "px-8 xl:px-16 2xl:px-24",
        desktopPaddingY: "py-12",
        mobilePaddingX: "px-6",
        mobileSectionY: "py-8",
        mobileBottomY: "py-6",
        columnGap: "gap-12 xl:gap-16 2xl:gap-20",
        sectionBottomGap: "mb-12",
    },

};