'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/src/context/WishlistContext';
import { customerLogin, getCustomerData } from '@/src/lib/shopify_utilis';

export default function LoginPage() {
    const router = useRouter();
    const { syncWishlistOnLogin } = useWishlist();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
            // Call Shopify customer login API
            const loginResponse = await customerLogin(formData.email, formData.password);

            // Check for errors
            if (loginResponse.customerUserErrors && loginResponse.customerUserErrors.length > 0) {
                const errorMessage = loginResponse.customerUserErrors[0].message;
                setError(errorMessage || 'Invalid email or password');
                setIsLoading(false);
                return;
            }

            // Get access token
            const accessToken = loginResponse.customerAccessToken?.accessToken;

            if (!accessToken) {
                setError('Login failed. Please try again.');
                setIsLoading(false);
                return;
            }

            // Fetch customer data
            const customerData = await getCustomerData(accessToken);

            if (!customerData) {
                setError('Failed to retrieve customer data');
                setIsLoading(false);
                return;
            }

            // Store customer data and access token
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

            // Dispatch auth change event
            window.dispatchEvent(new Event('auth-change'));

            // Sync wishlist after login
            syncWishlistOnLogin();

            // Redirect to account page
            router.push('/account');
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-md mx-auto px-4 py-12 sm:py-20">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-light text-[#244033] mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244033] focus:border-transparent"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244033] focus:border-transparent"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-right">
                        <Link href="/forgot-password" className="text-sm text-[#244033] hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#244033] text-white py-3 rounded-lg font-semibold hover:bg-[#2F4F3E] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-[#244033] hover:underline font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}