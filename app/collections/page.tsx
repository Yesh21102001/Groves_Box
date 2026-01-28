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
            id: 'valentine-day',
            name: 'Valentine\'s Day',
            description: 'Perfect gifts for your loved ones',
            image: '/images/White_arch.webp',
            link: '/collections/valentines-day'
        },
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
            id: 'orchids-blooms',
            name: 'Orchids & Blooms',
            description: 'Elegant flowering plants',
            image: '/images/White_arch.webp',
            link: '/collections/orchids-blooms'
        },
        {
            id: 'gifts',
            name: 'Gifts',
            description: 'Premium gift sets and bundles',
            image: '/images/White_arch.webp',
            link: '/collections/gifts'
        },
        {
            id: 'planters-care',
            name: 'Planters & Care',
            description: 'Everything you need to care for your plants',
            image: '/images/White_arch.webp',
            link: '/collections/planters-care'
        },
        {
            id: 'corporate-gifts',
            name: 'Corporate Gifts',
            description: 'Impress your clients and employees',
            image: '/images/White_arch.webp',
            link: '/collections/corporate-gifts'
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
                        <div className="mb-12 md:mb-16 lg:mb-20">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-serif font-light text-gray-900 mb-4 md:mb-6">
                                Collections
                            </h1>
                            <p className="text-gray-600 text-base md:text-lg lg:text-xl">
                                Explore our curated plant collections and find the perfect plants for your space.
                            </p>
                        </div>

                        {/* Collections Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
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
                                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-white mb-2">
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

                {/* Products Section */}
                <div className="w-full px-4 md:px-6 lg:px-8 py-16 md:py-24 lg:py-28 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-12 md:mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-gray-900 mb-4">
                                Featured Products
                            </h2>
                            <p className="text-gray-600 text-base md:text-lg">
                                Discover our most popular plants and bring nature into your home.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                            {products.slice(0, 8).map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    className="group"
                                >
                                    <div className="relative overflow-hidden rounded-lg bg-gray-200 mb-4 h-48 md:h-56 lg:h-64">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                        />
                                    </div>
                                    <h3 className="font-serif font-light text-lg text-gray-900 mb-2 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={`${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-600">({product.reviews})</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-900 font-medium text-lg">${product.price}</p>
                                            <p className="text-gray-500 text-sm line-through">${product.originalPrice}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center mt-12 md:mt-16">
                            <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition">
                                View All Products
                                <ChevronRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Featured Section */}
                {/* <div className="w-full px-4 md:px-6 lg:px-8 py-16 md:py-24 lg:py-28 bg-[#f5f5f4]">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="font-serif text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl text-stone-900 mb-8">
                            Shop by Plant Type
                        </h2>

                        <div className="grid grid-cols-1 min-[430px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14">
                            {[
                                { title: 'Indoor Plants', image: '/images/White_arch.webp' },
                                { title: 'Outdoor Plants', image: '/images/White_arch.webp' },
                                { title: 'Pet-Friendly Plants', image: '/images/White_arch.webp' },
                                { title: 'Easy-Care Plants', image: '/images/White_arch.webp' },
                                { title: 'Flowering Plants', image: '/images/White_arch.webp' },
                                { title: 'Low Light Plants', image: '/images/White_arch.webp' },
                                { title: 'Large Leafed Plants', image: '/images/White_arch.webp' },
                                { title: 'Succulents', image: '/images/White_arch.webp' },
                            ].map((category, index) => (
                                <Link href="/products" key={index} className="group cursor-pointer hover:text-teal-600">
                                    <div className="relative aspect-[5/5] overflow-hidden mb-3 sm:mb-4 lg:mb-5 rounded-lg">
                                        <img
                                            src={category.image}
                                            alt={category.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-900 group-hover:text-teal-600 transition-colors">
                                        <h3 className="text-base sm:text-lg md:text-lg lg:text-lg xl:text-lg font-medium">
                                            {category.title}
                                        </h3>
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transition-transform duration-300 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div> */}

                <Footer />
            </div>
        </div>
    );
}
