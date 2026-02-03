export const metadata = {
    title: "Refund Policy | Groves Box",
    description:
        "Refund Policy for Groves Box – Learn about returns, refunds, cancellations, and replacements.",
};

export default function RefundPolicy() {
    return (
        <section className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 sm:p-10">

                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    Refund Policy
                </h1>

                <p className="text-sm text-gray-500 mb-8">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                {/* Intro */}
                <p className="text-gray-700 leading-relaxed mb-6">
                    At <strong>Groves Box</strong>, we strive to ensure complete customer
                    satisfaction. This Refund Policy outlines the conditions under which
                    refunds, replacements, or cancellations may be accepted.
                </p>

                {/* Section */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    1. Eligibility for Refunds
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Refunds may be initiated under the following conditions:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Product received is damaged or defective</li>
                    <li>Incorrect product delivered</li>
                    <li>Order cancelled before dispatch</li>
                </ul>

                {/* Section */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    2. Non-Refundable Items
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    The following items are not eligible for refunds:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Customized or made-to-order products</li>
                    <li>Products damaged due to misuse or improper handling</li>
                    <li>Items returned without original packaging</li>
                </ul>

                {/* Section */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    3. Cancellation Policy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    Orders can be cancelled only before they are dispatched. Once an
                    order has been shipped, cancellation requests will not be accepted.
                </p>

                {/* Section */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    4. Refund Process
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    To initiate a refund, please contact our customer support team with
                    your order details and clear images of the product (if applicable).
                </p>
                <p className="text-gray-700 leading-relaxed">
                    Once approved, refunds will be processed to the original payment
                    method within <strong>5–7 business days</strong>.
                </p>

                {/* Section */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    5. Replacement Policy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    In case of damaged or incorrect items, we may offer a replacement
                    instead of a refund, depending on product availability.
                </p>

                {/* Section */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    6. Shipping Costs
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    Shipping charges are non-refundable unless the return is due to our
                    error (damaged or incorrect product).
                </p>

                {/* Section */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    7. Changes to This Policy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    Groves Box reserves the right to modify this Refund Policy at any
                    time. Changes will be updated on this page.
                </p>

                {/* Contact */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    8. Contact Us
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    If you have any questions regarding our Refund Policy, please contact
                    us at:
                </p>
                <p className="mt-2 text-gray-800 font-medium">
                    📧 Email: support@grovesbox.com
                </p>

            </div>
        </section>
    );
}
