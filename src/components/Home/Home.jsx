"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Phone,
  MessageSquare,
  Mail,
  ChevronRight,
  ChevronLeft,
  Heart,
  ShoppingCart,
  X,
  ArrowRight,
  ArrowUp,
  GraduationCap,
  Users,
  Shield,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import TestimonialsSection from "../Home/TestimonialsSection";
import IndoorPlantsSlider from "../Home/IndoorPlantsSlider";
import ProductCard from "../ProductCard";
import {
  getProducts,
  getCollections,
  getNewArrivals,
  getProductsByCollection,
} from "../../lib/shopify_utilis";
import { homeConfig } from "../../config/home.config";

const ICON_MAP = { GraduationCap, Users, Shield, Phone, MessageSquare, Mail };

// ── Star Rating ──────────────────────────────────────────────────────
function StarRating({ rating = 4, count = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={star <= Math.round(rating) ? "#22c55e" : "#e5e7eb"}
            stroke={star <= Math.round(rating) ? "#22c55e" : "#e5e7eb"}
            strokeWidth="1"
          />
        </svg>
      ))}
      {count > 0 && (
        <span className="text-xs text-gray-400 ml-1">({count})</span>
      )}
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
        e.preventDefault();
        e.stopPropagation();
        wishlisted
          ? removeFromWishlist(product.id?.toString())
          : addToWishlist({
              id: product.id?.toString(),
              variantId: product.variants?.[0]?.id ?? "",
              name: product.name,
              price: product.price,
              image: product.image,
              handle: product.handle,
              variants: product.variants,
            });
      }}
      className={`w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-green-50 transition ${className}`}
    >
      <Heart
        size={14}
        className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
      />
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

