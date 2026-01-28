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
        <div>
            <Navbar />
            <div className="min-h-screen bg-white py-8 md:py-12 lg:py-16">
                <div className="w-full px-4 md:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Back Link */}
                        <Link href="/collections" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 md:mb-12 text-base">
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Back to Collection
                        </Link>

                        {/* Product Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 mb-16 lg:mb-24">
                            {/* Images Section */}
                            <div className="flex flex-col gap-4">
                                {/* Main Image */}
                                <div className="bg-white rounded-lg overflow-hidden w-full">
                                    <img
                                        src={product.images[mainImage]}
                                        alt={product.name}
                                        className="w-full h-80 md:h-96 lg:h-[500px] xl:h-[600px] object-cover"
                                    />
                                </div>

                                {/* Thumbnail Images */}
                                <div className="grid grid-cols-4 gap-4">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setMainImage(idx)}
                                            className={`rounded-lg overflow-hidden border-2 transition ${mainImage === idx
                                                ? 'border-gray-900'
                                                : 'border-gray-200 hover:border-gray-400'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`View ${idx + 1}`}
                                                className="w-full h-24 md:h-32 lg:h-40 object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Product Info Section */}
                            <div className="flex flex-col">
                                {/* Title */}
                                <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-serif font-light text-gray-900 mb-6 md:mb-8">
                                    {product.name}
                                </h1>
                                {/* Rating */}
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={24}
                                                className="fill-current"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-lg text-gray-600">
                                        ({product.reviews} reviews)
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="mb-8 lg:mb-10">
                                    <div className="flex flex-wrap items-center gap-4 mb-3">
                                        <span className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-gray-900">
                                            ${product.price}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-2xl md:text-3xl line-through text-gray-400">
                                                ${product.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-base text-gray-600">
                                        Free shipping on orders over $79
                                    </p>
                                </div>

                                {/* Size Selection */}
                                {product.sizes.length > 0 && (
                                    <div className="mb-8 lg:mb-10">
                                        <label className="block text-lg font-medium text-gray-900 mb-4">
                                            Size
                                        </label>
                                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                            {product.sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`py-3 px-4 rounded-md border-2 transition text-base font-medium ${selectedSize === size
                                                        ? 'border-gray-900 bg-gray-100'
                                                        : 'border-gray-300 hover:border-gray-900'
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
                                    <div className="mb-5 sm:mb-6">
                                        <label className="block text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                            Color
                                        </label>
                                        <div className="flex flex-wrap gap-2 sm:gap-3">
                                            {product.colors.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`py-2 px-3 sm:px-4 rounded-lg border-2 transition text-xs sm:text-sm font-medium ${selectedColor === color
                                                        ? 'border-teal-600 bg-teal-50'
                                                        : 'border-gray-200 hover:border-teal-300'
                                                        }`}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quantity */}
                                <div className="mb-6 sm:mb-8">
                                    <label className="block text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                                        Quantity
                                    </label>
                                    <div className="inline-flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3 py-2 text-gray-600 hover:text-gray-900 text-lg"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            readOnly
                                            className="w-12 text-center border-x border-gray-300 py-2"
                                        />
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-3 py-2 text-gray-600 hover:text-gray-900 text-lg"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-teal-600 text-white py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base hover:bg-teal-700 transition mb-3 sm:mb-4 flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </button>

                                {/* Wishlist & Share */}
                                <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className="flex-1 border-2 border-gray-300 text-gray-900 py-2 sm:py-3 rounded-lg font-semibold hover:border-red-500 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                                    >
                                        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                                        <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
                                    </button>
                                    <button className="flex-1 border-2 border-gray-300 text-gray-900 py-2 sm:py-3 rounded-lg font-semibold hover:border-teal-500 transition flex items-center justify-center gap-2 text-sm sm:text-base">
                                        <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="hidden sm:inline">Share</span>
                                    </button>
                                </div>

                                {/* Benefits */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                                    {product.benefits.map((benefit) => (
                                        <div key={benefit} className="flex items-center text-gray-700 text-xs sm:text-sm">
                                            <span className="text-green-500 mr-2 text-lg">✓</span>
                                            <span>{benefit}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Shipping Info */}
                                <div className="border-t border-gray-200 pt-6 sm:pt-8 space-y-3 sm:space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Truck className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Free Shipping</p>
                                            <p className="text-xs sm:text-sm text-gray-600">On orders over $79</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Secure Payment</p>
                                            <p className="text-xs sm:text-sm text-gray-600">SSL encrypted checkout</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <RotateCcw className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm sm:text-base">Easy Returns</p>
                                            <p className="text-xs sm:text-sm text-gray-600">30-day return policy</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Section */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12 md:mb-16 lg:mb-20">
                            {/* Tab Buttons */}
                            <div className="flex border-b border-gray-200 overflow-x-auto">
                                {['description', 'care', 'reviews'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 min-w-fit py-3 sm:py-4 px-3 sm:px-6 font-semibold text-xs sm:text-base transition whitespace-nowrap ${activeTab === tab
                                            ? 'text-teal-600 border-b-2 border-teal-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-4 sm:p-8">
                                {activeTab === 'description' && (
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                                            Product Description
                                        </h3>
                                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                            {product.longDescription}
                                        </p>
                                    </div>
                                )}

                                {activeTab === 'care' && (
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                                            Care Instructions
                                        </h3>
                                        <ul className="space-y-2 sm:space-y-3">
                                            {product.careInstructions.map((instruction, idx) => (
                                                <li key={idx} className="flex items-start text-sm sm:text-base">
                                                    <span className="text-teal-600 mr-3 font-bold flex-shrink-0">•</span>
                                                    <span className="text-gray-600">{instruction}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                                            Customer Reviews
                                        </h3>
                                        <div className="space-y-4 sm:space-y-6">
                                            {[...Array(3)].map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className="border-b border-gray-200 pb-4 sm:pb-6 last:border-b-0"
                                                >
                                                    <div className="flex items-start gap-3 sm:gap-4">
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className="w-3 h-3 sm:w-4 sm:h-4 fill-current"
                                                                />
                                                            ))}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                                                Great product!
                                                            </p>
                                                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                                                By Customer - Jan 2024
                                                            </p>
                                                            <p className="text-gray-600 mt-2 text-xs sm:text-sm">
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

                        {/* Related Products */}
                        {relatedProducts.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                                    Related Products
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                                    {relatedProducts.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/products/${item.id}`}
                                            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-32 sm:h-40 md:h-48 object-cover"
                                            />
                                            <div className="p-2 sm:p-4">
                                                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2">
                                                    {item.name}
                                                </h3>
                                                <p className="text-teal-600 font-bold mt-1 sm:mt-2 text-xs sm:text-base">
                                                    ${item.price}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}
