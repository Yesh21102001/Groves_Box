'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Loader2 } from 'lucide-react';
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
            const data = await getCollections(250);
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
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#2d5a3d] animate-spin mx-auto mb-3" />
                    <p className="text-gray-600">Loading collections...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-8 md:py-12 lg:py-16">
            <div className="w-full px-5 sm:px-8 lg:px-12">
                <div className="max-w-7xl mx-auto">

                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                        <Link href="/" className="hover:text-[#2d5a3d] transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[#2d5a3d] font-semibold">Collections</span>
                    </nav>

                    {/* Header */}
                    <div className="mb-12 md:mb-14 lg:mb-16">
                        <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#2d5a3d] mb-3">
                            Our Collection
                        </p>
                        <h1
                            className="text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4"
                            style={{ fontFamily: "Georgia, serif" }}
                        >
                            Find Your Perfect Plant
                        </h1>
                        <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
                            Explore our carefully curated collections of plants, each selected for quality and beauty to transform your space.
                        </p>
                    </div>

                    {/* Collections Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                        {collections.map((collection) => (
                            <Link
                                key={collection.id}
                                href={collection.link}
                                className="group block"
                            >
                                {/* Image container */}
                                <div className="relative overflow-hidden w-full aspect-square mb-4 rounded-lg bg-gray-100">
                                    <img
                                        src={collection.image || '/images/White_arch.webp'}
                                        alt={collection.imageAlt || collection.name}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                </div>

                                {/* Title with arrow */}
                                <div className="flex items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-[#2d5a3d] transition-colors duration-200 line-clamp-2">
                                            {collection.name}
                                        </h3>
                                    </div>
                                    <span className="text-[#2d5a3d] text-lg flex-shrink-0 group-hover:translate-x-1 transition-transform duration-200">
                                        →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