// ── Section Header (unified across all sections) ─────────────────────
function SectionHeader({ eyebrow, title, href, linkText }) {
  return (
    <div className="flex items-end justify-between mb-8 gap-4">
      <div>
        {eyebrow && (
          <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#6B9238] mb-2">
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B9238] hover:gap-2.5 hover:text-[#557420] transition-all duration-200"
        >
          {linkText} <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}

// ── Category Row ─────────────────────────────────────────────────────
function CategoryRow({ categories }) {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style>{`
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-card:hover .cat-circle { transform: translateY(-4px) scale(1.04); box-shadow: 0 10px 28px rgba(107,146,56,0.22); border-color: #b6d68a !important; }
        .cat-card:hover .cat-name { color: #6B9238; }
        @media (max-width: 640px) {
          .cat-circle { width: 84px !important; height: 84px !important; }
          .cat-name { font-size: 12px !important; }
        }
      `}</style>
      <div
        className="cat-scroll"
        style={{
          display: "flex",
          gap: "4px",
          overflowX: "auto",
          scrollbarWidth: "none",
          padding: "8px 0 16px",
          justifyContent: "flex-start",
          flexWrap: "nowrap",
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
                  width: "124px",
                  height: "124px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid #eef2eb",
                  transition: "all 0.28s cubic-bezier(0.22,1,0.36,1)",
                  background: "linear-gradient(135deg, #f4f9f0, #e3f2e3)",
                  position: "relative",
                }}
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2.5rem",
                    }}
                  >
                    🪴
                  </div>
                )}
              </div>
              <div style={{ textAlign: "center" }}>
                <p
                  className="cat-name"
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#5c5e61",
                    lineHeight: 1.3,
                    margin: 0,
                    transition: "color 0.2s",
                  }}
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
  const [selectedSize, setSelectedSize] = useState("M");
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
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const {
    features,
    bestSellers,
    help,
    categories: categoriesConfig,
    newArrivals: newArrivalsConfig,
    onSale,
    workshops: workshopsConfig,
    testimonials: testimonialsConfig,
  } = homeConfig;

  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        const [bestSellersData, saleData, collectionsData, newArrivalsData] =
          await Promise.all([
            getProductsByCollection(
              bestSellers.collectionHandle,
              bestSellers.limit,
            ).then((d) => (d.length > 0 ? d : getProducts(bestSellers.limit))),
            getProductsByCollection(onSale.collectionHandle, onSale.limit).then(
              (d) => (d.length > 0 ? d : getProducts(onSale.limit)),
            ),
            getCollections(20),
            getNewArrivals(newArrivalsConfig.limit).then((d) =>
              d && d.length > 0 ? d : getProducts(newArrivalsConfig.limit),
            ),
          ]);
        setProducts(bestSellersData || []);
        setSaleProducts(saleData || []);
        setNewArrivals(newArrivalsData || []);
        const trimmedCategories = (collectionsData || []).slice(
          0,
          categoriesConfig.limit,
        );
        setCategories(trimmedCategories);

        if (trimmedCategories.length > 0) {
          const mainCategory = trimmedCategories[0];
          setFeaturedCategory(mainCategory);
          const categoryProductsData = await getProductsByCollection(
            mainCategory.handle,
            8,
          );
          setCategoryProducts(categoryProductsData || []);
        }

        try {
          const [testimonialsRes, workshopsRes] = await Promise.all([
            fetch("/data/testimonials.json"),
            fetch(workshopsConfig.dataFile),
          ]);
          if (testimonialsRes.ok) setTestimonials(await testimonialsRes.json());
          if (workshopsRes.ok) setWorkshops(await workshopsRes.json());
        } catch (jsonError) {
          console.log("Optional data not available:", jsonError);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  const CARDS_PER_PAGE = 4;
  const displayProducts =
    categoryProducts.length > 0 ? categoryProducts : products;
  const maxIndex = Math.max(0, displayProducts.length - CARDS_PER_PAGE);

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading…</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );

  const heroProduct = products[0];

  return (
    <div className={`bg-white ${totalItems > 0 ? "pb-24 sm:pb-20" : ""}`}>
      
      {/* ══════════════════════════════════════
    HERO — Premium Gardening Experience
══════════════════════════════════════ */}
      <section className="w-full relative bg-gradient-to-br from-white via-[#f9fdf7] to-[#f0f7f0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px] md:min-h-[600px] py-12 md:py-20">
            
            {/* Left Content */}
            <div className="flex flex-col justify-center z-10">

              {/* Eyebrow badge */}
              <span className="inline-flex w-fit items-center gap-2 bg-green-100/70 text-[#557420] text-xs font-semibold uppercase tracking-[0.16em] px-4 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#78a240]" />
                Fresh Greens, Delivered
              </span>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.08] mb-5 tracking-tight">
                Transform Your Space Into a{" "}
                <span className="bg-gradient-to-r from-[#78a240] to-[#557420] bg-clip-text text-transparent">
                  Green Paradise
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
                Discover curated plants, expert gardening guides, and everything you need to cultivate a thriving indoor garden.
              </p>

              {/* Features List */}
              <div className="flex flex-col gap-3 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Premium quality plants & accessories</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Fast & reliable delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">Expert gardening support</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="/collections"
                  className="btn-primary"
                >
                  Explore Collections
                </Link>
                <Link
                  href="/about"
                  className="btn-outline"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden md:block h-full min-h-[500px]">
              {/* Decorative circles */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-100 rounded-full opacity-30 blur-3xl"></div>
              <div className="absolute -bottom-10 right-10 w-48 h-48 bg-emerald-100 rounded-full opacity-20 blur-3xl"></div>

              {/* Hero Image */}
              <div className="relative z-10 h-full rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/artificial-green-plant-pot-display-rack-sale.jpg"
                  alt="Beautiful gardening setup"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-lg z-20 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#78a240] flex items-center justify-center">
                    <span className="text-xl">🌱</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">1000+</p>
                    <p className="text-xs text-gray-500">Plants in stock</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Image - shown only on small screens */}
        <div className="md:hidden relative mx-5 sm:mx-8 mb-8 rounded-2xl overflow-hidden shadow-lg h-64 sm:h-80">
          <img
            src="/images/artificial-green-plant-pot-display-rack-sale.jpg"
            alt="Beautiful gardening setup"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="w-full px-5 sm:px-8 lg:px-12 py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              eyebrow="Shop by Category"
              title={categoriesConfig.title}
              href={categoriesConfig.viewAllHref}
              linkText={categoriesConfig.viewAllText}
            />
            <CategoryRow categories={categories} />
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          NEW ARRIVALS
      ══════════════════════════════════════ */}
      {newArrivals.length > 0 && (
        <section className="w-full px-5 sm:px-8 lg:px-12 py-16 bg-[#fafff9]">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              eyebrow="Just Landed"
              title={newArrivalsConfig.title}
              href={newArrivalsConfig.viewAllHref}
              linkText={newArrivalsConfig.viewAllText}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={`new-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          SPECIAL OFFER BANNER
      ══════════════════════════════════════ */}
      <section className="w-full px-5 sm:px-8 lg:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden flex flex-col md:flex-row items-stretch min-h-[320px] lg:min-h-[380px] shadow-xl shadow-green-100/60 ring-1 ring-black/5">
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
                className="btn-primary w-fit"
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
        <section className="w-full px-5 sm:px-8 lg:px-12 py-16">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              eyebrow="Limited Time"
              title={onSale.title}
              href={onSale.viewAllHref}
              linkText={onSale.viewAllText}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {saleProducts.slice(0, 4).map((product) => (
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
        <section
          className="w-full px-5 sm:px-8 lg:px-12 py-16"
          style={{ backgroundColor: workshopsConfig.bgColor }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#6B9238] mb-2">
                Learn & Grow
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                {workshopsConfig.title}
              </h2>
              <p className="text-gray-500 max-w-xl">{workshopsConfig.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workshops.map((w) => (
                <a
                  key={w.id}
                  href="/"
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 hover:shadow-xl hover:ring-green-200 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={w.image}
                      alt={w.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-full">
                      {w.date}
                    </div>
                    {w.isFree && (
                      <div className="absolute bottom-3 left-3 bg-white text-green-700 px-3 py-1 text-xs font-bold rounded-full shadow">
                        FREE
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 mb-2 leading-tight group-hover:text-green-700 transition-colors">
                      {w.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {w.description}
                    </p>
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
              <div className="bg-[#6b9238] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
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
              className="btn-primary"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
