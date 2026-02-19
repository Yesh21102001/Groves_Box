"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { shopifyFetch } from "../../src/lib/shopify_utilis";
import Link from "next/link";

const steps = [
    { id: 1, title: "Order Confirmed", desc: "Your plant order is confirmed" },
    { id: 2, title: "Carefully Packed", desc: "Plant is packed with safety" },
    { id: 3, title: "Shipped", desc: "On the way to your home" },
    { id: 4, title: "Delivered", desc: "Plant delivered successfully" },
];


const CUSTOMER_ORDERS_QUERY = `
  query getCustomerOrders($customerAccessToken: String!, $first: Int!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            name
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice { amount currencyCode }
            subtotalPrice { amount currencyCode }
            totalShippingPrice { amount currencyCode }
            shippingAddress {
              address1 address2 city province zip country
            }
            lineItems(first: 50) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    price { amount currencyCode }
                    image { url altText }
                    product { handle }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Shopify Storefront API — all real status combinations
//
// fulfillmentStatus values:
//   UNFULFILLED | FULFILLED | PARTIAL | RESTOCKED
//   IN_TRANSIT  | OUT_FOR_DELIVERY | ATTEMPTED_DELIVERY | ON_HOLD | OPEN | SCHEDULED
//
// financialStatus values:
//   PENDING | AUTHORIZED | PARTIALLY_PAID | PAID
//   PARTIALLY_REFUNDED | REFUNDED | VOIDED | EXPIRED
// ─────────────────────────────────────────────────────────────────────────────
function getOrderStatus(fulfillmentStatus, financialStatus) {
    // 1. Payment not completed yet
    if (financialStatus === "PENDING") return { label: "Awaiting Payment", cls: "bg-orange-100 text-orange-700", step: 1 };
    if (financialStatus === "AUTHORIZED") return { label: "Payment Authorized", cls: "bg-blue-100 text-blue-700", step: 1 };
    if (financialStatus === "PARTIALLY_PAID") return { label: "Partially Paid", cls: "bg-orange-100 text-orange-700", step: 1 };
    if (financialStatus === "VOIDED") return { label: "Order Cancelled", cls: "bg-red-100 text-red-700", step: 1 };
    if (financialStatus === "EXPIRED") return { label: "Payment Expired", cls: "bg-red-100 text-red-700", step: 1 };

    // 2. Fully or partially refunded
    if (financialStatus === "REFUNDED") return { label: "Refunded", cls: "bg-red-100 text-red-700", step: 1 };
    if (financialStatus === "PARTIALLY_REFUNDED") return { label: "Partially Refunded", cls: "bg-yellow-100 text-yellow-700", step: 3 };

    // From here — financialStatus is PAID
    // 3. Fulfillment status determines the step
    if (fulfillmentStatus === "ON_HOLD") return { label: "On Hold", cls: "bg-gray-100 text-gray-600", step: 1 };
    if (fulfillmentStatus === "SCHEDULED") return { label: "Scheduled", cls: "bg-gray-100 text-gray-600", step: 1 };
    if (fulfillmentStatus === "OPEN") return { label: "Order Confirmed", cls: "bg-yellow-100 text-yellow-700", step: 1 };
    if (fulfillmentStatus === "UNFULFILLED") return { label: "Processing", cls: "bg-yellow-100 text-yellow-700", step: 2 };
    if (fulfillmentStatus === "IN_TRANSIT") return { label: "Shipped", cls: "bg-blue-100 text-blue-700", step: 3 };
    if (fulfillmentStatus === "OUT_FOR_DELIVERY") return { label: "Out for Delivery", cls: "bg-blue-100 text-blue-700", step: 3 };
    if (fulfillmentStatus === "ATTEMPTED_DELIVERY") return { label: "Delivery Attempted", cls: "bg-orange-100 text-orange-700", step: 3 };
    if (fulfillmentStatus === "PARTIAL") return { label: "Partially Shipped", cls: "bg-blue-100 text-blue-700", step: 3 };
    if (fulfillmentStatus === "RESTOCKED") return { label: "Restocked / Returned", cls: "bg-red-100 text-red-700", step: 1 };
    if (fulfillmentStatus === "FULFILLED") return { label: "Delivered ✓", cls: "bg-green-100 text-green-700", step: 4 };

    // Fallback
    return { label: "Order Confirmed", cls: "bg-yellow-100 text-yellow-700", step: 1 };
}

function parseOrder(node) {
    const fs = node.fulfillmentStatus;
    const fin = node.financialStatus;
    const status = getOrderStatus(fs, fin);

    return {
        id: node.name,
        orderNumber: node.orderNumber,
        date: new Date(node.processedAt).toLocaleDateString("en-IN", {
            year: "numeric", month: "short", day: "numeric"
        }),
        financialStatus: fin,
        fulfillmentStatus: fs,
        statusLabel: status.label,
        statusClass: status.cls,
        currentStep: status.step,   // ✅ step comes from status now
        total: `₹${parseFloat(node.totalPrice.amount).toFixed(2)}`,
        subtotal: parseFloat(node.subtotalPrice.amount),
        shipping: parseFloat(node.totalShippingPrice.amount),
        shippingAddress: node.shippingAddress,
        items: node.lineItems.edges.map(({ node: li }) => ({
            title: li.title,
            quantity: li.quantity,
            price: parseFloat(li.variant?.price?.amount || "0"),
            image: li.variant?.image?.url || "/placeholder.png",
            variantTitle: li.variant?.title || "",
            handle: li.variant?.product?.handle || "",
        })),
    };
}

export default function OrderTracking() {
    const searchParams = useSearchParams();
    const orderParam = searchParams.get("order") || "";

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchOrder() {
            try {
                setLoading(true);
                setError(null);

                // ✅ Read from the same key your login page uses
                const userRaw = localStorage.getItem("plants-current-user");
                const accessToken = userRaw ? JSON.parse(userRaw)?.accessToken : null;

                if (!accessToken) {
                    setError("not_logged_in");
                    return;
                }

                const data = await shopifyFetch({
                    query: CUSTOMER_ORDERS_QUERY,
                    variables: { customerAccessToken: accessToken, first: 50 },
                });

                const customer = data?.data?.customer;
                if (!customer) {
                    setError("session_expired");
                    return;
                }

                const orders = customer.orders.edges.map(({ node }) => parseOrder(node));
                if (orders.length === 0) {
                    setError("no_orders");
                    return;
                }

                const normalized = orderParam.replace("#", "").trim();
                const matched = normalized
                    ? orders.find(o =>
                        String(o.orderNumber) === normalized ||
                        o.id === `#${normalized}`
                    ) || orders[0]
                    : orders[0];

                setOrder(matched);

            } catch (err) {
                console.error("Error fetching order:", err);
                setError("fetch_failed");
            } finally {
                setLoading(false);
            }
        }

        fetchOrder();
    }, [orderParam]);

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

    if (error) {
        return (
            <div className="bg-[#f5f7f4] min-h-screen flex items-center justify-center px-4">
                <div className="text-center bg-white rounded-3xl shadow-lg p-10 max-w-sm w-full">
                    <p className="text-3xl mb-4">🌿</p>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        {error === "not_logged_in" ? "Please Log In" :
                            error === "session_expired" ? "Session Expired" :
                                error === "no_orders" ? "No Orders Found" :
                                    "Something went wrong"}
                    </h2>
                    <p className="text-gray-500 text-sm mb-4">
                        {error === "not_logged_in" ? "You need to be logged in to track your order." :
                            error === "session_expired" ? "Your session has expired. Please log in again." :
                                error === "no_orders" ? "No orders found on your account." :
                                    "Failed to load order. Please try again."}
                    </p>                    {debugKeys.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-3 mb-4 text-left">
                            <p className="text-xs font-semibold text-gray-500 mb-1">
                                🔍 localStorage keys found:
                            </p>
                            <p className="text-xs text-gray-600 break-all">
                                {debugKeys.join(", ") || "none"}
                            </p>
                        </div>
                    )}

                    <Link
                        href="/login"
                        className="inline-block bg-[#007B57] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#009A7B] transition"
                    >
                        {error === "no_orders" ? "Shop Now" : "Go to Login"}
                    </Link>
                </div>
            </div>
        );
    }

    if (!order) return null;

    const currentStep = order.currentStep;

    return (
        <div className="bg-[#f5f7f4] px-4 py-10 flex justify-center min-h-screen">
            <div className="w-full max-w-xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl bg-white rounded-3xl shadow-lg p-6 md:p-8">

                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#007B57]">Track Your Plant</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Order ID: <span className="font-medium">{order.id}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Placed on {order.date}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${order.statusClass}`}>
                        {order.statusLabel}
                    </span>
                </div>

                {order.shippingAddress && (
                    <div className="bg-[#f0f4f1] rounded-2xl px-4 py-3 mb-6 flex items-start gap-3">
                        <span className="text-lg mt-0.5">📍</span>
                        <div>
                            <p className="text-xs font-semibold text-gray-600 mb-0.5">Delivering to</p>
                            <p className="text-sm text-gray-700">
                                {[order.shippingAddress.address1, order.shippingAddress.city,
                                order.shippingAddress.province, order.shippingAddress.zip,
                                order.shippingAddress.country].filter(Boolean).join(", ")}
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-3 mb-8">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 bg-[#f0f4f1] rounded-2xl p-4">
                            <img
                                src={item.image} alt={item.title}
                                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                                onError={(e) => { e.target.src = "/placeholder.png"; }}
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm md:text-base font-medium text-[#007B57] line-clamp-1">{item.title}</h3>
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

                <div className="space-y-7">
                    {steps.map((step, index) => {
                        const isCompleted = step.id < currentStep;
                        const isActive = step.id === currentStep;
                        return (
                            <div key={step.id} className="flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-5 h-5 rounded-full border-2 ${isCompleted ? "bg-[#3a6b4b] border-[#3a6b4b]" :
                                        isActive ? "bg-[#7aa27d] border-[#7aa27d] animate-pulse" :
                                            "border-gray-300"
                                        }`} />
                                    {index !== steps.length - 1 && (
                                        <div className={`w-px h-12 mt-1 ${isCompleted ? "bg-[#3a6b4b]" : "bg-gray-200"}`} />
                                    )}
                                </div>
                                <div>
                                    <h4 className={`text-sm md:text-base font-medium ${isCompleted || isActive ? "text-[#007B57]" : "text-gray-400"
                                        }`}>{step.title}</h4>
                                    <p className="text-xs md:text-sm text-gray-500 mt-0.5">{step.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 border-t border-gray-100 pt-5 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Shipping</span>
                        <span>{order.shipping > 0 ? `₹${order.shipping.toFixed(2)}` : "FREE"}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold text-[#007B57] pt-1">
                        <span>Total</span><span>{order.total}</span>
                    </div>
                </div>

                <div className="mt-8 space-y-3">
                    <Link href="/products"
                        className="block w-full bg-[#007B57] text-white py-3 rounded-xl font-medium hover:bg-[#009A7B] transition text-center">
                        Continue Shopping
                    </Link>
                    <button className="w-full border border-[#007B57] text-[#007B57] py-3 rounded-xl font-medium hover:bg-[#f0f4f1] transition">
                        Need Plant Care Help?
                    </button>
                </div>
            </div>
        </div>
    );
}