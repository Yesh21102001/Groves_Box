// ─────────────────────────────────────────────────────────────────────────────
// aboutConfig.js  –  Central configuration for the About Us page
// Every visual, textual, and structural decision lives here.
// ─────────────────────────────────────────────────────────────────────────────


// ── 1. COLORS ─────────────────────────────────────────────────────────────────
export const colors = {
    // Brand
    primary: '#2F4F3E',     // dark forest green – headings, CTA bg
    primaryDark: '#244033',     // deeper green – shop button bg
    accent: '#007B57',     // emerald links
    accentHover: '#065f46',     // emerald link hover

    // Page backgrounds
    page: '#FFFFFF',     // overall page bg
    heroRight: '#F9FAFB',     // gradient base for right panel (from)
    heroRightVia: '#FFFFFF',     // gradient via
    founderBg: '#FFFBF5',     // warm amber tint for founder section bg (from)
    founderBgVia: '#FFFFFF',     // via / to
    ctaBg: '#F0F4F1',     // CTA section background

    // Text
    text: {
        heading: '#2F4F3E',     // section headings
        body: '#374151',     // gray-700 body paragraphs
        muted: '#6B7280',     // gray-500 italic / helper copy
        light: '#FFFFFF',     // white text on dark bg
        ctaHeading: '#2F4F3E',     // CTA heading
        ctaBody: '#374151',     // CTA sub-text
    },

    // Image placeholders (shown while real images load)
    placeholder: {
        hero: '#D1FAE5',     // green tint
        founder: '#FDE68A',     // amber tint
    },

    // CTA button
    button: {
        bg: '#244033',
        text: '#FFFFFF',
        hoverShadow: 'rgba(36,64,51,0.3)',
    },
};


// ── 2. TYPOGRAPHY ─────────────────────────────────────────────────────────────
export const typography = {
    fonts: {
        heading: "'Playfair Display', serif",   // all h1/h2 serif headings
        body: "'Inter', sans-serif",          // paragraphs, links, buttons
    },

    sizes: {
        heroHeading: { base: '2.25rem', sm: '3rem', lg: '3.75rem' }, // text-4xl → text-6xl
        sectionHeading: { base: '1.875rem', sm: '2.25rem', lg: '3rem' }, // text-3xl → text-5xl
        body: { base: '1rem', lg: '1.125rem' },              // text-base → text-lg
        founderSign: { base: '1.5rem', sm: '1.875rem' },              // text-2xl → text-3xl
        ctaHeading: { base: '1.875rem', sm: '2.25rem', lg: '3rem' },
        ctaBody: { base: '1.125rem', lg: '1.25rem' },
        superscript: { base: '1.5rem', lg: '1.875rem' },
    },

    weights: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        black: 900,
    },

    lineHeight: {
        tight: 1.25,
        relaxed: 1.75,
    },
};


// ── 3. LAYOUT & SPACING ───────────────────────────────────────────────────────
export const layout = {
    maxWidth: {
        content: '56rem',   // max-w-4xl – founder + CTA sections
        heroText: '36rem',   // max-w-xl  – hero right panel text
    },

    hero: {
        // Controls the image/content split
        imageColSpan: 1,   // lg grid column count for image (out of 2)
        contentColSpan: 1,
        minHeight: '100vh',
        imageHeightMobile: '50vh',
        imageOrder: { mobile: 1, desktop: 1 },
        contentOrder: { mobile: 2, desktop: 2 },
        // Content alignment inside the right panel
        contentAlign: 'center',   // 'left' | 'center' | 'right'
        contentPadding: {
            x: { base: '1.5rem', sm: '2rem', lg: '4rem', xl: '6rem' },
            y: { base: '4rem', lg: '6rem' },
        },
    },

    founder: {
        padding: { y: { base: '5rem', lg: '8rem' }, x: { base: '1.5rem', sm: '2rem', lg: '4rem' } },
        imageHeight: { base: '16rem', lg: '24rem' },
        imageRadius: '1.5rem',
        imageMarginBottom: '4rem',
        imageShadow: '0 20px 40px rgba(0,0,0,0.15)',
    },

    cta: {
        padding: { y: '5rem', x: { base: '1.5rem', sm: '2rem', lg: '4rem' } },
        textAlign: 'center',   // 'left' | 'center' | 'right'
        buttonLayout: 'row',      // 'row' | 'column'
        maxWidth: '56rem',
    },

    borderRadius: {
        image: '1.5rem',    // rounded-3xl on all images
        button: '0.5rem',    // rounded-lg on buttons
    },
};


