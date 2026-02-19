'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
    shopifyFetch,
    CREATE_CART,
    GET_CART,
    ADD_TO_CART,
    UPDATE_CART_LINE,
    REMOVE_CART_LINE
} from '../lib/shopify_utilis';

const CartContext = createContext();

// ✅ Appends return_to so Shopify redirects to your custom success page after payment
const buildCheckoutUrl = (rawUrl) => {
    if (!rawUrl) return null;
    const returnTo = encodeURIComponent(
        `${process.env.NEXT_PUBLIC_SITE_URL}/order-success`
    );
    return `${rawUrl}&return_to=${returnTo}`;
};

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkoutUrl, setCheckoutUrl] = useState(null);
    const [currentUserId, setCurrentUserId] = useState('guest');

    useEffect(() => {
        const handleAuthChange = () => {
            console.log('🔄 Auth changed, reinitializing cart...');
            initializeCart();
        };

        window.addEventListener('auth-change', handleAuthChange);
        window.addEventListener('storage', handleAuthChange);

        return () => {
            window.removeEventListener('auth-change', handleAuthChange);
            window.removeEventListener('storage', handleAuthChange);
        };
    }, []);

    useEffect(() => {
        initializeCart();
    }, []);

    const getCurrentUserId = () => {
        if (typeof window === 'undefined') return 'guest';
        const userStr = localStorage.getItem('plants-current-user');
        if (!userStr) return 'guest';
        try {
            const user = JSON.parse(userStr);
            return user.id || 'guest';
        } catch (error) {
            console.error('Error parsing user:', error);
            return 'guest';
        }
    };

    const initializeCart = async () => {
        try {
            setLoading(true);

            let userId = 'guest';

            if (typeof window !== 'undefined') {
                const userStr = localStorage.getItem('plants-current-user');
                if (userStr) {
                    try {
                        const currentUser = JSON.parse(userStr);
                        userId = currentUser.id;
                        console.log('👤 Current user:', currentUser.email, '| ID:', userId);
                    } catch (error) {
                        console.error('Error parsing user:', error);
                    }
                }
            }

            setCurrentUserId(userId);

            const cartKey = `shopify_cart_id_${userId}`;
            console.log('🔑 Using cart key:', cartKey);

            let storedCartId = null;
            if (typeof window !== 'undefined') {
                storedCartId = localStorage.getItem(cartKey);
                console.log('📦 Stored cart ID:', storedCartId || 'none');
            }

            if (storedCartId) {
                try {
                    const cartData = await shopifyFetch({
                        query: GET_CART,
                        variables: { cartId: storedCartId }
                    });

                    if (cartData.data.cart) {
                        setCartId(storedCartId);
                        // ✅ FIX: wrap with buildCheckoutUrl
                        setCheckoutUrl(buildCheckoutUrl(cartData.data.cart.checkoutUrl));
                        updateCartItems(cartData.data.cart);
                        console.log('✅ Cart loaded for user:', userId);
                    } else {
                        await createNewCart(userId);
                    }
                } catch (error) {
                    console.error('Error fetching cart:', error);
                    await createNewCart(userId);
                }
            } else {
                await createNewCart(userId);
            }
        } catch (error) {
            console.error('Error initializing cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const createNewCart = async (userId = null) => {
        try {
            console.log('📝 Creating new cart...');

            if (!userId) {
                userId = getCurrentUserId();
            }

            const response = await shopifyFetch({
                query: CREATE_CART
            });

            const newCartId = response.data.cartCreate.cart.id;
            const newCheckoutUrl = response.data.cartCreate.cart.checkoutUrl;

            setCartId(newCartId);
            // ✅ FIX: wrap with buildCheckoutUrl
            setCheckoutUrl(buildCheckoutUrl(newCheckoutUrl));
            setCartItems([]);
            setCurrentUserId(userId);

            if (typeof window !== 'undefined') {
                const cartKey = `shopify_cart_id_${userId}`;
                localStorage.setItem(cartKey, newCartId);
                console.log(`✅ New cart created for user ${userId}:`, newCartId);
            }

            return newCartId;
        } catch (error) {
            console.error('❌ Error creating cart:', error);
            throw error;
        }
    };

    const updateCartItems = (cart) => {
        if (!cart || !cart.lines) {
            setCartItems([]);
            return;
        }

        const items = cart.lines.edges.map((edge) => ({
            id: edge.node.id,
            productId: edge.node.merchandise.product.id,
            variantId: edge.node.merchandise.id,
            name: edge.node.merchandise.product.title,
            price: parseFloat(edge.node.merchandise.price.amount),
            quantity: edge.node.quantity,
            image: edge.node.merchandise.product.featuredImage?.url || '/placeholder.png',
            handle: edge.node.merchandise.product.handle,
            variant: edge.node.merchandise.title !== 'Default Title' ? edge.node.merchandise.title : null
        }));

        console.log('🔄 Updating cart items:', items.length, 'items');
        setCartItems(items);
    };

    const refreshCart = async () => {
        if (!cartId) {
            console.log('⚠️ No cart ID, skipping refresh');
            return;
        }

        try {
            console.log('🔄 Refreshing cart...');
            const cartData = await shopifyFetch({
                query: GET_CART,
                variables: { cartId }
            });

            if (cartData.data.cart) {
                // ✅ FIX: wrap with buildCheckoutUrl
                setCheckoutUrl(buildCheckoutUrl(cartData.data.cart.checkoutUrl));
                updateCartItems(cartData.data.cart);
                console.log('✅ Cart refreshed successfully');
            }
        } catch (error) {
            console.error('❌ Error refreshing cart:', error);
        }
    };

    const addToCart = async (product) => {
        try {
            console.log('🛒 Adding to cart:', product);

            let currentCartId = cartId;
            let userId = getCurrentUserId();

            if (!currentCartId) {
                console.log('📝 No cart exists, creating new one...');
                currentCartId = await createNewCart(userId);
            }

            let variantId = product.variantId;

            if (!variantId && product.variants && product.variants.length > 0) {
                variantId = product.variants[0].id;
                console.log('Using first variant:', variantId);
            }

            if (!variantId) {
                console.error('❌ No variant ID found for product:', product);
                alert('Unable to add product to cart. Please try again.');
                return;
            }

            console.log('✅ Using variant ID:', variantId);

            const existingItem = cartItems.find(item => item.variantId === variantId);

            if (existingItem) {
                console.log('📦 Item exists, updating quantity...');
                await updateQuantity(existingItem.id, existingItem.quantity + (product.quantity || 1));
            } else {
                console.log('➕ Adding new item to cart...');

                const addResponse = await shopifyFetch({
                    query: ADD_TO_CART,
                    variables: {
                        cartId: currentCartId,
                        lines: [
                            {
                                merchandiseId: variantId,
                                quantity: product.quantity || 1
                            }
                        ]
                    }
                });

                console.log('✅ Add to cart response:', addResponse);
                await refreshCart();
            }

            console.log('🎉 Item added successfully!');

        } catch (error) {
            console.error('❌ Error adding to cart:', error);
            alert('Failed to add item to cart. Please check console for details.');
        }
    };

    const updateQuantity = async (lineId, newQuantity) => {
        if (!cartId) return;

        try {
            console.log(`🔄 Updating quantity for ${lineId} to ${newQuantity}`);

            if (newQuantity <= 0) {
                await removeFromCart(lineId);
                return;
            }

            await shopifyFetch({
                query: UPDATE_CART_LINE,
                variables: {
                    cartId,
                    lines: [{ id: lineId, quantity: newQuantity }]
                }
            });

            await refreshCart();
            console.log('✅ Quantity updated');
        } catch (error) {
            console.error('❌ Error updating quantity:', error);
        }
    };

    const removeFromCart = async (lineId) => {
        if (!cartId) return;

        try {
            console.log(`🗑️ Removing item ${lineId}`);

            await shopifyFetch({
                query: REMOVE_CART_LINE,
                variables: {
                    cartId,
                    lineIds: [lineId]
                }
            });

            await refreshCart();
            console.log('✅ Item removed');
        } catch (error) {
            console.error('❌ Error removing from cart:', error);
        }
    };

    const clearCart = async () => {
        try {
            console.log('🗑️ Clearing cart...');
            const userId = getCurrentUserId();
            await createNewCart(userId);
            console.log('✅ Cart cleared');
        } catch (error) {
            console.error('❌ Error clearing cart:', error);
        }
    };

    const value = {
        cartItems,
        cartId,
        checkoutUrl,   // ✅ Already has return_to appended
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        currentUserId
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}