import Image from 'next/image';
import Link from "next/link";

export const metadata = {
    title: "About Us | Groves Box",
    description:
        "Learn about Groves Box and our mission to bring the joy of plants into people's lives.",
};

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section - Split Screen */}
            <section className="grid lg:grid-cols-2 min-h-screen">

                {/* Left Side - Image */}
                <div className="relative h-[50vh] lg:h-auto lg:min-h-screen order-1 lg:order-1">
                    <div className="absolute inset-0">
                        {/* Replace with your actual image */}
                        <div className="relative w-full h-full flex items-center justify-center p-8 lg:p-16">
                            <div className="relative w-full h-full max-w-2xl">
                                <div className="absolute inset-0  rounded-3xl flex items-center justify-center">
                                    <svg className="w-32 h-32 text-green-600/20" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                                    </svg>
                                </div>

                                <Image
                                    src="/images/OST_pair_bw_terrazzo.webp"
                                    alt="Beautiful plants on a table"
                                    fill
                                    className="object-cover rounded-3xl"
                                    priority
                                />

                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Content */}
                <div className="flex items-center justify-center px-6 sm:px-8 lg:px-16 xl:px-24 py-16 lg:py-24 order-2 lg:order-2 bg-gradient-to-br from-gray-50 via-white to-gray-50">
                    <div className="max-w-xl">

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-[#2F4F3E] leading-tight mb-8">
                            We believe Plants Make People Happy
                            <sup className="text-2xl lg:text-3xl">®</sup>
                        </h1>

                        <div className="space-y-6 text-gray-700 text-base lg:text-lg leading-relaxed">
                            <p>
                                There's something about the simple act of being around and caring for plants that
                                boosts our spirits and transforms our spaces.
                            </p>

                            <p>
                                <a href="#" className="text-emerald-700 underline hover:text-emerald-800 transition-colors font-medium">
                                    Science even backs it up
                                </a>
                                : every exposure to greenery — from caring for houseplants
                                to digging in the garden — helps you slow down and feel more grounded.
                            </p>

                            <p>
                                That's why we've made it our mission to bring plants into more people's lives — and
                                over the last decade plus, we've helped thousands of plant parents get started (and
                                keep going).
                            </p>

                            <p>
                                Along with hundreds of plant varieties, we share free virtual workshops, care
                                resources, and approachable advice to help you grow.
                            </p>
                        </div>
                    </div>
                </div>

            </section>

            {/* Founder's Note Section */}
            <section className="py-20 lg:py-32 px-6 sm:px-8 lg:px-16 bg-gradient-to-b from-amber-50/30 via-white to-white">
                <div className="max-w-4xl mx-auto">

                    {/* Decorative Image */}
                    <div className="relative w-full h-64 lg:h-96 mb-16 rounded-3xl overflow-hidden shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-200/40 to-orange-300/40 flex items-center justify-center">
                            {/* Placeholder - Replace with your wooden furniture image */}
                            <svg className="w-24 h-24 text-amber-600/20" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                        </div>

                        <Image
                            src="/images/desktop2.png"
                            alt="Wooden furniture detail"
                            fill
                            className="object-cover"
                        />

                    </div>

                    {/* Founder's Note */}
                    <div className="prose prose-lg max-w-none">

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#2F4F3E] mb-12">
                            A Note from Our Founder
                        </h2>

                        <div className="space-y-6 text-gray-700 text-base lg:text-lg leading-relaxed">
                            <p>
                                I started{' '}
                                <a href="#" className="text-emerald-700 underline hover:text-emerald-800 transition-colors">
                                    The Sill
                                </a>{' '}
                                in 2012 at the age of 26 in borrowed office space in a tiny walk-up in New York City's Chinatown. The idea had sprouted years before{' '}
                                <span className="italic text-gray-600">(sorry, we love a good plant pun around here)</span>{' '}
                                when I found myself in my first adult apartment. Bleak is how you'd describe it. Homesick is how you'd describe me. My Mom,
                                an immigrant who stayed connected to her Filipino roots through gardening, recommended I get some houseplants.
                            </p>

                            <p>
                                I instantly became passionate about plants — and keenly aware of the impact being around plants had on me growing up. Little did I know that tapping into my
                                family's generational love of plants would grow into this small but mighty company.
                            </p>

                            <p>
                                That realization{' '}
                                <span className="italic text-gray-600">
                                    (plus a lot of dirt, sweat, and hustle from an incredible team)
                                </span>{' '}
                                is how{' '}
                                <a href="#" className="text-emerald-700 underline hover:text-emerald-800 transition-colors">
                                    The Sill
                                </a>{' '}
                                came to be.
                            </p>

                            <p className="text-2xl sm:text-3xl font-serif font-light text-gray-900 mt-12 mb-4">
                                Keep growing,
                            </p>

                            <p className="text-2xl sm:text-3xl font-serif font-light text-gray-900">
                                Eliza
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            {/* Optional CTA Section */}
            <section className="py-20 px-6 sm:px-8 lg:px-16 bg-[#F0F4F1] text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black mb-6 text-[#2F4F3E]">
                        Ready to start your plant journey?
                    </h2>

                    <p className="text-lg lg:text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
                        Explore our collection of beautiful plants and find the perfect green companion for your space.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/"
                            className="bg-[#244033] text-white  px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto inline-block text-center"
                        >
                            Shop Plants
                        </Link>

                    </div>
                </div>
            </section>

        </div>
    );
}