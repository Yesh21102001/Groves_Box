"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import ProductCard from "../ProductCard";
import {
  getProducts,
  getCollections,
  getNewArrivals,
  getProductsByCollection,
} from "../../lib/shopify_utilis";
import { homeConfig } from "../../config/home.config";

export default function HomePage({ initialData = {} }) {
  const [products, setProducts] = useState(initialData.products ?? []);
  const [categories, setCategories] = useState(initialData.categories ?? []);
  const [newArrivals, setNewArrivals] = useState(initialData.newArrivals ?? []);
  const [saleProducts, setSaleProducts] = useState(initialData.saleProducts ?? []);
  const [categoryProducts, setCategoryProducts] = useState(initialData.categoryProducts ?? []);
  const [loading, setLoading] = useState(Object.keys(initialData).length === 0);
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (Object.keys(initialData).length > 0) return;

    async function fetchAllData() {
      try {
        setLoading(true);
        const [bestSellersData, saleData, collectionsData, newArrivalsData] = await Promise.all([
          getProducts(8),
          getProducts(4),
          getCollections(6),
          getNewArrivals(8),
        ]);
        setProducts(bestSellersData || []);
        setSaleProducts(saleData || []);
        setCategories(collectionsData || []);
        setNewArrivals(newArrivalsData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, [initialData]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 border-4 border-[#2d5a3d] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className={`bg-white ${totalItems > 0 ? "pb-24 sm:pb-20" : ""}`}>
      {/* ════════════════════════════════════════════════
          HERO SECTION - The Right Plant for The Right Space
      ════════════════════════════════════════════════ */}
      <section className="w-full relative py-16 md:py-32 overflow-hidden" style={{
        backgroundImage: 'url(/images/2148851374.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundAttachment: 'fixed'
      }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2d5a3d]/95 via-[#2d5a3d]/85 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

            {/* LEFT: Content */}
            <div className="flex flex-col justify-center">
              <p className="text-sm text-[#BAF915] font-semibold uppercase tracking-widest mb-4">
                Quality You Can Trust
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white leading-tight mb-6">
                The Right Plant for The Right Space
              </h1>
              <p className="text-gray-100 text-base sm:text-lg mb-8 leading-relaxed max-w-md">
                Discover a carefully curated selection of exceptional plants. Every plant comes with care tips and expert guidance for success.
              </p>

              {/* Buttons */}
              <div className="flex gap-3 sm:gap-4 flex-wrap mb-10">
                <Link href="/collections" className="px-6 sm:px-8 py-3 bg-white text-[#2d5a3d] font-semibold hover:bg-gray-100 transition-colors rounded">
                  Find Your Plant →
                </Link>
                <button className="flex items-center gap-2 text-white font-semibold hover:text-[#BAF915] transition-colors">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  Explore Video
                </button>
              </div>

              {/* Feature Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/20">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🚚</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Free Delivery</p>
                    <p className="text-gray-300 text-xs">On Orders Over ₹99</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🌿</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Healthy Plants</p>
                    <p className="text-gray-300 text-xs">100% Quality Guaranteed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🛡️</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Plant Care Support</p>
                    <p className="text-gray-300 text-xs">We're Here to Help</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Magazine-style image stack */}
            <div className="relative hidden md:block">
              {/* Main plant image */}
              <div className="relative mb-4">
                <div className="aspect-square relative rounded-lg overflow-hidden shadow-2xl">
                  <img src="/images/artificial-green-plant-pot-display-rack-sale.jpg" alt="Plants Display" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Stacked magazine cards */}
              <div className="flex gap-3 justify-end">
                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform -rotate-3 hover:rotate-0 transition-transform w-32 h-40">
                  <img src="/images/artificial-green-plant-pot-display-rack-sale.jpg" alt="Lifestyle" className="w-full h-24 object-cover" />
                  <div className="p-3">
                    <p className="text-xs text-[#2d5a3d] font-semibold uppercase tracking-wide">Lifestyle &</p>
                    <p className="text-xs text-[#2d5a3d] font-semibold uppercase">Inspiration</p>
                    <p className="text-[10px] text-gray-600 mt-2 font-semibold">Bring Your Dream</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform rotate-2 hover:rotate-0 transition-transform w-32 h-40 mt-4">
                  <img src="/images/artificial-green-plant-pot-display-rack-sale.jpg" alt="Garden" className="w-full h-24 object-cover" />
                  <div className="p-3">
                    <p className="text-xs text-[#2d5a3d] font-semibold uppercase tracking-wide">Garden</p>
                    <p className="text-xs text-[#2d5a3d] font-semibold uppercase">Decor Ideas</p>
                    <p className="text-[10px] text-gray-600 mt-2 font-semibold">Fresh & Natural</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FIND YOUR PERFECT PLANT - Category Showcase
      ════════════════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="w-full bg-white py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-sm text-[#2d5a3d] font-semibold uppercase tracking-widest mb-3">Our Collection</p>
                <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Find Your Perfect Plant</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
              {categories.slice(0, 6).map((cat) => (
                <Link key={cat.id} href={`/collections/${cat.handle}`} className="group relative overflow-hidden rounded-lg aspect-square">
                  <Image src={cat.image || "/images/artificial-green-plant-pot-display-rack-sale.jpg"} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-end p-4">
                    <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════
          FEATURED PLANTS - Grid Layout
      ════════════════════════════════════════════════ */}
      {products.length > 0 && (
        <section className="w-full bg-white py-20 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-sm text-[#2d5a3d] font-semibold uppercase tracking-widest mb-3">Best Sellers</p>
                <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Featured Plants</h2>
              </div>
              <Link href="/collections" className="text-[#2d5a3d] font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                View all <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Link href="/collections" className="px-8 py-3 border-2 border-[#2d5a3d] text-[#2d5a3d] font-semibold hover:bg-[#2d5a3d]/5 transition-colors rounded">
                View Our Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════
          LET YOUR SPACE COME ALIVE - Scattered Photo Grid
      ════════════════════════════════════════════════ */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {/* DESKTOP: 3-column layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-12 items-center">
            {/* Left side */}
            <div className="grid grid-cols-2 gap-4 h-96">
              <div className="rounded-lg overflow-hidden -rotate-3 shadow-lg mt-8">
                <Image src="/images/artificial-green-plant-pot-display-rack-sale.jpg" alt="Plant 1" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-lg overflow-hidden rotate-2 shadow-lg -mt-12">
                <Image src="/images/artificial-green-plant-pot-display-rack-sale.jpg" alt="Plant 2" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-lg overflow-hidden rotate-3 shadow-lg">
                <Image src="/images/artificial-green-plant-pot-display-rack-sale.jpg" alt="Plant 3" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-lg overflow-hidden -rotate-2 shadow-lg -mt-8">
                <Image src="/images/artificial-green-plant-pot-display-rack-sale.jpg" alt="Plant 4" width={200} height={200} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Center - Text content */}
            <div className="flex flex-col justify-center text-center">
              <h2 className="text-4xl font-serif text-gray-900 mb-6">Let Your Space Come Alive</h2>
              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                Create a beautiful sanctuary with our premium plant collection. Perfect for any room and skill level.
              </p>
              <Link href="/collections" className="px-8 py-3 bg-[#2d5a3d] text-white font-semibold hover:bg-[#1f4028] transition-colors rounded inline-block w-fit mx-auto">
                Explore Now →
              </Link>
            </div>

            {/* Right side */}
            <div className="grid grid-cols-2 gap-4 h-96">
              <div className="rounded-lg overflow-hidden rotate-2 shadow-lg -mt-8">
                <Image src="/images/artificial-green-plant-pot-display-rack-sale.jpg" alt="Plant 5" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-lg overflow-hidden -rotate-3 shadow-lg mt-8">
                <Image src="/images/artificial-green-plant-pot-display-rack-sale.jpg" alt="Plant 6" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-lg overflow-hidden -rotate-2 shadow-lg">
                <Image src="/images/artificial-green-plant-pot-display-rack-sale.jpg" alt="Plant 7" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <div className="rounded-lg overflow-hidden rotate-3 shadow-lg -mt-8">
                <Image src="/images/artificial-green-plant-pot-display-rack-sale.jpg" alt="Plant 8" width={200} height={200} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* MOBILE: Text + 3 images row */}
          <div className="md:hidden flex flex-col">
            {/* Text content */}
            <div className="flex flex-col justify-center text-center mb-6">
              <h2 className="text-3xl sm:text-4xl font-serif text-gray-900 mb-4">Let Your Space Come Alive</h2>
              <p className="text-gray-700 text-base sm:text-lg mb-6 leading-relaxed">
                Create a beautiful sanctuary with our premium plant collection. Perfect for any room and skill level.
              </p>
              <Link href="/collections" className="px-6 sm:px-8 py-3 bg-[#2d5a3d] text-white font-semibold hover:bg-[#1f4028] transition-colors rounded inline-block w-fit mx-auto">
                Explore Now →
              </Link>
            </div>

            {/* 3-column image row */}
            <div className="grid grid-cols-3 gap-3 w-full">
              <div className="rounded-lg overflow-hidden shadow-md w-full" style={{ height: '96px' }}>
                <img src="/images/artificial-green-plant-pot-display-rack-sale.jpg" alt="Plant 1" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md w-full" style={{ height: '96px' }}>
                <img src="/images/artificial-green-plant-pot-display-rack-sale.jpg" alt="Plant 2" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md w-full" style={{ height: '96px' }}>
                <img src="/images/artificial-green-plant-pot-display-rack-sale.jpg" alt="Plant 3" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          LOVED BY PLANT LOVERS - Testimonials
      ════════════════════════════════════════════════ */}
      <section className="w-full bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-sm text-[#2d5a3d] font-semibold uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Loved By Plant Lovers</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Join thousands of happy plant parents who've transformed their spaces</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <span key={j} className="text-yellow-400">★</span>)}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "The plant quality is amazing and the care instructions are super helpful. My monstera has never looked better!"
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-400"></div>
                  <div>
                    <p className="font-bold text-gray-900">Customer Name</p>
                    <p className="text-sm text-gray-600">Plant Enthusiast</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          TIPS TO HELP YOUR PLANTS THRIVE - Blog Section
      ════════════════════════════════════════════════ */}
      <section className="w-full bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-sm text-[#2d5a3d] font-semibold uppercase tracking-widest mb-3">Blog</p>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Tips to Help Your Plants Thrive</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <article key={i} className="group">
                <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                  <Image src="/images/artificial-green-plant-pot-display-rack-sale.jpg" alt="Blog" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex justify-between items-start mb-3">
                  <p className="text-sm text-[#2d5a3d] font-semibold">5 min read</p>
                  <p className="text-sm text-gray-600">Jan {i + 5}</p>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#2d5a3d] transition-colors">
                  How to Choose the Right Light for Your Plants
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">Discover the secrets to keeping your plants healthy and happy with proper lighting tips.</p>
                <Link href="#" className="text-[#2d5a3d] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read More <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          BOTTOM CART BAR
      ════════════════════════════════════════════════ */}
      {totalItems > 0 && (
        <div className="fixed z-40 bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#2d5a3d] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                {totalItems}
              </div>
              <div>
                <p className="text-sm text-gray-600">{totalItems} item{totalItems > 1 ? "s" : ""}</p>
                <p className="font-bold text-gray-900">₹ {totalPrice.toFixed(2)}</p>
              </div>
            </div>
            <Link href="/cart" className="px-8 py-3 bg-[#2d5a3d] text-white font-semibold hover:bg-[#1f4028] rounded transition-colors">
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
