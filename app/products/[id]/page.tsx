'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    Star,
    Truck,
    Shield,
    RotateCcw,
    ShoppingCart,
    Heart,
    ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { products, getProductById } from '@/src/data/products';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';

/* ---------------- TYPES ---------------- */

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    images: string[];
    sizes: string[];
    colors: string[];
    benefits: string[];
    careInstructions: string[];
    category: string;
    reviews: number;
    longDescription: string;
    description: string;
}

/* ---------------- PRODUCT CARD COMPONENT ---------------- */

function ProductCard({ product }: { product: Product }) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
        });
    };

    return (
        <Link href={`/products/${product.id}`} className="group block">
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-4">
                {/* Wishlist Icon - Top Right */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsWishlisted(!isWishlisted);
                    }}
                    className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:bg-black hover:text-white transition"
                >
                    <Heart
                        size={18}
                        className={isWishlisted ? "fill-current text-red-500" : ""}
                    />
                </button>

                {/* Quick Add Button */}
                {/* Mobile: Small circular button bottom-right, always visible */}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-3 right-3 z-10 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition md:hidden"
                >
                    <ShoppingCart size={18} />
                </button>

                {/* Desktop: Full button at bottom on hover */}
                <button
                    onClick={handleAddToCart}
                    className="hidden md:flex absolute bottom-3 left-3 right-3 z-10 bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                >
                    <ShoppingCart size={16} />
                    Quick Add
                </button>

                {/* Product Image */}
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Product Info */}
            <h3 className="text-sm md:text-base font-sans font-light text-gray-900 mb-1">
                {product.name}
            </h3>

            <p className="text-xs md:text-sm italic text-gray-500 mb-2 line-clamp-2">
                {product.description}
            </p>

            <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-900">
                    From ${product.price}
                </span>

                {product.originalPrice && (
                    <span className="text-gray-400 line-through">
                        ${product.originalPrice}
                    </span>
                )}
            </div>
        </Link>
    );
}

/* ---------------- PAGE ---------------- */

