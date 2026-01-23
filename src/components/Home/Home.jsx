"use client";

import Image from "next/image";
import { Package, Users, ShieldCheck } from "lucide-react";
import { MessageSquare, Phone, Mail } from 'lucide-react';
import PlantsForEveryone from "./PlantsForEveryone";
import LargeFloorPlants from "./LargeFloorPlants";
import NewArrivals from "./NewArrivals";
import MostPopular from "./MostPopular";
import PlantWorkshopsSection from "./PlantWorkshopsSection";
import BlogArticlesSection from "./BlogArticlesSection";
import TestimonialsSection from "./TestimonialsSection";
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const products = [
    {
      id: 1,
      name: "Large Ficus Altissima Tree",
      description: "Choose your planter style & color",
      price: 99,
      badge: "New Arrival",
      badgeColor: "bg-cyan-400",
      bgColor: "bg-[#d6d1c6]",
      image: "/images/3bce5e6c49f8ff31bcc4c692fd30770e65ce34ad-2923x2922.avif",
    },
    {
      id: 2,
      name: "Calathea Rattlesnake",
      description: "Choose your planter color",
      price: 39,
      badge: "On Sale",
      badgeColor: "bg-red-500",
      bgColor: "bg-[#e7e7e7]",
      image: "/images/3bce5e6c49f8ff31bcc4c692fd30770e65ce34ad-2923x2922.avif",
    },
    {
      id: 3,
      name: "String of Pearls",
      description: "The cutest pearly greens",
      price: 49,
      badge: null,
      badgeColor: "",
      bgColor: "bg-[#d6d1c6]",
      image: "/images/3bce5e6c49f8ff31bcc4c692fd30770e65ce34ad-2923x2922.avif",
    },
  ];

  const categories = [
    {
      title: 'Indoor Plants',
      image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800&q=80',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Outdoor Plants',
      image: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&q=80',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pet-Friendly Plants',
      image: 'https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=800&q=80',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Easy-Care Plants',
      image: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=800&q=80',
      bgColor: 'bg-slate-100'
    }
  ];

  return (
    <div>

      <div className="min-h-screen bg-[#ffe1d1] rounded-bl-3xl rounded-br-3xl">
        {/* HERO */}
        <section className="px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-24 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.6rem] leading-tight lg:leading-[1.05] text-stone-900">
            Quality Stuff.
          </h1>

          <p className="text-stone-700 mt-4 sm:mt-5 md:mt-6 max-w-xl mx-auto text-sm sm:text-base px-4">
            Rare, sought-after picks and tried-and-true favorites,
            restocked in small batches.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center px-4">
            <button className="bg-black text-white px-6 sm:px-7 py-3 sm:py-3.5 text-sm transition hover:bg-stone-800">
              Shop Back In Stock Plants
            </button>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-8 md:px-12 lg:px-16 pb-12 sm:pb-16 lg:pb-20 rounded-md">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col rounded-md h-auto lg:h-[500px] cursor-pointer transition-transform hover:scale-[1.03]"
            >
              {/* IMAGE */}
              <div
                className={`relative h-64 sm:h-80 lg:h-[360px] w-full overflow-hidden ${product.bgColor}`}
              >
                {product.badge && (
                  <span
                    className={`absolute top-4 sm:top-6 left-4 sm:left-6 z-10 ${product.badgeColor} text-white px-3 sm:px-4 py-1 sm:py-1.5 text-xs`}
                  >
                    ✦ {product.badge}
                  </span>
                )}

                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
              </div>

              {/* CONTENT */}
              <div className="bg-white px-5 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-7 flex-1">
                <h3 className="font-serif text-xl sm:text-2xl lg:text-[1.55rem] text-stone-900 leading-snug">
                  {product.name}
                </h3>

                <p className="text-stone-500 italic text-xs sm:text-sm mt-1">
                  {product.description}
                </p>

                <p className="text-stone-900 text-sm sm:text-base mt-2">
                  From ${product.price}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>

      <section className="w-full bg-[#f9f8f6] bg-white py-12 px-4" >
        <div className="max-w-6xl  mx-auto">
          <div className="grid grid-cols-1  md:grid-cols-3 gap-10 text-center md:text-left">

            {/* Card 1 */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <Package className="w-8 h-8 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">
                Expert Guidance
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Success starts with choosing the right plants. We’ll make sure you do.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <Users className="w-8 h-8 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">
                Connect & Grow
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Community is everything. Our workshops and events help you learn and connect.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <ShieldCheck className="w-8 h-8 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">
                Judgement-Free Service
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our dedicated team is always available to assist — no question too small or silly!
              </p>
            </div>

          </div>
        </div>
      </section>

      <MostPopular />

      <div className="relative bg-gray-50 py-16 px-6 overflow-hidden">
        {/* Decorative green blob */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500 rounded-br-full -translate-x-8 -translate-y-8"></div>

        <div className="max-w-7xl mx-auto">
          {/* Flex container for side-by-side layout */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Header - Left Column */}
            <div className="lg:w-2/5 flex-shrink-0">
              <p className="text-sm text-gray-600 mb-2">Speak to a Plant Specialist</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-900 mb-4">Need Help?</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Your confidence is our priority. Unsure what plants will work with your light? New to gardening outdoors and need some advice? Reach out, we're here to help.
              </p>
            </div>

            {/* Contact Options - Right Column */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
              {/* Chat */}
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="inline-flex items-center justify-center bg-emerald-50 rounded-lg mb-3 sm:mb-4 mx-auto
                  w-10 h-10 sm:w-12 sm:h-12">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Chat
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  DM with a plant care expert
                </p>
              </div>

              {/* Call */}
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-lg mb-3 sm:mb-4">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Call</h3>
                <p className="text-sm sm:text-base text-gray-600">Speak live to a plant care expert</p>
              </div>

              {/* Email */}
              <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-lg mb-3 sm:mb-4">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-sm sm:text-base text-gray-600">Send a note to info@thesill.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PlantsForEveryone />

      <LargeFloorPlants />

      <NewArrivals />

      <PlantWorkshopsSection />

      <BlogArticlesSection />

      <TestimonialsSection />
    </div>
  );
}