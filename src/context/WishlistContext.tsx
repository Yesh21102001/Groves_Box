'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistItem {
    id: string;
    variantId: string;
    name: string;
    price: number;
    image: string;
    handle: string;
    variants?: any[];
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    syncWishlistOnLogin: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Check for logged-in user on mount and when storage changes
    useEffect(() => {
        checkCurrentUser();
        loadWishlist();

        // Listen for login/logout events
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'plants-current-user') {
                checkCurrentUser();
                loadWishlist();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    /**
     * Check if user is logged in
     */
    const checkCurrentUser = () => {
        const user = localStorage.getItem('plants-current-user');
        if (user) {
            setCurrentUser(JSON.parse(user));
        } else {
            setCurrentUser(null);
        }
    };

    /**
     * Get wishlist storage key based on login status
     */
    const getWishlistKey = () => {
        if (currentUser && currentUser.id) {
            return `plants-wishlist-${currentUser.id}`; // User-specific wishlist
        }
        return 'plants-wishlist'; // Guest wishlist
    };

    /**
     * Load wishlist from localStorage
     */
    const loadWishlist = () => {
        const user = localStorage.getItem('plants-current-user');
        const wishlistKey = user
            ? `plants-wishlist-${JSON.parse(user).id}`
            : 'plants-wishlist';

        const saved = localStorage.getItem(wishlistKey);
        if (saved) {
            try {
                setWishlistItems(JSON.parse(saved));
            } catch (error) {
                console.error('Error loading wishlist:', error);
                setWishlistItems([]);
            }
        } else {
            setWishlistItems([]);
        }
    };

    /**
     * Save wishlist to localStorage
     */
    const saveWishlist = (items: WishlistItem[]) => {
        const wishlistKey = getWishlistKey();
        localStorage.setItem(wishlistKey, JSON.stringify(items));
    };

    /**
     * Sync wishlist when user logs in
     * Merges guest wishlist with user's saved wishlist
     */
    const syncWishlistOnLogin = () => {
        const user = localStorage.getItem('plants-current-user');
        if (!user) return;

        const userId = JSON.parse(user).id;
        const guestWishlist = localStorage.getItem('plants-wishlist');
        const userWishlist = localStorage.getItem(`plants-wishlist-${userId}`);

        if (guestWishlist) {
            const guestItems = JSON.parse(guestWishlist);
            const userItems = userWishlist ? JSON.parse(userWishlist) : [];

            // Merge wishlists - remove duplicates based on id
            const merged = [...userItems];
            guestItems.forEach((guestItem: WishlistItem) => {
                const exists = merged.some(item => item.id === guestItem.id);
                if (!exists) {
                    merged.push(guestItem);
                }
            });

            // Save merged wishlist to user's wishlist
            localStorage.setItem(`plants-wishlist-${userId}`, JSON.stringify(merged));

            // Clear guest wishlist
            localStorage.removeItem('plants-wishlist');

            // Update state
            setWishlistItems(merged);
        } else {
            // Just load user's wishlist
            loadWishlist();
        }
    };

    /**
     * Add item to wishlist
     */
    const addToWishlist = (item: WishlistItem) => {
        setWishlistItems((prev) => {
            // Don't add if already in wishlist
            if (prev.find((i) => i.id === item.id)) {
                return prev;
            }

            const newItems = [...prev, item];
            saveWishlist(newItems);
            return newItems;
        });
    };

    /**
     * Remove item from wishlist
     */
    const removeFromWishlist = (id: string) => {
        setWishlistItems((prev) => {
            const newItems = prev.filter((item) => item.id !== id);
            saveWishlist(newItems);
            return newItems;
        });
    };

    /**
     * Check if item is in wishlist
     */
    const isInWishlist = (id: string) => {
        return wishlistItems.some((item) => item.id === id);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                syncWishlistOnLogin
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
}