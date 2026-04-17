"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { Phone, MessageSquare, Mail, ChevronRight, ChevronLeft, Heart, ShoppingCart, X, ArrowRight, GraduationCap, Users, Shield } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import TestimonialsSection from "../Home/TestimonialsSection";
import ProductCard from "../ProductCard";
import { getProducts, getCollections, getNewArrivals, getProductsByCollection } from "../../lib/shopify_utilis";
import { homeConfig } from "../../config/home.config";
import Hero from "../../../public/images/hero-image.png";

const ICON_MAP = { GraduationCap, Users, Shield, Phone, MessageSquare, Mail };

// ── Star Rating ──────────────────────────────────────────────────────
function StarRating({ rating = 4, count = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={star <= Math.round(rating) ? '#22c55e' : '#e5e7eb'}
            stroke={star <= Math.round(rating) ? '#22c55e' : '#e5e7eb'}
            strokeWidth="1"
          />
        </svg>
      ))}
      {count > 0 && <span className="text-xs text-gray-400 ml-1">({count})</span>}
    </div>
  );
}

// ── Wishlist Button ──────────────────────────────────────────────────
function WishlistButton({ product, className = "" }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id?.toString());
  return (
    <button
      onClick={(e) => {
        e.preventDefault(); e.stopPropagation();
        wishlisted
          ? removeFromWishlist(product.id?.toString())
          : addToWishlist({
            id: product.id?.toString(),
            variantId: product.variants?.[0]?.id ?? '',
            name: product.name, price: product.price,
            image: product.image, handle: product.handle,
            variants: product.variants,
          });
      }}
      className={`w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-green-50 transition ${className}`}
    >
      <Heart size={14} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
    </button>
  );
}