// ── 4. IMAGES ─────────────────────────────────────────────────────────────────
export const images = {
    hero: {
        src: '/images/OST_pair_bw_terrazzo.webp',
        alt: 'Beautiful plants on a table',
        priority: true,
        objectFit: 'cover',
    },
    founder: {
        src: '/images/desktop2.png',
        alt: 'Wooden furniture detail',
        priority: false,
        objectFit: 'cover',
    },
};


// ── 5. SEO / METADATA ─────────────────────────────────────────────────────────
export const meta = {
    title: 'About Us | Groves Box',
    description: "Learn about Groves Box and our mission to bring the joy of plants into people's lives.",
};


// ── 6. HERO SECTION CONTENT ───────────────────────────────────────────────────
export const heroContent = {
    heading: 'We believe Plants Make People Happy',
    showTrademark: true,   // toggle the ® superscript

    paragraphs: [
        `There's something about the simple act of being around and caring for plants that boosts our spirits and transforms our spaces.`,

        {
            // Paragraph with an inline link
            before: '',
            linkText: 'Science even backs it up',
            linkHref: '#',
            after: ': every exposure to greenery — from caring for houseplants to digging in the garden — helps you slow down and feel more grounded.',
        },

        `That's why we've made it our mission to bring plants into more people's lives — and over the last decade plus, we've helped thousands of plant parents get started (and keep going).`,

        `Along with hundreds of plant varieties, we share free virtual workshops, care resources, and approachable advice to help you grow.`,
    ],
};


// ── 7. FOUNDER'S NOTE SECTION ─────────────────────────────────────────────────
export const founderContent = {
    sectionHeading: "A Note from Our Founder",

    paragraphs: [
        {
            parts: [
                { type: 'text', value: 'I started ' },
                { type: 'link', value: 'Groves Box', href: '#' },
                { type: 'text', value: ' in 2012 at the age of 26 in borrowed office space in a tiny walk-up in New York City\'s Chinatown. The idea had sprouted years before ' },
                { type: 'italic', value: '(sorry, we love a good plant pun around here)' },
                { type: 'text', value: ' when I found myself in my first adult apartment. Bleak is how you\'d describe it. Homesick is how you\'d describe me. My Mom, an immigrant who stayed connected to her Filipino roots through gardening, recommended I get some houseplants.' },
            ],
        },
        {
            parts: [
                { type: 'text', value: "I instantly became passionate about plants — and keenly aware of the impact being around plants had on me growing up. Little did I know that tapping into my family's generational love of plants would grow into this small but mighty company." },
            ],
        },
        {
            parts: [
                { type: 'text', value: 'That realization ' },
                { type: 'italic', value: '(plus a lot of dirt, sweat, and hustle from an incredible team)' },
                { type: 'text', value: ' is how ' },
                { type: 'link', value: 'The Sill', href: '#' },
                { type: 'text', value: ' came to be.' },
            ],
        },
    ],

    signOff: {
        line1: '',
        line2: ''         // founder name
    },
};


// ── 8. CTA SECTION ────────────────────────────────────────────────────────────
export const ctaContent = {
    heading: 'Ready to start your plant journey?',
    subtext: 'Explore our collection of beautiful plants and find the perfect green companion for your space.',

    buttons: [
        {
            label: 'Shop Plants',
            href: '/',
            style: 'primary',    // 'primary' | 'outline'
        },
        // Add more buttons here, e.g.:
        // { label: 'Learn More', href: '/about', style: 'outline' },
    ],
};


// ── 9. FEATURE FLAGS ──────────────────────────────────────────────────────────
export const features = {
    showHeroSection: true,
    showFounderNote: true,
    showCtaSection: true,
    showTrademark: true,   // ® on hero heading
    heroImageOnLeft: true,   // false = image on right
};


// ── 10. ANIMATION / TRANSITIONS ───────────────────────────────────────────────
export const transitions = {
    link: 'transition-colors duration-200',
    button: 'transition-all duration-300',
    buttonHover: 'hover:-translate-y-0.5 hover:shadow-lg',
    imageScale: 'transition-transform duration-500 group-hover:scale-105',
};