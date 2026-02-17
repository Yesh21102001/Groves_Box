// Product Detail Page - Updated to match reference design
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    Truck,
    Shield,
    RotateCcw,
    ShoppingCart,
    Heart,
    ChevronRight,
    Star,
    ThumbsUp,
    PenLine,
    Check,
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
    variants?: Array<{
        id: string;
        title: string;
        price: number;
        compareAtPrice?: number | null;
        availableForSale: boolean;
        quantityAvailable?: number;
        selectedOptions?: Array<{ name: string; value: string }>;
    }>;
}

/* ------------------------------------------------------------------ */
/*  STAR RATING COMPONENT                                               */
/* ------------------------------------------------------------------ */
const StarRating = ({
    rating,
    size = 16,
    interactive = false,
    onRate,
}: {
    rating: number;
    size?: number;
    interactive?: boolean;
    onRate?: (r: number) => void;
}) => {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={size}
                    className={`transition-colors ${star <= (interactive ? hover || rating : rating)
                        ? 'fill-[#2F8C6E] text-[#2F8C6E]'
                        : 'fill-gray-200 text-gray-200'
                        } ${interactive ? 'cursor-pointer' : ''}`}
                    onMouseEnter={() => interactive && setHover(star)}
                    onMouseLeave={() => interactive && setHover(0)}
                    onClick={() => interactive && onRate?.(star)}
                />
            ))}
        </div>
    );
};

/* ------------------------------------------------------------------ */
/*  SHARE ICON                                                          */
/* ------------------------------------------------------------------ */
const ShareIcon = ({ className = '', size = 20 }: { className?: string; size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={className}
    >
        <path
            fill="currentColor"
            fillRule="evenodd"
            d="M12 1.5c.21 0 .411.09.55.247l3.1 3.48a.73.73 0 0 1-.063 1.034.738.738 0 0 1-1.039-.063l-1.812-2.035v9.38c0 .404-.33.732-.736.732a.734.734 0 0 1-.736-.733V4.163L9.452 6.198a.738.738 0 0 1-1.04.063.73.73 0 0 1-.062-1.034l3.1-3.48A.738.738 0 0 1 12 1.5ZM3 13.337c0-2.563 2.087-4.64 4.661-4.64h.414c.406 0 .736.328.736.733 0 .404-.33.732-.736.732H7.66a3.182 3.182 0 0 0-3.189 3.175v4.523a3.182 3.182 0 0 0 3.19 3.175h8.677a3.182 3.182 0 0 0 3.189-3.175v-4.523a3.182 3.182 0 0 0-3.19-3.175h-.413a.734.734 0 0 1-.736-.732c0-.405.33-.733.736-.733h.414c2.574 0 4.661 2.077 4.661 4.64v4.523c0 2.563-2.087 4.64-4.661 4.64H7.66C5.087 22.5 3 20.423 3 17.86v-4.523Z"
            clipRule="evenodd"
        />
    </svg>
);

/* ------------------------------------------------------------------ */
/*  PRODUCT CARD (for "Customers Also Enjoyed")                         */
/* ------------------------------------------------------------------ */
const ProductCard = ({ product }: { product: Product }) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const wishlisted = isInWishlist(product.id.toString());

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const variantId = product.variants?.[0]?.id;
        if (!variantId) { alert('This product is currently unavailable'); return; }
        addToCart({ id: product.id, variantId, name: product.name, price: product.price, quantity: 1, image: product.image, handle: product.handle, variants: product.variants });
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (wishlisted) {
            removeFromWishlist(product.id.toString());
        } else {
            addToWishlist({ id: product.id.toString(), variantId: product.variants?.[0]?.id, name: product.name, price: product.price, image: product.image, handle: product.handle, variants: product.variants });
        }
    };

    return (
        <Link href={`/products/${product.handle}`} className="group block">
            <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-3">
                {product.badge && (
                    <div className={`absolute top-3 left-3 z-10 ${product.badgeColor} text-white px-3 py-1 text-xs rounded-full flex items-center gap-1`}>
                        {product.badge === 'Best Seller' && <Heart size={10} className="fill-white" />}
                        {product.badge}
                    </div>
                )}
                <button onClick={handleWishlistToggle} className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:bg-[#244033] hover:text-white transition">
                    <Heart size={16} className={wishlisted ? 'fill-current text-red-500' : ''} />
                </button>
                <button onClick={handleQuickAdd} className="absolute bottom-3 right-3 z-10 w-10 h-10 bg-[#244033] text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition md:hidden">
                    <ShoppingCart size={16} />
                </button>
                <button onClick={handleQuickAdd} className="hidden md:flex absolute bottom-3 left-3 right-3 z-10 bg-[#244033] text-white py-2.5 text-sm font-medium hover:bg-[#2F4F3E] transition items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 duration-300">
                    <ShoppingCart size={14} /> Quick Add
                </button>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <h3 className="text-sm md:text-base font-light text-gray-900 mb-0.5">{product.name}</h3>
            {product.description && (
                <p className="text-xs text-gray-500 mb-1 line-clamp-1">{product.description}</p>
            )}
            <div className="flex items-center gap-2 text-sm">
                <span className={`font-medium ${product.originalPrice ? 'text-[#2F8C6E]' : 'text-gray-900'}`}>
                    {product.originalPrice ? `From Rs. ${product.price}` : `Rs. ${product.price}`}
                </span>
                {product.originalPrice && (
                    <span className="text-gray-400 line-through">Rs. {product.originalPrice}</span>
                )}
            </div>
        </Link>
    );
};

