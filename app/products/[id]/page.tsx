'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    Truck,
    Shield,
    RotateCcw,
    ShoppingCart,
    Heart,
    ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProduct, getProducts } from '@/src/lib/shopify_utilis';
import { useCart } from '@/src/context/CartContext';


interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number | null;
    image: string;
    images?: Array<{ url: string; altText?: string }>;
    description: string;
    descriptionHtml?: string;
    availableForSale: boolean;
    tags?: string[];
    badge?: string | null;
    badgeColor?: string;
    handle: string;
}

/* ---------------- PAGE COMPONENT ---------------- */

export default function ProductDetailPage() {
    const params = useParams();
    const { addToCart, cartItems } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'care'>('description');

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Fetch product from Shopify
    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                const handle = params?.id as string;
                if (!handle) return;

                const productData = await getProduct(handle);
                if (productData) {
                    setProduct(productData);

                    // Fetch related products
                    const allProducts = await getProducts(20);
                    const related = allProducts
                        .filter((p: any) => p.handle !== handle)
                        .slice(0, 4);
                    setRelatedProducts(related);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [params?.id]);

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
        });
    };

    const productImages = product?.images || [{ url: product?.image || '' }];

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#244033] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Product not found</p>
                    <Link href="/products" className="text-[#244033] hover:underline">
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`${totalItems > 0 ? 'pb-24' : ''}`}>
            <div className="min-h-screen bg-white">
                {/* Breadcrumbs */}
                <div className="border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                        <nav className="flex items-center space-x-2 text-sm text-gray-600">
                            <Link href="/" className="hover:text-[#244033]">
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href="/products" className="hover:text-[#244033]">
                                Products
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-[#244033] font-medium">{product.name}</span>
                        </nav>
                    </div>
                </div>

                {/* Main Product Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Images */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                                {product.badge && (
                                    <div className={`absolute top-4 left-4 z-10 ${product.badgeColor} text-white px-4 py-2 text-sm rounded-full`}>
                                        {product.badge}
                                    </div>
                                )}
                                <img
                                    src={productImages[mainImage]?.url || product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Thumbnail Images */}
                            <div className="grid grid-cols-4 gap-4">
                                {productImages.slice(0, 4).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMainImage(idx)}
                                        className={`relative bg-gray-100 rounded-lg overflow-hidden aspect-square border-2 transition ${mainImage === idx ? 'border-[#244033]' : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={img.url}
                                            alt={`Product view ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col justify-start space-y-6">
                            {/* Title and Price */}
                            <div>
                                <h1 className="text-4xl font-light text-gray-900 mb-3">{product.name}</h1>
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl font-semibold text-[#244033]">
                                        {product.price}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-lg text-gray-400 line-through">
                                            {product.originalPrice}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-green-600 mt-2">
                                    {product.availableForSale ? 'In Stock' : 'Out of Stock'}
                                </p>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed text-base">
                                {product.description}
                            </p>

                            {/* Quantity Selector */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-900">Quantity</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                                    >
                                        −
                                    </button>
                                    <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart and Wishlist */}
                            <div className="space-y-3 pt-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.availableForSale}
                                    className="w-full bg-[#244033] text-white py-4 rounded-lg font-semibold hover:bg-[#2F4F3E] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={20} />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className={`w-full py-3 rounded-lg border-2 font-semibold transition flex items-center justify-center gap-2 ${isWishlisted
                                        ? 'border-red-500 text-red-500'
                                        : 'border-gray-300 text-gray-900 hover:border-red-500 hover:text-red-500'
                                        }`}
                                >
                                    <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                                    {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
                                </button>
                            </div>

                            {/* Features */}
                            <div className="space-y-4 pt-6 border-t border-gray-200">
                                <div className="flex items-start gap-4">
                                    <Truck className="text-[#244033] flex-shrink-0 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Free Shipping</h4>
                                        <p className="text-sm text-gray-600">On orders over 50</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Shield className="text-[#244033] flex-shrink-0 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Satisfaction Guaranteed</h4>
                                        <p className="text-sm text-gray-600">30-day money back guarantee</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <RotateCcw className="text-[#244033] flex-shrink-0 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Easy Returns</h4>
                                        <p className="text-sm text-gray-600">Hassle-free returns within 30 days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="mt-16 border-t border-gray-200">
                        <div className="flex gap-8 border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`py-4 px-1 font-semibold relative transition ${activeTab === 'description'
                                    ? 'text-[#244033]'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Description
                                {activeTab === 'description' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#244033]"></div>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('care')}
                                className={`py-4 px-1 font-semibold relative transition ${activeTab === 'care'
                                    ? 'text-[#244033]'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Care Instructions
                                {activeTab === 'care' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#244033]"></div>
                                )}
                            </button>
                        </div>

                        <div className="py-8">
                            {activeTab === 'description' && (
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                    {product.descriptionHtml && (
                                        <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                                    )}
                                </div>
                            )}

                            {activeTab === 'care' && (
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-4">Plant Care Guide</h4>
                                        <ul className="space-y-3 text-gray-600">
                                            <li className="flex gap-3">
                                                <span className="font-semibold text-[#244033] flex-shrink-0">💧</span>
                                                <span>Water moderately. Keep soil moist but not waterlogged. Reduce watering in winter.</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="font-semibold text-[#244033] flex-shrink-0">☀️</span>
                                                <span>Place in bright, indirect light. Avoid direct sunlight which can scorch leaves.</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="font-semibold text-[#244033] flex-shrink-0">🌡️</span>
                                                <span>Ideal temperature range: 65-75°F (18-24°C). Protect from cold drafts.</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="font-semibold text-[#244033] flex-shrink-0">💨</span>
                                                <span>Prefers moderate humidity. Mist leaves occasionally or use a humidity tray.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-light text-gray-900 mb-8">Related Products</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((p) => (
                                    <Link
                                        key={p.id}
                                        href={`/products/${p.handle}`}
                                        className="group block"
                                    >
                                        <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-4">
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />
                                        </div>
                                        <h3 className="text-sm font-light text-gray-900 mb-1">{p.name}</h3>
                                        <p className="text-sm font-medium text-[#244033]">From ${p.price}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Cart Navigator */}
            {totalItems > 0 && (
                <div className="
      fixed z-50
      bg-[#F0F4F1] border-t border-gray-200 shadow-lg

      bottom-[70px] left-3 right-3          /* mobile */
      
     sm:bottom-0 
sm:left-1/2 
sm:-translate-x-1/2 
sm:w-[500px] 
sm:rounded-t-[20px] 
sm:rounded-b-none
                    /* desktop width */

      p-5 rounded-[20px]
      sm:p-4 sm:rounded-[16px]
    ">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#244033] text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold">
                                {totalItems}
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
                                <p className="text-lg font-semibold text-[#244033]">Rs. {totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                        <Link
                            href="/cart"
                            className="bg-[#244033] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2F4F3E] transition"
                        >
                            View Cart
                        </Link>
                    </div>
                </div>
            )
            }
        </div >
    );
}

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
