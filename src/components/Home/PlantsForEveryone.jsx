import React from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function PlantsForEveryone() {
    const categories = [
        {
            title: 'Indoor Plants',
            image: '/images/AAWUweUuuDHmoD_OM_-TeWfUV7bBgPsN7Wj9ZsUlJHeuMO6I57PbwQbdCc6uMRzs049NBp8srPzltOwpp-EGM1p102xPgEhNCDZ0-2jnYAmDY8qxmAoPhOMtoXO3oHDZWMH-dqPuNCwpPbb4xMQj9AYs4hVNXISTBAiZ0O94p9a4ltizDMn1K5m.webp',
        },
        {
            title: 'Outdoor Plants',
            image: '/images/B_W_5.webp',
        },
        {
            title: 'Pet-Friendly Plants',
            image: '/images/Blue_3.webp',
        },
        {
            title: 'Easy-Care Plants',
            image: '/images/Green_1 (1).webp',
        },
        {
            title: 'Indoor Plants',
            image: '/images/Group_coasters.webp',
        },
        {
            title: 'Outdoor Plants',
            image: '/images/OST_pair_bw_terrazzo.webp',
        },
        {
            title: 'Pet-Friendly Plants',
            image: '/images/Pink_1.webp',
        },
        {
            title: 'Easy-Care Plants',
            image: '/images/White_arch (1).webp',
        },
    ];

    return (
        <div className="min-h-screen bg-[#f5f5f4]">
            <style>{`
                
                @media (min-width: 1536px) {
                    .container-2xl {
                        max-width: 1536px;
                    }
                }
                
                @media (min-width: 1920px) {
                    .container-full {
                        max-width: 1800px;
                    }
                }
            `}</style>
            <div className="container-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 lg:py-16 xl:py-20 2xl:py-24">
                {/* Header */}
                <h1 className="font-serif text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl text-stone-900 mb-8 ">
                    Bring Home Green
                </h1>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 min-[430px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14">
                    {categories.map((category, index) => (
                        <div key={index} className="group cursor-pointer hover:text-[#ffe1d1]">
                            <div className="relative aspect-[5/5] overflow-hidden mb-3 sm:mb-4 lg:mb-5">
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="flex items-center gap-2 text-gray-900">
                                <h3 className="text-base sm:text-lg md:text-l lg:text-l xl:text-lg">
                                    {category.title}
                                </h3>
                                <ArrowRight
                                    className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}