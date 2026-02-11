"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import { Phone, MessageSquare, Mail, ChevronRight, ChevronLeft, Heart, ShoppingCart, X, ArrowRight, GraduationCap, Users, Shield } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { getProducts, getCollections, getNewArrivals, getProductsByCollection } from "../../lib/shopify_utilis";

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

  // State for Shopify data
  const [products, setProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Static features data (unlikely to change frequently)
  const features = [
    {
      icon: GraduationCap,
      title: 'Expert Guidance',
      description: "Success starts with choosing the right plants. We'll make sure you do.",
    },
    {
      icon: Users,
      title: 'Connect & Grow',
      description: 'Community is everything. Our workshops and events help you learn and connect.',
    },
    {
      icon: Shield,
      title: 'Judgement-Free Service',
      description: 'Our dedicated team is always available to assist — no question too small or too silly!',
    },
  ];

  // Fetch all data on component mount
  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);

        // Fetch products, collections, and new arrivals in parallel
        const [productsData, collectionsData, newArrivalsData] = await Promise.all([
          getProductsByCollection('best-sellers', 8),
          getCollections(4),
          getNewArrivals(8)
        ]);


        setProducts(productsData);
        setCategories(collectionsData);
        setNewArrivals(newArrivalsData);

        // Also fetch testimonials and workshops from JSON files
        try {
          const [testimonialsRes, workshopsRes] = await Promise.all([
            fetch('/data/testimonials.json'),
            fetch('/data/workshops.json')
          ]);

          if (testimonialsRes.ok) {
            const testimonialsData = await testimonialsRes.json();
            setTestimonials(testimonialsData);
          }

          if (workshopsRes.ok) {
            const workshopsData = await workshopsRes.json();
            setWorkshops(workshopsData);
          }
        } catch (jsonError) {
          console.log('Optional data not available:', jsonError);
          // These are optional, so we don't set error state
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

  // Testimonial slider auto-play
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Function to add product to cart
  const handleAddToCart = (product) => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };



  // Product Card Component
  const ProductCard = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);

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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:bg-[#244033] hover:text-white transition"
          >
            <Heart
              size={18}
              className={isWishlisted ? "fill-current text-red-500" : ""}
            />
          </button>

          {/* Quick Add Button */}
          {/* Mobile: Small circular button bottom-right, always visible */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart(product);
            }}
            className="absolute bottom-3 right-3 z-10 w-10 h-10 bg-[#244033] text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition md:hidden"
          >
            <ShoppingCart size={18} />
          </button>

          {/* Desktop: Full button at bottom on hover */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart(product);
            }}
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

        <p className="text-xs md:text-sm italic text-gray-500 mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-900">
            From ${product.price}
          </span>

          {product.originalPrice && (
            <span className="text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </Link>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#244033] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading data: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#244033] text-white px-6 py-3 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${totalItems > 0 ? 'pb-20' : ''}`}>


      {/* HERO SECTION */}
      <section
        className="
    relative w-full
    min-h-[70vh]
    2xl:min-h-[85vh]
    px-4 sm:px-6 lg:px-12 2xl:px-24
    flex items-center justify-end
    bg-cover bg-center

    /* MOBILE background */
    bg-[url('/images/2149155732.jpg')]

    /* DESKTOP background */
    sm:bg-[url('/images/2151022072.jpg')]
  "
      >
        {/* ✅ MOBILE DARK OVERLAY (image only) */}
        <div
          className="
      absolute inset-0
      bg-black/60
      sm:hidden
    "
        />

        {/* CONTENT */}
        <div
          className="
    relative z-10 w-full
    max-w-7xl 2xl:max-w-[1600px]
    -mt-10 sm:-mt-40 lg:-mt-0
    flex justify-center sm:justify-end
  "
        >
          <div
            className="
      max-w-xl sm:max-w-2xl
      text-center sm:text-left
      sm:ml-auto
    "
          >
            <h1
              className="
        font-sans font-lexend text-white
        text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl
        leading-tight mb-6 sm:mb-8
      "
            >
              Plants for best friends
            </h1>

            <p
              className="
        text-white
        text-xs sm:text-sm lg:text-base
        mb-6 sm:mb-10
      "
            >
              Expert Guidance • Connect & Grow • Judgement-Free Service
            </p>

            {/* BUTTONS */}
            <div className="flex justify-center sm:justify-start gap-3 sm:gap-6">
              <Link
                href="/collections"
                className="
          bg-[#244033] text-white
          px-4 sm:px-8 lg:px-10
          py-2.5 sm:py-3 lg:py-4
          text-xs sm:text-base
          font-medium
          transition
        "
              >
                Shop All Houseplants
              </Link>

              <Link
                href="/collections"
                className="
          bg-white text-black
          px-4 sm:px-8 lg:px-10
          py-2.5 sm:py-3 lg:py-4
          text-xs sm:text-base
          font-medium
          hover:bg-[#244033] hover:text-white
          transition
        "
              >
                Valentine's Day Gifts
              </Link>
            </div>
          </div>
        </div>

      </section>


      {/* FEATURES SECTION */}
      <section className="w-full bg-[#F0F4F1] py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    <Icon className="w-10 h-10 text-[#2F4F3E]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-l font-semibold text-[#2F4F3E] mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-s">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* MOST POPULAR PLANTS (BEST SELLERS) */}
      {products.length > 0 && (
        <section className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="max-w-[1600px] mx-auto">

            {/* Heading */}
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl sm:text-3xl 2xl:text-3xl font-lexend font-semibold text-[#2F4F3E]">
                Our Most Popular Plants
              </h2>

              {/* ✅ FIXED: Changed to filter=bestseller */}
              <Link
                href="/products?filter=bestseller"
                className="group inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-white border-2 border-[#244033] text-[#244033] font-medium text-xs sm:text-sm md:text-base tracking-wide hover:bg-[#244033] hover:text-white transition-all duration-300 rounded-none whitespace-nowrap flex-shrink-0"
              >
                <span>View All</span>
                <ArrowRight
                  size={16}
                  className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {products.slice(0, 8).map((product) => (
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
            <button
              onClick={() => setQuickView(null)}
              className="absolute top-4 right-4"
            >
              <X size={20} />
            </button>

            <img
              src={quickView.image}
              alt={quickView.name}
              className="w-full h-64 object-cover rounded mb-4"
            />

            <h3 className="text-xl font-sans mb-2">
              {quickView.name}
            </h3>

            <p className="text-gray-600 mb-4">
              {quickView.description}
            </p>

            <button
              onClick={() => {
                handleAddToCart(quickView);
                setQuickView(null);
              }}
              className="w-full bg-[#244033] text-white py-3"
            >
              Add to Cart — ${quickView.price}
            </button>
          </div>
        </div>
      )}


      {/* HELP SECTION */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-20 lg:py-28 bg-[#F0F4F1]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* LEFT CONTENT */}
            <div>
              <p className="text-sm tracking-wide uppercase text-gray-600 mb-6">
                Speak to a Plant Specialist
              </p>

              <h2 className="text-2xl sm:text-3xl 2xl:text-3xl font-lexend font-semibold text-[#2F4F3E]">
                Need Help?
              </h2>

              <p className="text-lg md:text-l text-gray-600 leading-relaxed max-w-xl">
                Your confidence is our priority. Unsure what plants will work with your
                light? New to gardening outdoors and need some advice? Reach out, we're
                here to help.
              </p>
            </div>

            {/* RIGHT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

              {/* CHAT */}
              <div className="bg-white text-center p-10">
                <MessageSquare size={36} className="mx-auto mb-6 text-[#2F4F3E]" />
                <h3 className="text-lg font-medium text-[#2F4F3E] mb-2">
                  Chat
                </h3>
                <p className="text-sm text-gray-600">
                  DM with a plant care expert
                </p>
              </div>

              {/* CALL */}
              <div className="bg-white text-center p-10">
                <Phone size={36} className="mx-auto mb-6 text-[#2F4F3E]" />
                <h3 className="text-lg font-medium text-[#2F4F3E] mb-2">
                  Call
                </h3>
                <p className="text-sm text-gray-600">
                  Speak live to a plant care expert
                </p>
              </div>

              {/* EMAIL */}
              <div className="bg-white text-center p-10">
                <Mail size={36} className="mx-auto mb-6 text-[#2F4F3E]" />
                <h3 className="text-lg font-medium text-[#2F4F3E] mb-2">
                  Email
                </h3>
                <p className="text-sm text-gray-600">
                  Send a note to info@thesill.com
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* Categories (Collections from Shopify) */}
      {categories.length > 0 && (
        <section className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="w-full px-4 md:px-6 lg:px-8">
            <div className="max-w-[1600px] mx-auto">
              {/* Section Header with View All Button - Side by Side on Mobile */}
              <div className="flex items-center justify-between gap-3 mb-8 md:mb-10 lg:mb-12 xl:mb-14">
                <h2 className="text-xl sm:text-2xl lg:text-3xl 2xl:text-3xl font-lexend font-semibold text-[#2F4F3E]">
                  Plants For Everyone
                </h2>

                {/* View All Button - Compact on Mobile */}
                <Link
                  href="/collections"
                  className="group inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-white border-2 border-[#244033] text-[#244033] font-medium text-xs sm:text-sm md:text-base tracking-wide hover:bg-[#244033] hover:text-white transition-all duration-300 rounded-none whitespace-nowrap flex-shrink-0"
                >
                  <span>View All</span>
                  <ArrowRight
                    size={16}
                    className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
                  />
                </Link>
              </div>

              {/* Categories Grid - 2 per row on mobile */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={category.link}
                    className="group relative overflow-hidden rounded-none aspect-[3/4] transition-all duration-300"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />

                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300" />

                    {/* Content Container at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 lg:p-6">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-serif font-light">
                          {category.name} →
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}


      {/* New Arrivals - Separate Section with its own data */}
      {newArrivals.length > 0 && (
        <section className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="max-w-[1600px] mx-auto">

            {/* Heading */}
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl sm:text-3xl 2xl:text-3xl font-lexend font-semibold text-[#2F4F3E]">
                New Arrivals
              </h2>

              {/* ✅ Correct - Already has filter=new */}
              <Link
                href="/products?filter=new"
                className="group inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-white border-2 border-[#244033] text-[#244033] font-medium text-xs sm:text-sm md:text-base tracking-wide hover:bg-[#244033] hover:text-white transition-all duration-300 rounded-none whitespace-nowrap flex-shrink-0"
              >
                <span>View All</span>
                <ArrowRight
                  size={16}
                  className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
            </div>

            {/* New Arrivals Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {newArrivals.map((product) => (
                <ProductCard key={`new-${product.id}`} product={product} />
              ))}
            </div>

          </div>
        </section>
      )}


      {/* WORKSHOPS & BLOG */}
      {workshops.length > 0 && (
        <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 sm:py-16 md:py-20 lg:py-24 bg-[#F0F4F1]">
          <div className="max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-8 md:mb-12 lg:mb-16">
              <div>
                <h2 className="text-2xl sm:text-3xl 2xl:text-3xl font-lexend font-semibold text-[#2F4F3E]">
                  Plant Care & Workshops
                </h2>
                <p className="text-base sm:text-l md:text-l lg:text-l text-gray-600 max-w-2xl">
                  Empowering all people to be plant people. Welcome to Plant Parenthood®.
                </p>
              </div>
            </div>

            {/* Workshop Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl:gap-12">
              {workshops.map((workshop) => (
                <a
                  key={workshop.id}
                  href="#"
                  className="group block bg-white rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={workshop.image}
                      alt={workshop.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 bg-teal-400 text-white px-3 py-1.5 text-sm font-medium rounded">
                      {workshop.date}
                    </div>
                    {/* Free Badge */}
                    {workshop.isFree && (
                      <div className="absolute bottom-4 left-4 bg-white text-teal-600 px-3 py-1 text-xs font-semibold rounded">
                        FREE
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6 lg:p-7">
                    <h3 className="text-xl md:text-xl lg:text-xl  font-normal text-[#2F4F3E] font-bold mb-3 md:mb-4 leading-tight group-hover:text-gray-700 transition-colors">
                      {workshop.title}
                    </h3>
                    <p className="text-sm md:text-base lg:text-l text-gray-600 leading-relaxed">
                      {workshop.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="w-full bg-white py-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <p className="text-2xl sm:text-3xl 2xl:text-3xl font-lexend font-semibold text-[#2F4F3E]">What our customers are saying</p>
            </div>

            {/* Slider Container */}
            <div className="relative">
              <div className="flex flex-col md:flex-row gap-0 overflow-hidden h-auto md:h-[500px]">
                {/* Left Container - Text */}
                <div className="w-full md:w-1/5 md:min-w-[200px] bg-[#F0F4F1] flex items-center justify-center p-6 md:p-8 relative min-h-[150px] md:min-h-0 md:h-full">
                  <div className="relative w-full h-full flex items-center">
                    {testimonials.map((testimonial, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 flex items-center justify-center p-4 md:p-6 transition-all duration-700 ${index === currentSlide
                          ? 'opacity-100 translate-x-0'
                          : index < currentSlide
                            ? 'opacity-0 -translate-x-full'
                            : 'opacity-0 translate-x-full'
                          }`}
                      >
                        <p className="text-center text-gray-800 text-sm md:text-base leading-relaxed">
                          "{testimonial.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Container - Image */}
                <div className="w-full md:w-4/5 relative overflow-hidden bg-gray-100 h-[300px] md:h-full">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-700 ${index === currentSlide
                        ? 'opacity-100 translate-x-0'
                        : index < currentSlide
                          ? 'opacity-0 -translate-x-full'
                          : 'opacity-0 translate-x-full'
                        }`}
                    >
                      <img
                        src={testimonial.image}
                        alt={`Testimonial ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {/* Navigation Buttons */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all z-10"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-[#244033]" />
                  </button>

                  <button
                    onClick={nextSlide}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all z-10"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-[#244033]" />
                  </button>
                </div>
              </div>

              {/* Dots Navigation */}
              <div className="flex justify-center gap-2 mt-6 md:mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all ${index === currentSlide
                      ? 'w-6 md:w-8 h-2 md:h-3 bg-black'
                      : 'w-2 md:w-3 h-2 md:h-3 bg-gray-300 hover:bg-gray-400'
                      } rounded-full`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}


      {/* Bottom Cart Navigator */}
      {totalItems > 0 && (
        <div
          className="
    fixed left-0 right-0
    bg-white border-t border-gray-200 shadow-lg z-50

    bottom-[70px] left-3 right-3       /* mobile */
    sm:bottom-0              /* desktop */

    p-5 rounded-[20px]
    sm:p-4 sm:rounded-none bg-[#F0F4F1]
  "
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#244033] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                {totalItems}
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {totalItems} item{totalItems > 1 ? "s" : ""}
                </p>
                <p className="font-semibold">${totalPrice.toFixed(2)}</p>
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

    </div>
  );
}