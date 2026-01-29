'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    Star,
    Truck,
    Shield,
    RotateCcw,
    ShoppingCart,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { products, getProductById } from '@/src/data/products';
import { useCart } from '@/src/context/CartContext';

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
}

/* ---------------- PAGE ---------------- */

export default function ProductDetailPage() {
    const params = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
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

    /* ---------------- STATES ---------------- */

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <p className="text-lg text-gray-600">Loading product...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                    <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
                    <Link href="/collections" className="text-teal-600 font-semibold">
                        Back to Collections
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    const relatedProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    /* ---------------- UI ---------------- */

    return (
        <div className="bg-white">
            <Navbar />

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
                        <div className="bg-gray-50 rounded-xl overflow-hidden">
                            <img
                                src={product.images[mainImage]}
                                alt={product.name}
                                className="w-full h-[500px] object-cover"
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            {product.images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(idx)}
                                    className={`border-2 rounded-lg overflow-hidden ${mainImage === idx
                                            ? 'border-teal-600'
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
                        <h1 className="text-4xl font-light">{product.name}</h1>

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
                            <span className="text-3xl font-semibold">${product.price}</span>
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
                                            className={`px-4 py-2 rounded-lg border ${selectedSize === size
                                                    ? 'border-teal-600 bg-teal-50'
                                                    : 'border-gray-300'
                                                }`}
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
                                                    ? 'border-teal-600 bg-teal-50'
                                                    : 'border-gray-300'
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
                                className="px-3 py-1 border rounded"
                            >
                                −
                            </button>
                            <span>{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-3 py-1 border rounded"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-teal-600 text-white py-4 rounded-lg flex justify-center items-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                        </button>

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
                <div className="mt-16 border rounded-xl">
                    <div className="flex border-b">
                        {(['description', 'care', 'reviews'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-4 font-semibold ${activeTab === tab
                                        ? 'text-teal-600 border-b-2 border-teal-600'
                                        : 'text-gray-600'
                                    }`}
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {activeTab === 'description' && <p>{product.longDescription}</p>}
                        {activeTab === 'care' && (
                            <ul className="list-disc pl-5">
                                {product.careInstructions.map((c, i) => (
                                    <li key={i}>{c}</li>
                                ))}
                            </ul>
                        )}
                        {activeTab === 'reviews' && <p>No reviews yet.</p>}
                    </div>
                </div>

                {/* RELATED */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-semibold mb-6">
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.map((item) => (
                                <Link key={item.id} href={`/products/${item.id}`}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="rounded-lg h-48 w-full object-cover"
                                    />
                                    <p className="mt-2 font-medium">{item.name}</p>
                                    <p className="text-teal-600">${item.price}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
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
