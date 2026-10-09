"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Heart, ArrowRight } from "lucide-react";
import ProductCard from "../ProductCard";
import {
  getCollections,
  getNewArrivals,
  getProductsByCollection,
} from "../../lib/shopify_utilis";
import { homeConfig } from "../../config/home.config";

export default function HomePage({ initialData = {} }) {
  const mobileCollectionSliderRef = useRef(null);
  const [products, setProducts] = useState(initialData.products ?? initialData.newArrivals ?? []);
  const [categories, setCategories] = useState(initialData.categories ?? []);
  const [newArrivals, setNewArrivals] = useState(initialData.newArrivals ?? []);
  const [saleProducts, setSaleProducts] = useState(initialData.saleProducts ?? []);
  const [loading, setLoading] = useState(Object.keys(initialData).length === 0);
  const collectionCategories = categories.filter((category) => {
    const handle = category.handle?.toLowerCase();
    const name = category.name?.trim().toLowerCase();
    return (
      handle !== "new-arrivals" &&
      handle !== "best-sellers" &&
      name !== "new arrivals" &&
      name !== "best sellers"
    );
  });

  useEffect(() => {
    const slider = mobileCollectionSliderRef.current;
    const collectionCount = collectionCategories.length;
    if (!slider || collectionCount === 0) return;

    const getSegmentWidth = () => {
      const firstCollectionOfNextSet = slider.children[collectionCount];
      const firstCollection = slider.children[0];
      return firstCollectionOfNextSet && firstCollection
        ? firstCollectionOfNextSet.offsetLeft - firstCollection.offsetLeft
        : 0;
    };

    const centerSlider = () => {
      if (window.matchMedia("(min-width: 640px)").matches) return;
      slider.scrollLeft = getSegmentWidth();
    };

    const handleScroll = () => {
      if (window.matchMedia("(min-width: 640px)").matches) return;
      const segmentWidth = getSegmentWidth();
      if (!segmentWidth) return;

      if (slider.scrollLeft < segmentWidth / 2) {
        slider.scrollLeft += segmentWidth;
      } else if (slider.scrollLeft > segmentWidth * 1.5) {
        slider.scrollLeft -= segmentWidth;
      }
    };

    centerSlider();
    slider.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", centerSlider);

    return () => {
      slider.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", centerSlider);
    };
  }, [collectionCategories.length]);

  useEffect(() => {
    if (Object.keys(initialData).length > 0) return;

    async function fetchAllData() {
      try {
        setLoading(true);
        const [collectionsData, newArrivalsData] = await Promise.all([
          getCollections(250),
          getProductsByCollection("new-arrivals", 5).then((collectionProducts) =>
            collectionProducts.length > 0
              ? collectionProducts
              : getNewArrivals(5),
          ),
        ]);
        setProducts(newArrivalsData || []);
        setCategories((collectionsData || []).filter((collection) => collection.handle !== "frontpage"));
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
        <p className="text-gray-600">Loading…</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white">

      {/* ════════════════════════════════════════════════
          HERO SECTION - The Right Plant for The Right Space
      ════════════════════════════════════════════════ */}
      <section
        className="home-hero relative isolate w-full overflow-hidden bg-[#1a3227] text-white"
        style={{
          backgroundImage: "url('/images/2148851374.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#14291f]/75 via-[#1a3227]/55 to-[#1a3227]/15"
        />
        <div className="relative z-10 mx-auto grid min-h-[560px] max-w-7xl grid-cols-1 items-center gap-10 px-5 py-14 sm:px-8 md:min-h-[600px] md:grid-cols-[1.15fr_0.85fr] md:py-16 lg:min-h-[680px] lg:px-12">
          <div className="flex flex-col justify-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#d8e9a4] sm:text-sm">
              Quality You Can Trust
            </p>
            <h1 className="home-hero-title mb-5 max-w-2xl font-serif text-white">
              The Right Plant for The Right Space
            </h1>
            <p className="mb-7 max-w-lg text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
              Discover plants that fit your space, lifestyle, and level of care. From bright balconies to cozy corners
            </p>
            <div className="mb-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/products"
                className="inline-flex min-h-11 items-center gap-2 rounded bg-white px-5 py-3 text-sm font-semibold text-[#1f4028] transition-colors hover:bg-[#edf3e9] sm:px-7"
              >
                Shop All Plants
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="relative hidden justify-end pr-8 md:flex lg:pr-16">
            <div
              aria-hidden="true"
              className="absolute right-1 top-5 h-[350px] w-[205px] rotate-[7deg] border-[5px] border-white/90 bg-white/90 shadow-2xl"
            />
            <div className="relative h-[370px] w-[220px] overflow-hidden border-[5px] border-white bg-white shadow-2xl">
              <div className="relative h-[245px] overflow-hidden">
                <Image
                  src="/images/artificial-green-plant-pot-display-rack-sale.jpg"
                  alt="Leafy indoor plants in a home"
                  fill
                  sizes="220px"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/35 px-5 text-center">
                  <p className="text-lg font-medium leading-snug text-white">
                    Lifestyle &amp;
                    <br />
                    Inspiration
                  </p>
                </div>
              </div>
              <div className="p-4 text-[#1f4028]">
                <p className="text-[10px] font-semibold uppercase tracking-wide">Bring Your Dream Home</p>
                <p className="mt-2 text-[10px] leading-relaxed text-gray-600">
                  Find the perfect plants to bring nature, calm, and style into every corner of your home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FIND YOUR PERFECT PLANT - Category Showcase
      ════════════════════════════════════════════════ */}
      {collectionCategories.length > 0 && (
        <section className="w-full bg-white py-20 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="flex justify-between items-end mb-6 sm:mb-12">
              <div>
                <p className="text-sm text-[#2d5a3d] font-semibold uppercase tracking-widest mb-3">Our Collection</p>
                <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Find Your Perfect Plant</h2>
              </div>
            </div>
            <div
              ref={mobileCollectionSliderRef}
              className="mobile-collection-slider flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:hidden"
            >
              {[0, 1, 2].flatMap((copy) =>
                collectionCategories.map((cat) => (
                  <Link
                    key={`${copy}-${cat.id}`}
                    href={`/collections/${cat.handle}`}
                    aria-hidden={copy !== 1}
                    tabIndex={copy === 1 ? undefined : -1}
                    className="group relative aspect-[2/3] basis-[calc((100%-2.5rem)/2.5)] flex-none snap-start overflow-hidden rounded-lg"
                  >
                    <Image
                      src={cat.image || "/images/artificial-green-plant-pot-display-rack-sale.jpg"}
                      alt={cat.name}
                      fill
                      sizes="35vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/65 via-black/10 to-transparent p-3 transition-colors group-hover:from-black/75">
                      <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                    </div>
                  </Link>
                )),
              )}
            </div>
            <div className="hidden grid-cols-2 gap-4 sm:grid sm:grid-cols-3 md:grid-cols-5 md:gap-5">
              {collectionCategories.slice(0, 5).map((cat) => (
                <Link key={cat.id} href={`/collections/${cat.handle}`} className="group relative aspect-[2/3] overflow-hidden rounded-lg">
                  <Image
                    src={cat.image || "/images/artificial-green-plant-pot-display-rack-sale.jpg"}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/65 via-black/10 to-transparent p-3 transition-colors group-hover:from-black/75 sm:p-4">
                    <h3 className="text-sm font-bold text-white sm:text-base">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                href="/collections"
                className="inline-flex min-h-9 items-center justify-center rounded border-2 border-[#2d5a3d] px-4 py-2 text-sm font-semibold text-[#2d5a3d] transition-colors hover:bg-[#2d5a3d]/5 sm:min-h-11 sm:px-7 sm:py-3 sm:text-base"
              >
                View All <ArrowRight size={18} className="ml-2" />
              </Link>
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
            <div className="flex justify-between items-end mb-6 sm:mb-12">
              <div>
                <p className="text-sm text-[#2d5a3d] font-semibold uppercase tracking-widest mb-3">Fresh Finds</p>
                <h2 className="text-4xl md:text-5xl font-serif text-gray-900">New Arrivals</h2>
              </div>
              <Link href="/products?filter=new" className="text-[#2d5a3d] font-semibold flex items-center gap-2 hover:gap-3 transition-all hidden md:flex">
                View all <ArrowRight size={18} />
              </Link>
            </div>
            <div className="mobile-product-slider flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:hidden">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="basis-[calc((100%-2.5rem)/2.5)] flex-none snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <div className="hidden grid-cols-2 gap-5 sm:grid sm:grid-cols-3 md:grid-cols-5 md:gap-6">
              {products.slice(0, 5).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                href="/products?filter=new"
                className="inline-flex min-h-9 items-center justify-center rounded border-2 border-[#2d5a3d] px-4 py-2 text-sm font-semibold text-[#2d5a3d] transition-colors hover:bg-[#2d5a3d]/5 sm:min-h-11 sm:px-7 sm:py-3 sm:text-base"
              >
                View All <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════
          LET YOUR SPACE COME ALIVE - Scattered Photo Grid
      ════════════════════════════════════════════════ */}
      <section className="w-full border-t border-gray-100 bg-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3 md:gap-12">
            {/* Left side - scattered images */}
            <div className="hidden md:grid grid-cols-2 gap-4 h-96">
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
              <h2 className="space-showcase-title mb-4 font-serif leading-tight text-gray-900 sm:mb-6">Let Your Space Come Alive</h2>
              <p className="mb-6 text-base leading-relaxed text-gray-700 sm:mb-8 sm:text-lg">
                Create a beautiful sanctuary with our premium plant collection. Perfect for any room and skill level.
              </p>
              <Link href="/collections" className="mx-auto inline-block w-fit rounded bg-[#2d5a3d] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#1f4028]">
                Explore Now →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 md:hidden">
              {["Plant 1", "Plant 2", "Plant 3", "Plant 4"].map((alt, index) => (
                <div
                  key={alt}
                  className={`relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg ${
                    index % 2 === 0 ? "-rotate-2" : "rotate-2"
                  }`}
                >
                  <Image
                    src="/images/artificial-green-plant-pot-display-rack-sale.jpg"
                    alt={alt}
                    fill
                    sizes="(max-width: 640px) 45vw, 200px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Right side - scattered images */}
            <div className="hidden md:grid grid-cols-2 gap-4 h-96">
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
                    <p className="font-bold text-gray-900 text-sm">Customer Name</p>
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

    </div>
  );
}
