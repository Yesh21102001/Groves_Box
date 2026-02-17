"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import { Phone, MessageSquare, Mail, ChevronRight, ChevronLeft, Heart, ShoppingCart, X, ArrowRight, GraduationCap, Users, Shield } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
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
  const [saleProducts, setSaleProducts] = useState([]);

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
        // Uses fallback approach - if collection doesn't exist, use all products
        const [bestSellersData, saleData, collectionsData, newArrivalsData] = await Promise.all([
          getProductsByCollection('best-sellers', 8).then(data => data.length > 0 ? data : getProducts(8)),
          getProductsByCollection('on-sale', 8).then(data => data.length > 0 ? data : getProducts(8)),
          getCollections(4),
          getNewArrivals(8)
        ]);

        setProducts(bestSellersData || []);
        setSaleProducts(saleData || []);
        setCategories(collectionsData || []);
        setNewArrivals(newArrivalsData || []);

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

  // Star Rating mini component
  const StarRatingMini = ({ rating = 4, count = 0 }) => {
    return (
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
        {count > 0 && (
          <span className="text-xs text-gray-500">{count} review{count !== 1 ? 's' : ''}</span>
        )}
      </div>
    );
  };

  // Product Card Component
  const ProductCard = ({ product }) => {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const wishlisted = isInWishlist(product.id.toString());

    const handleQuickAdd = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const variantId = product.variants?.[0]?.id;
      if (!variantId) { alert('This product is currently unavailable'); return; }
      addToCart({ id: product.id, variantId, name: product.name, price: product.price, quantity: 1, image: product.image, handle: product.handle, variants: product.variants });
    };

    const handleWishlistToggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (wishlisted) { removeFromWishlist(product.id.toString()); }
      else { addToWishlist({ id: product.id.toString(), variantId: product.variants?.[0]?.id, name: product.name, price: product.price, image: product.image, handle: product.handle, variants: product.variants }); }
    };

    const isOnSale = !!product.originalPrice;
    // Derive a review count from tags or default to 0
    const reviewCount = product.tags?.find(t => /\d+review/i.test(t.replace(/\s/g, '')))
      ? parseInt(product.tags.find(t => /\d+review/i.test(t.replace(/\s/g, ''))))
      : 0;

    return (
      <Link href={`/products/${product.handle}`} className="group block">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-50 aspect-[3/4] mb-3">

          {/* Badge top-left */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-[#2BBFA4] text-white px-3 py-1 text-xs font-medium rounded-full shadow-sm">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {product.badge}
            </div>
          )}

          {/* Wishlist — top right, appears on hover */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <Heart size={15} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
          </button>

          {/* Quick Add — desktop hover bar */}
          <button
            onClick={handleQuickAdd}
            className="hidden md:flex absolute bottom-3 left-3 right-3 z-10 bg-[#007B57] text-white py-2.5 text-sm font-medium hover:bg-[#009A7B] items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          >
            <ShoppingCart size={13} /> Quick Add
          </button>

          {/* Mobile quick add */}
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 right-3 z-10 w-9 h-9 bg-[#244033] text-white rounded-full flex items-center justify-center md:hidden"
          >
            <ShoppingCart size={14} />
          </button>

          {/* Product Image */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Info below image */}
        <div className="space-y-1.5">
          {/* Product Name */}
          <h3 className={`text-sm md:text-base font-normal leading-snug ${isOnSale ? 'text-[#2F8C6E]' : 'text-gray-900'}`}>
            {product.name}
          </h3>

          {/* Short description */}
          {product.description && (
            <p className="text-xs text-gray-400 italic leading-tight line-clamp-1">
              {product.description}
            </p>
          )}

          {/* Star Rating */}
          <StarRatingMini rating={4.5} count={reviewCount} />

          {/* Price */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className={`text-sm font-medium ${isOnSale ? 'text-[#2F8C6E]' : 'text-gray-900'}`}>
              {isOnSale ? `From Rs. ${product.price}` : `Rs. ${product.price}`}
            </span>
            {isOnSale && (
              <span className="text-xs text-gray-400 line-through">Rs. {product.originalPrice}</span>
            )}
          </div>
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
      <Link href="/products">
        <section
          className="
      relative w-full
      min-h-[70vh]
      2xl:min-h-[80vh]
      px-4 sm:px-6 lg:px-12 2xl:px-24
      flex items-center justify-end
      bg-cover bg-center
      cursor-pointer

      /* MOBILE background */
      bg-[url('/images/Groves_Box_mobile.png')]

      /* DESKTOP background */
      sm:bg-[url('/images/Groves%20Box.png')]
    "
        >
        </section>
      </Link>


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
              {products.slice(0, 4).map((product) => (
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
                const variantId = quickView.variants?.[0]?.id;

                if (variantId) {
                  addToCart({
                    id: quickView.id,
                    variantId: variantId,
                    name: quickView.name,
                    price: quickView.price,
                    quantity: 1,
                    image: quickView.image,
                    handle: quickView.handle,
                    variants: quickView.variants
                  });
                }
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
                {categories.slice(0, 8).map((category) => (
                  <Link
                    key={category.id}
                    href={category.link}
                    className="group block"
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden aspect-[3/4]">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    </div>

                    {/* Title Section Below Image */}
                    <div className="mt-3">
                      <h3 className="inline-flex items-center gap-2 text-gray-800 text-sm sm:text-base md:text-lg lg:text-lg font-serif font-light leading-none transition-colors duration-300 group-hover:text-emerald-700">
                        <span>{category.name}</span>
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </h3>

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
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={`new-${product.id}`} product={product} />
              ))}
            </div>

          </div>
        </section>
      )}


      {/* On Sale Section */}
      {saleProducts.length > 0 && (
        <section className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="max-w-[1600px] mx-auto">

            {/* Heading */}
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl sm:text-3xl 2xl:text-3xl font-lexend font-semibold text-[#2F4F3E]">
                On Sale
              </h2>


              <Link
                href="/products?filter=sale"
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
              {saleProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
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
              sm:p-4 sm:rounded-[16px]">
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


    </div>
  );
}