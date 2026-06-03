import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Heart, Truck, ShieldCheck } from 'lucide-react';

export const metadata = {
    title: 'About Us | Groves Box',
    description: "Learn about Groves Box and our mission to bring the joy of plants into people's lives.",
};

const values = [
    {
        icon: Leaf,
        title: 'Sustainably Sourced',
        desc: 'Every plant in our collection is ethically grown by trusted nurseries that share our love for the environment.',
    },
    {
        icon: Heart,
        title: 'Plant Parent Support',
        desc: 'From first-timers to seasoned growers, we provide guidance and care tips to help every plant thrive.',
    },
    {
        icon: Truck,
        title: 'Safe Delivery',
        desc: 'Your plants are packaged with breathable, eco-friendly materials and delivered with care to your doorstep.',
    },
    {
        icon: ShieldCheck,
        title: 'Quality Guarantee',
        desc: "We stand behind every plant we send. If your order arrives unhealthy, we'll make it right.",
    },
];

const stats = [
    { value: '10,000+', label: 'Plants Delivered' },
    { value: '5,000+', label: 'Happy Customers' },
    { value: '200+', label: 'Plant Varieties' },
    { value: '4.9★', label: 'Average Rating' },
];

export default function AboutUs() {
    return (
        <div className="bg-white">

            {/* ── HERO ────────────────────────────────────────────────────── */}
            <section className="relative w-full min-h-105 md:min-h-130 flex items-center overflow-hidden">
                <Image
                    src="/images/artificial-green-plant-pot-display-rack-sale.jpg"
                    alt="Groves Box plants"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20">
                    <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-[#C2DEA3] mb-4">
                        Our Story
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-2xl mb-6">
                        We Believe Plants Make People Happy
                    </h1>
                    <p className="text-lg text-white/80 max-w-xl leading-relaxed mb-8">
                        Groves Box started with a simple idea — that bringing a little greenery
                        into your space can change everything. We're here to make that easy for everyone.
                    </p>
                    <Link href="/collections" className="btn-primary">
                        Explore Our Plants
                    </Link>
                </div>
            </section>

            {/* ── STATS STRIP ─────────────────────────────────────────────── */}
            <section className="bg-[#6b9238]">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-white/30">
                        {stats.map(({ value, label }) => (
                            <div key={label} className="text-center px-4">
                                <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{value}</p>
                                <p className="text-sm text-white/80 font-medium">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── OUR STORY ───────────────────────────────────────────────── */}
            <section className="w-full px-5 sm:px-8 lg:px-12 py-16 md:py-24 bg-[#F5F7F2]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Image */}
                    <div className="relative rounded-2xl overflow-hidden aspect-4/3 shadow-xl">
                        <Image
                            src="/images/2148488544.jpg"
                            alt="Our nursery"
                            fill
                            className="object-cover"
                        />
                        {/* Floating badge */}
                        <div className="absolute bottom-5 left-5 bg-white rounded-xl px-4 py-3 shadow-lg">
                            <p className="text-xs text-gray-500 font-medium">Est.</p>
                            <p className="text-2xl font-bold text-[#6b9238]">2012</p>
                        </div>
                    </div>

                    {/* Text */}
                    <div>
                        <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#6b9238] mb-3">
                            Who We Are
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
                            A Community Built Around the Love of Plants
                        </h2>
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                Groves Box was founded in 2012 with a single mission: to make plants
                                accessible to everyone — from first-time plant parents to seasoned
                                green thumbs. What began as a small operation has grown into a trusted
                                destination for thousands of plant lovers across India.
                            </p>
                            <p>
                                Every plant in our collection is hand-picked from trusted nurseries,
                                carefully packaged, and delivered with the care it deserves. We don't
                                just sell plants — we help people build a greener, happier home.
                            </p>
                            <p>
                                Science backs it up too: being around plants reduces stress, boosts
                                mood, and transforms spaces. That's the simple belief that drives
                                everything we do at Groves Box.
                            </p>
                        </div>
                        <div className="mt-8 flex items-center gap-4">
                            <Link href="/contact-us" className="btn-primary">Get in Touch</Link>
                            <Link href="/products" className="btn-outline">Shop Plants</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── VALUES ──────────────────────────────────────────────────── */}
            <section className="w-full px-5 sm:px-8 lg:px-12 py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#6b9238] mb-3">
                            What We Stand For
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                            Our Core Values
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map(({ icon: Icon, title, desc }) => (
                            <div key={title}
                                className="group bg-[#F5F7F2] rounded-2xl p-6 hover:bg-[#6b9238] transition-colors duration-300">
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-5 shadow-sm group-hover:bg-white/20 transition-colors">
                                    <Icon className="w-6 h-6 text-[#6b9238] group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-white transition-colors">
                                    {title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-white/85 transition-colors">
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOUNDER'S NOTE ──────────────────────────────────────────── */}
            <section className="w-full px-5 sm:px-8 lg:px-12 py-16 md:py-24 bg-[#F5F7F2]">
                <div className="max-w-4xl mx-auto">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#6b9238] mb-3">
                        From the Founder
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10">
                        A Note from Our Founder
                    </h2>

                    <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100">
                        {/* Quote mark */}
                        <div className="text-[#6b9238] text-6xl font-serif leading-none mb-4 select-none">"</div>
                        <div className="space-y-4 text-gray-600 leading-relaxed text-base sm:text-lg mb-8">
                            <p>
                                I started Groves Box because I experienced firsthand how a single plant
                                can transform a space — and a mood. When I moved into my first apartment,
                                it felt cold and lifeless. My mother, who grew up gardening, suggested I
                                get some houseplants. Within weeks, everything changed.
                            </p>
                            <p>
                                That feeling — of calm, of connection, of being grounded — is what I
                                wanted everyone to have access to. Not just people with big gardens or
                                green thumbs. Everyone. That's why Groves Box exists.
                            </p>
                            <p>
                                We've come a long way since that first tiny office, but our mission
                                remains the same: to put a plant in every home and a smile on every
                                plant parent's face.
                            </p>
                        </div>

                        {/* Sign off */}
                        <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-[#6b9238] flex items-center justify-center text-white font-bold text-lg">
                                G
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Founder, Groves Box</p>
                                <p className="text-sm text-gray-500">Est. 2012 · Growing Together</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ──────────────────────────────────────────────── */}
            <section className="w-full px-5 sm:px-8 lg:px-12 py-16 md:py-20 bg-[#6b9238]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Ready to Start Your Plant Journey?
                    </h2>
                    <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                        Explore hundreds of beautiful plants and find your perfect green companion today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/collections"
                            className="inline-flex items-center gap-2 bg-white text-[#6b9238] font-semibold px-8 py-3.5 rounded-xl hover:bg-[#F5F7F2] transition-colors shadow-sm">
                            Shop All Plants
                        </Link>
                        <Link href="/contact-us"
                            className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
