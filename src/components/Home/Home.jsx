"use client";

import Link from "next/link";
import { Phone, MessageSquare, Mail, ChevronRight, Star } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function HomePage() {
  const products = [
    {
      id: 1,
      name: "Money Tree Plant",
      description: "The OG good-luck tree",
      price: 39,
      image: "https://cdn.shopify.com/s/files/1/0150/6262/files/the-sill_Small-Money-Tree_Small_Marcelle-Gold_Variant.jpg",
      badge: "Best Seller",
      badgeColor: "bg-gray-800"
    },
    {
      id: 2,
      name: "Olive Tree",
      description: "Free gift with purchase",
      price: 40,
      originalPrice: 70,
      image: "https://cdn.shopify.com/s/files/1/0150/6262/files/Olivetree-Isabella_Black_Variant.png",
      badge: "On Sale",
      badgeColor: "bg-red-600"
    },
    {
      id: 3,
      name: "Musa Nono Pink Variegated Banana",
      description: "Pretty in pink streaks",
      price: 249,
      image: "https://cdn.shopify.com/s/files/1/0150/6262/files/PinkBananaMusa-PDP-Wall1.png",
      badge: "Rare Plant",
      badgeColor: "bg-purple-600"
    },
    {
      id: 4,
      name: "Plant Of The Month Club",
      description: "Use code NEWLEAF10 for $10 off",
      price: 60,
      image: "https://cdn.shopify.com/s/files/1/0150/6262/files/small-subscriptions_gift-card.jpg",
    }
  ];

  const testimonials = [
    {
      quote: "I love The Sill! It's a nice way to send plants to people you love who live far away. Thanks for helping me stay connected!",
      author: "Hillary",
      location: "TX"
    },
    {
      quote: "My Monstera arrived gorgeous and healthy!!! Best looking plant I've ever pulled out of a box!!",
      author: "Melanie",
      location: "IL"
    },
    {
      quote: "I have ordered several times and each time I get the healthiest, prettiest plants very quickly. I have been extremely satisfied with The Sill.",
      author: "Kelsey",
      location: "CA"
    },
    {
      quote: "Thank you so much for getting back to me about my plant concern! I'm grateful that customer service does still exist. Can't wait to recommend The Sill to others!",
      author: "Molly",
      location: "CO"
    }
  ];

  return (
    <div className="bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section
        className="
    relative w-full
    min-h-[70vh]
    sm:min-h-[70vh]
    lg:min-h-[70vh]
    2xl:min-h-[85vh]
    px-4 sm:px-6 lg:px-12 2xl:px-24
    flex items-center
    bg-cover bg-center
  "
        style={{ backgroundImage: "url('/images/desktop2.png')" }}
      >
        {/* Optional overlay (keep empty if image is clean) */}
        <div className="absolute inset-0"></div>

        <div className="relative w-full max-w-7xl 2xl:max-w-[1600px] mt-[-80px] mx-auto">
          <div className="max-w-xl sm:max-w-2xl">

            <h1
              className="
          font-serif font-light text-[#2a2d24]
          text-3xl
          sm:text-4xl
          lg:text-5xl
          2xl:text-6xl
          leading-tight
          mb-6 sm:mb-8
        "
            >
              Plants for best friends
            </h1>

            <p
              className="
          text-[#2a2d24]
          text-base
          sm:text-m
          mb-8 sm:mb-10
        "
            >
              Expert Guidance • Connect & Grow • Judgement-Free Service
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link
                href="/collections"
                className="
            bg-black text-white
            px-8 lg:px-10
            py-3 lg:py-4
            text-base lg:text-lg
            font-medium
            hover:bg-gray-800 transition
          "
              >
                Shop All Houseplants
              </Link>

              <Link
                href="/collections"
                className="
                bg-white
             text-black
            px-8 lg:px-10
            py-3 lg:py-4
            text-base lg:text-lg
            font-medium
            hover:bg-black hover:text-white transition
          "
              >
                Shop Valentine's Day Gifts
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* MOST POPULAR PLANTS */}
      <section className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-[1600px] mx-auto">

          {/* Heading */}
          <div className="flex justify-between items-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl 2xl:text-4xl font-serif font-light text-gray-900">
              Our Most Popular Plants
            </h2>

            <Link
              href="/products"
              className="hidden md:flex items-center gap-2 text-white bg-black py-2.5 px-4 text-lg"
            >
              Shop all <ChevronRight size={20} />
            </Link>
          </div>

          {/* Products Grid */}
          <div
            className="
    grid
    grid-cols-2
    sm:grid-cols-3
    md:grid-cols-3
    lg:grid-cols-4
    xl:grid-cols-5
    2xl:grid-cols-6
    gap-x-6 gap-y-10
    place-items-center
  "
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group w-full max-w-[260px]"
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4] mb-4">
                  {product.badge && (
                    <div
                      className={`absolute top-3 left-3 z-10 ${product.badgeColor} text-white px-3 py-1 text-xs font-medium rounded-full`}
                    >
                      {product.badge}
                    </div>
                  )}

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <h3 className="text-[15px] font-serif font-light text-gray-900 mb-1">
                  {product.name}
                </h3>

                <p className="text-xs italic text-gray-500 mb-2">
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
            ))}
          </div>


          {/* Mobile CTA */}
          <div className="md:hidden mt-10 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-white bg-black py-2.5 px-5 font-medium"
            >
              Shop all <ChevronRight size={18} />
            </Link>
          </div>

        </div>
      </section>


      {/* HELP SECTION */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-20 lg:py-28 bg-[#fafaf8]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* LEFT CONTENT */}
            <div>
              <p className="text-sm tracking-wide uppercase text-gray-600 mb-6">
                Speak to a Plant Specialist
              </p>

              <h2 className="text-3xl md:text-3xl lg:text-4xl font-serif font-light text-gray-900 mb-8">
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
                <MessageSquare size={36} className="mx-auto mb-6 text-green-700" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chat
                </h3>
                <p className="text-sm text-gray-600">
                  DM with a plant care expert
                </p>
              </div>

              {/* CALL */}
              <div className="bg-white text-center p-10">
                <Phone size={36} className="mx-auto mb-6 text-green-700" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Call
                </h3>
                <p className="text-sm text-gray-600">
                  Speak live to a plant care expert
                </p>
              </div>

              {/* EMAIL */}
              <div className="bg-white text-center p-10">
                <Mail size={36} className="mx-auto mb-6 text-green-700" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
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




      {/* LARGE FLOOR PLANTS */}
      <section className="w-full px-4 md:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-gray-900">Large Floor Plants</h2>
            <Link href="/products" className="hidden md:flex items-center gap-2 text-gray-900 hover:text-gray-600 transition text-lg">
              Shop all large plants <ChevronRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
            {products.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-100 h-64 md:h-80 lg:h-96">
                  {product.badge && (
                    <div className={`absolute top-4 left-4 z-10 ${product.badgeColor} text-white px-4 py-1 text-xs font-medium rounded-full`}>
                      {product.badge}
                    </div>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <h3 className="text-base md:text-lg lg:text-xl font-serif font-light text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm md:text-base text-gray-600 mb-2">{product.description}</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">From ${product.price}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="md:hidden mt-8 text-center">
            <Link href="/products" className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 transition font-medium">
              Shop all large plants <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>


      {/* NEW ARRIVALS */}
      <section className="w-full px-4 md:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-gray-900">New Arrivals</h2>
            <Link href="/products" className="hidden md:flex items-center gap-2 text-gray-900 hover:text-gray-600 transition text-lg">
              Shop all new arrivals <ChevronRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-100 h-64 md:h-80 lg:h-96">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <h3 className="text-base md:text-lg lg:text-xl font-serif font-light text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm md:text-base text-gray-600 mb-2">{product.description}</p>
              </Link>
            ))}
          </div>
          <div className="md:hidden mt-8 text-center">
            <Link href="/products" className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 transition font-medium">
              Shop all new arrivals <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>


      {/* WORKSHOPS & BLOG */}
      <section className="w-full px-4 md:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-6 md:mb-8 text-gray-900">Plant Care & Workshops</h2>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-12 md:mb-16 max-w-3xl">
            Empowering all people to be plant people. Welcome to Plant Parenthood®.
          </p>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <Link href="#" className="group">
              <div className="bg-gray-100 rounded-lg h-48 md:h-56 lg:h-64 mb-6 group-hover:bg-gray-200 transition" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-medium text-gray-900 mb-2">The Best Gifts for Every Love Language</h3>
              <p className="text-sm md:text-base text-gray-600">Ask The Sill</p>
            </Link>
            <Link href="#" className="group">
              <div className="bg-gray-100 rounded-lg h-48 md:h-56 lg:h-64 mb-6 group-hover:bg-gray-200 transition" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-medium text-gray-900 mb-2">Galentine's Day Plant Party Guide</h3>
              <p className="text-sm md:text-base text-gray-600">Ask The Sill</p>
            </Link>
            <Link href="#" className="group">
              <div className="bg-gray-100 rounded-lg h-48 md:h-56 lg:h-64 mb-6 group-hover:bg-gray-200 transition" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-medium text-gray-900 mb-2">The Sill 2025 Plant Trend Report</h3>
              <p className="text-sm md:text-base text-gray-600">Ask The Sill</p>
            </Link>
          </div>
        </div>
      </section>


      {/* TESTIMONIALS */}
      <section className="w-full px-4 md:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-12 md:mb-16 text-gray-900">What our customers are saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 md:p-8">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-gray-900 text-gray-900" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-sm md:text-base">"{testimonial.quote}"</p>
                <div>
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <Footer />
    </div >
  );
}
