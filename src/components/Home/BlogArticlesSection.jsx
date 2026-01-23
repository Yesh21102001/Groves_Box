import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function BlogArticlesSection() {
    const articles = [
        {
            id: 1,
            category: 'Ask The Sill',
            title: 'The Best Gifts for Every Love Language',
            link: '#'
        },
        {
            id: 2,
            category: 'Ask The Sill',
            title: 'Galentine\'s Day Plant Party Guide',
            link: '#'
        },
        {
            id: 3,
            category: 'Ask The Sill',
            title: 'The Sill 2025 Plant Trend Report & 2026 Predictions',
            link: '#'
        }
    ];

    return (
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Column - Image */}
                    <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg order-2 lg:order-1">
                        <Image
                            src="/images/3bce5e6c49f8ff31bcc4c692fd30770e65ce34ad-2923x2922.avif" // Update with your image path
                            alt="Plant display with Monstera and ZZ plants"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                        />
                    </div>

                    {/* Right Column - Articles */}
                    <div className="space-y-8 sm:space-y-10 lg:space-y-12 order-1 lg:order-2">
                        {articles.map((article, index) => (
                            <article key={article.id} className="group">
                                {/* Category */}
                                <p className="text-emerald-600 text-sm sm:text-base font-medium mb-2 sm:mb-3 italic">
                                    {article.category}
                                </p>

                                {/* Title */}
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-900 mb-3 sm:mb-4 group-hover:text-emerald-600 transition-colors">
                                    {article.title}
                                </h3>

                                {/* Read More Link */}
                                <a
                                    href={article.link}
                                    className="inline-flex items-center gap-2 text-gray-900 hover:text-emerald-600 transition-colors text-sm sm:text-base font-medium group/link"
                                >
                                    Read More
                                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                </a>

                                {/* Divider - except for last item */}
                                {index < articles.length - 1 && (
                                    <div className="mt-8 sm:mt-10 lg:mt-12 border-t border-gray-200"></div>
                                )}
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}