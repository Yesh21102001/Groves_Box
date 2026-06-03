'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const contactInfo = [
    {
        icon: Mail,
        title: 'Email Us',
        subtitle: 'We reply within 24 hours',
        value: 'support@grovesbox.com',
        href: 'mailto:support@grovesbox.com',
    },
    {
        icon: Phone,
        title: 'Call Us',
        subtitle: 'Mon – Sat, 10am – 6pm',
        value: '+91 XXXXX XXXXX',
        href: 'tel:+91XXXXXXXXXX',
    },
    {
        icon: MapPin,
        title: 'Visit Us',
        subtitle: 'Come say hello',
        value: 'Hyderabad, Telangana, India',
        href: '#',
    },
    {
        icon: Clock,
        title: 'Business Hours',
        subtitle: 'We are available',
        value: 'Mon – Sat: 10am – 6pm',
        href: null,
    },
];

export default function ContactUsPage() {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', subject: '', message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        setLoading(false);
        setSubmitted(true);
    };

    const inputClass =
        'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm placeholder:text-gray-400 outline-none focus:border-[#6b9238] focus:ring-2 focus:ring-[#6b9238]/20 transition-all';

    return (
        <div className="min-h-screen bg-[#F5F7F2]">

            {/* ── HERO ───────────────────────────────────────────────────── */}
            <section className="w-full bg-[#6b9238] px-5 sm:px-8 lg:px-12 py-16 md:py-20">
                <div className="max-w-7xl mx-auto">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/70 mb-3">
                        Contact Us
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4 max-w-xl">
                        We'd Love to Hear From You
                    </h1>
                    <p className="text-white/80 text-lg max-w-lg leading-relaxed">
                        Have a question about a plant, your order, or just want to say hi?
                        Our team is here to help.
                    </p>
                </div>
            </section>

            {/* ── INFO CARDS ─────────────────────────────────────────────── */}
            <section className="w-full px-5 sm:px-8 lg:px-12 -mt-8 mb-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {contactInfo.map(({ icon: Icon, title, subtitle, value, href }) => (
                        <div key={title}
                            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-[#F5F7F2] flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5 text-[#6b9238]" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{title}</p>
                                <p className="text-[11px] text-gray-400 mb-1">{subtitle}</p>
                                {href && href !== '#'
                                    ? <a href={href} className="text-sm font-semibold text-gray-800 hover:text-[#6b9238] transition-colors truncate block">{value}</a>
                                    : <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FORM + SIDEBAR ─────────────────────────────────────────── */}
            <section className="w-full px-5 sm:px-8 lg:px-12 pb-16">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Form */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Send a Message</h2>
                        <p className="text-sm text-gray-500 mb-7">Fill out the form and we'll get back to you shortly.</p>

                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-[#6b9238]" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                <p className="text-gray-500 text-sm max-w-xs">
                                    Thank you for reaching out. We'll get back to you within 24 hours.
                                </p>
                                <button
                                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                                    className="mt-6 text-sm font-semibold text-[#6b9238] hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input type="text" name="name" value={formData.name}
                                            onChange={handleChange} required
                                            placeholder="Your name"
                                            className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input type="email" name="email" value={formData.email}
                                            onChange={handleChange} required
                                            placeholder="you@example.com"
                                            className={inputClass} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Phone
                                        </label>
                                        <input type="tel" name="phone" value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+91 XXXXX XXXXX"
                                            className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Subject <span className="text-red-500">*</span>
                                        </label>
                                        <select name="subject" value={formData.subject}
                                            onChange={handleChange} required
                                            className={inputClass}>
                                            <option value="">Select a topic</option>
                                            <option value="order">Order & Delivery</option>
                                            <option value="plant-care">Plant Care Help</option>
                                            <option value="return">Return / Refund</option>
                                            <option value="bulk">Bulk / Corporate Order</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea name="message" value={formData.message}
                                        onChange={handleChange} required rows={5}
                                        placeholder="Tell us how we can help..."
                                        className={`${inputClass} resize-none`} />
                                </div>

                                <button type="submit" disabled={loading}
                                    className="btn-primary w-full justify-center disabled:opacity-70">
                                    {loading
                                        ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        : <><Send size={15} /> Send Message</>
                                    }
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="flex flex-col gap-5">

                        {/* FAQ prompt */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 mb-2">Quick Answers</h3>
                            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                                Find instant answers to common questions about orders, plants, and delivery.
                            </p>
                            <a href="/faq"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b9238] hover:text-[#557420] transition-colors">
                                Visit our FAQ →
                            </a>
                        </div>

                        {/* WhatsApp */}
                        <div className="bg-[#25D366]/10 rounded-2xl border border-[#25D366]/20 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900">Chat on WhatsApp</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Get instant support from our plant experts directly on WhatsApp.
                            </p>
                            <a href="https://wa.me/91XXXXXXXXXX"
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#20b858] transition-colors">
                                Start Chat
                            </a>
                        </div>

                        {/* Plant tip */}
                        <div className="bg-[#6b9238] rounded-2xl p-6 text-white">
                            <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-2">Plant Tip</p>
                            <p className="text-sm leading-relaxed text-white/90">
                                Most indoor plants prefer indirect sunlight. Place them near a window
                                but out of direct harsh rays for healthy, happy growth. 🌿
                            </p>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
}