// Each card navigates to /collections/[handle] on click
function CategoryRow({ categories }) {
  return (
    <div style={{ width: "100%", overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
      <style>{`
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-card:hover .cat-circle { transform: scale(1.06); box-shadow: 0 6px 20px rgba(0,0,0,0.13); border-color: #86efac !important; }
        .cat-card:hover .cat-name { color: #16a34a; }
        @media (max-width: 640px) {
          .cat-circle { width: 80px !important; height: 80px !important; }
          .cat-name { font-size: 12px !important; }
          .cat-count { font-size: 10px !important; }
        }
      `}</style>
      <div
        className="cat-scroll"
        style={{
          display: "flex",
          gap: "0",
          overflowX: "auto",
          scrollbarWidth: "none",
          padding: "8px 0 12px",
          /* Show 6 on desktop, scroll for more; on mobile ~3 visible then scroll */
          justifyContent: "center",
        }}
      >
        {categories.map((cat, idx) => {
          const handle = cat.handle || cat.id || String(idx);
          const href = `/collections/${handle}`;
          return (
            <Link
              key={cat.id || idx}
              href={href}
              className="cat-card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                flexShrink: 0,
                padding: "8px 18px",
                textDecoration: "none",
              }}
            >
              {/* Circle image */}
              <div
                className="cat-circle"
                style={{
                  width: "130px",
                  height: "130px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid #e5e7eb",
                  transition: "all 0.22s ease",
                  background: "linear-gradient(135deg, #f0f7f0, #e3f2e3)",
                  position: "relative",
                }}
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>🪴</div>
                )}
              </div>

              {/* Label */}
              <div style={{ textAlign: "center" }}>
                <p
                  className="cat-name"
                  style={{ fontSize: "15px", fontWeight: 700, color: "#5c5e61", lineHeight: 1.3, margin: 0, transition: "color 0.2s" }}
                >
                  {cat.name}
                </p>

              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────
export default function HomePage() {
  const [selectedSize, setSelectedSize] = useState('M');
  const [bestSellerIndex, setBestSellerIndex] = useState(0);
  const { cartItems, addToCart } = useCart();
  const [saleProducts, setSaleProducts] = useState([]);
  const [products, setProducts] = useState([]); // best sellers fallback
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [featuredCategory, setFeaturedCategory] = useState(null);
  const [newArrivals, setNewArrivals] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const {
    features, bestSellers, help,
    categories: categoriesConfig,
    newArrivals: newArrivalsConfig,
    onSale, workshops: workshopsConfig,
    testimonials: testimonialsConfig,
  } = homeConfig;

  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        const [bestSellersData, saleData, collectionsData, newArrivalsData] = await Promise.all([
          getProductsByCollection(bestSellers.collectionHandle, bestSellers.limit).then(d => d.length > 0 ? d : getProducts(bestSellers.limit)),
          getProductsByCollection(onSale.collectionHandle, onSale.limit).then(d => d.length > 0 ? d : getProducts(onSale.limit)),
          getCollections(20),
          getNewArrivals(newArrivalsConfig.limit).then(d => d && d.length > 0 ? d : getProducts(newArrivalsConfig.limit)),

        ]);
        setProducts(bestSellersData || []);
        setSaleProducts(saleData || []);
        setNewArrivals(newArrivalsData || []);
        const trimmedCategories = (collectionsData || []).slice(0, categoriesConfig.limit);
        setCategories(trimmedCategories);

        if (trimmedCategories.length > 0) {
          const mainCategory = trimmedCategories[0];
          setFeaturedCategory(mainCategory);
          const categoryProductsData = await getProductsByCollection(mainCategory.handle, 8);
          setCategoryProducts(categoryProductsData || []);
        }

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
  }, []);


  const CARDS_PER_PAGE = 4;
  const displayProducts = categoryProducts.length > 0 ? categoryProducts : products;
  const maxIndex = Math.max(0, displayProducts.length - CARDS_PER_PAGE);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button onClick={() => window.location.reload()} className="bg-green-600 text-white px-6 py-2 rounded-lg">Retry</button>
      </div>
    </div>
  );

  const heroProduct = products[0];

  return (
    <div className={`bg-white ${totalItems > 0 ? 'pb-24 sm:pb-20' : ''}`}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="w-full relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0f4ee 0%, #e8f0e4 50%, #f2f5f0 100%)' }}>
        <div className="absolute inset-0 flex items-center justify-start pointer-events-none select-none overflow-hidden">
          <span
            className="font-serif font-black leading-none tracking-tight"
            style={{
              fontSize: 'clamp(80px, 18vw, 220px)',
              color: 'transparent',
              WebkitTextStroke: '2px rgba(160,185,150,0.18)',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              transform: 'translateX(-5%)',
            }}
          >
            GROVES
          </span>
        </div>
        <div className="absolute inset-0 flex items-end justify-start pointer-events-none select-none overflow-hidden pb-2">
          <span
            className="font-serif font-black leading-none tracking-tight"
            style={{
              fontSize: 'clamp(80px, 18vw, 220px)',
              color: 'transparent',
              WebkitTextStroke: '2px rgba(160,185,150,0.13)',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              transform: 'translateX(5%)',
            }}
          >
            BOX
          </span>
        </div>
        <svg className="absolute top-4 right-[42%] opacity-10 pointer-events-none" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <ellipse cx="40" cy="40" rx="18" ry="36" fill="#4ade80" transform="rotate(-30 40 40)" />
          <line x1="40" y1="10" x2="40" y2="70" stroke="#16a34a" strokeWidth="1.5" />
        </svg>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-6">
            <div className="flex-1 z-10">
              <p className="mb-2 text-gray-500" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(18px, 3vw, 28px)' }}>
                Groves Box
              </p>
              <h1 className="font-serif font-extrabold text-gray-900 leading-[1.05] mb-5" style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}>
                Garden<br />Plants
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  href="/collections/sale"
                  className="inline-flex items-center gap-2 bg-[#78A240] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#3a8a5b] transition-all duration-200 shadow-sm"
                >
                  Shop Now
                </Link>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center relative z-10">
              {heroProduct ? (
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full blur-3xl opacity-30"
                    style={{ background: "radial-gradient(circle, #86efac 0%, transparent 70%)", transform: "scale(1.3)" }}
                  />
                  <Image
                    src={Hero}
                    alt={heroProduct.name}
                    width={500}
                    height={500}
                    className="relative w-56 sm:w-72 md:w-80 lg:w-96 object-contain drop-shadow-xl"
                    style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.12))" }}
                  />
                </div>
              ) : (
                <div className="w-64 h-64 flex items-center justify-center text-8xl">🪴</div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          CATEGORIES — Pill/Icon row style
          (like the reference image)
      ══════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="w-full px-5 sm:px-8 lg:px-12 pt-10 pb-4 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{categoriesConfig.title}</h2>
              <Link href={categoriesConfig.viewAllHref} className="text-green-600 text-sm font-semibold hover:underline flex items-center gap-1">
                {categoriesConfig.viewAllText} <ArrowRight size={14} />
              </Link>
            </div>

            {/* Category scroll row — navigates to collection page on click */}
            <CategoryRow categories={categories} />
          </div>
        </section>
      )}


      {/* ══════════════════════════════════════
          NEW ARRIVALS
      ══════════════════════════════════════ */}
      {
        newArrivals.length > 0 && (
          <section className="w-full px-5 sm:px-8 lg:px-12 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{newArrivalsConfig.title}</h2>
                <Link href={newArrivalsConfig.viewAllHref} className="text-green-600 text-sm font-semibold hover:underline flex items-center gap-1">
                  {newArrivalsConfig.viewAllText} <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {newArrivals.slice(0, 4).map(product => (
                  <ProductCard key={`new-${product.id}`} product={product} />
                ))}
              </div>
            </div>
          </section>
        )
      }


      {/* ══════════════════════════════════════
          SPECIAL OFFER BANNER
      ══════════════════════════════════════ */}
      <section className="w-full px-5 sm:px-8 lg:px-12 py-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden bg-[#eef6ee] flex flex-col md:flex-row items-center">
            <div className="flex-1 p-8 sm:p-12 lg:p-16">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-green-600 block mb-4">Special Offer</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                SUCCULENT GARDEN<br />
                <span className="text-green-600">GIFT BOXES</span>
              </h2>
              <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-8">
                Give planter materials to style options, find our which planter is best for your house.
              </p>
              <Link
                href="/collections/gift-boxes"
                className="inline-flex items-center gap-2 border-2 border-gray-900 text-gray-900 px-7 py-3 text-sm font-bold hover:bg-gray-900 hover:text-white transition-all duration-200 rounded-sm"
              >
                Explore The Shop
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
              {saleProducts.length > 0 ? (
                <div className="flex items-end gap-4">
                  <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden border-[6px] border-white shadow-xl">
                    <img src={saleProducts[0].image} alt={saleProducts[0].name} className="w-full h-full object-cover" />
                  </div>
                  {saleProducts[1] && (
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-[6px] border-white shadow-lg mb-4">
                      <img src={saleProducts[1].image} alt={saleProducts[1].name} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-52 h-52 rounded-full bg-green-100 flex items-center justify-center text-7xl">🪴</div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          ON SALE
      ══════════════════════════════════════ */}
      {
        saleProducts.length > 0 && (
          <section className="w-full px-5 sm:px-8 lg:px-12 py-12 bg-[#fafff9]">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{onSale.title}</h2>
                <Link href={onSale.viewAllHref} className="text-green-600 text-sm font-semibold hover:underline flex items-center gap-1">
                  {onSale.viewAllText} <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {saleProducts.slice(0, 4).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )
      }


      {/* ══════════════════════════════════════
          WORKSHOPS & BLOG
      ══════════════════════════════════════ */}
      {
        workshops.length > 0 && (
          <section className="w-full px-5 sm:px-8 lg:px-12 py-12" style={{ backgroundColor: workshopsConfig.bgColor }}>
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{workshopsConfig.title}</h2>
                <p className="text-gray-500">{workshopsConfig.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {workshops.map(w => (
                  <a key={w.id} href="/" className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img src={w.image} alt={w.imageAlt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-full">{w.date}</div>
                      {w.isFree && <div className="absolute bottom-3 left-3 bg-white text-green-700 px-3 py-1 text-xs font-bold rounded-full shadow">FREE</div>}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-800 mb-2 leading-tight group-hover:text-green-700 transition-colors">{w.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{w.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )
      }


      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <TestimonialsSection />


      {/* ══════════════════════════════════════
          BOTTOM CART BAR
      ══════════════════════════════════════ */}
      {totalItems > 0 && (
        <div className="fixed z-40 bg-[#F0F4F1] border-t border-gray-200 shadow-lg bottom-[70px] left-3 right-3 sm:bottom-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px] sm:rounded-t-[20px] sm:rounded-b-none p-5 rounded-[20px] sm:p-4 sm:rounded-[16px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#6b9238] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">{totalItems}</div>
              <div>
                <p className="text-sm text-gray-600">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
                <p className="font-semibold">Rs. {totalPrice.toFixed(2)}</p>
              </div>
            </div>
            <Link href="/cart" className="bg-[#6b9238] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#009A7B] transition">
              View Cart
            </Link>
          </div>
        </div>
      )}

    </div >
  );
}