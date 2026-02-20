// Product Page
'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { Filter, X, Heart, ShoppingCart, ChevronRight } from 'lucide-react';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';
import { getProducts, getProductsByCollection, getAllCollections } from '@/src/lib/shopify_utilis';
import { useSearchParams } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    image: string;
    badge?: string;
    badgeColor?: string;
    handle: string;
    tags?: string[];
    variants?: any[];
    variantId?: string;
}

function ProductsPageContent() {
    const searchParams = useSearchParams();
    const filterParam = searchParams.get('filter');

    const [showFiltersSidebar, setShowFiltersSidebar] = useState(false);
    const [sortBy, setSortBy] = useState('popular');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [collections, setCollections] = useState<{ id: string; name: string; handle: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToCart, cartItems } = useCart();

    const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    const getPageTitle = () => {
        switch (filterParam) {
            case 'new': return 'New Arrivals';
            case 'bestseller': return 'Best Sellers';
            case 'sale': return 'On Sale';
            case 'rare': return 'Rare Plants';
            default: return 'All Products';
        }
    };

    const getPageDescription = () => {
        switch (filterParam) {
            case 'new': return 'Check out our latest additions to the collection.';
            case 'bestseller': return 'Our most popular plants, loved by plant parents everywhere.';
            case 'on-sale': return 'Great deals on beautiful plants.';
            case 'rare': return 'Unique and hard-to-find plants for collectors.';
            default: return 'Explore our complete collection of beautiful plants and find your favorites.';
        }
    };

    useEffect(() => {
        async function fetchAll() {
            try {
                setLoading(true);
                setError(null);

                const [productsData, collectionsData] = await Promise.all([
                    filterParam === 'new' ? getProductsByCollection('new-arrivals', 100)
                        : filterParam === 'bestseller' ? getProductsByCollection('best-sellers', 100)
                            : filterParam === 'sale' ? getProductsByCollection('on-sale', 100)
                                : filterParam === 'rare' ? getProductsByCollection('rare', 100)
                                    : getProducts(100),
                    getAllCollections(50),
                ]);

                setProducts(productsData);
                setCollections(collectionsData);
                setSelectedColors([]);
                setSelectedSizes([]);
                setSelectedCollections([]);

                if (productsData.length > 0) {
                    const prices = productsData.map((p: any) => p.price);
                    const maxPrice = Math.ceil(Math.max(...prices) / 100) * 100;
                    setPriceRange([0, maxPrice]);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err instanceof Error ? err.message : 'Failed to load products');
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, [filterParam]);

    // Derive colors from variants
    const availableColors = useMemo(() => {
        const s = new Set<string>();
        products.forEach(p =>
            (p.variants as any[])?.forEach(v =>
                v.selectedOptions?.forEach((o: any) => {
                    if (o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour')
                        s.add(o.value);
                })
            )
        );
        return Array.from(s).sort();
    }, [products]);

    // Derive sizes from variants
    const availableSizes = useMemo(() => {
        const s = new Set<string>();
        products.forEach(p =>
            (p.variants as any[])?.forEach(v =>
                v.selectedOptions?.forEach((o: any) => {
                    if (o.name.toLowerCase() === 'size') s.add(o.value);
                })
            )
        );
        return Array.from(s).sort();
    }, [products]);

    const sliderMax = products.length > 0
        ? Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100
        : 500;

    const pct = (v: number) => (sliderMax > 0 ? (v / sliderMax) * 100 : 0);

    const handleAddToCart = (product: Product) => {
        const variantId = (product.variants as any[])?.[0]?.id;
        if (!variantId) {
            alert('This product is currently unavailable');
            return;
        }
        addToCart({
            id: product.id,
            variantId,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            handle: product.handle,
            variants: product.variants
        });
    };

    // Color map
    const cssColorMap: Record<string, string> = {
        red: '#EF4444', crimson: '#DC143C', pink: '#EC4899', hotpink: '#FF69B4',
        orange: '#F97316', yellow: '#EAB308', gold: '#F59E0B',
        green: '#22C55E', darkgreen: '#15803D', olive: '#6B7280', lime: '#84CC16',
        teal: '#14B8A6', cyan: '#06B6D4',
        blue: '#3B82F6', navy: '#1E3A8A', skyblue: '#38BDF8',
        purple: '#A855F7', violet: '#7C3AED', lavender: '#C4B5FD',
        brown: '#92400E', tan: '#D97706', beige: '#F5F0E8',
        white: '#FFFFFF', ivory: '#FFFFF0', cream: '#FFFDD0',
        gray: '#6B7280', grey: '#6B7280', silver: '#9CA3AF',
        black: '#111111', charcoal: '#374151',
    };
    const lightColors = new Set(['white', 'ivory', 'cream', 'beige', 'yellow', 'lightyellow']);

    // Filter products
    const filteredProducts = products.filter(product => {
        if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
        if (selectedColors.length > 0) {
            const pc = (product.variants as any[])?.flatMap(v =>
                v.selectedOptions?.filter((o: any) => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour').map((o: any) => o.value) ?? []
            ) ?? [];
            if (!selectedColors.some(c => pc.includes(c))) return false;
        }
        if (selectedSizes.length > 0) {
            const ps = (product.variants as any[])?.flatMap(v =>
                v.selectedOptions?.filter((o: any) => o.name.toLowerCase() === 'size').map((o: any) => o.value) ?? []
            ) ?? [];
            if (!selectedSizes.some(s => ps.includes(s))) return false;
        }
        if (selectedCollections.length > 0) {
            const hasTag = selectedCollections.some(handle =>
                product.tags?.some(t => t.toLowerCase().replace(/\s+/g, '-') === handle.toLowerCase())
            );
            if (!hasTag) return false;
        }
        return true;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') {
            const an = a.tags?.some(t => t.toLowerCase().includes('new'));
            const bn = b.tags?.some(t => t.toLowerCase().includes('new'));
            return an && !bn ? -1 : !an && bn ? 1 : 0;
        }
        return 0;
    });

    const activeFilterCount =
        (selectedColors.length > 0 ? 1 : 0) +
        (selectedSizes.length > 0 ? 1 : 0) +
        (selectedCollections.length > 0 ? 1 : 0) +
        (priceRange[0] > 0 ? 1 : 0);

    // Star Rating
    const StarRatingMini = ({ rating = 4, count = 0 }: { rating?: number; count?: number }) => (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                            fill={star <= Math.round(rating) ? '#2F8C6E' : '#E5E7EB'}
                            stroke={star <= Math.round(rating) ? '#2F8C6E' : '#E5E7EB'}
                            strokeWidth="1"
                        />
                    </svg>
                ))}
            </div>
            {count > 0 && <span className="text-xs text-gray-500">{count} review{count !== 1 ? 's' : ''}</span>}
        </div>
    );

    // Product Card
    const ProductCard = ({ product }: { product: Product }) => {
        const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
        const wishlisted = isInWishlist(product.id.toString());
        const isOnSale = !!product.originalPrice;

        return (
            <div className="group">
                <div className="relative overflow-hidden bg-gray-50 aspect-[3/4] mb-3">
                    {product.badge && (
                        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-[#2BBFA4] text-white px-3 py-1 text-xs font-medium rounded-full shadow-sm">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            {product.badge}
                        </div>
                    )}
                    <button
                        onClick={e => {
                            e.preventDefault(); e.stopPropagation();
                            wishlisted
                                ? removeFromWishlist(product.id.toString())
                                : addToWishlist({ id: product.id.toString(), variantId: (product.variants as any[])?.[0]?.id || '', name: product.name, price: product.price, image: product.image, handle: product.handle, variants: product.variants });
                        }}
                        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                        <Heart size={15} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
                    </button>
                    <button
                        onClick={e => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
                        className="hidden md:flex absolute bottom-3 left-3 right-3 z-10 bg-[#007B57] text-white py-2.5 text-sm font-medium hover:bg-[#009A7B] items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                    >
                        <ShoppingCart size={14} /> Quick Add
                    </button>
                    <button
                        onClick={e => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
                        className="absolute bottom-3 right-3 z-10 w-9 h-9 bg-[#007B57] text-white rounded-full flex items-center justify-center md:hidden"
                    >
                        <ShoppingCart size={14} />
                    </button>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="space-y-1.5">
                    <h3 className={`text-sm md:text-base font-normal leading-snug ${isOnSale ? 'text-[#2F8C6E]' : 'text-gray-900'}`}>{product.name}</h3>
                    {product.description && <p className="text-xs text-gray-400 italic leading-tight line-clamp-1">{product.description}</p>}
                    <StarRatingMini rating={4.5} count={0} />
                    <div className="flex items-center gap-2 pt-0.5">
                        <span className={`text-sm font-medium ${isOnSale ? 'text-[#2F8C6E]' : 'text-gray-900'}`}>Rs. {product.price}</span>
                        {isOnSale && <span className="text-xs text-gray-400 line-through">Rs. {product.originalPrice}</span>}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#007B57] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading products...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <button onClick={() => window.location.reload()} className="bg-[#007B57] text-white px-6 py-3 rounded">Retry</button>
            </div>
        </div>
    );

    return (
        <div className={`${totalItems > 0 ? 'pb-20' : ''}`}>
            <div className="min-h-screen bg-white py-8 md:py-12 lg:py-16">
                <div className="w-full px-4 md:px-6 lg:px-8">
                    <div className="max-w-[1600px] mx-auto">

                        {/* BREADCRUMBS */}
                        <div className="py-4">
                            <nav className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                <Link href="/" className="hover:text-[#007B57]">Home</Link>
                                <ChevronRight className="w-4 h-4" />
                                <Link href="/products" className="hover:text-[#007B57]">Products</Link>
                                {filterParam && (
                                    <>
                                        <ChevronRight className="w-4 h-4" />
                                        <span className="text-[#007B57] font-medium">{getPageTitle()}</span>
                                    </>
                                )}
                            </nav>
                        </div>

                        {/* Header */}
                        <div className="mb-12 md:mb-16">
                            <h1 className="text-2xl md:text-3xl lg:text-3xl 2xl:text-4xl font-lexend font-semibold text-[#007B57] mb-4">
                                {getPageTitle()}
                            </h1>
                            <p className="text-gray-600 text-base md:text-l lg:text-l">{getPageDescription()}</p>
                            {filterParam && (
                                <Link href="/products" className="inline-block mt-4 text-[#007B57] hover:text-[#007B57] font-medium underline">
                                    View All Products
                                </Link>
                            )}
                        </div>

                        {/* Filter button row */}
                        <div className="mb-8 flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => setShowFiltersSidebar(true)}
                                className="relative inline-flex items-center gap-2 px-6 py-3 border border-[#007B57] rounded-md text-[#007B57] hover:bg-[#007B57] hover:text-white transition font-medium"
                            >
                                <Filter size={20} />
                                Filter and sort
                                {activeFilterCount > 0 && (
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#007B57] text-white text-xs rounded-full flex items-center justify-center font-bold">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                            <span className="ml-2 text-gray-600 font-medium">{sortedProducts.length} products</span>

                            {/* Active chips */}
                            {selectedColors.map(c => (
                                <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#007B57]/10 text-[#007B57] text-xs font-medium rounded-full">
                                    {c}<button onClick={() => setSelectedColors(p => p.filter(x => x !== c))}><X size={12} /></button>
                                </span>
                            ))}
                            {selectedSizes.map(s => (
                                <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#007B57]/10 text-[#007B57] text-xs font-medium rounded-full">
                                    {s}<button onClick={() => setSelectedSizes(p => p.filter(x => x !== s))}><X size={12} /></button>
                                </span>
                            ))}
                            {selectedCollections.map(h => (
                                <span key={h} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#007B57]/10 text-[#007B57] text-xs font-medium rounded-full">
                                    {collections.find(c => c.handle === h)?.name || h}
                                    <button onClick={() => setSelectedCollections(p => p.filter(x => x !== h))}><X size={12} /></button>
                                </span>
                            ))}
                        </div>

                        {/* Overlay */}
                        {showFiltersSidebar && (
                            <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowFiltersSidebar(false)} />
                        )}

                        {/* ── Filter Sidebar ── */}
                        <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${showFiltersSidebar ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>

                            {/* Sidebar Header */}
                            <div className="bg-gradient-to-r from-[#007B57] to-[#007B57] p-6 flex items-center justify-between flex-shrink-0">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Filters & Sort</h2>
                                    <p className="text-sm text-white/80 mt-1">Customize your search</p>
                                </div>
                                <button onClick={() => setShowFiltersSidebar(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            {/* Sidebar Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">

                                {/* Sort By */}
                                <div className="bg-white rounded-xl p-5 shadow-sm">
                                    <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#007B57] rounded-full"></span>
                                        Sort by
                                    </h3>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#007B57] focus:border-transparent bg-white text-gray-900 font-medium cursor-pointer"
                                    >
                                        <option value="popular">✨ Featured</option>
                                        <option value="newest">🆕 Newest First</option>
                                        <option value="price-low">💰 Price: Low to High</option>
                                        <option value="price-high">💎 Price: High to Low</option>
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div className="bg-white rounded-xl p-5 shadow-sm">
                                    <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#007B57] rounded-full"></span>
                                        Price Range
                                    </h3>

                                    {/* Min / Max display box — unchanged */}
                                    <div className="bg-gradient-to-r from-[#007B57]/5 to-[#007B57]/5 rounded-lg p-4 mb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-center flex-1">
                                                <p className="text-xs text-gray-500 mb-1">Minimum</p>
                                                <p className="text-lg font-bold text-[#007B57]">₹{priceRange[0]}</p>
                                            </div>
                                            <div className="w-px h-8 bg-gray-300 mx-3"></div>
                                            <div className="text-center flex-1">
                                                <p className="text-xs text-gray-500 mb-1">Maximum</p>
                                                <p className="text-lg font-bold text-[#007B57]">₹{priceRange[1]}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Single-line dual range slider */}
                                    <div className="relative h-5 flex items-center">
                                        {/* Grey track */}
                                        <div className="absolute left-0 right-0 h-[3px] bg-gray-200 rounded-full pointer-events-none" />
                                        {/* Green active fill */}
                                        <div
                                            className="absolute h-[3px] bg-[#007B57] rounded-full pointer-events-none"
                                            style={{
                                                left: `${pct(priceRange[0])}%`,
                                                right: `${100 - pct(priceRange[1])}%`,
                                            }}
                                        />
                                        {/* Min thumb */}
                                        <input
                                            type="range"
                                            min="0"
                                            max={sliderMax}
                                            step="100"
                                            value={priceRange[0]}
                                            onChange={(e) => {
                                                const v = Math.min(Number(e.target.value), priceRange[1] - 100);
                                                setPriceRange([v, priceRange[1]]);
                                            }}
                                            className="dual-thumb absolute w-full"
                                        />
                                        {/* Max thumb */}
                                        <input
                                            type="range"
                                            min="0"
                                            max={sliderMax}
                                            step="100"
                                            value={priceRange[1]}
                                            onChange={(e) => {
                                                const v = Math.max(Number(e.target.value), priceRange[0] + 100);
                                                setPriceRange([priceRange[0], v]);
                                            }}
                                            className="dual-thumb absolute w-full"
                                        />
                                    </div>
                                </div>

                                {/* Collections — checkbox accordion */}
                                {collections.length > 0 && (
                                    <div className="bg-white rounded-xl p-5 shadow-sm">
                                        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-[#007B57] rounded-full"></span>
                                            Collections
                                            {selectedCollections.length > 0 && (
                                                <span className="ml-auto text-xs text-[#007B57] font-medium">{selectedCollections.length} selected</span>
                                            )}
                                        </h3>
                                        <div className="space-y-2.5">
                                            {collections.map(col => {
                                                const checked = selectedCollections.includes(col.handle);
                                                return (
                                                    <label key={col.handle} className="flex items-center gap-3 cursor-pointer group/item">
                                                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked ? 'bg-[#007B57] border-[#007B57]' : 'border-gray-300 group-hover/item:border-[#007B57]'}`}>
                                                            {checked && (
                                                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                                    <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            )}
                                                        </span>
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only"
                                                            checked={checked}
                                                            onChange={() =>
                                                                setSelectedCollections(prev =>
                                                                    checked ? prev.filter(h => h !== col.handle) : [...prev, col.handle]
                                                                )
                                                            }
                                                        />
                                                        <span className={`text-sm transition-colors ${checked ? 'text-[#007B57] font-medium' : 'text-gray-700 group-hover/item:text-[#007B57]'}`}>
                                                            {col.name}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Color Filter */}
                                {availableColors.length > 0 && (
                                    <div className="bg-white rounded-xl p-5 shadow-sm">
                                        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-[#007B57] rounded-full"></span>
                                            Color
                                            {selectedColors.length > 0 && (
                                                <span className="ml-auto text-xs text-[#007B57] font-medium">{selectedColors.length} selected</span>
                                            )}
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {availableColors.map(color => {
                                                const key = color.toLowerCase().replace(/\s+/g, '');
                                                const css = cssColorMap[key] ?? '#A0A0A0';
                                                const isLight = lightColors.has(key);
                                                const active = selectedColors.includes(color);
                                                return (
                                                    <button
                                                        key={color}
                                                        title={color}
                                                        onClick={() => setSelectedColors(prev => active ? prev.filter(c => c !== color) : [...prev, color])}
                                                        className="relative flex items-center justify-center transition-transform duration-200 hover:scale-110"
                                                    >
                                                        <span className={`absolute inset-0 rounded-full ${active ? 'ring-2 ring-offset-2 ring-[#007B57]' : ''}`} />
                                                        <span
                                                            className={`w-8 h-8 rounded-full block shadow-sm ${isLight ? 'border border-gray-300' : ''}`}
                                                            style={{ backgroundColor: css }}
                                                        />
                                                        {active && (
                                                            <span className="absolute inset-0 flex items-center justify-center">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isLight ? '#007B57' : 'white'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="20 6 9 17 4 12" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Size Filter */}
                                {availableSizes.length > 0 && (
                                    <div className="bg-white rounded-xl p-5 shadow-sm">
                                        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-[#007B57] rounded-full"></span>
                                            Size
                                            {selectedSizes.length > 0 && (
                                                <span className="ml-auto text-xs text-[#007B57] font-medium">{selectedSizes.length} selected</span>
                                            )}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {availableSizes.map(size => {
                                                const active = selectedSizes.includes(size);
                                                return (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedSizes(prev => active ? prev.filter(s => s !== size) : [...prev, size])}
                                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${active ? 'bg-[#007B57] text-white border-[#007B57] shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:border-[#007B57] hover:text-[#007B57]'}`}
                                                    >
                                                        {size}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Match count */}
                                <div className="bg-[#007B57]/5 rounded-lg p-4 border border-[#007B57]/10">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold text-[#007B57]">{filteredProducts.length}</span> products match your filters
                                    </p>
                                </div>
                            </div>

                            {/* Sidebar Footer */}
                            <div className="bg-white border-t border-gray-200 p-6 flex gap-3 flex-shrink-0">
                                <button
                                    onClick={() => {
                                        setPriceRange([0, sliderMax]);
                                        setSortBy('popular');
                                        setSelectedColors([]);
                                        setSelectedSizes([]);
                                        setSelectedCollections([]);
                                    }}
                                    className="flex-1 text-center px-6 py-3 border-2 border-[#007B57] rounded-lg text-[#007B57] hover:bg-[#007B57]/5 font-semibold transition-colors"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={() => setShowFiltersSidebar(false)}
                                    className="flex-1 bg-[#007B57] text-white font-semibold rounded-lg hover:bg-[#006046] transition-colors py-3 shadow-lg"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>

                        {/* Dual slider styles */}
                        <style jsx global>{`
                            .dual-thumb {
                                -webkit-appearance: none;
                                appearance: none;
                                background: transparent;
                                pointer-events: none;
                                height: 20px;
                                outline: none;
                            }
                            .dual-thumb::-webkit-slider-thumb {
                                -webkit-appearance: none;
                                appearance: none;
                                width: 20px;
                                height: 20px;
                                border-radius: 50%;
                                background: white;
                                border: 3px solid #007B57;
                                cursor: pointer;
                                pointer-events: all;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                                transition: transform 0.2s ease, box-shadow 0.2s ease;
                            }
                            .dual-thumb::-webkit-slider-thumb:hover {
                                transform: scale(1.1);
                                box-shadow: 0 3px 6px rgba(0,123,87,0.3);
                            }
                            .dual-thumb::-moz-range-thumb {
                                width: 20px;
                                height: 20px;
                                border-radius: 50%;
                                background: white;
                                border: 3px solid #007B57;
                                cursor: pointer;
                                pointer-events: all;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                            }
                            .dual-thumb::-webkit-slider-runnable-track { background: transparent; }
                            .dual-thumb::-moz-range-track { background: transparent; }
                        `}</style>

                        {/* Products Grid */}
                        <div className="w-full">
                            {sortedProducts.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                                    {sortedProducts.map((product) => (
                                        <Link key={product.id} href={`/products/${product.handle}`} className="group">
                                            <ProductCard product={product} />
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 lg:py-24">
                                    <p className="text-gray-600 text-lg lg:text-xl mb-4">
                                        No products found {filterParam && `in ${getPageTitle()}`}.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setPriceRange([0, sliderMax]);
                                            setSelectedColors([]);
                                            setSelectedSizes([]);
                                            setSelectedCollections([]);
                                        }}
                                        className="text-teal-600 hover:text-teal-700 font-semibold"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Cart Navigator */}
                {totalItems > 0 && (
                    <div className="fixed z-40 bg-[#F0F4F1] border-t border-gray-200 shadow-lg bottom-[70px] left-3 right-3 sm:bottom-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px] sm:rounded-t-[20px] sm:rounded-b-none p-5 rounded-[20px] sm:p-4 sm:rounded-[16px]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#007B57] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">{totalItems}</div>
                                <div>
                                    <p className="text-sm text-gray-600">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
                                    <p className="font-semibold">Rs. {totalPrice.toFixed(2)}</p>
                                </div>
                            </div>
                            <Link href="/cart" className="bg-[#007B57] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#006046] transition">
                                View Cart
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#007B57] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        }>
            <ProductsPageContent />
        </Suspense>
    );
}