export default function ProductDetailPage() {
    const params = useParams();
    const { addToCart, cartItems } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const [activeTab, setActiveTab] = useState<'description' | 'care' | 'reviews'>('description');
    const [mainImage, setMainImage] = useState(0);

    /* ---------------- FETCH PRODUCT ---------------- */

    useEffect(() => {
        if (params?.id) {
            const found = getProductById(params.id as string) as Product | undefined;
            setProduct(found ?? null);
            setLoading(false);
        }
    }, [params?.id]);

    /* ---------------- DEFAULT OPTIONS ---------------- */

    useEffect(() => {
        if (product) {
            if (!selectedSize && product.sizes.length > 0) {
                setSelectedSize(product.sizes[0]);
            }
            if (!selectedColor && product.colors.length > 0) {
                setSelectedColor(product.colors[0]);
            }
        }
    }, [product, selectedSize, selectedColor]);

    /* ---------------- HANDLERS ---------------- */

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            id: `${product.id}-${selectedSize}-${selectedColor}`,
            name: product.name,
            price: product.price,
            quantity,
            size: selectedSize,
            color: selectedColor,
            image: product.image,
        });
    };

    const handleWishlistToggle = () => {
        if (!product) return;

        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
            });
        }
    };

    /* ---------------- STATES ---------------- */

    if (loading) {
        return (
            <>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <p className="text-lg text-gray-600">Loading product...</p>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                {/* <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                    <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
                    <Link href="/collections" className="text-teal-600 font-semibold">
                        Back to Collections
                    </Link>
                </div> */}
            </>
        );
    }

    const relatedProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    /* ---------------- UI ---------------- */

    return (
        <div className={`bg-white ${totalItems > 0 ? 'pb-20' : ''}`}>

            {/* BREADCRUMBS */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <nav className="flex items-center justify-center  space-x-2 text-sm text-gray-600">
                    <Link href="/" className="hover:text-[#2F4F3E]">
                        Home
                    </Link>

                    <ChevronRight className="w-4 h-4" />

                    <Link href="/products" className="hover:text-[#2F4F3E]">
                        Products
                    </Link>

                    <ChevronRight className="w-4 h-4" />

                    <span className="text-[#2F4F3E] font-medium">
                        {product.name}
                    </span>
                </nav>
            </div>


            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link
                    href="/collections"
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Collection
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* LEFT */}
                    <div className="lg:sticky lg:top-24 space-y-4">
                        <div className="bg-gray-50 rounded-xl overflow-hidden relative">
                            <img
                                src={product.images[mainImage]}
                                alt={product.name}
                                className="w-full h-[500px] object-cover"
                            />
                            {/* Wishlist Icon on Image */}
                            <button
                                onClick={handleWishlistToggle}
                                className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${isInWishlist(product.id)
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-500'
                                    }`}
                            >
                                <Heart
                                    className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`}
                                />
                            </button>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            {product.images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(idx)}
                                    className={`border-2 rounded-lg overflow-hidden ${mainImage === idx
                                        ? 'border-black'
                                        : 'border-transparent hover:border-gray-300'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`Thumbnail ${idx}`}
                                        className="h-20 w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-6">
                        <h1 className="text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-semibold text-[#2F4F3E]">{product.name}</h1>

                        <div className="flex items-center gap-2">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">
                                ({product.reviews} reviews)
                            </span>
                        </div>

                        <div className="flex gap-4 items-end">
                            <span className="text-3xl text-[#2F4F3E] font-semibold">${product.price}</span>
                            {product.originalPrice && (
                                <span className="line-through text-gray-400">
                                    ${product.originalPrice}
                                </span>
                            )}
                        </div>

                        {/* SIZE */}
                        {product.sizes.length > 0 && (
                            <div>
                                <p className="font-semibold mb-2">Size</p>

                                <div className="flex gap-2 flex-wrap">
                                    {product.sizes.map((size: string) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`
            px-4 py-2 rounded-lg border transition-all duration-200
            ${selectedSize === size
                                                    ? 'bg-[#244033] text-white border-[#244033]'
                                                    : 'border-[#244033] text-[#244033]'
                                                }
          `}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* COLOR */}
                        {product.colors.length > 0 && (
                            <div>
                                <p className="font-semibold mb-2">Color</p>
                                <div className="flex gap-2 flex-wrap">
                                    {product.colors.map((color: string) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-4 py-2 rounded-lg border ${selectedColor === color
                                                ? 'bg-[#244033] text-white border-[#244033]'
                                                : 'border-[#244033] text-[#244033]'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* QUANTITY */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-3 py-1 bg-[#F0F4F1] rounded"
                            >
                                −
                            </button>
                            <span>{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-3 py-1 bg-[#F0F4F1] rounded"
                            >
                                +
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-[#244033] text-white py-4 rounded-lg flex justify-center items-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                        </div>

                        {/* BENEFITS */}
                        <div className="bg-gray-50 p-5 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {product.benefits.map((b: string) => (
                                <div key={b} className="text-sm text-gray-700">
                                    ✓ {b}
                                </div>
                            ))}
                        </div>

                        {/* SHIPPING */}
                        <div className="space-y-4 pt-4 border-t">
                            <Info icon={<Truck />} title="Free Shipping" />
                            <Info icon={<Shield />} title="Secure Payment" />
                            <Info icon={<RotateCcw />} title="Easy Returns" />
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <div className="mt-16">
                    <div className="flex gap-8 border-b border-gray-200">
                        {(['description', 'care', 'reviews'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative pb-4 font-medium text-sm uppercase tracking-wide transition-colors ${activeTab === tab
                                    ? 'text-black'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="py-8">
                        {activeTab === 'description' && (
                            <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed">{product.longDescription}</p>
                            </div>
                        )}

                        {activeTab === 'care' && (
                            <div className="space-y-3">
                                {product.careInstructions.map((instruction, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
                                        <p className="text-gray-700">{instruction}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 font-medium">No reviews yet</p>
                                <p className="text-gray-400 text-sm mt-1">Be the first to review this product</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RELATED */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl text-[#2F4F3E] font-semibold mb-6">
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Cart Navigator */}
            {totalItems > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                                {totalItems}
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
                                <p className="font-semibold">${totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                        <Link
                            href="/cart"
                            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                        >
                            View Cart
                        </Link>
                    </div>
                </div>
            )}

        </div>
    );
}

/* ---------------- SMALL COMPONENT ---------------- */

function Info({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
                {icon}
            </div>
            {title}
        </div>
    );
}