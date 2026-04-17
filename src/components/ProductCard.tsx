"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
    Heart,
    ShoppingCart,
    X,
    ChevronLeft,
    ChevronRight,
    Check,
} from "lucide-react";

interface Variant {
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number | null;
    availableForSale: boolean;
    quantityAvailable?: number;
    selectedOptions?: Array<{ name: string; value: string }>;
}

interface ProductImage {
    url: string;
    altText?: string;
}

interface Product {
    id: string;
    name: string;
    handle: string;
    image: string;
    images?: ProductImage[];
    variants?: Variant[];
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const wishlisted = isInWishlist(product.id);
    const hasVariants = (product.variants?.length ?? 0) > 1;

    const [showQuickView, setShowQuickView] = useState(false);
    const [showBottomSheet, setShowBottomSheet] = useState(false);

    const firstAvailable =
        product.variants?.find((v) => v.availableForSale) ?? product.variants?.[0];
    const [selectedVariant] = useState<Variant | undefined>(firstAvailable);

    const price = selectedVariant?.price ?? 0;
    const compare = selectedVariant?.compareAtPrice;
    const discount =
        compare && compare > price
            ? Math.round(((compare - price) / compare) * 100)
            : null;

    /* ── lock body scroll while a modal is open ── */
    useEffect(() => {
        if (showBottomSheet || showQuickView) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [showBottomSheet, showQuickView]);

    /* ── handlers ── */
    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (wishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist({
                id: product.id,
                variantId: selectedVariant?.id ?? "",
                name: product.name,
                price,
                image: product.image,
                handle: product.handle,
                variants: product.variants,
            });
        }
    };

