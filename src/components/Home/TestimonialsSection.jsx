'use client';
import React, { useState } from 'react';
import Image from 'next/image';

export default function TestimonialsSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const testimonials = [
        {
            quote:
                '"Thank you so much for getting back to me about my plant concern! I’m grateful that customer service does still exist <3 Can’t wait to recommend The Sill to others!"',
            author: 'Molly',
            location: 'CO',
            image: '/images/testimonial-1.jpg',
        },
        {
            quote:
                '"The quality of plants is outstanding and the customer service is exceptional. Highly recommend!"',
            author: 'Sarah',
            location: 'CA',
            image: '/images/testimonial-2.jpg',
        },
    ];

    return (
        <section className="bg-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h2 className="text-4xl lg:text-5xl font-sans text-gray-900 mb-2">
                        #PlantsMakePeopleHappy
                    </h2>
                    <p className="text-gray-600">What our customers are saying</p>
                </div>

                {/* Slider */}
                <div className="relative">
                    {/* Image */}
                    <div className="relative h-[420px] sm:h-[500px] lg:h-[560px] overflow-hidden">
                        <Image
                            src={testimonials[currentSlide].image}
                            alt="Testimonial background"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Overlay Card */}
                    <div className="relative lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2 bg-white shadow-xl p-8 sm:p-10 lg:p-12 max-w-xl">
                        <blockquote className="text-gray-900 text-lg sm:text-xl leading-relaxed mb-8">
                            {testimonials[currentSlide].quote}
                        </blockquote>

                        <p className="text-sm text-gray-700 mb-6">
                            {testimonials[currentSlide].author} , {testimonials[currentSlide].location}
                        </p>

                        {/* Pagination */}
                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-2 rounded-full transition-all ${currentSlide === index
                                            ? 'w-8 bg-emerald-600'
                                            : 'w-2 bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
