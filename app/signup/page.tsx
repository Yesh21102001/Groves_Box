'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { customerCreate, customerLogin, getCustomerData } from '@/src/lib/shopify_utilis';

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

        // Limit to 10 digits for Indian mobile numbers
        if (value.length > 10) {
            value = value.slice(0, 10);
        }

        // Format as XXXXX-XXXXX (Indian format)
        if (value.length > 5) {
            value = `${value.slice(0, 5)}-${value.slice(5)}`;
        }

        setFormData(prev => ({ ...prev, phone: value }));
    };

    const validatePassword = (password: string) => {
        return password.length >= 8;
    };

    const validateIndianPhone = (phone: string) => {
        const digitsOnly = phone.replace(/\D/g, '');

        // Must be exactly 10 digits
        if (digitsOnly.length !== 10) {
            return false;
        }

        // First digit must be 6, 7, 8, or 9 (valid Indian mobile prefixes)
        const firstDigit = digitsOnly[0];
        if (!['6', '7', '8', '9'].includes(firstDigit)) {
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (!validateIndianPhone(formData.phone)) {
            setError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9');
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
            // Format phone for Shopify (E.164 format: +91XXXXXXXXXX)
            const phoneDigits = formData.phone.replace(/\D/g, '');
            const formattedPhone = `+91${phoneDigits}`;

            // Create customer in Shopify
            const createResponse = await customerCreate(
                formData.email,
                formData.password,
                formData.firstName,
                formData.lastName,
                formattedPhone
            );

            // Check for errors
            if (createResponse.customerUserErrors && createResponse.customerUserErrors.length > 0) {
                const errorMessage = createResponse.customerUserErrors[0].message;

                // Handle specific error messages
                if (errorMessage.toLowerCase().includes('taken') || errorMessage.toLowerCase().includes('already exists')) {
                    setError('This email is already registered. Please sign in instead.');
                } else {
                    setError(errorMessage);
                }
                setIsLoading(false);
                return;
            }

            // Check if customer was created successfully
            if (!createResponse.customer) {
                setError('Account creation failed. Please try again.');
                setIsLoading(false);
                return;
            }

            // Now log the user in automatically
            const loginResponse = await customerLogin(formData.email, formData.password);

            if (loginResponse.customerUserErrors && loginResponse.customerUserErrors.length > 0) {
                setError('Account created but login failed. Please try signing in.');
                setIsLoading(false);
                router.push('/login');
                return;
            }

            const accessToken = loginResponse.customerAccessToken?.accessToken;

            if (!accessToken) {
                setError('Account created but login failed. Please try signing in.');
                setIsLoading(false);
                router.push('/login');
                return;
            }

            // Fetch customer data
            const customerData = await getCustomerData(accessToken);

            if (!customerData) {
                setError('Account created but failed to retrieve data. Please try signing in.');
                setIsLoading(false);
                router.push('/login');
                return;
            }

            // Store customer data and access token
            const userData = {
                id: customerData.id,
                email: customerData.email,
                name: customerData.name,
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                phone: customerData.phone || formattedPhone,
                accessToken: accessToken,
                expiresAt: loginResponse.customerAccessToken.expiresAt
            };

            localStorage.setItem('plants-current-user', JSON.stringify(userData));

            // Dispatch auth change event
            window.dispatchEvent(new Event('auth-change'));

            // Redirect to account page
            router.push('/');
        } catch (err) {
            console.error('Sign up error:', err);
            setError('Sign up failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength = formData.password.length >= 8 ? 'strong' : formData.password.length >= 4 ? 'medium' : 'weak';

    // Check if phone is valid for visual feedback
    const phoneDigits = formData.phone.replace(/\D/g, '');
    const isPhoneValid = validateIndianPhone(formData.phone);
    const showPhoneValidation = phoneDigits.length === 10;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#2F4F3E]">Create Account</h1>
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
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244033]"
                                    placeholder="John"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244033]"
                                    placeholder="Doe"
                                    required
                                />
                            </div>
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244033]"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        {/* Indian Phone Number */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Mobile Number
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                                    <span className="text-gray-600 font-semibold">+91</span>
                                    <div className="w-px h-6 bg-gray-300 ml-2"></div>
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    className={`w-full pl-16 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244033] ${showPhoneValidation
                                        ? isPhoneValid
                                            ? 'border-green-300 bg-green-50'
                                            : 'border-red-300 bg-red-50'
                                        : 'border-gray-300'
                                        }`}
                                    placeholder="98765-43210"
                                    maxLength={11}
                                    required
                                />
                                {showPhoneValidation && (
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        {isPhoneValid ? (
                                            <Check className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <X className="w-5 h-5 text-red-600" />
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Enter a 10-digit Indian mobile number (starts with 6, 7, 8, or 9)
                            </p>
                            {showPhoneValidation && !isPhoneValid && (
                                <p className="text-xs text-red-600 mt-1">
                                    ⚠️ Invalid number. Must start with 6, 7, 8, or 9
                                </p>
                            )}
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244033]"
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
                                <div className="mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-1 flex-1 rounded ${passwordStrength === 'strong' ? 'bg-green-500' :
                                            passwordStrength === 'medium' ? 'bg-yellow-500' :
                                                'bg-red-500'
                                            }`}></div>
                                        <span className="text-xs text-gray-600 capitalize">{passwordStrength}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Minimum 8 characters required
                                    </p>
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#244033]"
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
                                    className="w-4 h-4 text-[#244033] rounded focus:ring-[#244033] mt-1"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    I agree to the{' '}
                                    <Link href="/terms-service" className="text-[#244033] font-semibold hover:underline">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy-policy" className="text-[#244033] font-semibold hover:underline">
                                        Privacy Policy
                                    </Link>
                                </span>
                            </label>
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#244033] text-white py-3 rounded-lg font-semibold hover:bg-[#2F4F3E] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p className="text-center text-gray-600 mt-8">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#244033] font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}