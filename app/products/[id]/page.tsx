'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Heart, Share2, Star, Truck, Shield, RotateCcw, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { products, getProductById } from '@/src/data/products';
import { useCart } from '@/src/context/CartContext';

export default function ProductDetailPage() {
    const params = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [mainImage, setMainImage] = useState(0);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Get product data
    useEffect(() => {
        if (params?.id) {
            const foundProduct = getProductById(params.id as string);
            setProduct(foundProduct);
            setLoading(false);
        }
    }, [params?.id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                id: `${product.id}-${selectedSize}-${selectedColor}`,
                name: product.name,
                price: product.price,
                quantity: quantity,
                size: selectedSize,
                color: selectedColor,
                image: product.image,
            });
        }
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-600 text-lg">Loading product...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                        <Link href="/collections" className="text-teal-600 hover:text-teal-700 font-semibold">
                            Back to Collections
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Initialize selected options
    if (!selectedSize && product.sizes.length > 0) {
        setTimeout(() => setSelectedSize(product.sizes[0]), 0);
    }
    if (!selectedColor && product.colors.length > 0) {
        setTimeout(() => setSelectedColor(product.colors[0]), 0);
    }

    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    return (
        <div className="bg-white">
            <Navbar />

            <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Back Link */}
                    <Link href="/collections" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 text-sm md:text-base transition-colors">
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                        Back to Collection
                    </Link>

                    {/* Product Details - Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
                        {/* LEFT: Sticky Images Section */}
                        <div className="lg:sticky lg:top-24 lg:self-start">
                            <div className="space-y-4">
                                {/* Main Image */}
                                <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                                    <img
                                        src={product.images[mainImage]}
                                        alt={product.name}
                                        className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover"
                                    />
                                </div>

                                {/* Thumbnail Images */}
                                <div className="grid grid-cols-4 gap-3">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setMainImage(idx)}
                                            className={`rounded-lg overflow-hidden border-2 transition-all duration-200 ${mainImage === idx
                                                ? 'border-teal-600 shadow-md scale-105'
                                                : 'border-gray-200 hover:border-gray-400'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`View ${idx + 1}`}
                                                className="w-full h-20 md:h-24 lg:h-28 object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Scrollable Product Info Section */}
                        <div className="space-y-6">
                            {/* Product Header */}
                            <div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4">
                                    {product.name}
                                </h1>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={18} className="fill-current" />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        ({product.reviews} reviews)
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-3 mb-2">
                                    <span className="text-4xl font-light text-gray-900">
                                        ${product.price}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-xl line-through text-gray-400">
                                            ${product.originalPrice}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-teal-600 font-medium">
                                    Free shipping on orders over $79
                                </p>
                            </div>

                            {/* Divider */}
                            <hr className="border-gray-200" />

                            {/* Size Selection */}
                            {product.sizes.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Size
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-6 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${selectedSize === size
                                                    ? 'border-teal-600 bg-teal-50 text-teal-700'
                                                    : 'border-gray-300 hover:border-gray-500 text-gray-700'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Color Selection */}
                            {product.colors.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Color
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-6 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${selectedColor === color
                                                    ? 'border-teal-600 bg-teal-50 text-teal-700'
                                                    : 'border-gray-300 hover:border-gray-500 text-gray-700'
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    Quantity
                                </label>
                                <div className="inline-flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        readOnly
                                        className="w-16 text-center border-x-2 border-gray-300 py-2 bg-white"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-teal-600 text-white py-4 rounded-lg font-semibold text-base hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </button>
                            </div>

                            {/* Benefits */}
                            <div className="bg-gray-50 rounded-xl p-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {product.benefits.map((benefit) => (
                                        <div key={benefit} className="flex items-center text-gray-700 text-sm">
                                            <span className="text-teal-600 mr-2 text-base">✓</span>
                                            <span>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="border-t border-gray-200 pt-6 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                                        <Truck className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Free Shipping</p>
                                        <p className="text-sm text-gray-600">On orders over $79</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Secure Payment</p>
                                        <p className="text-sm text-gray-600">SSL encrypted checkout</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                                        <RotateCcw className="w-5 h-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Easy Returns</p>
                                        <p className="text-sm text-gray-600">30-day return policy</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section - Full Width Below */}
                    <div className="mt-16">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Tab Buttons */}
                            <div className="flex border-b border-gray-200">
                                {['description', 'care', 'reviews'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-4 px-6 font-semibold text-sm transition-colors ${activeTab === tab
                                            ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/30'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-8">
                                {activeTab === 'description' && (
                                    <div className="max-w-3xl">
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                            Product Description
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {product.longDescription}
                                        </p>
                                    </div>
                                )}

                                {activeTab === 'care' && (
                                    <div className="max-w-3xl">
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                                            Care Instructions
                                        </h3>
                                        <ul className="space-y-3">
                                            {product.careInstructions.map((instruction, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <span className="text-teal-600 mr-3 font-bold">•</span>
                                                    <span className="text-gray-600">{instruction}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="max-w-3xl">
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                                            Customer Reviews
                                        </h3>
                                        <div className="space-y-6">
                                            {[...Array(3)].map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className="border-b border-gray-200 pb-6 last:border-b-0"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className="w-4 h-4 fill-current"
                                                                />
                                                            ))}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-gray-900">
                                                                Great product!
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                By Customer - Jan 2024
                                                            </p>
                                                            <p className="text-gray-600 mt-3">
                                                                This plant is absolutely beautiful and arrived in perfect condition.
                                                                Highly recommend!
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16 mb-8">
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
                                You May Also Like
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {relatedProducts.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/products/${item.id}`}
                                        className="group"
                                    >
                                        <div className="bg-gray-50 rounded-xl overflow-hidden mb-3 group-hover:shadow-lg transition-shadow duration-200">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                        </div>
                                        <h3 className="font-medium text-gray-900 text-sm md:text-base line-clamp-2 mb-2">
                                            {item.name}
                                        </h3>
                                        <p className="text-teal-600 font-semibold">
                                            ${item.price}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}