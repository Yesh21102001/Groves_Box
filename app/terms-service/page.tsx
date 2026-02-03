export const metadata = {
    title: "Terms of Service | Groves Box",
    description:
        "Terms of Service for Groves Box – Please read these terms carefully before using our website and services.",
};

export default function TermsOfService() {
    return (
        <section className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 sm:p-10">

                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    Terms of Service
                </h1>

                <p className="text-sm text-gray-500 mb-8">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                {/* Intro */}
                <p className="text-gray-700 leading-relaxed mb-6">
                    Welcome to <strong>Groves Box</strong>. By accessing or using our
                    website, products, or services, you agree to be bound by these Terms
                    of Service. If you do not agree with any part of these terms, please
                    do not use our services.
                </p>

                {/* Section */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    1. Use of Our Services
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    You agree to use Groves Box only for lawful purposes and in a way that
                    does not violate any applicable laws or regulations. You must not
                    misuse our services or attempt to access them using unauthorized
                    means.
                </p>

                {/* Section */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    2. Account Responsibilities
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    When you create an account with us, you are responsible for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Providing accurate and up-to-date information</li>
                </ul>

                {/* Section */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    3. Orders and Payments
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    All orders placed through Groves Box are subject to availability and
                    confirmation. Prices, product descriptions, and availability may
                    change without prior notice. We reserve the right to refuse or cancel
                    any order at our discretion.
                </p>

                {/* Section */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    4. Intellectual Property
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    All content on the Groves Box website, including text, images,
                    graphics, logos, and designs, is the property of Groves Box and is
                    protected by intellectual property laws. You may not reproduce,
                    distribute, or use any content without our written permission.
                </p>

                {/* Section */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    5. Limitation of Liability
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    Groves Box shall not be liable for any indirect, incidental, or
                    consequential damages arising from your use of our services,
                    including but not limited to loss of data, profits, or business
                    opportunities.
                </p>

                {/* Section */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    6. Termination
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    We reserve the right to suspend or terminate your access to our
                    services at any time, without prior notice, if you violate these
                    Terms of Service.
                </p>

                {/* Section */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    7. Changes to These Terms
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    Groves Box may update these Terms of Service from time to time. Any
                    changes will be posted on this page with an updated revision date.
                </p>

                {/* Section */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    8. Governing Law
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    These Terms shall be governed by and interpreted in accordance with
                    the laws of India.
                </p>

                {/* Contact */}
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
                    9. Contact Us
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    If you have any questions about these Terms of Service, please contact
                    us at:
                </p>
                <p className="mt-2 text-gray-800 font-medium">
                    📧 Email: support@grovesbox.com
                </p>

            </div>
        </section>
    );
}
