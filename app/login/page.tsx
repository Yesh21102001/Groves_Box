'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (email && password) {
                // Redirect to account page on successful login
                window.location.href = '/account';
            } else {
                setError('Please fill in all fields');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-600 mt-2">Login to your account to continue shopping</p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                </label>
                                <Link href="#" className="text-sm text-black">
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        {/* Divider */}
                        {/* <div className="my-6 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div> */}

                        {/* Social Login */}
                        {/* <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition">
                                <span className="text-xl">👍</span>
                            </button>
                            <button className="flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition">
                                <span className="text-xl">🍎</span>
                            </button>
                        </div> */}

                        {/* Sign Up Link */}
                        <p className="text-center text-gray-600 mt-8">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-black font-semibold">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
