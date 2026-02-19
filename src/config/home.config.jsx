// ============================================================
//  HOME PAGE CONFIG — src/config/home.config.js
//  Change anything here → home page updates automatically
// ============================================================

export const homeConfig = {

    // ── Hero Section ───────────────────────────────────────
    hero: {
        heading: "Quality Stuff",
        subheading: "Why stop at one? Buy more, save more – sitewide.",
        primaryButton: { text: "Shop New Arrivals", href: "/collections/indoor-trees" },
        secondaryButton: { text: "Shop All", href: "/products" },
        bgColor: "#007B57",
        autoPlayInterval: 3500,   // ms between hero slides
    },

    // ── Features Strip ─────────────────────────────────────
    features: {
        bgColor: "#F0F4F1",
        items: [
            {
                icon: "GraduationCap",
                title: "Expert Guidance",
                description: "Success starts with choosing the right plants. We'll make sure you do.",
            },
            {
                icon: "Users",
                title: "Connect & Grow",
                description: "Community is everything. Our workshops and events help you learn and connect.",
            },
            {
                icon: "Shield",
                title: "Judgement-Free Service",
                description: "Our dedicated team is always available to assist — no question too small or too silly!",
            },
        ],
    },

    // ── Best Sellers Section ───────────────────────────────
    bestSellers: {
        title: "Our Most Popular Plants",
        viewAllText: "View All",
        viewAllHref: "/products?filter=bestseller",
        collectionHandle: "best-sellers",
        limit: 4,
    },

    // ── Help / Contact Section ─────────────────────────────
    help: {
        label: "Speak to a Plant Specialist",
        title: "Need Help?",
        subtitle: "Your confidence is our priority. Unsure what plants will work with your light? New to gardening outdoors and need some advice? Reach out, we're here to help.",
        bgColor: "#F0F4F1",
        channels: [
            { icon: "MessageSquare", title: "Chat", description: "DM with a plant care expert" },
            { icon: "Phone", title: "Call", description: "Speak live to a plant care expert" },
            { icon: "Mail", title: "Email", description: "Send a note to info@grovesbox.com" },
        ],
    },

    // ── Categories Section ─────────────────────────────────
    categories: {
        title: "Plants For Everyone",
        viewAllText: "View All",
        viewAllHref: "/collections",
        limit: 8,
    },

    // ── New Arrivals Section ───────────────────────────────
    newArrivals: {
        title: "New Arrivals",
        viewAllText: "View All",
        viewAllHref: "/products?filter=new",
        limit: 4,
    },

    // ── On Sale Section ────────────────────────────────────
    onSale: {
        title: "On Sale",
        viewAllText: "View All",
        viewAllHref: "/products?filter=sale",
        collectionHandle: "on-sale",
        limit: 4,
    },

    // ── Workshops / Blog Section ───────────────────────────
    workshops: {
        title: "Plant Care & Workshops",
        subtitle: "Empowering all people to be plant people. Welcome to Plant Parenthood®.",
        bgColor: "#F0F4F1",
        dataFile: "/data/workshops.json",
    },

    // ── Testimonials Section ───────────────────────────────
    testimonials: {
        title: "What Our",
        titleHighlight: "Customers Are Saying",   // rendered in brand green
        subtitle: "Real reviews from real plant lovers who brought nature home.",
        bgColor: "#F0F4F1",
        autoPlayInterval: 4200,   // ms between auto-slides

        // Change name, role, rating (1-5), text, avatar, social here
        // social options: "instagram" | "facebook" | "twitter"
        items: [
            {
                id: 1,
                name: "Frank Klin",
                role: "Designer",
                rating: 4,
                text: "The plants arrived in perfect condition and the packaging was eco-friendly. My Monstera has been thriving for 3 months!",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                social: "instagram",
            },
            {
                id: 2,
                name: "Linda Anand",
                role: "Doctor",
                rating: 5,
                text: "Absolutely love the quality of plants. The team helped me choose the right plant for low-light conditions. Highly recommend!",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                social: "facebook",
            },
            {
                id: 3,
                name: "David Gueta",
                role: "Artist",
                rating: 5,
                text: "Ordered a rare Philodendron and it exceeded all expectations. Will definitely be a repeat customer.",
                avatar: "https://randomuser.me/api/portraits/men/65.jpg",
                social: "twitter",
            },
            {
                id: 4,
                name: "Soda Lanna",
                role: "Designer",
                rating: 3,
                text: "Good variety of plants and reasonable prices. Delivery was a bit delayed but customer support was very responsive.",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg",
                social: "facebook",
            },
            {
                id: 5,
                name: "Zoom Chat",
                role: "Developer",
                rating: 4,
                text: "Got the ZZ plant for my office — zero maintenance and looks stunning. Everyone keeps asking where I bought it.",
                avatar: "https://randomuser.me/api/portraits/men/11.jpg",
                social: "facebook",
            },
            {
                id: 6,
                name: "Aria Wells",
                role: "Entrepreneur",
                rating: 5,
                text: "Groves Box has the best plant selection I have found online. The care tips included with each plant are a game-changer.",
                avatar: "https://randomuser.me/api/portraits/women/22.jpg",
                social: "twitter",
            },
        ],
    },

    // ── Badge Styles ───────────────────────────────────────
    badges: {
        "On Sale": { bg: "bg-red-500", icon: "🏷️" },
        "New Arrival": { bg: "bg-[#2BBFA4]", icon: "✨" },
        "Best Seller": { bg: "bg-[#244033]", icon: "⭐" },
        "Rare Plant": { bg: "bg-purple-600", icon: "🌿" },
    },

};