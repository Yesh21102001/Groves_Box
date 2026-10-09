'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, User, ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
  const router = useRouter();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const previousScrollY = useRef(0);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = Math.max(window.scrollY, 0);
      const scrollDelta = currentScrollY - previousScrollY.current;

      setScrolled(currentScrollY > 10);

      if (currentScrollY <= 10) {
        setHeaderVisible(true);
      } else if (scrollDelta > 6) {
        setHeaderVisible(false);
      } else if (scrollDelta < -6) {
        setHeaderVisible(true);
      }

      previousScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 bg-white transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
        headerVisible || isMenuOpen ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* TOP ANNOUNCEMENT BANNER */}
      <div className="bg-[#2d5a3d] text-white text-center py-2.5 text-sm font-medium">
        HUGE EVERGREENS 25% OFF All Products
      </div>

      {/* MAIN HEADER */}
      <div className={`border-b border-gray-200 transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {/* Header Row */}
          <div className="flex items-center justify-between py-4 gap-8">

            {/* LEFT: Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 mr-16">
              <span className="text-3xl">🌿</span>
              <span className="text-lg font-bold text-[#2d5a3d]">GrovesBox</span>
            </Link>

            {/* CENTER: Navigation (Hidden on Mobile) */}
            <div className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-[#2d5a3d] font-medium text-sm transition-colors whitespace-nowrap">
                Home
              </Link>
              <Link href="/collections" className="text-gray-700 hover:text-[#2d5a3d] font-medium text-sm transition-colors whitespace-nowrap">
                Shop
              </Link>
              <Link href="/care" className="text-gray-700 hover:text-[#2d5a3d] font-medium text-sm transition-colors whitespace-nowrap">
                Plant Care
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-[#2d5a3d] font-medium text-sm transition-colors whitespace-nowrap">
                Blog
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-[#2d5a3d] font-medium text-sm transition-colors whitespace-nowrap">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-[#2d5a3d] font-medium text-sm transition-colors whitespace-nowrap">
                Contact Us
              </Link>
            </div>

            {/* CENTER: Search Bar (Hidden on Mobile) */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-shrink-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Plants"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 bg-gray-100 rounded text-sm focus:outline-none focus:bg-white border border-transparent focus:border-gray-300 transition-colors w-64"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2d5a3d]">
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* RIGHT: Icons */}
            <div className="flex items-center gap-4 flex-shrink-0">

              {/* Account Icon */}
              <Link href="/account" className="hidden md:flex p-2.5 hover:bg-gray-100 touch-target rounded-lg transition-colors" title="Account">
                <User size={20} className="text-gray-700" />
              </Link>

              {/* Wishlist Icon */}
              <Link href="/wishlist" className="flex p-2.5 hover:bg-gray-100 touch-target rounded-lg transition-colors relative" title="Wishlist">
                <Heart size={20} className="text-gray-700" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#2d5a3d] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link href="/cart" className="flex p-2.5 hover:bg-gray-100 touch-target rounded-lg transition-colors relative" title="Shopping Cart">
                <ShoppingCart size={20} className="text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#2d5a3d] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => {
                  setHeaderVisible(true);
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="p-2 lg:hidden"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200">
          <div className="px-5 py-4 space-y-3 max-w-7xl mx-auto">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Plants"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 rounded text-sm focus:outline-none"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-[#2d5a3d] font-medium">
              Home
            </Link>
            <Link href="/collections" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-[#2d5a3d] font-medium">
              Shop
            </Link>
            <Link href="/care" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-[#2d5a3d] font-medium">
              Plant Care
            </Link>
            <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-[#2d5a3d] font-medium">
              Blog
            </Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-[#2d5a3d] font-medium">
              About Us
            </Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-[#2d5a3d] font-medium">
              Contact Us
            </Link>
            <Link href="/account" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-[#2d5a3d] font-medium">
              My Account
            </Link>

            {/* Mobile Support */}
            <div className="pt-4 border-t border-gray-200">
              <a href="tel:+1234567890" className="text-sm font-semibold text-[#2d5a3d]">
                📞 Get Support: +1-234-567-890
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
