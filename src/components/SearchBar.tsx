'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { searchProducts } from '@/src/lib/shopify_utilis';
import { useRouter } from 'next/navigation';

interface SearchResult {
    id: string;
    name: string;
    price: number;
    image: string;
    handle: string;
}

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    // Search products as user types
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length > 1) {
                try {
                    setIsLoading(true);
                    const searchResults = await searchProducts(query, 10);
                    setResults(searchResults);
                    setIsOpen(true);
                } catch (error) {
                    console.error('Search error:', error);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query)}`);
            setIsOpen(false);
            setQuery('');
        }
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-md">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    placeholder="Search plants..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244033]"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                            setIsOpen(false);
                        }}
                        className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={18} />
                    </button>
                )}
                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </form>

            {/* Search results dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="max-h-96 overflow-y-auto">
                        {results.map((result) => (
                            <Link
                                key={result.id}
                                href={`/products/${result.handle}`}
                                onClick={() => {
                                    setIsOpen(false);
                                    setQuery('');
                                }}
                                className="flex items-center gap-3 p-3 hover:bg-gray-100 border-b last:border-b-0 transition"
                            >
                                <img
                                    src={result.image}
                                    alt={result.name}
                                    className="w-10 h-10 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{result.name}</p>
                                    <p className="text-sm text-gray-600">${result.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="p-2 border-t">
                        <button
                            onClick={handleSearch}
                            className="w-full text-sm text-center py-2 text-[#244033] hover:bg-gray-50 font-medium"
                        >
                            View all results for "{query}"
                        </button>
                    </div>
                </div>
            )}

            {/* No results message */}
            {isOpen && query.trim() && results.length === 0 && !isLoading && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                    <p className="text-sm text-gray-600 text-center">No plants found for "{query}"</p>
                </div>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                    <p className="text-sm text-gray-600 text-center">Searching...</p>
                </div>
            )}
        </div>
    );
}
