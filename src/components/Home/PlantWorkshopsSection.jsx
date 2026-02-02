import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function PlantWorkshopsSection() {
    const workshops = [
        {
            id: 1,
            date: 'February 4',
            image: '/images/B_W_5.webp',
            tag: 'FREE',
            title: 'Diagnosing Plant Problems',
            description: 'Learn how to properly diagnose your plants symptoms early and provide the right care when it matters most!'
        },
        {
            id: 2,
            date: 'February 11',
            image: '/images/White_arch.webp',
            tag: 'FREE',
            title: 'The Complete Hoya Care Guide',
            description: 'Master the art of Hoya care! Learn essential tips on light, water, and soil to help your Hoyas thrive and bloom in this hands-on workshop.'
        },
        {
            id: 3,
            date: 'February 18',
            image: '/images/Pink_1.webp',
            tag: 'FREE',
            title: 'Ask An Expert: Mastering Natural Light & Growing Light Basics',
            description: 'Join our Lighting AMA! We\'ll start with a lighting crash course, then answer all your specific plant lighting questions.'
        }
    ];

    return (
        <div className="relative bg-gray-50 -mt-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">

            <div className="container-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 lg:py-16 xl:py-20 2xl:py-24">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans text-gray-900 mb-3 sm:mb-4">
                            Plant Care & Workshops
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                            Empowering all people to be plant people. Welcome to Plant Parenthood®.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 sm:gap-6">
                        <a
                            href="#"
                            className="flex items-center gap-2 text-gray-900 hover:text-emerald-600 transition-colors text-sm sm:text-base font-medium group"
                        >
                            View All Workshops
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href="#"
                            className="flex items-center gap-2 text-gray-900 hover:text-emerald-600 transition-colors text-sm sm:text-base font-medium group"
                        >
                            Visit Our Blog
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>

                {/* Workshop Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {workshops.map((workshop) => (
                        <div
                            key={workshop.id}
                            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
                                <Image
                                    src={workshop.image}
                                    alt={workshop.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                                {/* Date Badge */}
                                <div className="absolute top-4 left-4 bg-emerald-400 text-white px-3 py-1.5 rounded text-sm font-medium z-10">
                                    {workshop.date}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6">
                                <span className="text-xs font-semibold text-emerald-600 mb-2 block">
                                    {workshop.tag}
                                </span>
                                <h3 className="text-xl sm:text-2xl font-sans text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                                    {workshop.title}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    {workshop.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}