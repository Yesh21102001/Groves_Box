'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/src/context/WishlistContext';
import { customerLogin, getCustomerData } from '@/src/lib/shopify_utilis';
import { CheckCircle, ChevronRight } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { syncWishlistOnLogin } = useWishlist();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const loginResponse = await customerLogin(formData.email, formData.password);

            if (loginResponse.customerUserErrors && loginResponse.customerUserErrors.length > 0) {
                const errorMessage = loginResponse.customerUserErrors[0].message;
                setError(errorMessage || 'Invalid email or password');
                setIsLoading(false);
                return;
            }

            const accessToken = loginResponse.customerAccessToken?.accessToken;

            if (!accessToken) {
                setError('Login failed. Please try again.');
                setIsLoading(false);
                return;
            }

            const customerData = await getCustomerData(accessToken);

            if (!customerData) {
                setError('Failed to retrieve customer data');
                setIsLoading(false);
                return;
            }

            const userData = {
                id: customerData.id,
                email: customerData.email,
                name: customerData.name,
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                accessToken: accessToken,
                expiresAt: loginResponse.customerAccessToken.expiresAt
            };

            localStorage.setItem('plants-current-user', JSON.stringify(userData));
            window.dispatchEvent(new Event('auth-change'));
            syncWishlistOnLogin();
            setShowSuccess(true);

            setTimeout(() => {
                router.push('/');
            }, 1500);
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm mx-4">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-[#e5f0eb] rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-10 h-10 text-[#2d5a3d]" />
                            </div>
                            <h3
                                className="text-2xl font-bold text-gray-900 mb-2"
                                style={{ fontFamily: "Georgia, serif" }}
                            >
                                Welcome back!
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Redirecting you now...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-md mx-auto px-5 py-12 sm:py-20">
                {/* Back Link */}
                <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#2d5a3d] mb-8 transition-colors">
                    <ChevronRight className="w-4 h-4 -rotate-180" />
                    Back Home
                </Link>

                {/* Header */}
                <div className="mb-10">
                    <h1
                        className="text-4xl font-bold text-gray-900 mb-3"
                        style={{ fontFamily: "Georgia, serif" }}
                    >
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">Sign in to your Groves Box account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition text-gray-900 placeholder-gray-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-gray-900">
                                Password
                            </label>
                            <Link href="/forgot-password" className="text-xs text-[#2d5a3d] hover:text-[#1f4028] transition-colors">
                                Forgot?
                            </Link>
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition text-gray-900 placeholder-gray-500"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-[#2d5a3d] text-white font-semibold rounded-lg hover:bg-[#1f4028] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">New to Groves Box?</span>
                    </div>
                </div>

                {/* Signup Link */}
                <Link
                    href="/signup"
                    className="w-full py-3 px-4 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:border-[#2d5a3d] hover:bg-[#f0f9f6] transition-colors text-center block"
                >
                    Create Account
                </Link>
            </div>
        </div>
    );
}