    // Mobile cart click -> always open bottom sheet
    const handleMobileCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowBottomSheet(true);
    };

    // Desktop Options click -> open quick view (for products with variants)
    const handleOptionsClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowQuickView(true);
    };

    // Desktop direct add-to-cart -> for products with NO variants
    // Adds the (only) available variant to cart without opening modal or redirecting.
    const handleDesktopAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!selectedVariant?.availableForSale) return;
        addToCart({
            id: product.id,
            variantId: selectedVariant.id,
            name: product.name,
            price,
            quantity: 1,
            image: product.image,
            handle: product.handle,
            variants: product.variants,
        });
        // No redirect on desktop — global cart state updates (header/drawer).
    };

    /* ─────────────────────────────────────────── */
    /* BOTTOM SHEET (MOBILE — Blinkit style)      */
    /* ─────────────────────────────────────────── */
    const BottomSheet = () => {
        // Require variant selection if hasVariants, else preselect first available
        const [bsVariant, setBsVariant] = useState<Variant | undefined>(
            hasVariants ? undefined : firstAvailable
        );
        const [adding, setAdding] = useState(false);

        // swipe-down-to-close state
        const [dragY, setDragY] = useState(0);
        const [isDragging, setIsDragging] = useState(false);
        const startY = useRef(0);

        const bsPrice = bsVariant?.price ?? price;
        const bsCompare = bsVariant?.compareAtPrice;
        const bsDiscount =
            bsCompare && bsCompare > bsPrice
                ? Math.round(((bsCompare - bsPrice) / bsCompare) * 100)
                : null;

        const canAdd = !!bsVariant && bsVariant.availableForSale;

        const handleBsAdd = () => {
            if (!canAdd || adding) return;
            setAdding(true);
            try {
                addToCart({
                    id: product.id,
                    variantId: bsVariant!.id,
                    name: product.name,
                    price: bsPrice,
                    quantity: 1,
                    image: product.image,
                    handle: product.handle,
                    variants: product.variants,
                });
                // Blinkit-style: redirect to cart after add on mobile
                setShowBottomSheet(false);
                router.push("/cart");
            } catch (err) {
                console.error("Add to cart failed:", err);
                setAdding(false);
            }
        };

        const handleClose = () => setShowBottomSheet(false);

        // Touch handlers for swipe-to-close (only on the handle area)
        const onTouchStart = (e: React.TouchEvent) => {
            startY.current = e.touches[0].clientY;
            setIsDragging(true);
        };
        const onTouchMove = (e: React.TouchEvent) => {
            const diff = e.touches[0].clientY - startY.current;
            if (diff > 0) setDragY(diff);
        };
        const onTouchEnd = () => {
            setIsDragging(false);
            if (dragY > 120) {
                handleClose();
            }
            setDragY(0);
        };

        return (
            <div className="bs-overlay" onClick={handleClose}>
                <div
                    className="bs-sheet"
                    style={{
                        transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
                        transition: isDragging ? "none" : undefined,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Drag handle (swipe to close) */}
                    <div
                        className="bs-handle-area"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <div className="bs-handle" />
                    </div>

                    {/* Header */}
                    <div className="bs-header">
                        <h2 className="bs-header-title">
                            {hasVariants ? "Choose an option" : "Add to Cart"}
                        </h2>
                        <button
                            className="bs-close"
                            onClick={handleClose}
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Scrollable content */}
                    <div className="bs-content">
                        <div className="bs-product-info">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="bs-image"
                            />
                            <div className="bs-details">
                                <h3 className="bs-name">{product.name}</h3>
                                <div className="bs-price-row">
                                    <span className="bs-price">
                                        ${bsPrice.toLocaleString("en-IN")}
                                    </span>
                                    {bsCompare && bsCompare > bsPrice && (
                                        <span className="bs-compare">
                                            ${bsCompare.toLocaleString("en-IN")}
                                        </span>
                                    )}
                                    {bsDiscount && (
                                        <span className="bs-discount">
                                            {bsDiscount}% OFF
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {hasVariants && product.variants && (
                            <div className="bs-variants">
                                <h4 className="bs-section-title">Available options</h4>
                                <div className="bs-variant-list">
                                    {product.variants.map((v) => {
                                        const selected = bsVariant?.id === v.id;
                                        const disabled = !v.availableForSale;
                                        return (
                                            <button
                                                key={v.id}
                                                onClick={() =>
                                                    !disabled && setBsVariant(v)
                                                }
                                                disabled={disabled}
                                                className={`bs-variant-btn ${selected ? "selected" : ""
                                                    } ${disabled ? "disabled" : ""}`}
                                            >
                                                <div className="bs-variant-info">
                                                    <span className="bs-variant-title">
                                                        {v.title}
                                                    </span>
                                                    <span className="bs-variant-price">
                                                        ${v.price.toLocaleString("en-IN")}
                                                    </span>
                                                </div>
                                                <div className="bs-variant-right">
                                                    {disabled ? (
                                                        <span className="bs-oos-label">
                                                            Out of stock
                                                        </span>
                                                    ) : selected ? (
                                                        <div className="bs-check">
                                                            <Check size={14} />
                                                        </div>
                                                    ) : (
                                                        <div className="bs-check-empty" />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sticky footer CTA */}
                    <div className="bs-footer">
                        <button
                            className="bs-add-btn"
                            onClick={handleBsAdd}
                            disabled={!canAdd || adding}
                        >
                            {!bsVariant && hasVariants ? (
                                "Select an option to continue"
                            ) : bsVariant && !bsVariant.availableForSale ? (
                                "Out of Stock"
                            ) : adding ? (
                                "Adding..."
                            ) : (
                                <>
                                    <ShoppingCart size={18} />
                                    Add to Cart · ${bsPrice.toLocaleString("en-IN")}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    /* ─────────────────────────────────────────── */
    /* QUICK VIEW (DESKTOP — centered modal)      */
    /* ─────────────────────────────────────────── */
    const QuickView = () => {
        const [qvVariant, setQvVariant] = useState<Variant | undefined>(
            hasVariants ? undefined : firstAvailable
        );
        const [adding, setAdding] = useState(false);
        const [currentImageIndex, setCurrentImageIndex] = useState(0);

        const allImages = product.images?.length
            ? product.images.map((img) => img.url)
            : [product.image];

        const qvPrice = qvVariant?.price ?? price;
        const qvCompare = qvVariant?.compareAtPrice;
        const qvDiscount =
            qvCompare && qvCompare > qvPrice
                ? Math.round(((qvCompare - qvPrice) / qvCompare) * 100)
                : null;

        const canAdd = !!qvVariant && qvVariant.availableForSale;

        const handleQuickAdd = () => {
            if (!canAdd || adding) return;
            setAdding(true);
            try {
                addToCart({
                    id: product.id,
                    variantId: qvVariant!.id,
                    name: product.name,
                    price: qvPrice,
                    quantity: 1,
                    image: product.image,
                    handle: product.handle,
                    variants: product.variants,
                });
                // Desktop: do NOT redirect; just close modal. Global cart state updates elsewhere.
                setShowQuickView(false);
            } catch (err) {
                console.error("Add to cart failed:", err);
                setAdding(false);
            }
        };

        const handleQuickWishlist = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (wishlisted) {
                removeFromWishlist(product.id);
            } else {
                addToWishlist({
                    id: product.id,
                    variantId: qvVariant?.id ?? "",
                    name: product.name,
                    price: qvPrice,
                    image: product.image,
                    handle: product.handle,
                    variants: product.variants,
                });
            }
        };

        const handlePrevImage = (e: React.MouseEvent) => {
            e.stopPropagation();
            setCurrentImageIndex((p) =>
                p === 0 ? allImages.length - 1 : p - 1
            );
        };
        const handleNextImage = (e: React.MouseEvent) => {
            e.stopPropagation();
            setCurrentImageIndex((p) =>
                p === allImages.length - 1 ? 0 : p + 1
            );
        };

        const handleClose = () => setShowQuickView(false);

        return (
            <div className="qv-overlay" onClick={handleClose}>
                <div className="qv-modal" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="qv-close"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>

                    <div className="qv-inner">
                        <div className="qv-gallery">
                            <div className="qv-main-image">
                                <img
                                    src={allImages[currentImageIndex]}
                                    alt={product.name}
                                />
                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            className="qv-nav qv-prev"
                                            onClick={handlePrevImage}
                                            aria-label="Previous"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button
                                            className="qv-nav qv-next"
                                            onClick={handleNextImage}
                                            aria-label="Next"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                            {allImages.length > 1 && (
                                <div className="qv-thumbs">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`qv-thumb ${idx === currentImageIndex ? "active" : ""
                                                }`}
                                        >
                                            <img src={img} alt="" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="qv-info">
                            <h2 className="qv-title">{product.name}</h2>

                            <div className="qv-price-row">
                                <span className="qv-price">
                                    ${qvPrice.toLocaleString("en-IN")}
                                </span>
                                {qvCompare && qvCompare > qvPrice && (
                                    <span className="qv-compare">
                                        ${qvCompare.toLocaleString("en-IN")}
                                    </span>
                                )}
                                {qvDiscount && (
                                    <span className="qv-discount">
                                        {qvDiscount}% OFF
                                    </span>
                                )}
                            </div>

                            {hasVariants && product.variants && (
                                <div className="qv-variants">
                                    <h3 className="qv-section-title">Options</h3>
                                    <div className="qv-variant-grid">
                                        {product.variants.map((v) => (
                                            <button
                                                key={v.id}
                                                onClick={() =>
                                                    v.availableForSale && setQvVariant(v)
                                                }
                                                disabled={!v.availableForSale}
                                                className={`qv-variant-btn ${qvVariant?.id === v.id ? "selected" : ""
                                                    } ${!v.availableForSale ? "disabled" : ""}`}
                                            >
                                                {v.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="qv-actions">
                                <button
                                    className="qv-add-btn"
                                    onClick={handleQuickAdd}
                                    disabled={!canAdd || adding}
                                >
                                    {!qvVariant && hasVariants ? (
                                        "Select an option"
                                    ) : qvVariant && !qvVariant.availableForSale ? (
                                        "Out of Stock"
                                    ) : adding ? (
                                        "Adding..."
                                    ) : (
                                        <>
                                            <ShoppingCart size={18} />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                                <button
                                    className={`qv-wish-btn ${wishlisted ? "active" : ""
                                        }`}
                                    onClick={handleQuickWishlist}
                                >
                                    <Heart
                                        size={18}
                                        className={wishlisted ? "fill-current" : ""}
                                    />
                                    {wishlisted ? "Saved" : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        /* ─── PRODUCT CARD ─── */
        .pc-card {
          font-family: 'Inter', sans-serif;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
          position: relative;
          border: 1px solid #EAF0E0;
          padding: 0;
        }
        .pc-card:hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .pc-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #ffffff;
          overflow: hidden;
        }
        .pc-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .pc-card:hover .pc-img-wrap img {
          transform: scale(1.05);
        }

        .pc-discount {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #78A240;
          color: #ffffff;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 4px 9px;
          border-radius: 20px;
          z-index: 10;
        }

        .pc-wish {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(6px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: none;
          z-index: 10;
          transition: transform 0.2s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }
        .pc-wish:hover { transform: scale(1.12); }

        /* MOBILE-ONLY floating cart on image — always opens bottom sheet */
        .pc-mobile-cart {
          display: none;
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 42px;
          height: 42px;
          background: #78A240;
          color: #ffffff;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(120, 162, 64, 0.35);
          transition: transform 0.15s ease, background 0.2s ease;
        }
        .pc-mobile-cart:active { transform: scale(0.9); }
        .pc-mobile-cart:hover { background: #648A33; }

        .pc-body {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          align-items: flex-start;
        }

        .pc-name {
          font-size: 15px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.3;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          width: 100%;
        }

        .pc-price {
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          margin: 0;
        }
        .pc-compare {
          margin-left: 6px;
          text-decoration: line-through;
          color: #b0b0b0;
          font-size: 12px;
        }

        /* DESKTOP hover-reveal — Options only */
        .pc-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          max-height: 0;
          margin-top: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.28s ease, opacity 0.22s ease, margin-top 0.28s ease;
        }
        .pc-card:hover .pc-actions {
          max-height: 48px;
          margin-top: 12px;
          opacity: 1;
        }

        .pc-order-btn {
          flex: 1;
          background: #78A240;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 9px 14px;
          font-family: 'Inter', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          white-space: nowrap;
        }
        .pc-order-btn:hover { background: #648A33; }
        .pc-order-btn:active { transform: scale(0.97); }

        .pc-icon-btn {
          width: 36px;
          height: 36px;
          background: #ffffff;
          border: 1px solid #E5E7EB;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .pc-icon-btn:hover {
          border-color: #78A240;
          color: #78A240;
          background: #F3F8EE;
        }

        .pc-oos {
          font-size: 11px;
          color: #9ca3af;
          letter-spacing: 0.05em;
          text-align: center;
          padding: 8px 0;
          font-weight: 500;
          width: 100%;
          margin-top: 12px;
          background: #F3F4F6;
          border-radius: 10px;
        }

        /* ─── MOBILE RESPONSIVE ─── */
        @media (max-width: 768px) {
          .pc-actions { display: none !important; }
          .pc-mobile-cart { display: flex; }
          .pc-body { padding: 12px 14px 14px; }
          .pc-name { font-size: 14px; }
          .pc-price { font-size: 12.5px; }
        }

        /* ─── BOTTOM SHEET (MOBILE) ─── */
        .bs-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 100;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: bsFadeIn 0.2s ease-out;
        }

        .bs-sheet {
          width: 100%;
          max-width: 640px;
          background: #ffffff;
          border-radius: 20px 20px 0 0;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          animation: bsSlideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1);
          transition: transform 0.2s ease-out;
          overflow: hidden;
        }

        .bs-handle-area {
          padding: 10px 0 6px;
          cursor: grab;
          touch-action: none;
        }
        .bs-handle {
          width: 40px;
          height: 4px;
          background: #d1d5db;
          border-radius: 2px;
          margin: 0 auto;
        }

        .bs-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 20px 12px;
          border-bottom: 1px solid #f3f4f6;
        }
        .bs-header-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          font-family: 'Inter', sans-serif;
        }
        .bs-close {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: #f3f4f6;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s;
        }
        .bs-close:hover { background: #e5e7eb; }

        .bs-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px 20px;
          font-family: 'Inter', sans-serif;
        }

        .bs-product-info {
          display: flex;
          gap: 14px;
          margin-bottom: 24px;
        }
        .bs-image {
          width: 88px;
          height: 88px;
          border-radius: 12px;
          object-fit: cover;
          background: #F3F8EE;
          flex-shrink: 0;
        }
        .bs-details { flex: 1; min-width: 0; }
        .bs-name {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
          line-height: 1.35;
        }
        .bs-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .bs-price {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .bs-compare {
          font-size: 13px;
          color: #9ca3af;
          text-decoration: line-through;
        }
        .bs-discount {
          font-size: 11px;
          font-weight: 600;
          color: #78A240;
          background: #F3F8EE;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .bs-section-title {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 12px 0;
        }

        .bs-variant-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .bs-variant-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease;
          width: 100%;
          text-align: left;
          font-family: 'Inter', sans-serif;
        }
        .bs-variant-btn:hover:not(.disabled):not(.selected) {
          border-color: #78A240;
        }
        .bs-variant-btn.selected {
          border-color: #78A240;
          background: #F3F8EE;
        }
        .bs-variant-btn.disabled {
          opacity: 0.55;
          cursor: not-allowed;
          background: #fafafa;
        }
        .bs-variant-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .bs-variant-title {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
        }
        .bs-variant-price {
          font-size: 13px;
          color: #6b7280;
        }
        .bs-variant-right {
          display: flex;
          align-items: center;
        }
        .bs-check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #78A240;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bs-check-empty {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1.5px solid #d1d5db;
        }
        .bs-oos-label {
          font-size: 11px;
          font-weight: 500;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .bs-footer {
          padding: 12px 20px calc(16px + env(safe-area-inset-bottom)) 20px;
          border-top: 1px solid #f3f4f6;
          background: #ffffff;
        }
        .bs-add-btn {
          width: 100%;
          height: 52px;
          background: #78A240;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .bs-add-btn:hover:not(:disabled) { background: #648A33; }
        .bs-add-btn:active:not(:disabled) { transform: scale(0.98); }
        .bs-add-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          color: #6b7280;
        }

        @keyframes bsFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bsSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        /* ─── DESKTOP QUICK VIEW ─── */
        .qv-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: bsFadeIn 0.2s ease-out;
        }
        .qv-modal {
          background: #ffffff;
          border-radius: 24px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
          position: relative;
          animation: quickViewIn 0.25s ease-out;
          font-family: 'Inter', sans-serif;
        }
        .qv-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: #f3f4f6;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: background 0.15s;
        }
        .qv-close:hover { background: #e5e7eb; }

        .qv-inner {
          display: flex;
          flex-direction: row;
        }
        .qv-gallery {
          width: 50%;
          padding: 24px;
        }
        .qv-main-image {
          aspect-ratio: 1 / 1;
          border-radius: 16px;
          overflow: hidden;
          background: #F3F8EE;
          position: relative;
        }
        .qv-main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .qv-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(6px);
          color: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: background 0.15s;
        }
        .qv-nav:hover { background: #ffffff; }
        .qv-prev { left: 12px; }
        .qv-next { right: 12px; }

        .qv-thumbs {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          overflow-x: auto;
        }
        .qv-thumb {
          width: 56px;
          height: 56px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid transparent;
          background: #f3f4f6;
          cursor: pointer;
          flex-shrink: 0;
          padding: 0;
          opacity: 0.6;
          transition: opacity 0.15s, border-color 0.15s;
        }
        .qv-thumb:hover { opacity: 1; }
        .qv-thumb.active {
          border-color: #78A240;
          opacity: 1;
        }
        .qv-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .qv-info {
          width: 50%;
          padding: 32px 28px 24px;
          display: flex;
          flex-direction: column;
        }
        .qv-title {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 12px 0;
          line-height: 1.3;
        }
        .qv-price-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .qv-price {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .qv-compare {
          font-size: 16px;
          color: #9ca3af;
          text-decoration: line-through;
        }
        .qv-discount {
          font-size: 12px;
          font-weight: 600;
          color: #dc2626;
          background: #fef2f2;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .qv-section-title {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 12px 0;
        }
        .qv-variant-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }
        .qv-variant-btn {
          padding: 10px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          background: #ffffff;
          font-size: 13px;
          font-weight: 600;
          color: #1a1a1a;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: 'Inter', sans-serif;
        }
        .qv-variant-btn:hover:not(.disabled):not(.selected) {
          border-color: #78A240;
        }
        .qv-variant-btn.selected {
          border-color: #78A240;
          background: #F3F8EE;
          color: #4F6F2B;
        }
        .qv-variant-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          text-decoration: line-through;
        }

        .qv-actions {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .qv-add-btn {
          width: 100%;
          height: 48px;
          background: #78A240;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .qv-add-btn:hover:not(:disabled) { background: #648A33; }
        .qv-add-btn:active:not(:disabled) { transform: scale(0.98); }
        .qv-add-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          color: #6b7280;
        }
        .qv-wish-btn {
          width: 100%;
          height: 44px;
          background: #ffffff;
          color: #7A5C3E;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .qv-wish-btn:hover { background: #F6F3E8; border-color: #7A5C3E; }
        .qv-wish-btn.active {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }
        .qv-wish-btn .fill-current { fill: currentColor; }

        @keyframes quickViewIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @media (max-width: 768px) {
          .qv-overlay { display: none; }
          .qv-inner { flex-direction: column; }
          .qv-gallery, .qv-info { width: 100%; }
        }
      `}</style>

            <Link
                href={`/products/${product.handle}`}
                className="pc-card"
                style={{ textDecoration: "none" }}
            >
                {/* Image */}
                <div className="pc-img-wrap">
                    {discount && <div className="pc-discount">{discount}% OFF</div>}

                    <button
                        className="pc-wish"
                        onClick={handleWishlist}
                        aria-label="Add to wishlist"
                    >
                        <Heart
                            size={15}
                            style={
                                wishlisted
                                    ? { fill: "#e53935", color: "#e53935" }
                                    : { color: "#888" }
                            }
                        />
                    </button>

                    <img src={product.image} alt={product.name} />

                    {/* MOBILE-ONLY: cart icon always opens bottom sheet */}
                    {selectedVariant?.availableForSale !== false && (
                        <button
                            className="pc-mobile-cart"
                            onClick={handleMobileCartClick}
                            aria-label="Add to cart"
                        >
                            <ShoppingCart size={18} />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="pc-body">
                    <p className="pc-name">{product.name}</p>
                    <p className="pc-price">
                        {price.toLocaleString("en-IN")}/-
                        {compare && compare > price && (
                            <span className="pc-compare">
                                {compare.toLocaleString("en-IN")}/-
                            </span>
                        )}
                    </p>

                    {/* DESKTOP hover-reveal: Options (if variants) or Add to Cart (if no variants) */}
                    {selectedVariant?.availableForSale === false ? (
                        <p className="pc-oos">OUT OF STOCK</p>
                    ) : (
                        <div className="pc-actions">
                            {hasVariants ? (
                                <button
                                    className="pc-order-btn"
                                    onClick={handleOptionsClick}
                                >
                                    Options
                                </button>
                            ) : (
                                <button
                                    className="pc-order-btn"
                                    onClick={handleDesktopAddToCart}
                                >
                                    <ShoppingCart size={15} />
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </Link>

            {showQuickView && <QuickView />}
            {showBottomSheet && <BottomSheet />}
        </>
    );
}