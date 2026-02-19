"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCustomerOrders } from "../../src/lib/shopify_utilis";
import Link from "next/link";

const steps = [
    { id: 1, title: "Order Confirmed", desc: "Your plant order is confirmed" },
    { id: 2, title: "Carefully Packed", desc: "Plant is packed with safety" },
    { id: 3, title: "Shipped", desc: "On the way to your home" },
    { id: 4, title: "Delivered", desc: "Plant delivered successfully" },
];

// Map Shopify fulfillment status → step number
function getStepFromStatus(fulfillmentStatus, financialStatus) {
    if (fulfillmentStatus === "FULFILLED") return 4;
    if (fulfillmentStatus === "IN_TRANSIT") return 3;
    if (fulfillmentStatus === "PARTIAL") return 3;
    if (financialStatus === "PAID") return 2; // paid but not shipped yet = packed
    return 1;
}

export default function OrderTracking() {
    const searchParams = useSearchParams();
    const orderName = searchParams.get("order"); // e.g. ?order=#1003

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchOrder() {
            try {
                setLoading(true);

                // Get access token from localStorage
                const accessToken = localStorage.getItem("shopify_customer_token");

                if (!accessToken) {
                    setError("Please log in to track your order.");
                    return;
                }

                // Fetch all recent orders and find the matching one
                const orders = await getCustomerOrders(accessToken, 20);

                if (!orders || orders.length === 0) {
                    setError("No orders found.");
                    return;
                }

                // If order param passed in URL, find that specific order
                // Otherwise show the most recent order
                const matched = orderName
                    ? orders.find(o => o.id === orderName || String(o.orderNumber) === orderName.replace("#", ""))
                    : orders[0];

                if (!matched) {
                    setError("Order not found.");
                    return;
                }

                setOrder(matched);
            } catch (err) {
                console.error("Error fetching order:", err);
                setError("Failed to load order. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        fetchOrder();
    }, [orderName]);

    // ── Loading ──────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="bg-[#f5f7f4] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#007B57] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Loading your order...</p>
                </div>
            </div>
        );
    }

    // ── Error ────────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="bg-[#f5f7f4] min-h-screen flex items-center justify-center px-4">
                <div className="text-center bg-white rounded-3xl shadow-lg p-10 max-w-sm w-full">
                    <p className="text-2xl mb-3">🌿</p>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Oops!</h2>
                    <p className="text-gray-500 text-sm mb-6">{error}</p>
                    <Link
                        href="/login"
                        className="inline-block bg-[#007B57] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#009A7B] transition"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (!order) return null;

    const currentStep = getStepFromStatus(order.fulfillmentStatus, order.financialStatus);

    // Status badge color
    const statusColors = {
        Delivered: "bg-green-100 text-green-700",
        "In Transit": "bg-blue-100 text-blue-700",
        "Partially Shipped": "bg-blue-100 text-blue-700",
        Processing: "bg-yellow-100 text-yellow-700",
        "Payment Pending": "bg-orange-100 text-orange-700",
        Refunded: "bg-red-100 text-red-700",
    };
    const badgeClass = statusColors[order.status] || "bg-gray-100 text-gray-600";

    return (
        <div className="bg-[#f5f7f4] px-4 py-10 flex justify-center min-h-screen">
            <div className="w-full max-w-xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl bg-white rounded-3xl shadow-lg p-6 md:p-8">

                {/* ── Header ── */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#007B57]">
                            Track Your Plant
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Order ID:{" "}
                            <span className="font-medium">{order.id}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Placed on {order.date}
                        </p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${badgeClass}`}>
                        {order.status}
                    </span>
                </div>

                {/* ── Shipping address ── */}
                {order.shippingAddress && (
                    <div className="bg-[#f0f4f1] rounded-2xl px-4 py-3 mb-6 flex items-start gap-3">
                        <span className="text-lg mt-0.5">📍</span>
                        <div>
                            <p className="text-xs font-semibold text-gray-600 mb-0.5">Delivering to</p>
                            <p className="text-sm text-gray-700">
                                {[
                                    order.shippingAddress.address1,
                                    order.shippingAddress.city,
                                    order.shippingAddress.province,
                                    order.shippingAddress.zip,
                                    order.shippingAddress.country,
                                ].filter(Boolean).join(", ")}
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Product Cards ── */}
                <div className="space-y-3 mb-8">
                    {order.items.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 bg-[#f0f4f1] rounded-2xl p-4"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                                onError={(e) => { e.target.src = "/placeholder.png"; }}
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm md:text-base font-medium text-[#007B57] line-clamp-1">
                                    {item.title}
                                </h3>
                                {item.variantTitle && item.variantTitle !== "Default Title" && (
                                    <p className="text-xs text-gray-500 mt-0.5">{item.variantTitle}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-sm md:text-base font-semibold text-[#007B57] flex-shrink-0">
                                ₹{(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Tracking Timeline ── */}
                <div className="space-y-7">
                    {steps.map((step, index) => {
                        const isCompleted = step.id < currentStep;
                        const isActive = step.id === currentStep;

                        return (
                            <div key={step.id} className="flex items-start gap-4">
                                {/* Dot + line */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 ${isCompleted
                                            ? "bg-[#3a6b4b] border-[#3a6b4b]"
                                            : isActive
                                                ? "bg-[#7aa27d] border-[#7aa27d] animate-pulse"
                                                : "border-gray-300"
                                            }`}
                                    />
                                    {index !== steps.length - 1 && (
                                        <div className={`w-px h-12 mt-1 ${isCompleted ? "bg-[#3a6b4b]" : "bg-gray-200"
                                            }`} />
                                    )}
                                </div>

                                {/* Text */}
                                <div>
                                    <h4 className={`text-sm md:text-base font-medium ${isCompleted || isActive ? "text-[#007B57]" : "text-gray-400"
                                        }`}>
                                        {step.title}
                                    </h4>
                                    <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Order total ── */}
                <div className="mt-8 border-t border-gray-100 pt-5 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span>₹{order.subtotal?.toFixed(2) || "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Shipping</span>
                        <span>₹{order.shipping?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold text-[#007B57] pt-1">
                        <span>Total</span>
                        <span>{order.total}</span>
                    </div>
                </div>

                {/* ── Footer button ── */}
                <div className="mt-8">
                    <button className="w-full bg-[#007B57] text-white py-3 rounded-xl font-medium hover:bg-[#009A7B] transition">
                        Need Plant Care Help?
                    </button>
                </div>
            </div>
        </div>
    );
}