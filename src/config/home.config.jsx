// ============================================================
//  HOME PAGE CONFIG — src/config/home.config.js
//  Change anything here → home page updates automatically
// ============================================================

export const homeConfig = {

    // ── Hero Section ───────────────────────────────────────
    hero: {
        heading: "Quality Stuff",
        subheading: "Why stop at one? Buy more, save more – sitewide.",
        primaryButton: { text: "Shop Collections", href: "/collections" },
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
                avatar: "data:image/jpeg;base64,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",
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
            {
                id: 7,
                name: "Frank Klin",
                role: "Designer",
                rating: 4,
                text: "The plants arrived in perfect condition and the packaging was eco-friendly. My Monstera has been thriving for 3 months!",
                avatar: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQA5QMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABQYBBAcDAgj/xAA7EAABAwMCBAMGBAMIAwAAAAABAAIDBAUREiEGEzFBB1FxFCJCgZGxMmGhwYPR8BUjJFJyouHxMzVi/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAIDBAEF/8QAIhEBAQACAgICAgMAAAAAAAAAAAECEQMhMUESMhMiBFFh/9oADAMBAAIRAxEAPwDuKIiAiIgIiICIiAiIgIiICwsrwrKmKlgfNO9rI2DLnOOAFy3U2SberntZ+JwHqUDgRsQVzC++Ilnpap2qd9VKOkUTcho8l427xXp4wDNa6sQO6P1Nx98qqctt8dLrxan+urLKrlj4ztF4eyOGR0Ur/wALZBjUfIHorFlWTKZeFVxs8soiKTgiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIMErkfibxG6Q1bGH/D0buWxh6PlzjJ9P2XWyvztxpHKbhWUEmWy+3yvIxnPvEj75VHNb1F/BN2vDhzhSsujBUPqhC6Q5zoz1Vqt/hnSsfzK+vnnA3wxob+u6+7Za5qiOKJj2x4DQ+NxOQO+Md1OQ0slVQtpnVznPhmLSZCTrA7Ed1nuda5hFRgtrrPf56CN7zTtaJYHOO4B3+67fQOe+jgfL+N0bS71wqVS8OmtvNNMWjkxRaZHAYBwTgD6q9sADcAYxtgK3gl3azfyMp1H0iItTMIiICIiAiIgIiICIiAiIgIiICIiAiIgIsFNkGUXlUTRwQPllcGsYMklc5qvFaCkqXsnoWBnvctpmw8489seSDpaqnFvBFu4ikbUmSSkrmDDZ4gDn/U07FeVg4/tN0pedUa6Nw2PM3Y4/8Ay4dfoFr8U8WPdbOZwzUMkma4OfJpyA0dW4PchRy1rdSw+Vv6q+0ttt2kppZC4xHll4HxAdx+eApC1W2aHU/ELS9xLiyI5OfVyqQdV11RLVzua6aZ2p+BjfyI7K3Wouo4TV1T3mOBuvTny3WDXb0ZlccV6tUHIoo2OB1dSD2yt1adHcKOrDPZ6iJ7nsDw0PBOCMg4W5lb8ZJOnm5W29iIik4IiICIiAiIgIiICIiAiIgIiICIiAiIgpfiLxJNY/7OgppuVJUzDLgATgHp6ErDeJqhp3nB9WhanifZKi51FDU09NNUcgHDY25w7OQVQZ6e9wk8yiqx/CcuJSLpxhf6yu4eqYqOaJkwGoDT+PHwn1/ZcqsdA++P5l3mEMLtRYREHSyY8s7AbYyV7XC6VjHR07myMklfpAc3GM/9q10VlfSAvDmv0PDD2JOMkA+Q2A9FDPLUWceMyqBuMdHRCOCiD20roSQwyFx1Ajcn889Bss2643Chp5GW2cR+0NAc5zQ5zTnYtz0O53wo69z08c0DIXD3YTry7uXnY+XRb1j9mMT31r2tawDAc/G+/RMd3Dt3KYzl1PCz+HtFSz1VRy9TaiSMPnie4n3h8Yz/AJgcq8ikJjdCYjpcCCMea0OGLNS0lZHU0r3ObLS77gg9MforTgE48uhULxfLup/l14cQulLVWp1Vb5BKf7KkYIqpjsERPAOnI32Lvkrz4WcR1FRLPa7hVSTlrdUD5nan9d26u/UYWld7Wa291h5wbDcHzU8mBvqDcD9QFUOFJ5Ka76y7Q9kTtRb8Jb/yCrMeoq5Ju9P0KOiysNOW5WVNUIiICIiAiIgIiICIiAiIgIiICIiAiIgYXnI9sbC57msa0blxwAvRQ3F9pN84drrc2Qxvmj9xw7OG4+yCkeMNZSS0toeypikEcz5eW1wcXDTgH0yqeyvrqTh2ll5jtUkofpduNznCiWVFK60w0s4aSJHCN7u7dyMY7Zc5WO+U9G22R08U4ayGAT9Q4Dtv9FVnb6aeLHH2546pYLnWTODc+9gEHGSc/ut2nq/aaOZsjv7xsTdseQ0hQscfPlONTi4kgefdWWgmitdxrLc9hkL52R6mgHOCM/LqpWXWkcbPla6rwWyWJ8bnhvLigjDS07nI3yFdDgEOHQqDsstLV0kzqUbAtYSG6T/WymYXa4dL+rchJv2hlq1y3imaqFVUcuR/Lgu7yR02O4VWsdRSw3Z8tWA6N4fGcjONWcevcK+iOiqaziOnrpBqjqzIGufp2GCNvkqDY7bHWcSxU0WSwXGN38PUSfl0XO+9p2TrT9JRjDAPLyX0sBZVigREQEREBERAREQEREBERAREQEREBERAUbxHWyW6w19ZDG2SWGFzmMJwHO7D6qSVF8Zqual4GqeSS3myxxvIOCGlyDjbrfMLlFTVNPOxkPu5EZ2A74x/WVrcUThk7WxyAl9K2PI6dSpyzG413ERbVuDubHiWKaQiNpIBwB2ORnAUXx3bhQXEc4iQuedLveJxjucYP1yqpNe2m5dXUfXhpbRcq6tL3tDoKfIy3I97IP2W1crdUw8UQTvi1tfK17i3fJyongupkgrazkPLDLAWjScZ3U5Hda8XhuqNkz4YXEB22SPM+pXL3n0njvHj8OrcE00VLZjojLBLM55YfX+eVOt92cjs8ZyouwSvls1LM9rWvkjDnBpyMndSMjjpBb8O4Vk8M97rml8hFN4kVDZDpZXU7XjB76cfsvKysdbrvbqengZrqaqN2p2dWkHBx+Xulb3HM7KDjew1rm6mY0O26g7fchaFVdw2rtFx9lY7lzujLnEksw/Ix65P0ULtbjrTto6LKwFlWswiIgIiICIiAiIgIiICIiAiIgIiICIiAqn4oWyS7cFXGCCMySxgTMYOri052+WVbFjCD87Q1s9LFQthga6thP8Ai9wXbO2J377b7qT4/mra7hp9VURQuijLdmklwy4b9Fa/FShobZHbblS2+ATzVZp5XsbpJY5jnEnHXGjuqtXVMR4buVLUjLXwODXDoSRt+yz8m8co18dmWNU7hJ9vjvNMyQhsb4zqLsjBwrzb7EH1stVTzhzSNLO+xyevyC5hR6aSppiX5k5oB07gA9l1Xha3Okkt7A9+BO6bTqIx1B26dMhTyxm9o455fHUX22jRRsiAI0ADcLbYQWg9+hC1IQYg7G4J6L1idiVw/wA3vBTVWqD4sxOigttW3GIptJPl3H2WpU0VU3hZ80LDJKJuYIogXHdx+uxVi8TomS8KVJdgAFrs46Ht+qqdou9RQ2OG8yOMwpX6204k0B5BxjODj6KGXlZhdR3SnLjCwv8AxFoz6r0UNwxxDR8R0Aq6HOkYDwd9Li0EgHvjKmVaziIiAiIgIiICIiAiIgIiICIiAiIgIiICIiDn3i9PJDaqANibo57iZ3uGIjoIG3U5BPTyXJ7JM242w0FS9wbE/S8dSY+38vouheMWKK9cP3a5U7qmyRGSGrYM4ZqI326Egf7cLR4i4DisFVSXGxvqX0VVKI5WSYPJa7GnfrjOOu47lQzm4t4rquc3620NHdHx0AmhYzD4uY7UQRg4K69Y7jTRww1FWG0/92Pf31Bx3cHdttgqhPbNdQKqZjTKwBm2422BHmrZSRtgpImNjdK74nZwM+ipvIvuH9LPTyR1EQkglbKx3R0ZyEPZ3dpVaFNTaxJHTiKUfHGSw/p1XtJX1FOwtFVI54GcOOoD67rs5p7QvFfSau1I242yppH6CyaIsLHM1dvJc64JZbYNVsvkLKmEzgGGZoPvDb8J/MAqzmuuT8uMuWH4AMDH3VHqaGO38Yw1Zjd7FM7mygD/AMR7k/lnBz+ZT8kypMLjHceHrJQ2CgNHbouXCZHyYwOrjk9AFJr5jOpgPmMr6WhmEREBERAREQEREBERAREQEREBERAREQEREHhU0sNXA+CqiZLE8Ycx7dTT6grwu7/Z7VVyHGGROIHyW8oji1/L4erDnBLQB8yFHLw7j5ckgY6pfvO5jdRc1v5nupuhDmR8vWX79cqLpctfjG/QlSkOojA+Q7lYb5b3tUVbKdmnUNfkVFzVToqsBrgQRlzvNb1S6GKnMk4bo+Jrmb/M9lAU0ENXmZ87oNW7QdsD1XDSyQPmmAcySJw8ip3heijq6upNVTh2ITGQ4ZBa7qP0VSitUrAH0tU+QefMarxwQQ6KoOAJDp5gBzv0z81ZxT9or5esVkpIfZ6dkOt7wwaQ55ySO2T39V7Ii2sYiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgKC40/8ARvHYyNB+qIocn1qeH2jmlP70uD0OVJx7tblEWJtrQ4gz7G8Bzg3UMtzs71UfQTviZpbgtHYjKwi47FhpoY3MbKG6HY30bAq5cIMDYqkjOS5u5+aIreH7qeb6LEiItjIIiICIiAiIgIiICIiD/9k=",
                social: "instagram",
            },
            {
                id: 8,
                name: "Linda Anand",
                role: "Doctor",
                rating: 5,
                text: "Absolutely love the quality of plants. The team helped me choose the right plant for low-light conditions. Highly recommend!",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                social: "facebook",
            },
            {
                id: 9,
                name: "David Gueta",
                role: "Artist",
                rating: 5,
                text: "Ordered a rare Philodendron and it exceeded all expectations. Will definitely be a repeat customer.",
                avatar: "https://randomuser.me/api/portraits/men/65.jpg",
                social: "twitter",
            },
            {
                id: 10,
                name: "Soda Lanna",
                role: "Designer",
                rating: 3,
                text: "Good variety of plants and reasonable prices. Delivery was a bit delayed but customer support was very responsive.",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg",
                social: "facebook",
            },
            {
                id: 11,
                name: "Zoom Chat",
                role: "Developer",
                rating: 4,
                text: "Got the ZZ plant for my office — zero maintenance and looks stunning. Everyone keeps asking where I bought it.",
                avatar: "https://randomuser.me/api/portraits/men/11.jpg",
                social: "facebook",
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