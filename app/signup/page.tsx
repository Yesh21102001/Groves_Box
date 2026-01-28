'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validatePassword = (password: string) => {
        return password.length >= 8;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        if (!validatePassword(formData.password)) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!agreedToTerms) {
            setError('Please agree to the Terms of Service');
            return;
        }

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Redirect to login on successful signup
            window.location.href = '/login';
        } catch (err) {
            setError('Sign up failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength = formData.password.length >= 8 ? 'strong' : formData.password.length >= 4 ? 'medium' : 'weak';

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-600 mt-2">Join us and start your plant journey</p>
                    </div>

                    {/* Sign Up Form */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    placeholder="John"
                                    required
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    placeholder="Doe"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
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
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
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
                                {formData.password && (
                                    <div className="mt-2 flex items-center">
                                        <div className={`h-1 w-full rounded ${passwordStrength === 'strong' ? 'bg-green-500' :
                                                passwordStrength === 'medium' ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                            }`}></div>
                                        <span className="ml-2 text-xs text-gray-600">{passwordStrength}</span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                    <div className="mt-2 flex items-center text-green-600">
                                        <Check className="w-4 h-4 mr-2" />
                                        <span className="text-xs">Passwords match</span>
                                    </div>
                                )}
                            </div>

                            {/* Terms & Conditions */}
                            <div>
                                <label className="flex items-start cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 mt-1"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        I agree to the{' '}
                                        <Link href="#" className="text-teal-600 hover:text-teal-700 font-semibold">
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link href="#" className="text-teal-600 hover:text-teal-700 font-semibold">
                                            Privacy Policy
                                        </Link>
                                    </span>
                                </label>
                            </div>

                            {/* Sign Up Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        {/* Sign In Link */}
                        <p className="text-center text-gray-600 mt-8">
                            Already have an account?{' '}
                            <Link href="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
