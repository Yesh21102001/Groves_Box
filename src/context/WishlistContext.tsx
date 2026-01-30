'use client';

import React, { createContext, useContext, useState } from 'react';

interface WishlistItem {
    id: string;
    name: string;
    price: number;
    image: string;
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

    const addToWishlist = (item: WishlistItem) => {
        setWishlistItems((prevItems) => {
            if (prevItems.find((i) => i.id === item.id)) {
                return prevItems; // Already in wishlist
            }
            return [...prevItems, item];
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const isInWishlist = (id: string) => {
        return wishlistItems.some((item) => item.id === id);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}