'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, User, ShoppingCart, Search, Menu, X, House, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getCollections } from '../lib/shopify_utilis';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const previousScrollY = useRef(0);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    let isMounted = true;

    const loadCollections = async () => {
      const data = await getCollections(250);
      if (!isMounted) return;

      const excludedHandles = new Set(['new-arrivals', 'best-sellers']);
      const normalize = (value) => value.toLowerCase().trim().replace(/[\s_]+/g, '-');
      const availableCollections = data.filter((collection) => {
        const handle = normalize(collection.handle || '');
        const name = normalize(collection.name || '');
        return collection.id && collection.name && !excludedHandles.has(handle) &&
          name !== 'new-arrivals' && name !== 'best-sellers';
      });

      setCollections(availableCollections.slice(0, 5));
    };

    loadCollections();
    return () => {
      isMounted = false;
    };
  }, []);

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
    <>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          {/* Header Row */}
          <div className="flex min-w-0 items-center justify-between gap-2 py-3 sm:gap-4 sm:py-4 xl:gap-5 2xl:gap-2">

            {/* LEFT: Logo */}
            <Link href="/" className="flex min-w-0 flex-shrink-0 items-center gap-1.5 sm:gap-2">
              <span className="text-2xl sm:text-3xl">🌿</span>
              <span className="text-base font-bold text-[#2d5a3d] sm:text-lg">GrovesBox</span>
            </Link>

            {/* CENTER: Navigation (Hidden on Mobile) */}
            <div className="hidden 2xl:flex items-center gap-4">
              <Link href="/" className="text-gray-700 hover:text-[#2d5a3d] font-medium text-sm transition-colors whitespace-nowrap">
                Home
              </Link>
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={collection.link}
                  className="text-gray-700 hover:text-[#2d5a3d] font-medium text-sm transition-colors whitespace-nowrap"
                >
                  {collection.name}
                </Link>
              ))}
            </div>

            {/* CENTER: Search Bar (Hidden on Mobile) */}
            <form onSubmit={handleSearch} className="hidden xl:flex min-w-0 flex-shrink items-center 2xl:hidden">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Plants"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-44 rounded border border-transparent bg-gray-100 px-4 py-2 pr-10 text-sm transition-colors focus:border-gray-300 focus:bg-white focus:outline-none 2xl:w-56"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2d5a3d]">
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* RIGHT: Icons */}
            <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2 xl:gap-3">

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
                className="p-2 2xl:hidden"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="2xl:hidden bg-white border-b border-gray-200">
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
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={collection.link}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-[#2d5a3d] font-medium"
              >
                {collection.name}
              </Link>
            ))}
            <Link href="/account" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-700 hover:text-[#2d5a3d] font-medium">
              My Account
            </Link>

            {/* Mobile Contact */}
            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/contact-us"
                onClick={() => setIsMenuOpen(false)}
                className="flex min-h-11 w-full items-center justify-center rounded-lg bg-[#2d5a3d] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1f4028]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
      </nav>
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-gray-200 bg-white/95 px-2 pt-2 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur md:hidden"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        {[
          { label: 'Home', href: '/', icon: House },
          { label: 'Products', href: '/products', icon: Package },
          { label: 'Wishlist', href: '/wishlist', icon: Heart },
          { label: 'Account', href: '/account', icon: User },
        ].map(({ label, href, icon: Icon }) => {
          const active = href === '/' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={label}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium transition-colors ${
                active ? 'text-[#2d5a3d]' : 'text-gray-500 hover:text-[#2d5a3d]'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
