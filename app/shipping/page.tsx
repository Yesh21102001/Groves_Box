export const metadata = {
    title: "Shipping Policy | Groves Box",
    description: "Shipping Policy for Groves Box – Learn about our delivery timelines, charges, and guidelines.",
};

export default function ShippingPolicy() {
    return (
        <div>
            <section className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 sm:p-10">

                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Shipping Policy
                    </h1>

                    <p className="text-sm text-gray-500 mb-8">
                        Last updated: June 2025
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-6">
                        At <strong>Groves Box</strong>, we take great care in delivering your plants and
                        gardening essentials safely and on time. Please read our shipping policy carefully
                        to understand delivery timelines, charges, and related guidelines.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        1. Order Processing Time
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        All orders are processed within <strong>1–2 business days</strong> after payment
                        confirmation. Orders placed on weekends or public holidays will be processed on
                        the next working day.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        2. Delivery Timelines
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Estimated delivery times after dispatch:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                        <li><strong>Metro cities:</strong> 2–4 business days</li>
                        <li><strong>Tier 2 &amp; Tier 3 cities:</strong> 4–7 business days</li>
                        <li><strong>Remote / rural areas:</strong> 7–10 business days</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed">
                        Delivery timelines are estimates and may vary due to courier delays, weather
                        conditions, or other unforeseen circumstances.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        3. Shipping Charges
                    </h2>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>Free shipping on orders above <strong>₹799</strong></li>
                        <li>A flat shipping fee of <strong>₹79</strong> applies to orders below ₹799</li>
                        <li>Bulky or oversized items may attract additional handling charges shown at checkout</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        4. Plant Care During Transit
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We take special precautions to ensure your plants arrive healthy:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>Plants are securely packed with breathable packaging material</li>
                        <li>Pots are cushioned to prevent breakage</li>
                        <li>In extreme weather, we may delay dispatch to protect plant health</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        5. Order Tracking
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Once your order is dispatched, you will receive a tracking number via email
                        and/or SMS. You can also track your order from the{" "}
                        <a href="/track-order" className="text-[#6b9238] underline hover:text-[#557420]">
                            Track Order
                        </a>{" "}
                        page on our website.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        6. Delivery Attempts
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Our courier partners will make up to <strong>2 delivery attempts</strong>. If
                        delivery is unsuccessful both times, the package will be returned to us. Re-shipping
                        charges may apply. Please ensure someone is available at the delivery address.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        7. Damaged or Lost Shipments
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        If your order arrives damaged or is lost in transit, please contact us within
                        <strong> 48 hours</strong> of the expected delivery date with your order number
                        and photographs (if applicable). We will investigate and offer a replacement or
                        refund as appropriate.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        8. Incorrect Address
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Please double-check your delivery address before placing an order. Groves Box
                        is not responsible for orders delivered to an incorrect address provided by the
                        customer. Address changes after dispatch may not be possible.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        9. Contact Us
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        For any shipping-related queries, please reach out to our support team:
                    </p>
                    <p className="mt-2 text-gray-800 font-medium">
                        📧 Email: support@grovesbox.com
                    </p>
                    <p className="mt-1 text-gray-800 font-medium">
                        📞 Phone: +91 XXXXX XXXXX (Mon–Sat, 10am–6pm)
                    </p>

                </div>
            </section>
        </div>
    );
}
