import React from 'react';

export default function NewArrivals() {
    const arrivals = [
        {
            id: 1,
            name: 'Yucca Plant Single Stem',
            subtitle: 'Corners hate to see it coming',
            rating: 5,
            reviews: 2,
            price: 99,
            badge: null,
            image: '/images/B_W_5.webp',
            sizeNote: "Now available in giant 6'-7' sizes!"
        },
        {
            id: 2,
            name: 'Dracaena Marginata Braided',
            subtitle: 'Statement plant for any space!',
            rating: 0,
            reviews: 0,
            price: 169,
            badge: 'New Arrival',
            badgeColor: 'cyan',
            image: '/images/Blue_3.webp',
            sizeNote: "Now available in giant 6'-7' sizes!"
        },
        {
            id: 3,
            name: 'Olive Tree',
            subtitle: 'Free gift with purchase for a limited time',
            rating: 4.5,
            reviews: 137,
            price: 40,
            originalPrice: 70,
            badge: 'On Sale',
            badgeColor: 'pink',
            image: '/images/White_arch.webp'
        },
        {
            id: 4,
            name: 'Money Tree Plant',
            subtitle: 'The OG good-luck tree',
            rating: 5,
            reviews: 63,
            price: 39,
            badge: 'Best Seller',
            badgeColor: 'cyan',
            image: '/images/Pink_1.webp'
        }
    ];

    const renderStars = (rating, reviews) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <svg key={i} className="w-4 h-4 fill-emerald-600" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <svg key={i} className="w-4 h-4" viewBox="0 0 20 20">
                        <defs>
                            <linearGradient id="half">
                                <stop offset="50%" stopColor="#059669" />
                                <stop offset="50%" stopColor="#d1d5db" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                );
            } else {
                stars.push(
                    <svg key={i} className="w-4 h-4 fill-gray-300" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                );
            }
        }

        return (
            <div className="flex items-center gap-1">
                {stars}
                <span className="text-sm text-gray-600 ml-1">{reviews} reviews</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f9f8f6]">
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
                <div className="flex justify-between items-baseline mb-10">
                    <h1 className="text-4xl font-sans text-gray-900">New Arrivals</h1>
                    <button className="bg-black text-white px-6 sm:px-7 py-3 sm:py-3.5 text-sm transition hover:bg-stone-800">
                        Shop all large plants
                    </button>
                </div>

                {/* Product Grid - Changed from grid-cols-1 to grid-cols-2 for mobile */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {arrivals.map((product) => (
                        <div key={product.id} className="group cursor-pointer">
                            {/* Image Container */}
                            <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {/* Badge */}
                                {product.badge && (
                                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-medium ${product.badgeColor === 'cyan' ? 'bg-cyan-400' : 'bg-pink-500'
                                        }`}>
                                        {product.badgeColor === 'cyan' && (
                                            <span className="mr-1">●</span>
                                        )}
                                        {product.badgeColor === 'pink' && (
                                            <span className="mr-1">♥</span>
                                        )}
                                        {product.badge}
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="space-y-2">
                                <h3 className="text-base sm:text-lg font-sans text-gray-900">{product.name}</h3>
                                <p className="text-xs sm:text-sm text-gray-600 italic">{product.subtitle}</p>

                                {/* Rating */}
                                {product.reviews > 0 && renderStars(product.rating, product.reviews)}

                                {/* Size Note */}
                                {product.sizeNote && (
                                    <p className="text-xs sm:text-sm text-pink-500">{product.sizeNote}</p>
                                )}

                                {/* Price */}
                                <div className="flex items-center gap-2">
                                    {product.originalPrice ? (
                                        <>
                                            <span className="text-base sm:text-lg font-medium text-emerald-600">From ${product.price}</span>
                                            <span className="text-base sm:text-lg text-gray-400 line-through">${product.originalPrice}</span>
                                        </>
                                    ) : (
                                        <span className="text-base sm:text-lg font-medium text-gray-900">From ${product.price}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}