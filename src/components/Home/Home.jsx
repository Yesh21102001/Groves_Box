"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { Phone, MessageSquare, Mail, ChevronRight, ChevronLeft, Heart, ShoppingCart, X, ArrowRight, ArrowUp, GraduationCap, Users, Shield } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import TestimonialsSection from "../Home/TestimonialsSection";
import IndoorPlantsSlider from "../Home/IndoorPlantsSlider";
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

const featuredCollection = {
  handle: "Gift Box",
  label: "Gift BOX –",
  discount: "35%",
  titleAfter: "Off All Gifts Box!",
  description:
    "One simple and rewarding way to make a difference is by incorporating at-home composting and reusing materials into your gardening routine.",
  cta: "Explore More",
  image: "/images/2148488544.jpg",
};

// ── Category Row ─────────────────────────────────────────────────────
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
  const [products, setProducts] = useState([]);
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
          HERO — Boutique Plants. Big Love.
      ══════════════════════════════════════ */}
      <section
        className="w-full relative overflow-hidden"
        style={{
          background: 'linear-gradient(120deg, #e8f0e3 0%, #eef5ea 40%, #e4efdc 100%)',
        }}
      >
        {/* ── Decorative layer (absolute, non-interactive) ── */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">

          {/* Trailing ivy vine — top-left */}
          <svg
            className="absolute -top-4 -left-4 md:left-0"
            width="260"
            height="640"
            viewBox="0 0 260 640"
            fill="none"
            style={{ opacity: 0.85 }}
          >
            {/* Main vine stem */}
            <path
              d="M 30 0 Q 50 80 40 160 Q 25 240 55 320 Q 80 400 45 480 Q 30 560 60 640"
              stroke="#6b8e4e"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />
            {/* Leaves scattered along the vine */}
            {[
              { x: 45, y: 30, r: -20, s: 1 },
              { x: 20, y: 90, r: 40, s: 1.1 },
              { x: 70, y: 140, r: -30, s: 0.9 },
              { x: 15, y: 200, r: 25, s: 1.2 },
              { x: 85, y: 260, r: -45, s: 1 },
              { x: 25, y: 320, r: 15, s: 1.1 },
              { x: 80, y: 380, r: -25, s: 0.95 },
              { x: 10, y: 440, r: 50, s: 1.15 },
              { x: 70, y: 500, r: -35, s: 1 },
              { x: 30, y: 560, r: 20, s: 1.05 },
              { x: 85, y: 610, r: -40, s: 0.9 },
            ].map((leaf, i) => (
              <g key={i} transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.r}) scale(${leaf.s})`}>
                <path
                  d="M0 0 Q -8 -18 0 -30 Q 8 -18 0 0 Z"
                  fill="#5a8a3e"
                  opacity="0.75"
                />
                <path
                  d="M0 0 L 0 -28"
                  stroke="#3d6428"
                  strokeWidth="0.8"
                />
              </g>
            ))}
            {/* Additional cluster leaves */}
            {[
              { x: 50, y: 50 },
              { x: 35, y: 180 },
              { x: 65, y: 420 },
            ].map((leaf, i) => (
              <g key={`c${i}`} transform={`translate(${leaf.x}, ${leaf.y})`}>
                <ellipse cx="0" cy="0" rx="14" ry="8" fill="#78a255" opacity="0.6" transform="rotate(-30)" />
                <ellipse cx="4" cy="6" rx="10" ry="6" fill="#5a8a3e" opacity="0.7" transform="rotate(20)" />
              </g>
            ))}
          </svg>

          {/* Hanging planter — top-right */}
          <svg
            className="absolute top-0 right-4 sm:right-12 hidden sm:block"
            width="140"
            height="260"
            viewBox="0 0 140 260"
            fill="none"
            style={{ opacity: 0.9 }}
          >
            {/* Hanging strings */}
            <line x1="30" y1="0" x2="55" y2="95" stroke="#a8a8a8" strokeWidth="1" />
            <line x1="110" y1="0" x2="85" y2="95" stroke="#a8a8a8" strokeWidth="1" />
            <line x1="70" y1="0" x2="70" y2="95" stroke="#a8a8a8" strokeWidth="1" />
            {/* Pot */}
            <ellipse cx="70" cy="100" rx="30" ry="8" fill="#e8e8e8" />
            <path d="M 42 100 Q 45 135 55 145 Q 70 150 85 145 Q 95 135 98 100 Z" fill="#f0f0f0" stroke="#d0d0d0" strokeWidth="1" />
            {/* Cascading leaves */}
            {[
              { x: 60, y: 100, len: 90, rot: -15 },
              { x: 70, y: 95, len: 120, rot: 5 },
              { x: 80, y: 100, len: 100, rot: 20 },
              { x: 55, y: 95, len: 80, rot: -30 },
              { x: 85, y: 95, len: 110, rot: 30 },
            ].map((v, i) => (
              <g key={i}>
                <path
                  d={`M ${v.x} ${v.y} Q ${v.x - 8 + i * 3} ${v.y + v.len / 2} ${v.x + v.rot / 3} ${v.y + v.len}`}
                  stroke="#5a8a3e"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.8"
                />
                {/* Leaves on vines */}
                {[0.25, 0.5, 0.75, 0.95].map((t, j) => {
                  const lx = v.x + (v.rot / 3) * t;
                  const ly = v.y + v.len * t;
                  return (
                    <ellipse
                      key={j}
                      cx={lx + (j % 2 ? 6 : -6)}
                      cy={ly}
                      rx="5"
                      ry="3"
                      fill="#6b9b48"
                      opacity="0.75"
                      transform={`rotate(${v.rot + (j % 2 ? 30 : -30)} ${lx} ${ly})`}
                    />
                  );
                })}
              </g>
            ))}
          </svg>

          {/* Blurred floating leaves — atmospheric depth */}
          <div
            className="absolute top-20 right-1/3 w-40 h-40 blur-2xl"
            style={{ background: 'radial-gradient(ellipse, rgba(134,239,172,0.35) 0%, transparent 70%)' }}
          />
          <div
            className="absolute top-1/2 left-1/3 w-32 h-32 blur-xl"
            style={{ background: 'radial-gradient(ellipse, rgba(163,213,133,0.3) 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-10 right-1/4 w-48 h-32 blur-2xl"
            style={{ background: 'radial-gradient(ellipse, rgba(134,239,172,0.25) 0%, transparent 70%)' }}
          />

          {/* Single detailed falling leaf — bottom-right */}
          <svg
            className="absolute bottom-8 right-16 hidden md:block"
            width="120"
            height="60"
            viewBox="0 0 120 60"
            fill="none"
            style={{ opacity: 0.45, filter: 'blur(0.5px)' }}
          >
            <path
              d="M 10 30 Q 30 10 60 15 Q 90 20 110 35 Q 90 45 60 42 Q 30 38 10 30 Z"
              fill="#86c05a"
              opacity="0.6"
            />
            <path d="M 10 30 L 110 35" stroke="#5a8a3e" strokeWidth="0.8" opacity="0.5" />
          </svg>
        </div>

        {/* ── Main content ── */}
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-20 md:py-24 lg:py-28">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-8 lg:gap-16">

            {/* LEFT — Plant image with floating info card */}
            <div className="flex-1 relative flex items-center justify-center w-full order-2 md:order-1">
              <div className="relative">
                {/* Soft glow behind plant */}
                <div
                  className="absolute inset-0 rounded-full blur-3xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(134,239,172,0.35) 0%, transparent 65%)',
                    transform: 'scale(1.2)',
                  }}
                />

                {heroProduct ? (
                  <Image
                    src={Hero}
                    alt="Boutique Indoor Plant"
                    width={520}
                    height={520}
                    priority
                    className="relative w-64 sm:w-80 md:w-80 lg:w-[440px] object-contain"
                    style={{ filter: 'drop-shadow(0 30px 50px rgba(30,70,40,0.25))' }}
                  />
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center text-8xl">🪴</div>
                )}

                {/* Floating info pill card */}
                <div
                  className="absolute -bottom-2 left-0 sm:-left-4 md:-left-8 bg-white rounded-full pl-1.5 pr-6 py-1.5 flex items-center gap-3 z-10"
                  style={{ boxShadow: '0 10px 30px rgba(30,70,40,0.12), 0 2px 8px rgba(0,0,0,0.04)' }}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6B9238 0%, #8CAB4F 100%)' }}
                  >
                    <ArrowUp size={18} strokeWidth={2.5} className="text-white" />
                  </div>
                  <p className="text-[13px] sm:text-sm font-medium text-gray-700 leading-snug">
                    A peaceful, air-purifying<br />indoor plant
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT — Text content */}
            <div className="flex-1 z-10 order-1 md:order-2 text-center md:text-left">

              {/* Pill badge with dots */}
              <div
                className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-6 sm:mb-7"
                style={{ background: 'rgba(184, 214, 168, 0.55)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a2e]" />
                <span className="text-[13px] sm:text-sm font-medium text-[#1e3a2e] tracking-wide">
                  Welcome Agritourism Company
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a2e]" />
              </div>

              {/* Main heading */}
              <h1
                className="font-bold leading-[1.02] mb-6 tracking-tight"
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  color: '#1e3a2e',
                  fontSize: 'clamp(40px, 6.5vw, 80px)',
                }}
              >
                Boutique Plants.
                <br />
                Big Love.
              </h1>

              {/* Description */}
              <p
                className="text-gray-600 leading-relaxed mb-8 max-w-md mx-auto md:mx-0"
                style={{ fontSize: 'clamp(14px, 1.5vw, 16px)' }}
              >
                This text is a temporary placeholder and needs to be replaced with
                SEO-friendly content and relevant keyword.
              </p>

              {/* CTA button */}
              <Link
                href="/collections/all"
                className="inline-flex items-center justify-center gap-2 text-white px-9 py-4 rounded-full text-base font-medium transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #6B9238 0%, #8CAB4F 100%)',
                  boxShadow: '0 8px 20px rgba(30,90,46,0.3)',
                }}
              >
                Explore More
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="w-full px-5 sm:px-8 lg:px-12 pt-10 pb-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{categoriesConfig.title}</h2>
              <Link href={categoriesConfig.viewAllHref} className="text-green-600 text-sm font-semibold hover:underline flex items-center gap-1">
                {categoriesConfig.viewAllText} <ArrowRight size={14} />
              </Link>
            </div>
            <CategoryRow categories={categories} />
          </div>
        </section>
      )}


      {/* ══════════════════════════════════════
          NEW ARRIVALS
      ══════════════════════════════════════ */}
      {newArrivals.length > 0 && (
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
      )}


      {/* ══════════════════════════════════════
          SPECIAL OFFER BANNER
      ══════════════════════════════════════ */}
      <section className="w-full px-5 sm:px-8 lg:px-12 py-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden flex flex-col md:flex-row items-stretch min-h-[320px] lg:min-h-[380px]">
            <div className="flex-1 bg-gradient-to-br from-[#8CAB4F] to-[#C2DEA3] p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <span className="text-sm font-medium text-white/90 block mb-3">
                {featuredCollection.label}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="inline-flex items-center bg-white/95 text-green-800 px-3 py-1 rounded-md text-xl sm:text-2xl lg:text-3xl font-extrabold">
                  {featuredCollection.discount}
                </span>
                <span>{featuredCollection.titleAfter}</span>
              </h2>
              <p className="text-sm text-white/80 max-w-md leading-relaxed mb-7">
                {featuredCollection.description}
              </p>
              <Link
                href={`/collections/${featuredCollection.handle}`}
                className="inline-flex w-fit items-center gap-2 bg-[#6B9238] hover:bg-[#8CAB4F] text-white px-6 py-3 text-sm font-semibold rounded-md transition-all duration-200 shadow-md"
              >
                {featuredCollection.cta}
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex-1 relative min-h-[240px] md:min-h-0">
              <img
                src={featuredCollection.image}
                alt={featuredCollection.titleAfter}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          ON SALE
      ══════════════════════════════════════ */}
      {saleProducts.length > 0 && (
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
      )}


      {/* ══════════════════════════════════════
          WORKSHOPS & BLOG
      ══════════════════════════════════════ */}
      {workshops.length > 0 && (
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
      )}

      <IndoorPlantsSlider />

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
            <Link href="/cart" className="bg-[#6b9238] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#8CAB4F] transition">
              View Cart
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}