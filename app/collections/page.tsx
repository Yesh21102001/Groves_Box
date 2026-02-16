'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getCollections } from '@/src/lib/shopify_utilis';

type Collection = {
    id: string;
    name: string;
    description: string;
    handle: string;
    image: string;
    imageAlt: string;
    link: string;
};

export default function CollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const data = await getCollections(20);
            // Filter out empty collections and set state
            const validCollections = data.filter((c: any) => c.name && c.id);
            setCollections(validCollections.length > 0 ? validCollections : data);
        } catch (error) {
            console.error('Failed to fetch collections:', error);
            setCollections([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading collections...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-8 md:py-12 lg:py-16">
            <div className="w-full px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Breadcrumbs */}
                    <div className="py-4">
                        <nav className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                            <Link href="/" className="hover:text-[#2F4F3E]">
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-[#2F4F3E] font-medium">Collections</span>
                        </nav>
                    </div>

                    {/* Header */}
                    <div className="mb-8 md:mb-12">
                        <h1 className="font-light text-[#2F4F3E] text-3xl lg:text-4xl 2xl:text-5xl mb-3">
                            Collections
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Explore our curated plant collections and find the perfect plants for your space.
                        </p>
                    </div>

                    {/* Collections Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                        {collections.map((collection) => (
                            <Link
                                key={collection.id}
                                href={collection.link}
                                className="group relative overflow-hidden rounded-lg h-64 sm:h-80 md:h-136"
                            >
                                {/* Image */}
                                <img
                                    src={collection.image || '/images/White_arch.webp'}
                                    alt={collection.imageAlt}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition duration-300" />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                                    <h3 className="text-lg sm:text-2xl font-light text-white mb-1">
                                        {collection.name}
                                    </h3>
                                    <p className="text-gray-200 text-xs sm:text-sm line-clamp-2 mb-2">
                                        {collection.description || 'Explore this collection'}
                                    </p>
                                    <div className="flex items-center gap-2 text-white text-sm">
                                        <span>Explore</span>
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
