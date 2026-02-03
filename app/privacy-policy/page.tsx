import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";

export const metadata = {
    title: "Privacy Policy | Groves Box",
    description:
        "Privacy Policy for Groves Box – Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicy() {
    return (
        <div>
            <section className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 sm:p-10">

                    {/* Heading */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Privacy Policy
                    </h1>

                    <p className="text-sm text-gray-500 mb-8">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    {/* Intro */}
                    <p className="text-gray-700 leading-relaxed mb-6">
                        At <strong>Groves Box</strong>, your privacy is very important to us.
                        This Privacy Policy explains how we collect, use, and protect your
                        personal information when you visit or use our website and services.
                    </p>

                    {/* Section */}
                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        1. Information We Collect
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We may collect personal information such as your name, phone number,
                        email address, delivery address, and payment details when you:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>Create an account</li>
                        <li>Place an order</li>
                        <li>Contact customer support</li>
                        <li>Subscribe to updates or offers</li>
                    </ul>

                    {/* Section */}
                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        2. How We Use Your Information
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        The information we collect is used to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2">
                        <li>Process and deliver your orders</li>
                        <li>Improve our products and services</li>
                        <li>Communicate order updates and support responses</li>
                        <li>Send promotional offers (only if you opt in)</li>
                    </ul>

                    {/* Section */}
                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        3. Data Security
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        We implement appropriate security measures to protect your personal
                        data from unauthorized access, alteration, disclosure, or destruction.
                        However, no method of transmission over the internet is 100% secure.
                    </p>

                    {/* Section */}
                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        4. Sharing of Information
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        We do not sell or rent your personal information to third parties.
                        Your data may only be shared with trusted partners who assist us in
                        operating our website and delivering services, under strict
                        confidentiality agreements.
                    </p>

                    {/* Section */}
                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        5. Cookies
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Groves Box may use cookies to enhance your browsing experience,
                        analyze site traffic, and personalize content. You can disable cookies
                        through your browser settings if you prefer.
                    </p>

                    {/* Section */}
                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        6. Your Rights
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        You have the right to access, update, or request deletion of your
                        personal data. If you wish to exercise these rights, please contact us.
                    </p>

                    {/* Section */}
                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        7. Changes to This Policy
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        We may update this Privacy Policy from time to time. Any changes will
                        be posted on this page with an updated revision date.
                    </p>

                    {/* Contact */}
                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                        8. Contact Us
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        If you have any questions about this Privacy Policy or our data
                        practices, please contact us at:
                    </p>
                    <p className="mt-2 text-gray-800 font-medium">
                        📧 Email: support@grovesbox.com
                    </p>

                </div>
            </section>
        </div>

    );
}
