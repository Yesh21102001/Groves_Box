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

// ─────────────────────────────────────────────────────────────────────────────
// GraphQL: Apply / Remove discount codes
// ─────────────────────────────────────────────────────────────────────────────
const APPLY_DISCOUNT_CODE = `
  mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
        checkoutUrl
        discountCodes {
          code
          applicable
        }
        cost {
          totalAmount { amount }
          subtotalAmount { amount }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount }
                  product {
                    id
                    title
                    handle
                    featuredImage { url }
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────
const buildCheckoutUrl = (rawUrl) => {
    if (!rawUrl) return null;
    const returnTo = encodeURIComponent(
        `${process.env.NEXT_PUBLIC_SITE_URL}/order-success`
    );
    return `${rawUrl}&return_to=${returnTo}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkoutUrl, setCheckoutUrl] = useState(null);
    const [currentUserId, setCurrentUserId] = useState('guest');

    // Discount state
    const [discountCodes, setDiscountCodes] = useState([]);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountError, setDiscountError] = useState(null);
    const [discountLoading, setDiscountLoading] = useState(false);

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
        } catch {
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
                    } catch (err) {
                        console.error('Error parsing user:', err);
                    }
                }
            }

            setCurrentUserId(userId);
            const cartKey = `shopify_cart_id_${userId}`;
            let storedCartId = null;

            if (typeof window !== 'undefined') {
                storedCartId = localStorage.getItem(cartKey);
            }

            if (storedCartId) {
                try {
                    const cartData = await shopifyFetch({
                        query: GET_CART,
                        variables: { cartId: storedCartId },
                    });
                    if (cartData.data.cart) {
                        setCartId(storedCartId);
                        setCheckoutUrl(buildCheckoutUrl(cartData.data.cart.checkoutUrl));
                        updateCartItems(cartData.data.cart);
                    } else {
                        await createNewCart(userId);
                    }
                } catch (err) {
                    console.error('Error fetching cart:', err);
                    await createNewCart(userId);
                }
            } else {
                await createNewCart(userId);
            }
        } catch (err) {
            console.error('Error initializing cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const createNewCart = async (userId = null) => {
        try {
            if (!userId) userId = getCurrentUserId();
            const response = await shopifyFetch({ query: CREATE_CART });
            const newCartId = response.data.cartCreate.cart.id;
            const newCheckoutUrl = response.data.cartCreate.cart.checkoutUrl;

            setCartId(newCartId);
            setCheckoutUrl(buildCheckoutUrl(newCheckoutUrl));
            setCartItems([]);
            setDiscountCodes([]);
            setDiscountAmount(0);
            setCurrentUserId(userId);

            if (typeof window !== 'undefined') {
                localStorage.setItem(`shopify_cart_id_${userId}`, newCartId);
            }
            return newCartId;
        } catch (err) {
            console.error('❌ Error creating cart:', err);
            throw err;
        }
    };

    const updateCartItems = (cart) => {
        if (!cart || !cart.lines) { setCartItems([]); return; }

        const items = cart.lines.edges.map((edge) => ({
            id: edge.node.id,
            productId: edge.node.merchandise.product.id,
            variantId: edge.node.merchandise.id,
            name: edge.node.merchandise.product.title,
            price: parseFloat(edge.node.merchandise.price.amount),
            quantity: edge.node.quantity,
            image: edge.node.merchandise.product.featuredImage?.url || '/placeholder.png',
            handle: edge.node.merchandise.product.handle,
            variant: edge.node.merchandise.title !== 'Default Title'
                ? edge.node.merchandise.title : null,
        }));

        setCartItems(items);

        if (cart.discountCodes) setDiscountCodes(cart.discountCodes);

        if (cart.cost) {
            const sub = parseFloat(cart.cost.subtotalAmount.amount);
            const total = parseFloat(cart.cost.totalAmount.amount);
            setDiscountAmount(Math.max(0, sub - total));
        }
    };

    const refreshCart = async () => {
        if (!cartId) return;
        try {
            const cartData = await shopifyFetch({ query: GET_CART, variables: { cartId } });
            if (cartData.data.cart) {
                setCheckoutUrl(buildCheckoutUrl(cartData.data.cart.checkoutUrl));
                updateCartItems(cartData.data.cart);
            }
        } catch (err) {
            console.error('❌ Error refreshing cart:', err);
        }
    };

    const addToCart = async (product) => {
        try {
            let currentCartId = cartId;
            const userId = getCurrentUserId();
            if (!currentCartId) currentCartId = await createNewCart(userId);

            let variantId = product.variantId;
            if (!variantId && product.variants?.length > 0) variantId = product.variants[0].id;
            if (!variantId) { alert('Unable to add product to cart.'); return; }

            const existingItem = cartItems.find((item) => item.variantId === variantId);
            if (existingItem) {
                await updateQuantity(existingItem.id, existingItem.quantity + (product.quantity || 1));
            } else {
                await shopifyFetch({
                    query: ADD_TO_CART,
                    variables: {
                        cartId: currentCartId,
                        lines: [{ merchandiseId: variantId, quantity: product.quantity || 1 }],
                    },
                });
                await refreshCart();
            }
        } catch (err) {
            console.error('❌ Error adding to cart:', err);
            alert('Failed to add item to cart.');
        }
    };

    const updateQuantity = async (lineId, newQuantity) => {
        if (!cartId) return;
        try {
            if (newQuantity <= 0) { await removeFromCart(lineId); return; }
            await shopifyFetch({
                query: UPDATE_CART_LINE,
                variables: { cartId, lines: [{ id: lineId, quantity: newQuantity }] },
            });
            await refreshCart();
        } catch (err) {
            console.error('❌ Error updating quantity:', err);
        }
    };

    const removeFromCart = async (lineId) => {
        if (!cartId) return;
        try {
            await shopifyFetch({
                query: REMOVE_CART_LINE,
                variables: { cartId, lineIds: [lineId] },
            });
            await refreshCart();
        } catch (err) {
            console.error('❌ Error removing from cart:', err);
        }
    };

    const clearCart = async () => {
        try {
            const userId = getCurrentUserId();
            await createNewCart(userId);
        } catch (err) {
            console.error('❌ Error clearing cart:', err);
        }
    };

    // ── Apply discount code ───────────────────────────────────────────────────
    const applyDiscount = async (code) => {
        if (!cartId || !code?.trim()) return;
        setDiscountLoading(true);
        setDiscountError(null);

        try {
            const response = await shopifyFetch({
                query: APPLY_DISCOUNT_CODE,
                variables: { cartId, discountCodes: [code.trim().toUpperCase()] },
            });

            const { cart, userErrors } = response.data.cartDiscountCodesUpdate;

            if (userErrors?.length) {
                setDiscountError(userErrors[0].message);
                return;
            }

            const applied = cart.discountCodes.find(
                (d) => d.code.toUpperCase() === code.trim().toUpperCase()
            );

            if (!applied?.applicable) {
                setDiscountError('This offer code is invalid or conditions are not met.');
                return;
            }

            setCheckoutUrl(buildCheckoutUrl(cart.checkoutUrl));
            updateCartItems(cart);
        } catch (err) {
            console.error('❌ Error applying discount:', err);
            setDiscountError('Failed to apply offer. Please try again.');
        } finally {
            setDiscountLoading(false);
        }
    };

    // ── Remove a specific discount code ──────────────────────────────────────
    const removeDiscount = async (codeToRemove) => {
        if (!cartId) return;
        setDiscountLoading(true);
        setDiscountError(null);

        try {
            const remaining = discountCodes
                .filter((d) => d.code !== codeToRemove)
                .map((d) => d.code);

            const response = await shopifyFetch({
                query: APPLY_DISCOUNT_CODE,
                variables: { cartId, discountCodes: remaining },
            });

            const { cart, userErrors } = response.data.cartDiscountCodesUpdate;
            if (userErrors?.length) { setDiscountError(userErrors[0].message); return; }

            setCheckoutUrl(buildCheckoutUrl(cart.checkoutUrl));
            updateCartItems(cart);
        } catch (err) {
            console.error('❌ Error removing discount:', err);
        } finally {
            setDiscountLoading(false);
        }
    };

    const value = {
        cartItems, cartId, checkoutUrl, loading,
        addToCart, updateQuantity, removeFromCart, clearCart, refreshCart, currentUserId,
        discountCodes, discountAmount, discountError, discountLoading,
        applyDiscount, removeDiscount,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) throw new Error('useCart must be used within a CartProvider');
    return context;
}