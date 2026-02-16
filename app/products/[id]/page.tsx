// Product Detail Page
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
    Share2,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProduct, getProducts } from '@/src/lib/shopify_utilis';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';


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
    variants?: any[];
}

/* ---------------- SHARE ICON COMPONENT (BOLD VERSION) ---------------- */
const ShareIcon = ({ className = "", size = 20 }: { className?: string; size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width={size}
        height={size}
        x="0"
        y="0"
        viewBox="0 0 24 24"
        className={className}
    >
        <g>
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M12 1.5c.21 0 .411.09.55.247l3.1 3.48a.73.73 0 0 1-.063 1.034.738.738 0 0 1-1.039-.063l-1.812-2.035v9.38c0 .404-.33.732-.736.732a.734.734 0 0 1-.736-.733V4.163L9.452 6.198a.738.738 0 0 1-1.04.063.73.73 0 0 1-.062-1.034l3.1-3.48A.738.738 0 0 1 12 1.5ZM3 13.337c0-2.563 2.087-4.64 4.661-4.64h.414c.406 0 .736.328.736.733 0 .404-.33.732-.736.732H7.66a3.182 3.182 0 0 0-3.189 3.175v4.523a3.182 3.182 0 0 0 3.19 3.175h8.677a3.182 3.182 0 0 0 3.189-3.175v-4.523a3.182 3.182 0 0 0-3.19-3.175h-.413a.734.734 0 0 1-.736-.732c0-.405.33-.733.736-.733h.414c2.574 0 4.661 2.077 4.661 4.64v4.523c0 2.563-2.087 4.64-4.661 4.64H7.66C5.087 22.5 3 20.423 3 17.86v-4.523Z"
                clipRule="evenodd"
                strokeWidth="0.8"
                stroke="currentColor"
            />
        </g>
    </svg>
);

/* ---------------- PRODUCT CARD COMPONENT (matching home page) ---------------- */
const ProductCard = ({ product }: { product: Product }) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const wishlisted = isInWishlist(product.id.toString());

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const variantId = product.variants?.[0]?.id;

        if (!variantId) {
            alert('This product is currently unavailable');
            return;
        }

        addToCart({
            id: product.id,
            variantId: variantId,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            handle: product.handle,
            variants: product.variants
        });
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (wishlisted) {
            removeFromWishlist(product.id.toString());
        } else {
            addToWishlist({
                id: product.id.toString(),
                variantId: product.variants?.[0]?.id,
                name: product.name,
                price: product.price,
                image: product.image,
                handle: product.handle,
                variants: product.variants
            });
        }
    };

    return (
        <Link href={`/products/${product.handle}`} className="group block">
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-4">
                {/* Badge */}
                {product.badge && (
                    <div
                        className={`absolute top-3 left-3 z-10 ${product.badgeColor} text-white px-3 py-1 text-xs rounded-full`}
                    >
                        {product.badge}
                    </div>
                )}

                {/* Wishlist Icon - Top Right */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:bg-[#244033] hover:text-white transition"
                >
                    <Heart
                        size={18}
                        className={wishlisted ? "fill-current text-red-500" : ""}
                    />
                </button>

                {/* Quick Add Button - Mobile: Small circular button bottom-right */}
                <button
                    onClick={handleQuickAdd}
                    className="absolute bottom-3 right-3 z-10 w-10 h-10 bg-[#244033] text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition md:hidden"
                >
                    <ShoppingCart size={18} />
                </button>

                {/* Quick Add Button - Desktop: Full button at bottom on hover */}
                <button
                    onClick={handleQuickAdd}
                    className="hidden md:flex absolute bottom-3 left-3 right-3 z-10 bg-[#244033] text-white py-2.5 text-sm font-medium hover:bg-[#2F4F3E] transition items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
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

            <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-900">
                    Rs. {product.price}
                </span>

                {product.originalPrice && (
                    <span className="text-gray-400 line-through">
                        Rs. {product.originalPrice}
                    </span>
                )}
            </div>
        </Link>
    );
};

/* ---------------- PAGE COMPONENT ---------------- */

export default function ProductDetailPage() {
    const params = useParams();
    const { addToCart, cartItems } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(0);
    const [activeTab, setActiveTab] = useState<'description' | 'care'>('description');
    const [showShareMenu, setShowShareMenu] = useState(false);

    const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Check if current product is wishlisted
    const isProductWishlisted = product ? isInWishlist(product.id.toString()) : false;

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

        const variantId = product.variants?.[0]?.id;

        if (!variantId) {
            alert('This product is currently unavailable');
            return;
        }

        addToCart({
            id: product.id,
            variantId: variantId,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
            handle: product.handle,
            variants: product.variants
        });
    };

    const handleWishlistToggle = () => {
        if (!product) return;

        if (isProductWishlisted) {
            removeFromWishlist(product.id.toString());
        } else {
            addToWishlist({
                id: product.id.toString(),
                variantId: product.variants?.[0]?.id,
                name: product.name,
                price: product.price,
                image: product.image,
                handle: product.handle,
                variants: product.variants
            });
        }
    };

    const handleShare = async (platform: 'copy' | 'whatsapp' | 'facebook' | 'twitter') => {
        if (!product) return;

        const url = window.location.href;
        const text = `Check out ${product.name} - Rs. ${product.price}`;

        switch (platform) {
            case 'copy':
                try {
                    await navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
                break;
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
        }
        setShowShareMenu(false);
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

                                {/* Wishlist Heart Icon - Top Right */}
                                <button
                                    onClick={handleWishlistToggle}
                                    className="absolute top-4 right-4 z-10 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#244033] hover:text-white transition-all duration-300"
                                >
                                    <Heart
                                        size={22}
                                        className={isProductWishlisted ? "fill-current text-red-500" : ""}
                                    />
                                </button>

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
                            {/* Title and Share Button */}
                            <div className="flex items-start justify-between gap-4">
                                <h1 className="text-4xl font-light text-gray-900 flex-1">{product.name}</h1>

                                {/* Share Button */}
                                <div className="relative flex-shrink-0">
                                    <button
                                        onClick={() => setShowShareMenu(!showShareMenu)}
                                        className="w-11 h-11 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-[#2F4F3E] hover:border-[#2F4F3E] transition-all duration-300 group"
                                    >
                                        <ShareIcon size={20} className="text-[#2F4F3E] group-hover:text-white transition-colors" />
                                    </button>

                                    {/* Share Menu Dropdown */}
                                    {showShareMenu && (
                                        <>
                                            {/* Backdrop */}
                                            <div
                                                className="fixed inset-0 z-20"
                                                onClick={() => setShowShareMenu(false)}
                                            />
                                            {/* Menu */}
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-30">
                                                <button
                                                    onClick={() => handleShare('copy')}
                                                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                                    </svg>
                                                    Copy Link
                                                </button>
                                                <button
                                                    onClick={() => handleShare('whatsapp')}
                                                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                    </svg>
                                                    WhatsApp
                                                </button>
                                                <button
                                                    onClick={() => handleShare('facebook')}
                                                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                    </svg>
                                                    Facebook
                                                </button>
                                                <button
                                                    onClick={() => handleShare('twitter')}
                                                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                                    </svg>
                                                    Twitter
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl font-semibold text-[#244033]">
                                        Rs. {product.price}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-lg text-gray-400 line-through">
                                            Rs. {product.originalPrice}
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

                            {/* Add to Cart */}
                            <div className="pt-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.availableForSale}
                                    className="w-full bg-[#244033] text-white py-4 rounded-lg font-semibold hover:bg-[#2F4F3E] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={20} />
                                    Add to Cart
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

                    {/* Related Products - Using ProductCard component like home page */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-light text-gray-900 mb-8">Related Products</h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                                {relatedProducts.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Cart Navigator */}
            {totalItems > 0 && (
                <div
                    className="
      fixed z-40
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
    "
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#244033] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                                {totalItems}
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    {totalItems} item{totalItems > 1 ? "s" : ""}
                                </p>
                                <p className="font-semibold">Rs. {totalPrice.toFixed(2)}</p>
                            </div>
                        </div>

                        <Link
                            href="/cart"
                            className="bg-[#244033] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2F4F3E] transition"
                        >
                            View Cart
                        </Link>
                    </div>
                </div>
            )}
        </div >
    );
}