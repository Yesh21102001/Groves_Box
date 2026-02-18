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
            <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                <div className="max-w-[1600px] mx-auto">

                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
                        <Link href="/" className="hover:text-[#2F4F3E] transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[#007B57] font-medium">Collections</span>
                    </nav>

                    {/* Header */}
                    <div className="mb-8 md:mb-10 lg:mb-12">
                        <h1 className="font-light text-[#007B57] text-3xl lg:text-4xl 2xl:text-5xl tracking-tight">
                            Collections
                        </h1>
                    </div>

                    {/* Collections Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 lg:gap-x-8 lg:gap-y-12">
                        {collections.map((collection) => (
                            <Link
                                key={collection.id}
                                href={collection.link}
                                className="group block"
                            >
                                {/* Image container — no overlay, clean crop */}
                                <div className="relative overflow-hidden w-full aspect-[3/4] mb-3 sm:mb-4 bg-gray-100">
                                    <img
                                        src={collection.image || '/images/White_arch.webp'}
                                        alt={collection.imageAlt || collection.name}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                </div>

                                {/* Title + arrow — below image, no overlay */}
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm sm:text-base lg:text-lg text-[#1a1a1a] font-light leading-snug group-hover:text-[#009A7B] transition-colors duration-200">
                                        {collection.name}
                                    </span>
                                    <span className="text-[#1a1a1a] text-base leading-none group-hover:text-[#009A7B] transition-transform duration-200 group-hover:translate-x-1 inline-block">
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