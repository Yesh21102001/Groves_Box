'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistItem {
    id: string;
    name: string;
    price: number;
    image: string;
    handle: string;
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('plants-wishlist');
        if (saved) {
            setWishlistItems(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('plants-wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToWishlist = (item: WishlistItem) => {
        setWishlistItems((prev) => {
            if (prev.find((i) => i.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlistItems((prev) =>
            prev.filter((item) => item.id !== id)
        );
    };

    const isInWishlist = (id: string) => {
        return wishlistItems.some((item) => item.id === id);
    };

    return (
        <WishlistContext.Provider
            value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within WishlistProvider');
    return context;
}
