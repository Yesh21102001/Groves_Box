'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Validation
            if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
                setError('Please fill in all fields');
                setIsLoading(false);
                return;
            }

            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters');
                setIsLoading(false);
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                setIsLoading(false);
                return;
            }

            if (!agreed) {
                setError('You must agree to the terms and conditions');
                setIsLoading(false);
                return;
            }

            // Get existing users
            const users = JSON.parse(localStorage.getItem('plants-users') || '[]');

            // Check if user already exists
            if (users.some((u: any) => u.email === formData.email)) {
                setError('Email already registered');
                setIsLoading(false);
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name: formData.name,
                email: formData.email,
                password: formData.password,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('plants-users', JSON.stringify(users));

            // Log the user in
            localStorage.setItem('plants-current-user', JSON.stringify({
                id: newUser.id,
                email: newUser.email,
                name: newUser.name
            }));

            router.push('/account');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-md mx-auto px-4 py-12 sm:py-20">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-light text-[#244033] mb-2">Create Account</h1>
                    <p className="text-gray-600">Join us to start shopping</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244033] focus:border-transparent"
                            placeholder="John Doe"
                        />
                    </div>

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
                        <p className="text-xs text-gray-600 mt-1">At least 6 characters</p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244033] focus:border-transparent"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="w-4 h-4 text-[#244033] rounded focus:ring-2 focus:ring-[#244033]"
                        />
                        <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                            I agree to the{' '}
                            <Link href="/terms-service" className="text-[#244033] hover:underline">
                                Terms & Conditions
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy-policy" className="text-[#244033] hover:underline">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#244033] text-white py-3 rounded-lg font-semibold hover:bg-[#2F4F3E] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#244033] hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
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
                                    <Link href="#" className="text-black font-semibold">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="#" className="text-black font-semibold">
                                        Privacy Policy
                                    </Link>
                                </span>
                            </label>
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p className="text-center text-gray-600 mt-8">
                        Already have an account?{' '}
                        <Link href="/login" className="text-black font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
);
}
