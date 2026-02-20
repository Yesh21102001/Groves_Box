"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, MessageSquare, Mail, ChevronRight, ChevronLeft, Heart, ShoppingCart, X, ArrowRight, GraduationCap, Users, Shield } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import TestimonialsSection from "../Home/TestimonialsSection";
import { getProducts, getCollections, getNewArrivals, getProductsByCollection } from "../../lib/shopify_utilis";
import { homeConfig } from "../../config/home.config";

// ── Icon map for features strip (add more as needed) ──────────────────
const ICON_MAP = { GraduationCap, Users, Shield, Phone, MessageSquare, Mail };

function IconButton({ icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow hover:bg-black hover:text-white transition"
    >
      {icon}
    </button>
  );
}

export default function HomePage() {
  const [quickView, setQuickView] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { cartItems, addToCart } = useCart();
  const [saleProducts, setSaleProducts] = useState([]);

  const [heroProducts, setHeroProducts] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroIntervalRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // ── Pull config values ────────────────────────────────────────────────
  const { hero, features, bestSellers, help, categories: categoriesConfig,
    newArrivals: newArrivalsConfig, onSale, workshops: workshopsConfig,
    testimonials: testimonialsConfig, badges: BADGE_STYLES } = homeConfig;

  // Badge component — uses config badge styles
  const ProductBadge = ({ badge }) => {
    if (!badge) return null;
    const style = BADGE_STYLES[badge] || { bg: 'bg-gray-700', icon: '' };
    return (
      <div className={`absolute top-3 left-3 z-10 flex items-center gap-1 ${style.bg} text-white px-3 py-1 text-xs font-semibold rounded-full shadow-sm`}>
        <span>{style.icon}</span>
        <span>{badge}</span>
      </div>
    );
  };

  const buildHeroProducts = useCallback((bestSellersArr, sales, arrivals) => {
    const withLabel = (arr, label) => arr.slice(0, 4).map(p => ({ ...p, heroLabel: label }));
    return [
      ...withLabel(arrivals, 'New Arrival'),
      ...withLabel(sales, 'On Sale'),
      ...withLabel(bestSellersArr, 'Best Seller'),
    ];
  }, []);

  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);

        const [bestSellersData, saleData, collectionsData, newArrivalsData] = await Promise.all([
          getProductsByCollection(bestSellers.collectionHandle, bestSellers.limit).then(d => d.length > 0 ? d : getProducts(bestSellers.limit)),
          getProductsByCollection(onSale.collectionHandle, onSale.limit).then(d => d.length > 0 ? d : getProducts(onSale.limit)),
          getCollections(categoriesConfig.limit),
          getNewArrivals(newArrivalsConfig.limit),
        ]);

        setProducts(bestSellersData || []);
        setSaleProducts(saleData || []);
        setCategories(collectionsData || []);
        setNewArrivals(newArrivalsData || []);
        setHeroProducts(buildHeroProducts(bestSellersData || [], saleData || [], newArrivalsData || []));

        try {
          const [testimonialsRes, workshopsRes] = await Promise.all([
            fetch('/data/testimonials.json'),
            fetch(workshopsConfig.dataFile),
          ]);
          if (testimonialsRes.ok) setTestimonials(await testimonialsRes.json());
          if (workshopsRes.ok) setWorkshops(await workshopsRes.json());
        } catch (jsonError) {
          console.log('Optional data not available:', jsonError);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, [buildHeroProducts]);

  // Hero auto-scroll — interval from config
  useEffect(() => {
    if (heroProducts.length === 0) return;
    heroIntervalRef.current = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroProducts.length);
    }, hero.autoPlayInterval);
    return () => clearInterval(heroIntervalRef.current);
  }, [heroProducts.length, hero.autoPlayInterval]);

  const heroNext = () => { clearInterval(heroIntervalRef.current); setHeroIndex(prev => (prev + 1) % heroProducts.length); };
  const heroPrev = () => { clearInterval(heroIntervalRef.current); setHeroIndex(prev => (prev - 1 + heroProducts.length) % heroProducts.length); };

  // Testimonial slider auto-play — interval from config
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % testimonials.length);
    }, testimonialsConfig.autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length, testimonialsConfig.autoPlayInterval]);

  const nextSlide = () => { setCurrentSlide(prev => (prev + 1) % testimonials.length); setIsAutoPlaying(false); };
  const prevSlide = () => { setCurrentSlide(prev => (prev - 1 + testimonials.length) % testimonials.length); setIsAutoPlaying(false); };

  const StarRatingMini = ({ rating = 4, count = 0 }) => (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill="none">
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

  // ── Hero Product Card ─────────────────────────────────────────────────
  const HeroProductCard = ({ product }) => {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const wishlisted = isInWishlist(product.id.toString());
    const badge = product.heroLabel || product.badge;
    const isOnSale = !!product.originalPrice;
    const reviewCount = product.tags?.find(t => /\d+review/i.test(t.replace(/\s/g, '')))
      ? parseInt(product.tags.find(t => /\d+review/i.test(t.replace(/\s/g, ''))))
      : 0;

    const handleQuickAdd = (e) => {
      e.preventDefault(); e.stopPropagation();
      const variantId = product.variants?.[0]?.id;
      if (!variantId) { alert('This product is currently unavailable'); return; }
      addToCart({ id: product.id, variantId, name: product.name, price: product.price, quantity: 1, image: product.image, handle: product.handle, variants: product.variants });
    };

    const handleWishlistToggle = (e) => {
      e.preventDefault(); e.stopPropagation();
      if (wishlisted) removeFromWishlist(product.id.toString());
      else addToWishlist({ id: product.id.toString(), variantId: product.variants?.[0]?.id ?? '', name: product.name, price: product.price, image: product.image, handle: product.handle, variants: product.variants });
    };

    return (
      <Link href={`/products/${product.handle}`} className="group block bg-white h-full">
        <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]">
          <ProductBadge badge={badge} />
          <button onClick={handleWishlistToggle} className="absolute top-2 right-2 z-10 w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center shadow hover:bg-[#007B57] hover:text-white transition">
            <Heart size={16} className={`sm:w-[18px] sm:h-[18px] ${wishlisted ? 'fill-current text-red-500' : ''}`} />
          </button>
          <button onClick={handleQuickAdd} className="hidden md:flex absolute bottom-3 left-3 right-3 z-10 bg-[#007B57] text-white py-2.5 text-sm font-medium hover:bg-[#009A7B] items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <ShoppingCart size={13} /> Quick Add
          </button>
          <button onClick={handleQuickAdd} className="absolute bottom-3 right-3 z-10 w-9 h-9 bg-[#007B57] text-white rounded-full flex items-center justify-center md:hidden">
            <ShoppingCart size={14} />
          </button>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="p-3 space-y-1">
          <h3 className={`text-sm font-medium leading-snug ${isOnSale ? 'text-[#2F8C6E]' : 'text-gray-900'}`}>{product.name}</h3>
          {product.description && <p className="text-xs text-gray-400 italic leading-tight line-clamp-1">{product.description}</p>}
          <StarRatingMini rating={4.5} count={reviewCount} />
          {badge === 'New Arrival' && <p className="text-xs text-[#2F8C6E] font-medium">Now available in giant 6&apos;-7&apos; sizes!</p>}
          <div className="flex items-center gap-2 pt-0.5">
            <span className={`text-sm font-semibold ${isOnSale ? 'text-[#2F8C6E]' : 'text-gray-900'}`}>
              {isOnSale ? `From Rs. ${product.price}` : `Rs. ${product.price}`}
            </span>
            {isOnSale && <span className="text-xs text-gray-400 line-through">Rs. {product.originalPrice}</span>}
          </div>
        </div>
      </Link>
    );
  };

  // ── Standard Product Card ─────────────────────────────────────────────
  const ProductCard = ({ product }) => {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const wishlisted = isInWishlist(product.id.toString());
    const isOnSale = !!product.originalPrice;
    const reviewCount = product.tags?.find(t => /\d+review/i.test(t.replace(/\s/g, '')))
      ? parseInt(product.tags.find(t => /\d+review/i.test(t.replace(/\s/g, ''))))
      : 0;

    const handleQuickAdd = (e) => {
      e.preventDefault(); e.stopPropagation();
      const variantId = product.variants?.[0]?.id;
      if (!variantId) { alert('This product is currently unavailable'); return; }
      addToCart({ id: product.id, variantId, name: product.name, price: product.price, quantity: 1, image: product.image, handle: product.handle, variants: product.variants });
    };

    const handleWishlistToggle = (e) => {
      e.preventDefault(); e.stopPropagation();
      if (wishlisted) removeFromWishlist(product.id.toString());
      else addToWishlist({ id: product.id.toString(), variantId: product.variants?.[0]?.id ?? '', name: product.name, price: product.price, image: product.image, handle: product.handle, variants: product.variants });
    };

    return (
      <Link href={`/products/${product.handle}`} className="group block">
        <div className="relative overflow-hidden bg-gray-50 aspect-[3/4] mb-3">
          <ProductBadge badge={product.badge} />
          <button onClick={handleWishlistToggle} className="absolute top-2 right-2 z-10 w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center shadow hover:bg-[#007B57] hover:text-white transition">
            <Heart size={16} className={`sm:w-[18px] sm:h-[18px] ${wishlisted ? 'fill-current text-red-500' : ''}`} />
          </button>
          <button onClick={handleQuickAdd} className="hidden md:flex absolute bottom-3 left-3 right-3 z-10 bg-[#007B57] text-white py-2.5 text-sm font-medium hover:bg-[#009A7B] items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <ShoppingCart size={13} /> Quick Add
          </button>
          <button onClick={handleQuickAdd} className="absolute bottom-3 right-3 z-10 w-9 h-9 bg-[#007B57] text-white rounded-full flex items-center justify-center md:hidden">
            <ShoppingCart size={14} />
          </button>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="space-y-1.5">
          <h3 className={`text-sm md:text-base font-normal leading-snug ${isOnSale ? 'text-[#2F8C6E]' : 'text-gray-900'}`}>{product.name}</h3>
          {product.description && <p className="text-xs text-gray-400 italic leading-tight line-clamp-1">{product.description}</p>}
          <StarRatingMini rating={4.5} count={reviewCount} />
          <div className="flex items-center gap-2 pt-0.5">
            <span className={`text-sm font-medium ${isOnSale ? 'text-[#2F8C6E]' : 'text-gray-900'}`}>
              {isOnSale ? `From Rs. ${product.price}` : `Rs. ${product.price}`}
            </span>
            {isOnSale && <span className="text-xs text-gray-400 line-through">Rs. {product.originalPrice}</span>}
          </div>
        </div>
      </Link>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#244033] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 mb-4">Error loading data: {error}</p>
        <button onClick={() => window.location.reload()} className="bg-[#244033] text-white px-6 py-3 rounded">Retry</button>
      </div>
    </div>
  );

  return (
    <div className={`bg-white ${totalItems > 0 ? 'pb-20' : ''}`}>

      {/* ===================== HERO ===================== */}
      <section className="w-full flex flex-col lg:flex-row overflow-hidden min-h-[620px] lg:min-h-[800px]" style={{ backgroundColor: hero.bgColor }}>

        {/* LEFT: promo text — all values from config */}
        <div className="flex-shrink-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16 pt-10 pb-6 lg:py-0 lg:w-[340px] xl:w-[550px]">
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4">
            {hero.heading}
          </h1>
          <p className="text-white/80 text-base mb-8">{hero.subheading}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={hero.primaryButton.href} className="px-5 py-3 bg-white text-black text-sm font-semibold transition-colors rounded-sm">
              {hero.primaryButton.text}
            </Link>
            <Link href={hero.secondaryButton.href} className="px-5 py-3 bg-white/10 border border-white text-white text-sm font-semibold hover:bg-white/20 transition-colors rounded-sm">
              {hero.secondaryButton.text}
            </Link>
          </div>
        </div>

        {/* RIGHT: Product slider */}
        <div className="flex-1 relative flex items-center min-h-[460px] lg:min-h-0 overflow-hidden">
          {heroProducts.length === 0 ? (
            <div className="flex-1 h-full bg-[url('/images/Groves_Box_mobile.png')] sm:bg-[url('/images/Groves%20Box.png')] bg-cover bg-center" />
          ) : (
            <>
              <div className="flex sm:hidden w-full h-full items-stretch overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pl-3 pr-6">
                {heroProducts.map((product, i) => (
                  <div key={i} className="snap-start flex-shrink-0 w-[75vw] max-w-[300px] self-center">
                    <HeroProductCard product={product} />
                  </div>
                ))}
              </div>
              <div className="hidden sm:flex lg:hidden w-full h-full items-center gap-4 px-12 justify-center">
                {[0, 1].map(offset => (
                  <div key={offset} className="w-[45%] max-w-[350px]">
                    <HeroProductCard product={heroProducts[(heroIndex + offset) % heroProducts.length]} />
                  </div>
                ))}
              </div>
              <div className="hidden lg:flex w-full h-full items-center gap-6 px-12 justify-center">
                {[0, 1, 2].map(offset => (
                  <div key={offset} className="w-[30%] max-w-[350px]">
                    <HeroProductCard product={heroProducts[(heroIndex + offset) % heroProducts.length]} />
                  </div>
                ))}
              </div>
              <button
                onClick={heroPrev}
                aria-label="Previous product"
                className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 
             z-20 w-10 h-10 bg-white/90 hover:bg-[#009A7B] 
             rounded-full items-center justify-center 
             shadow-md transition-all hover:scale-110 group"
              >
                <ChevronLeft
                  size={20}
                  className="text-[#244033] group-hover:text-white transition-colors"
                />
              </button>
              <button onClick={heroNext} aria-label="Next product"
                className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2
               z-20 w-10 h-10 bg-white/90 hover:bg-[#009A7B]
                rounded-full items-center justify-center
                 shadow-md transition-all hover:scale-110 group">
                <ChevronRight size={20}
                  className="text-[#244033] group-hover:text-white transition-colors" />
              </button>
            </>
          )}
        </div>
      </section>


      {/* ===================== FEATURES STRIP ===================== */}
      <section className="w-full py-12 md:py-14" style={{ backgroundColor: features.bgColor }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
            {features.items.map((feature, index) => {
              const Icon = ICON_MAP[feature.icon];
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="mb-3">
                    {Icon && <Icon className="w-8 h-8 text-[#007B57]" strokeWidth={1.5} />}
                  </div>
                  <h3 className="text-base font-semibold text-[#007B57] mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed max-w-xs">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ===================== BEST SELLERS ===================== */}
      {products.length > 0 && (
        <section className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl sm:text-3xl 2xl:text-3xl font-lexend font-semibold text-[#007B57]">
                {bestSellers.title}
              </h2>
              <Link href={bestSellers.viewAllHref} className="group inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-white border-2 border-[#007B57] text-[#007B57] font-medium text-xs sm:text-sm md:text-base tracking-wide hover:bg-[#007B57] hover:text-white transition-all duration-300 rounded-none whitespace-nowrap flex-shrink-0">
                <span>{bestSellers.viewAllText}</span>
                <ArrowRight size={16} className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {products.slice(0, bestSellers.limit).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* QUICK VIEW MODAL */}
      {quickView && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white max-w-lg w-full rounded-lg p-6 relative">
            <button onClick={() => setQuickView(null)} className="absolute top-4 right-4"><X size={20} /></button>
            <img src={quickView.image} alt={quickView.name} className="w-full h-64 object-cover rounded mb-4" />
            <h3 className="text-xl font-sans mb-2">{quickView.name}</h3>
            <p className="text-gray-600 mb-4">{quickView.description}</p>
            <button
              onClick={() => {
                const variantId = quickView.variants?.[0]?.id;
                if (variantId) addToCart({ id: quickView.id, variantId, name: quickView.name, price: quickView.price, quantity: 1, image: quickView.image, handle: quickView.handle, variants: quickView.variants });
                setQuickView(null);
              }}
              className="w-full bg-[#244033] text-white py-3"
            >
              Add to Cart — Rs. {quickView.price}
            </button>
          </div>
        </div>
      )}


      {/* ===================== HELP SECTION ===================== */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-20 lg:py-28" style={{ backgroundColor: help.bgColor }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <p className="text-sm tracking-wide uppercase text-gray-600 mb-6">{help.label}</p>
              <h2 className="text-2xl sm:text-3xl 2xl:text-3xl font-lexend font-semibold text-[#007B57]">{help.title}</h2>
              <p className="text-lg md:text-l text-gray-600 leading-relaxed max-w-xl">{help.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {help.channels.map((channel, i) => {
                const Icon = ICON_MAP[channel.icon];
                return (
                  <div key={i} className="bg-white text-center p-10">
                    {Icon && <Icon size={36} className="mx-auto mb-6 text-[#007B57]" />}
                    <h3 className="text-lg font-medium text-[#007B57] mb-2">{channel.title}</h3>
                    <p className="text-sm text-gray-600">{channel.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>


      {/* ===================== CATEGORIES ===================== */}
      {categories.length > 0 && (
        <section className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="w-full px-4 md:px-6 lg:px-8">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex items-center justify-between gap-3 mb-8 md:mb-10 lg:mb-12 xl:mb-14">
                <h2 className="text-xl sm:text-2xl lg:text-3xl 2xl:text-3xl font-lexend font-semibold text-[#007B57]">
                  {categoriesConfig.title}
                </h2>
                <Link href={categoriesConfig.viewAllHref} className="group inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-white border-2 border-[#007B57] text-[#007B57] font-medium text-xs sm:text-sm md:text-base tracking-wide hover:bg-[#007B57] hover:text-white transition-all duration-300 rounded-none whitespace-nowrap flex-shrink-0">
                  <span>{categoriesConfig.viewAllText}</span>
                  <ArrowRight size={16} className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {categories.slice(0, categoriesConfig.limit).map((category) => (
                  <Link key={category.id} href={category.link} className="group block">
                    <div className="relative overflow-hidden aspect-[3/4]">
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                    </div>
                    <div className="mt-3">
                      <h3 className="inline-flex items-center gap-2 text-gray-800 text-sm sm:text-base md:text-lg lg:text-lg font-serif font-light leading-none transition-colors duration-300 group-hover:text-emerald-700">
                        <span>{category.name}</span>
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}


      {/* ===================== NEW ARRIVALS ===================== */}
      {newArrivals.length > 0 && (
        <section className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl sm:text-3xl 2xl:text-3xl font-lexend font-semibold text-[#007B57]">
                {newArrivalsConfig.title}
              </h2>
              <Link href={newArrivalsConfig.viewAllHref} className="group inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-white border-2 border-[#007B57] text-[#007B57] font-medium text-xs sm:text-sm md:text-base tracking-wide hover:bg-[#007B57] hover:text-white transition-all duration-300 rounded-none whitespace-nowrap flex-shrink-0">
                <span>{newArrivalsConfig.viewAllText}</span>
                <ArrowRight size={16} className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {newArrivals.slice(0, newArrivalsConfig.limit).map((product) => (
                <ProductCard key={`new-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ===================== ON SALE ===================== */}
      {saleProducts.length > 0 && (
        <section className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl sm:text-3xl 2xl:text-3xl font-lexend font-semibold text-[#007B57]">
                {onSale.title}
              </h2>
              <Link href={onSale.viewAllHref} className="group inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-white border-2 border-[#007B57] text-[#007B57] font-medium text-xs sm:text-sm md:text-base tracking-wide hover:bg-[#007B57] hover:text-white transition-all duration-300 rounded-none whitespace-nowrap flex-shrink-0">
                <span>{onSale.viewAllText}</span>
                <ArrowRight size={16} className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {saleProducts.slice(0, onSale.limit).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ===================== WORKSHOPS & BLOG ===================== */}
      {workshops.length > 0 && (
        <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 sm:py-16 md:py-20 lg:py-24" style={{ backgroundColor: workshopsConfig.bgColor }}>
          <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-8 md:mb-12 lg:mb-16">
              <div>
                <h2 className="text-2xl sm:text-3xl 2xl:text-3xl font-lexend font-semibold text-[#007B57]">
                  {workshopsConfig.title}
                </h2>
                <p className="text-base sm:text-l md:text-l lg:text-l text-gray-600 max-w-2xl">
                  {workshopsConfig.subtitle}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl:gap-12">
              {workshops.map((workshop) => (
                <a key={workshop.id} href="#" className="group block bg-white rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img src={workshop.image} alt={workshop.imageAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-teal-400 text-white px-3 py-1.5 text-sm font-medium rounded">{workshop.date}</div>
                    {workshop.isFree && <div className="absolute bottom-4 left-4 bg-white text-teal-600 px-3 py-1 text-xs font-semibold rounded">FREE</div>}
                  </div>
                  <div className="p-5 md:p-6 lg:p-7">
                    <h3 className="text-xl md:text-xl lg:text-xl font-normal text-[#007B57] font-bold mb-3 md:mb-4 leading-tight group-hover:text-gray-700 transition-colors">{workshop.title}</h3>
                    <p className="text-sm md:text-base lg:text-l text-gray-600 leading-relaxed">{workshop.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ===================== TESTIMONIALS ===================== */}
      <TestimonialsSection />


      {/* Bottom Cart Navigator */}
      {totalItems > 0 && (
        <div className="fixed z-40 bg-[#F0F4F1] border-t border-gray-200 shadow-lg bottom-[70px] left-3 right-3 sm:bottom-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px] sm:rounded-t-[20px] sm:rounded-b-none p-5 rounded-[20px] sm:p-4 sm:rounded-[16px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#007B57] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">{totalItems}</div>
              <div>
                <p className="text-sm text-gray-600">{totalItems} item{totalItems > 1 ? "s" : ""}</p>
                <p className="font-semibold">Rs. {totalPrice.toFixed(2)}</p>
              </div>
            </div>
            <Link href="/cart" className="bg-[#007B57] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#009A7B] transition">View Cart</Link>
          </div>
        </div>
      )}

    </div>
  );
}