/* ------------------------------------------------------------------ */
/*  RATING BAR ROW                                                      */
/* ------------------------------------------------------------------ */
const RatingBar = ({ stars, count, total }: { stars: number; count: number; total: number }) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-0.5 w-20 flex-shrink-0">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={11} className={s <= stars ? 'fill-[#2F8C6E] text-[#2F8C6E]' : 'fill-gray-200 text-gray-200'} />
                ))}
            </div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#2F8C6E] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-gray-500 w-6 text-right">({count})</span>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/*  WRITE REVIEW MODAL                                                  */
/* ------------------------------------------------------------------ */
const WriteReviewModal = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: (r: any) => void }) => {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [name, setName] = useState('');
    const [recommend, setRecommend] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating || !body || !name) return;
        onSubmit({
            id: Date.now(),
            rating,
            title,
            body,
            reviewer: name,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
            recommend,
            verified: false,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating *</label>
                        <StarRating rating={rating} size={28} interactive onRate={setRating} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Summarize your experience" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F8C6E]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
                        <textarea value={body} onChange={e => setBody(e.target.value)} rows={4} placeholder="Tell us about your experience..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F8C6E] resize-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="First name only" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F8C6E]" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="recommend" checked={recommend} onChange={e => setRecommend(e.target.checked)} className="accent-[#2F8C6E]" />
                        <label htmlFor="recommend" className="text-sm text-gray-700">I would recommend this product</label>
                    </div>
                    <button type="submit" className="w-full bg-[#244033] text-white py-3 rounded-lg font-semibold hover:bg-[#2F4F3E] transition">
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                       */
/* ------------------------------------------------------------------ */
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
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    /* ---- mock reviews (replace with your reviews app integration) ---- */
    const [reviews, setReviews] = useState([
        {
            id: 1,
            rating: 5,
            title: 'Giant Dracaena',
            body: 'Looks great and was easy to take out of the delivery box',
            reviewer: 'Eddie',
            date: '02/05/2026',
            recommend: true,
            verified: true,
            photos: [] as string[],
        },
    ]);

    /* ---- cart totals ---- */
    const totalItems = cartItems.reduce((s: number, i: any) => s + i.quantity, 0);
    const totalPrice = cartItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    const isProductWishlisted = product ? isInWishlist(product.id.toString()) : false;

    /* ---- group variant options ---- */
    const productOptions = useMemo(() => {
        if (!product?.variants?.length) return [];
        const map: Record<string, Set<string>> = {};
        product.variants.forEach((v) => {
            v.selectedOptions?.forEach(({ name, value }) => {
                if (!map[name]) map[name] = new Set();
                map[name].add(value);
            });
        });
        return Object.entries(map).map(([name, values]) => ({ name, values: Array.from(values) }));
    }, [product]);

    /* ---- selected variant (by matched options) ---- */
    const selectedVariant = useMemo(() => {
        if (!product?.variants?.length) return product?.variants?.[0];
        return product.variants.find((v) =>
            v.selectedOptions?.every((o) => selectedOptions[o.name] === o.value)
        ) ?? product.variants[0];
    }, [product, selectedOptions]);

    /* ---- review stats ---- */
    const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
    const ratingCounts = [5, 4, 3, 2, 1].map((s) => ({ stars: s, count: reviews.filter((r) => r.rating === s).length }));
    const recommendPct = reviews.length ? Math.round((reviews.filter((r) => r.recommend).length / reviews.length) * 100) : 0;

    /* ---- fetch product ---- */
    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                const handle = params?.id as string;
                if (!handle) return;
                const productData = await getProduct(handle);
                if (productData) {
                    setProduct(productData);
                    // Init first option of each group
                    if (productData.variants?.[0]?.selectedOptions) {
                        const init: Record<string, string> = {};
                        productData.variants[0].selectedOptions.forEach((o: any) => { init[o.name] = o.value; });
                        setSelectedOptions(init);
                    }
                    const allProducts = await getProducts(20);
                    setRelatedProducts(allProducts.filter((p: any) => p.handle !== handle).slice(0, 4));
                }
            } catch (err) {
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [params?.id]);

    /* ---- handlers ---- */
    const handleAddToCart = () => {
        if (!product || !selectedVariant) return;
        addToCart({ id: product.id, variantId: selectedVariant.id, name: product.name, price: selectedVariant.price ?? product.price, quantity, image: product.image, handle: product.handle, variants: product.variants });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleWishlistToggle = () => {
        if (!product) return;
        if (isProductWishlisted) { removeFromWishlist(product.id.toString()); }
        else { addToWishlist({ id: product.id.toString(), variantId: selectedVariant?.id, name: product.name, price: product.price, image: product.image, handle: product.handle, variants: product.variants }); }
    };

    const handleShare = async (platform: 'copy' | 'whatsapp' | 'facebook' | 'twitter') => {
        if (!product) return;
        const url = window.location.href;
        const text = `Check out ${product.name} - Rs. ${product.price}`;
        switch (platform) {
            case 'copy': try { await navigator.clipboard.writeText(url); alert('Link copied!'); } catch { } break;
            case 'whatsapp': window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank'); break;
            case 'facebook': window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'); break;
            case 'twitter': window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank'); break;
        }
        setShowShareMenu(false);
    };

    const productImages = product?.images?.length ? product.images : [{ url: product?.image ?? '' }];
    const displayPrice = selectedVariant?.price ?? product?.price ?? 0;

    /* ---- colour detection helper ---- */
    const isColorOption = (name: string) => /colou?r/i.test(name);
    const colorMap: Record<string, string> = {
        mustard: '#C8912A', yellow: '#ECC94B', white: '#F5F5F0', black: '#1A1A1A',
        gray: '#9CA3AF', grey: '#9CA3AF', green: '#276749', pink: '#F9A8D4',
        blue: '#3B82F6', red: '#EF4444', brown: '#92400E', beige: '#D4C5A9',
        terracotta: '#C06C52', sage: '#87A878', ivory: '#FFFFF0', charcoal: '#374151',
    };
    const getSwatchColor = (value: string) => {
        const lower = value.toLowerCase();
        for (const [key, hex] of Object.entries(colorMap)) {
            if (lower.includes(key)) return hex;
        }
        return '#CBD5E0';
    };

    /* ---- loading / not found ---- */
    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#244033] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading product...</p>
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <p className="text-gray-600 mb-4">Product not found</p>
                <Link href="/products" className="text-[#244033] hover:underline">Back to Products</Link>
            </div>
        </div>
    );

    /* ================================================================ */
    return (
        <div className={totalItems > 0 ? 'pb-24' : ''}>
            {showReviewModal && (
                <WriteReviewModal
                    onClose={() => setShowReviewModal(false)}
                    onSubmit={(r) => setReviews((prev) => [r, ...prev])}
                />
            )}

            <div className="min-h-screen bg-white">
                {/* Breadcrumbs */}
                <div className="border-b border-gray-200">
                    <div className="max-w-[1800px] mx-auto px-4 py-3 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
                        <nav className="flex items-center space-x-2 text-sm text-gray-500">
                            <Link href="/" className="hover:text-[#244033]">Home</Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href="/products" className="hover:text-[#244033]">Products</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-gray-900">{product.name}</span>
                        </nav>
                    </div>
                </div>

                {/* ---- Main Product Section ---- */}
                <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 py-8 lg:py-14">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24 2xl:gap-32">

                        {/* LEFT — Images */}
                        <div className="flex gap-4">
                            {/* Vertical thumbnail strip */}
                            <div className="hidden sm:flex flex-col gap-3 w-20 xl:w-24 2xl:w-28 flex-shrink-0">
                                {productImages.slice(0, 6).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMainImage(idx)}
                                        className={`relative bg-gray-100 rounded-lg overflow-hidden aspect-square border-2 transition ${mainImage === idx ? 'border-[#244033]' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <img src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            {/* Main image */}
                            <div className="flex-1">
                                <div className="relative bg-gray-100 overflow-hidden aspect-square">
                                    {product.badge && (
                                        <div className={`absolute top-4 left-4 z-10 ${product.badgeColor} text-white px-4 py-1.5 text-xs rounded-full`}>
                                            {product.badge}
                                        </div>
                                    )}
                                    {/* <button onClick={handleWishlistToggle} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow hover:bg-[#244033] hover:text-white transition-all duration-300">
                                        <Heart size={20} className={isProductWishlisted ? 'fill-current text-red-500' : ''} />
                                    </button> */}
                                    <img src={productImages[mainImage]?.url || product.image} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                                {/* Mobile thumbnails */}
                                <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto pb-1">
                                    {productImages.slice(0, 6).map((img, idx) => (
                                        <button key={idx} onClick={() => setMainImage(idx)} className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${mainImage === idx ? 'border-[#244033]' : 'border-transparent'}`}>
                                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT — Product Info */}
                        <div className="flex flex-col justify-start space-y-5">

                            {/* Title + Share */}
                            <div className="flex items-start justify-between gap-4">
                                <h1 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-light text-gray-900 leading-tight flex-1">
                                    {product.name}
                                </h1>
                                <div className="relative flex-shrink-0">
                                    <button onClick={() => setShowShareMenu(!showShareMenu)} className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-[#2F4F3E] hover:border-[#2F4F3E] group transition-all duration-300">
                                        <ShareIcon size={18} className="text-[#2F4F3E] group-hover:text-white transition-colors" />
                                    </button>
                                    {showShareMenu && (
                                        <>
                                            <div className="fixed inset-0 z-20" onClick={() => setShowShareMenu(false)} />
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-30">
                                                {[
                                                    { key: 'copy', label: 'Copy Link', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg> },
                                                    { key: 'whatsapp', label: 'WhatsApp', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg> },
                                                    { key: 'facebook', label: 'Facebook', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg> },
                                                    { key: 'twitter', label: 'Twitter / X', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg> },
                                                ].map(({ key, label, icon }) => (
                                                    <button key={key} onClick={() => handleShare(key as any)} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm transition">
                                                        {icon} {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Star Rating */}
                            <div className="flex items-center gap-2">
                                <StarRating rating={Math.round(avgRating)} size={18} />
                                <button
                                    onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="text-sm text-gray-600 hover:text-[#244033] underline underline-offset-2 transition"
                                >
                                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                                </button>
                            </div>

                            {/* Short description */}
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {product.description}
                            </p>

                            {/* Price */}
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-semibold text-gray-900">
                                    Rs. {displayPrice.toLocaleString()}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-lg text-gray-400 line-through">
                                        Rs. {product.originalPrice.toLocaleString()}
                                    </span>
                                )}
                                <span className={`text-sm font-medium ${product.availableForSale ? 'text-[#2F8C6E]' : 'text-red-500'}`}>
                                    {product.availableForSale ? '• In Stock' : '• Out of Stock'}
                                </span>
                            </div>

                            {/* ---- Variant Option Selectors ---- */}
                            {productOptions.map((option) => (
                                <div key={option.name} className="space-y-2">
                                    <div className="flex items-center mb-4 justify-between">
                                        <label className="text-sm font-semibold text-gray-900">
                                            {option.name}:{' '}
                                            <span className="font-normal text-gray-600">{selectedOptions[option.name]}</span>
                                        </label>
                                        {/* {/size/i.test(option.name) && (
                                            <button className="text-sm text-[#2F8C6E] underline underline-offset-2 hover:text-[#244033] transition">
                                                Size Guide
                                            </button>
                                        )} */}
                                        {/planter/i.test(option.name) && (
                                            <button className="text-sm text-[#2F8C6E] underline underline-offset-2 hover:text-[#244033] transition">
                                                Style Guide
                                            </button>
                                        )}
                                    </div>

                                    {isColorOption(option.name) ? (
                                        /* Color swatches */
                                        <div className="flex flex-wrap gap-2">
                                            {option.values.map((value) => {
                                                const selected = selectedOptions[option.name] === value;
                                                const bg = getSwatchColor(value);
                                                return (
                                                    <button
                                                        key={value}
                                                        title={value}
                                                        onClick={() => setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))}
                                                        className={`relative w-9 h-9 rounded-full border-2 mb-4 transition-all duration-200 ${selected ? 'border-[#244033] scale-110 ring-2 ring-offset-1 ring-[#244033]' : 'border-gray-300 hover:border-gray-500'}`}
                                                        style={{ backgroundColor: bg }}
                                                    >
                                                        {selected && <Check size={14} className="absolute inset-0 m-auto text-white drop-shadow" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        /* Text / pill buttons */
                                        <div className="flex flex-wrap gap-2">
                                            {option.values.map((value) => {
                                                const selected = selectedOptions[option.name] === value;
                                                // Check if this combination is available
                                                const available = product.variants?.some((v) =>
                                                    v.selectedOptions?.find((o) => o.name === option.name && o.value === value) &&
                                                    v.availableForSale
                                                );
                                                return (
                                                    <button
                                                        key={value}
                                                        onClick={() => available !== false && setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))}
                                                        className={`relative px-4 py-2 text-sm border rounded-lg mb-3 transition-all duration-200 ${selected
                                                            ? 'border-[#244033] bg-white text-[#244033] font-semibold ring-1 ring-[#244033]'
                                                            : available === false
                                                                ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                                                                : 'border-gray-300 text-gray-700 hover:border-[#2F8C6E] hover:text-[#244033]'
                                                            }`}
                                                    >

                                                        {selected && (
                                                            <span className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-[#2F8C6E] rounded-full flex items-center justify-center">
                                                                <Check size={10} className="text-white" />
                                                            </span>
                                                        )}
                                                        {value}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Quantity */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold text-gray-900">Qty:</span>
                                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-lg transition">−</button>
                                    <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-lg transition">+</button>
                                </div>
                            </div>

                            {/* Add to Cart button — with price shown */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.availableForSale}
                                    className={`flex-1 py-4 font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${addedToCart
                                        ? 'bg-[#2F8C6E] text-white'
                                        : 'bg-[#2F8C6E] hover:bg-[#244033] text-white'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {addedToCart ? (
                                        <><Check size={18} /> Added!</>
                                    ) : (
                                        <>Add To Cart — Rs. {(displayPrice * quantity).toLocaleString()}</>
                                    )}
                                </button>
                                <button
                                    onClick={handleWishlistToggle}
                                    className="w-14 h-14 border border-[#2F8C6E] rounded-4xl flex items-center justify-center hover:border-[#2F8C6E] hover:bg-green-50 transition-all duration-300"
                                >
                                    <Heart size={20} className={isProductWishlisted ? 'fill-red-500 text-red-500' : 'text-[#2F8C6E]'} />
                                </button>
                            </div>

                            {/* Trust badges */}
                            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                                {[
                                    { icon: <Truck size={18} />, title: 'Free Shipping', sub: 'On orders over Rs. 5,000' },
                                    { icon: <Shield size={18} />, title: '30-Day Guarantee', sub: 'Money back guaranteed' },
                                    { icon: <RotateCcw size={18} />, title: 'Easy Returns', sub: 'Hassle-free within 30 days' },
                                ].map(({ icon, title, sub }) => (
                                    <div key={title} className="flex flex-col items-center text-center gap-1">
                                        <div className="text-[#244033]">{icon}</div>
                                        <p className="text-xs font-semibold text-gray-800">{title}</p>
                                        <p className="text-xs text-gray-500 hidden sm:block">{sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ---- Tabs ---- */}
                    <div className="mt-16 border-t border-gray-200">
                        <div className="flex gap-8 border-b border-gray-200">
                            {(['description', 'care'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-1 text-sm font-semibold relative transition capitalize ${activeTab === tab ? 'text-[#244033]' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    {tab === 'description' ? 'Description' : 'Care Instructions'}
                                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#244033]" />}
                                </button>
                            ))}
                        </div>

                        <div className="py-8 max-w-5xl">
                            {activeTab === 'description' && (
                                <div className="space-y-4">
                                    {product.descriptionHtml && (
                                        <div
                                            className="prose prose-sm max-w-none text-gray-600 [&_ul]:list-none [&_li]:flex [&_li]:gap-3 [&_li]:before:content-['→'] [&_li]:before:text-[#2F8C6E] [&_li]:before:flex-shrink-0"
                                            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                                        />
                                    )}
                                </div>
                            )}
                            {activeTab === 'care' && (
                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <h4 className="font-semibold text-gray-900 mb-4">Plant Care Guide</h4>
                                    <ul className="space-y-3 text-gray-600">
                                        {[
                                            ['💧', 'Water moderately. Keep soil moist but not waterlogged. Reduce watering in winter.'],
                                            ['☀️', 'Place in bright, indirect light. Avoid direct sunlight which can scorch leaves.'],
                                            ['🌡️', 'Ideal temperature range: 65–75°F (18–24°C). Protect from cold drafts.'],
                                            ['💨', 'Prefers moderate humidity. Mist leaves occasionally or use a humidity tray.'],
                                        ].map(([emoji, text]) => (
                                            <li key={emoji as string} className="flex gap-3 text-sm">
                                                <span className="flex-shrink-0">{emoji}</span>
                                                <span>{text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ---- Customers Also Enjoyed ---- */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-light text-gray-900 mb-8">Customers Also Enjoyed</h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 xl:gap-10">
                                {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                            </div>
                        </div>
                    )}

                    {/* ---- Reviews Section ---- */}
                    <div id="reviews-section" className="mt-16 pt-8 border-t border-gray-200 scroll-mt-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-16 2xl:gap-24">
                            {/* Left — summary */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <span className="text-5xl font-light text-gray-900">{avgRating.toFixed(1)}</span>
                                    <div>
                                        <StarRating rating={Math.round(avgRating)} size={22} />
                                        <p className="text-sm text-gray-500 mt-1">Based on {reviews.length} Review{reviews.length !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {ratingCounts.map(({ stars, count }) => (
                                        <RatingBar key={stars} stars={stars} count={count} total={reviews.length} />
                                    ))}
                                </div>
                                {reviews.length > 0 && (
                                    <div className="bg-[#244033] text-white text-sm font-semibold px-3 py-1.5 rounded-lg inline-block">
                                        {recommendPct}% would recommend this product
                                    </div>
                                )}
                                <button
                                    onClick={() => setShowReviewModal(true)}
                                    className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl hover:border-[#244033] hover:text-[#244033] transition font-medium text-sm"
                                >
                                    <PenLine size={15} /> Write a Review
                                </button>
                            </div>

                            {/* Right — individual reviews */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900">Reviews {reviews.length}</h3>
                                    <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2F8C6E]">
                                        <option>Most Recent</option>
                                        <option>Highest Rated</option>
                                        <option>Lowest Rated</option>
                                    </select>
                                </div>

                                {reviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-100 pb-6">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="font-medium text-gray-900">{review.reviewer}</span>
                                            <span className="text-sm text-gray-400">{review.date}</span>
                                        </div>
                                        {review.recommend && (
                                            <div className="flex items-center gap-1.5 text-[#2F8C6E] text-sm mb-2">
                                                <ThumbsUp size={13} className="fill-[#2F8C6E]" />
                                                <span>I recommend this product</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 mb-2">
                                            <StarRating rating={review.rating} size={14} />
                                            {review.title && <span className="text-sm font-semibold text-gray-800">{review.title}</span>}
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
                                        {review.photos?.length > 0 && (
                                            <div className="flex gap-2 mt-3">
                                                {review.photos.map((photo, i) => (
                                                    <img key={i} src={photo} alt="" className="w-16 h-16 rounded-lg object-cover" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {reviews.length === 0 && (
                                    <div className="text-center py-10 text-gray-400">
                                        <p className="mb-4">No reviews yet. Be the first!</p>
                                        <button onClick={() => setShowReviewModal(true)} className="bg-[#244033] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2F4F3E] transition">
                                            Write a Review
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Cart Navigator */}
            {totalItems > 0 && (
                <div className="fixed z-40 bg-[#F0F4F1] border-t border-gray-200 shadow-lg bottom-[70px] left-3 right-3 sm:bottom-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-[600px] xl:w-[700px] sm:rounded-t-[20px] p-4 rounded-[20px]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#244033] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                                {totalItems}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
                                <p className="font-semibold text-sm">Rs. {totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                        <Link href="/cart" className="bg-[#244033] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#2F4F3E] transition text-sm">
                            View Cart
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}