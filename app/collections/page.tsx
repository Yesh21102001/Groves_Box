'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { ChevronRight, Star } from 'lucide-react';
import { products } from '@/src/data/products';

export default function CollectionsPage() {
    const collections = [

        {
            id: 'new-arrivals',
            name: 'New Arrivals',
            description: 'Fresh plants just added to our collection',
            image: '/images/White_arch.webp',
            link: '/collections/new-arrivals'
        },
        {
            id: 'large-plants',
            name: 'Large Plants',
            description: 'Make a statement with big, bold plants',
            image: '/images/White_arch.webp',
            link: '/collections/large-plants'
        },
        {
            id: 'houseplants',
            name: 'Houseplants',
            description: 'Beautiful plants for your indoor spaces',
            image: '/images/White_arch.webp',
            link: '/collections/houseplants'
        },
        {
            id: 'outdoor-patio',
            name: 'Outdoor & Patio',
            description: 'Transform your outdoor spaces',
            image: '/images/White_arch.webp',
            link: '/collections/outdoor-patio'
        },
        {
            id: 'planters-care',
            name: 'Planters & Care',
            description: 'Everything you need to care for your plants',
            image: '/images/White_arch.webp',
            link: '/collections/planters-care'
        },
        {
            id: 'sale',
            name: 'Sale',
            description: 'Amazing deals on selected items',
            image: '/images/White_arch.webp',
            link: '/collections/sale'
        },
    ];

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-white py-8 md:py-12 lg:py-16">
                <div className="w-full px-4 md:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className=" md:mb-12 lg:mb-16">
                            <h1 className="font-sans font-light text-[#2a2d24] text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl leading-tight sm:mb-4">
                                Collections
                            </h1>
                            <p className="text-gray-600 text-base md:text-l lg:text-l">
                                Explore our curated plant collections and find the perfect plants for your space.
                            </p>
                        </div>

                        {/* Collections Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 mb-6">
                            {collections.map((collection) => (
                                <Link
                                    key={collection.id}
                                    href={collection.link}
                                    className="group relative overflow-hidden rounded-lg h-80 md:h-96"
                                >
                                    {/* Background Image */}
                                    <img
                                        src={collection.image}
                                        alt={collection.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300" />

                                    {/* Content */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-sans font-light text-white mb-2">
                                            {collection.name}
                                        </h3>
                                        <p className="text-gray-100 text-sm md:text-base mb-4">
                                            {collection.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all duration-300">
                                            <span className="font-medium text-sm md:text-base">Explore</span>
                                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
}
