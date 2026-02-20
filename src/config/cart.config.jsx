// ─────────────────────────────────────────────────────────────────────────────
// cartConfig.js  –  Central configuration for the Cart page
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. BRAND COLORS ───────────────────────────────────────────────────────────
export const colors = {
    primary: '#007B57',
    primaryHover: '#009A7B',
    primaryLight: '#F0F4F1',
    primaryDark: '#005C41',

    text: {
        heading: '#009A7B',
        body: '#374151',
        muted: '#6B7280',
        price: '#009A7B',
        danger: '#DC2626',
    },

    surface: {
        page: '#F0F4F1',
        card: '#FFFFFF',
        muted: '#F9FAFB',
    },

    border: {
        default: '#E5E7EB',
        focus: '#007B57',
    },

    badge: {
        bestSeller: { bg: '#1F2937', text: '#FFFFFF' },
        topRated: { bg: '#16A34A', text: '#FFFFFF' },
    },

    notice: {
        cold: {
            bg: '#EFF6FF',
            border: '#BFDBFE',
            title: '#1E3A5F',
            body: '#1E40AF',
            icon: '#2563EB',
        },
        freeShipping: {
            bg: '#F0FDF4',
            border: '#BBF7D0',
            text: '#166534',
        },
    },

    progressBar: {
        track: '#E5E7EB',
        fillFrom: '#007B57',
        fillTo: '#009A7B',
    },
};

// ── 2. TYPOGRAPHY ─────────────────────────────────────────────────────────────
export const typography = {
    fonts: {
        heading: "'Playfair Display', serif",
        body: "'Inter', sans-serif",
        price: "'Inter', sans-serif",
    },
    weights: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
};

// ── 3. LAYOUT ─────────────────────────────────────────────────────────────────
export const layout = {
    maxWidth: '80rem',
    cardRadius: '0.75rem',
    stickyTop: '2rem',
    grid: {
        left: 8,
        right: 4,
    },
};

// ── 4. SHIPPING RULES ─────────────────────────────────────────────────────────
export const shippingConfig = {
    freeShippingThreshold: 79,
    standardShippingCost: 15,
    coldWeatherSurcharge: 50,
    currency: '₹',
    currencyCode: 'INR',
};

// ── 5. PRODUCT RECOMMENDATIONS ────────────────────────────────────────────────
export const recommendationsConfig = {
    fetchCount: 8,
    displayCount: 4,
    badgeRules: {
        bestSeller: { maxPrice: 50 },
        topRated: { minRating: 4.8 },
    },
};

// ── 6. UI / INTERACTION ───────────────────────────────────────────────────────
export const ui = {
    transitions: {
        default: 'transition-all duration-200',
        scale: 'active:scale-[0.98]',
        groupImg: 'transition-transform duration-500 group-hover:scale-105',
        slideUp: 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300',
    },
    productGrid: {
        desktop: 4,
        mobile: 2,
    },
};

// ── 7. COPY / STRINGS ─────────────────────────────────────────────────────────
export const strings = {
    page: {
        title: 'Shopping Cart',
        backLabel: 'Continue Shopping',
        itemSingular: 'item',
        itemPlural: 'items',
    },
    empty: {
        heading: 'Your cart is empty',
        subtext: 'Add some plants to get started!',
        cta: 'Continue Shopping',
    },
    loading: 'Loading cart...',
    checkout: {
        proceed: 'Proceed to Checkout',
        loading: 'Loading Checkout…',
        security: 'Secure Shopify Checkout',
    },
    summary: {
        title: 'Order Summary',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        taxes: 'Taxes',
        taxesNote: 'Calculated at checkout',
        total: 'Total',
        totalNote: 'Final amount calculated at checkout',
        shippingFree: 'FREE',
        shippingProgress: (amount) => `Add ${amount} more for free shipping!`,
        freeShippingUnlocked: "You've qualified for free shipping!",
        freeShippingLabel: '₹79 Free Shipping',
    },
    coldWeather: {
        title: 'Cold Weather Protection',
        body: `A ₹50 surcharge applies for special packaging to protect your plants during cold weather transit.`,
    },
    recommendations: {
        title: 'You Might Also Like',
        subtitle: 'Complete your plant collection with these essentials',
        quickAdd: 'Quick Add',
        unavailable: 'This product is currently unavailable',
    },
};

// ── 8. ROUTES ─────────────────────────────────────────────────────────────────
export const routes = {
    products: '/products',
    productDetail: (handle) => `/products/${handle}`,
};

// ── 9. FEATURE FLAGS ──────────────────────────────────────────────────────────
export const features = {
    showColdWeatherNotice: true,
    showRecommendations: true,
    showWishlistOnCards: true,
    enableFreeShippingProgress: true,
};