'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, Edit2, Heart, Package, MapPin, Lock, Bell, Check, Plus, Eye, User, ChevronDown, Loader2, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    getCustomerOrders,
    getCustomerAddresses,
    updateCustomerProfile,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    setDefaultAddress,
    getCustomerData
} from '@/src/lib/shopify_utilis';

interface CurrentUser {
    id: string;
    email: string;
    name: string;
    accessToken: string;
}

interface Address {
    id: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    phone?: string;
    isDefault: boolean;
}

export default function AccountPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Logout modal states
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

    // Data states
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const [orders, setOrders] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

    // Address modal state
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addressForm, setAddressForm] = useState({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        province: '',
        zip: '',
        country: 'United States',
        phone: '',
    });

    // Load user data on mount
    useEffect(() => {
        loadUserData();
    }, [router]);

    // Load orders when orders tab is active
    useEffect(() => {
        if (activeTab === 'orders' && currentUser && orders.length === 0) {
            loadOrders();
        }
    }, [activeTab, currentUser]);

    // Load addresses when addresses tab is active
    useEffect(() => {
        if (activeTab === 'addresses' && currentUser && addresses.length === 0) {
            loadAddresses();
        }
    }, [activeTab, currentUser]);

    const loadUserData = async () => {
        try {
            const userStr = localStorage.getItem('plants-current-user');
            if (!userStr) {
                router.push('/login');
                return;
            }

            const user = JSON.parse(userStr);
            setCurrentUser(user);

            // Fetch customer data from Shopify
            if (user.accessToken) {
                const customerData = await getCustomerData(user.accessToken);
                if (customerData) {
                    setUserData({
                        firstName: customerData.firstName || '',
                        lastName: customerData.lastName || '',
                        email: customerData.email || user.email,
                        phone: customerData.phone || user.phone || '',
                    });
                } else {
                    // Fallback to local storage data
                    setUserData({
                        firstName: user.name?.split(' ')[0] || '',
                        lastName: user.name?.split(' ')[1] || '',
                        email: user.email,
                        phone: user.phone || '',
                    });
                }
            }
        } catch (err) {
            console.error('Error loading user data:', err);
            setError('Failed to load user data');
        } finally {
            setIsLoading(false);
        }
    };

    const loadOrders = async () => {
        if (!currentUser?.accessToken) return;

        setIsLoadingOrders(true);
        try {
            const customerOrders = await getCustomerOrders(currentUser.accessToken);
            setOrders(customerOrders);
        } catch (err) {
            console.error('Error loading orders:', err);
            setError('Failed to load orders');
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const loadAddresses = async () => {
        if (!currentUser?.accessToken) return;

        setIsLoadingAddresses(true);
        try {
            const customerAddresses = await getCustomerAddresses(currentUser.accessToken);
            setAddresses(customerAddresses);
        } catch (err) {
            console.error('Error loading addresses:', err);
            setError('Failed to load addresses');
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // If it starts with +91, remove it for formatting
        if (value.startsWith('+91')) {
            value = value.substring(3);
        }

        // Remove all non-digits
        value = value.replace(/\D/g, '');

        // Limit to 10 digits
        if (value.length > 10) {
            value = value.slice(0, 10);
        }

        // Format as XXXXX-XXXXX for Indian numbers
        if (value.length > 5) {
            value = `${value.slice(0, 5)}-${value.slice(5)}`;
        }

        setUserData(prev => ({ ...prev, phone: value }));
    };

    const formatPhoneForDisplay = (phone: string) => {
        if (!phone) return '';

        // If it's in E.164 format (+91XXXXXXXXXX), format it
        if (phone.startsWith('+91')) {
            const digits = phone.substring(3);
            if (digits.length === 10) {
                return `${digits.slice(0, 5)}-${digits.slice(5)}`;
            }
            return digits;
        }

        // If it's already formatted or just digits, return as is
        return phone;
    };

    const handleSaveChanges = async () => {
        if (!currentUser?.accessToken) return;

        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Convert phone to E.164 format for Shopify
            let phoneForShopify = userData.phone;
            if (phoneForShopify && !phoneForShopify.startsWith('+91')) {
                // Remove any formatting and add +91
                const digitsOnly = phoneForShopify.replace(/\D/g, '');
                if (digitsOnly.length === 10) {
                    phoneForShopify = `+91${digitsOnly}`;
                }
            }

            await updateCustomerProfile(currentUser.accessToken, {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: phoneForShopify || undefined,
            });

            // Update local storage
            const updatedUser = {
                ...currentUser,
                name: `${userData.firstName} ${userData.lastName}`,
                email: userData.email,
                phone: phoneForShopify,
            };
            localStorage.setItem('plants-current-user', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);

            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            console.error('Error saving profile:', err);
            setError(err.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        // Show confirmation modal instead of logging out directly
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        // Clear localStorage
        localStorage.removeItem('plants-current-user');
        localStorage.removeItem('plants-cart');

        // Dispatch auth change event for navbar to update
        window.dispatchEvent(new Event('auth-change'));
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'plants-current-user',
            newValue: null,
            oldValue: JSON.stringify(currentUser),
            url: window.location.href,
            storageArea: localStorage
        }));

        // Close confirmation, show success
        setShowLogoutConfirm(false);
        setShowLogoutSuccess(true);

        // Redirect to home after showing success message
        setTimeout(() => {
            setShowLogoutSuccess(false);
            router.push('/');
        }, 2000);
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const toggleOrder = (orderId: string) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    // Address Modal Functions
    const openAddressModal = (address?: Address) => {
        if (address) {
            setEditingAddress(address);
            setAddressForm({
                firstName: address.firstName,
                lastName: address.lastName,
                address1: address.address1,
                address2: address.address2 || '',
                city: address.city,
                province: address.province,
                zip: address.zip,
                country: address.country,
                phone: address.phone || '',
            });
        } else {
            setEditingAddress(null);
            setAddressForm({
                firstName: userData.firstName,
                lastName: userData.lastName,
                address1: '',
                address2: '',
                city: '',
                province: '',
                zip: '',
                country: 'United States',
                phone: '',
            });
        }
        setShowAddressModal(true);
    };

    const closeAddressModal = () => {
        setShowAddressModal(false);
        setEditingAddress(null);
        setError(null);
    };

    const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveAddress = async () => {
        if (!currentUser?.accessToken) return;

        setIsSaving(true);
        setError(null);

        try {
            if (editingAddress) {
                // Update existing address
                await updateCustomerAddress(currentUser.accessToken, editingAddress.id, addressForm);
                setSuccessMessage('Address updated successfully!');
            } else {
                // Create new address
                await createCustomerAddress(currentUser.accessToken, addressForm);
                setSuccessMessage('Address added successfully!');
            }

            // Reload addresses
            await loadAddresses();
            closeAddressModal();

            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            console.error('Error saving address:', err);
            setError(err.message || 'Failed to save address');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (!currentUser?.accessToken) return;
        if (!confirm('Are you sure you want to delete this address?')) return;

        setIsSaving(true);
        setError(null);

        try {
            await deleteCustomerAddress(currentUser.accessToken, addressId);
            setSuccessMessage('Address deleted successfully!');
            await loadAddresses();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            console.error('Error deleting address:', err);
            setError(err.message || 'Failed to delete address');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSetDefaultAddress = async (addressId: string) => {
        if (!currentUser?.accessToken) return;

        setIsSaving(true);
        setError(null);

        try {
            await setDefaultAddress(currentUser.accessToken, addressId);
            setSuccessMessage('Default address updated!');
            await loadAddresses();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            console.error('Error setting default address:', err);
            setError(err.message || 'Failed to set default address');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#007B57] mx-auto mb-4" />
                    <p className="text-gray-600">Loading your account...</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'orders', name: 'Orders', icon: Package },
        { id: 'addresses', name: 'Addresses', icon: MapPin },
        { id: 'settings', name: 'Settings', icon: Lock },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                Welcome back, {userData.firstName || 'User'}!
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Manage your account, orders, and preferences
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-200 shadow-sm font-semibold text-sm sm:text-base"
                        >
                            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Log Out
                        </button>
                    </div>

                    {/* Success/Error Messages */}
                    {successMessage && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
                            <Check className="w-5 h-5 text-green-600 mr-2" />
                            <p className="text-green-800 text-sm">{successMessage}</p>
                        </div>
                    )}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                            <X className="w-5 h-5 text-red-600 mr-2" />
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 sticky top-6">
                            <div className="flex items-center justify-center flex-col mb-6 pb-6 border-b border-gray-100">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#007B57] to-[#3a5f4b] flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg mb-3">
                                    {userData.firstName?.[0]}{userData.lastName?.[0]}
                                </div>
                                <h3 className="font-bold text-gray-900 text-base sm:text-lg text-center">
                                    {userData.firstName} {userData.lastName}
                                </h3>
                                <p className="text-gray-500 text-xs sm:text-sm mt-1 text-center break-all">
                                    {userData.email}
                                </p>
                            </div>

                            <nav className="space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 mb-1 text-sm sm:text-base ${activeTab === tab.id
                                                ? 'bg-[#F0F4F1] text-black-700 font-semibold shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                                            {tab.name}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                                <div className="flex items-center justify-between mb-6 sm:mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Personal Information</h2>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 bg-[#007B57] text-white rounded-xl hover:bg-black-400 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                                        >
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={userData.firstName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#007B57] focus:ring-0 transition-all duration-200 text-sm sm:text-base"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={userData.lastName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#007B57] focus:ring-0 transition-all duration-200 text-sm sm:text-base"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={userData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#007B57] focus:ring-0 transition-all duration-200 text-sm sm:text-base"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
                                                    <span className="text-gray-600 font-semibold">+91</span>
                                                    <div className="w-px h-6 bg-gray-300 ml-2"></div>
                                                </div>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formatPhoneForDisplay(userData.phone)}
                                                    onChange={handlePhoneChange}
                                                    placeholder="98765-43210"
                                                    className="w-full pl-16 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#007B57] focus:ring-0 transition-all duration-200 text-sm sm:text-base"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                10-digit Indian mobile number
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                            <button
                                                onClick={handleSaveChanges}
                                                disabled={isSaving}
                                                className="flex-1 flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3.5 bg-[#007B57] text-white rounded-xl hover:bg-[#009A7B] transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-4 h-4 mr-2" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    loadUserData(); // Reset form
                                                }}
                                                disabled={isSaving}
                                                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                First Name
                                            </p>
                                            <p className="text-base sm:text-lg font-semibold text-gray-900">
                                                {userData.firstName || 'Not set'}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                Last Name
                                            </p>
                                            <p className="text-base sm:text-lg font-semibold text-gray-900">
                                                {userData.lastName || 'Not set'}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                Email
                                            </p>
                                            <p className="text-base sm:text-lg font-semibold text-gray-900 break-all">
                                                {userData.email}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                Phone
                                            </p>
                                            <p className="text-base sm:text-lg font-semibold text-gray-900">
                                                {userData.phone ? `+91 ${formatPhoneForDisplay(userData.phone)}` : 'Not set'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
                                    Order History
                                </h2>

                                {isLoadingOrders ? (
                                    <div className="text-center py-12">
                                        <Loader2 className="w-12 h-12 animate-spin text-[#007B57] mx-auto mb-4" />
                                        <p className="text-gray-600">Loading your orders...</p>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                                        <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                                        <button
                                            onClick={() => router.push('/products')}
                                            className="px-6 py-3 bg-[#007B57] text-white rounded-xl hover:bg-[#009A7B] transition-all duration-200 shadow-md"
                                        >
                                            Start Shopping
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="border-2 border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-all duration-200"
                                            >
                                                {/* Accordion Header */}
                                                <button
                                                    onClick={() => toggleOrder(order.id)}
                                                    className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition-all duration-200"
                                                >
                                                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                                                        <Package className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                        <div className="text-left">
                                                            <p className="font-bold text-gray-900 text-sm sm:text-base">
                                                                {order.id}
                                                            </p>
                                                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                                                {order.date}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 sm:gap-4">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${order.status === 'Delivered'
                                                                ? 'bg-green-100 text-green-700'
                                                                : order.status === 'In Transit'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-yellow-100 text-yellow-700'
                                                                }`}
                                                        >
                                                            {order.status === 'Delivered' && (
                                                                <Check className="w-3 h-3" />
                                                            )}
                                                            {order.status}
                                                        </span>
                                                        <ChevronDown
                                                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedOrderId === order.id ? 'rotate-180' : ''
                                                                }`}
                                                        />
                                                    </div>
                                                </button>

                                                {/* Accordion Content */}
                                                <div
                                                    className={`transition-all duration-300 ease-in-out ${expandedOrderId === order.id
                                                        ? 'max-h-[2000px] opacity-100'
                                                        : 'max-h-0 opacity-0 overflow-hidden'
                                                        }`}
                                                >
                                                    <div className="p-4 sm:p-6 bg-gray-50 border-t-2 border-gray-100">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                            {/* Order Items */}
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
                                                                <div className="space-y-3">
                                                                    {order.items.map((item: any, idx: number) => (
                                                                        <div key={idx} className="flex gap-3 bg-white p-3 rounded-lg">
                                                                            <img
                                                                                src={item.image}
                                                                                alt={item.title}
                                                                                className="w-16 h-16 object-cover rounded-lg"
                                                                            />
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="font-semibold text-sm text-gray-900 truncate">
                                                                                    {item.title}
                                                                                </p>
                                                                                {item.variantTitle !== 'Default Title' && (
                                                                                    <p className="text-xs text-gray-500">
                                                                                        {item.variantTitle}
                                                                                    </p>
                                                                                )}
                                                                                <p className="text-xs text-gray-600 mt-1">
                                                                                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Order Summary */}
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 mb-3">
                                                                    Order Summary
                                                                </h4>
                                                                <div className="bg-white p-4 rounded-lg space-y-2">
                                                                    <div className="flex justify-between text-sm">
                                                                        <span className="text-gray-600">Subtotal</span>
                                                                        <span className="font-semibold text-gray-900">
                                                                            ${order.subtotal.toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between text-sm">
                                                                        <span className="text-gray-600">Shipping</span>
                                                                        <span className="font-semibold text-gray-900">
                                                                            ${order.shipping.toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between text-sm">
                                                                        <span className="text-gray-600">Tax</span>
                                                                        <span className="font-semibold text-gray-900">
                                                                            ${order.tax.toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="pt-2 border-t border-gray-200">
                                                                        <div className="flex justify-between">
                                                                            <span className="font-bold text-gray-900">Total</span>
                                                                            <span className="font-bold text-gray-900 text-lg">
                                                                                {order.total}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {order.shippingAddress && (
                                                                    <div className="mt-4">
                                                                        <h4 className="font-semibold text-gray-900 mb-2">
                                                                            Shipping Address
                                                                        </h4>
                                                                        <div className="bg-white p-4 rounded-lg text-sm text-gray-600">
                                                                            <p>{order.shippingAddress.address1}</p>
                                                                            {order.shippingAddress.address2 && (
                                                                                <p>{order.shippingAddress.address2}</p>
                                                                            )}
                                                                            <p>
                                                                                {order.shippingAddress.city},{' '}
                                                                                {order.shippingAddress.province}{' '}
                                                                                {order.shippingAddress.zip}
                                                                            </p>
                                                                            <p>{order.shippingAddress.country}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                                <div className="flex items-center justify-between mb-6 sm:mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                        Saved Addresses
                                    </h2>
                                    <button
                                        onClick={() => openAddressModal()}
                                        className="flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 bg-[#007B57] text-white rounded-xl hover:bg-[#009A7B] transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Address
                                    </button>
                                </div>

                                {isLoadingAddresses ? (
                                    <div className="text-center py-12">
                                        <Loader2 className="w-12 h-12 animate-spin text-[#007B57] mx-auto mb-4" />
                                        <p className="text-gray-600">Loading your addresses...</p>
                                    </div>
                                ) : addresses.length === 0 ? (
                                    <div className="text-center py-12">
                                        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            No saved addresses
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            Add an address for faster checkout
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        {addresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                className="relative border-2 border-gray-100 rounded-xl p-4 sm:p-6 hover:border-gray-200 transition-all duration-200"
                                            >
                                                {addr.isDefault && (
                                                    <span className="absolute top-3 right-3 px-2 py-1 bg-[#007B57] text-white text-xs font-semibold rounded-lg">
                                                        DEFAULT
                                                    </span>
                                                )}
                                                <div className="flex items-start gap-3 mb-4">
                                                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">
                                                            {addr.firstName} {addr.lastName}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 leading-relaxed">
                                                            {addr.address1}
                                                            {addr.address2 && (
                                                                <>
                                                                    <br />
                                                                    {addr.address2}
                                                                </>
                                                            )}
                                                            <br />
                                                            {addr.city}, {addr.province} {addr.zip}
                                                            <br />
                                                            {addr.country}
                                                        </p>
                                                        {addr.phone && (
                                                            <p className="text-sm text-gray-600 mt-2">{addr.phone}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                                    <button
                                                        onClick={() => openAddressModal(addr)}
                                                        disabled={isSaving}
                                                        className="flex-1 px-3 py-2 text-sm font-semibold text-[#007B57] border-2 border-[#007B57] rounded-lg hover:bg-[#007B57] hover:text-white transition-all duration-200 disabled:opacity-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    {!addr.isDefault && (
                                                        <>
                                                            <button
                                                                onClick={() => handleSetDefaultAddress(addr.id)}
                                                                disabled={isSaving}
                                                                className="flex-1 px-3 py-2 text-sm font-semibold text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                                                            >
                                                                Set Default
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteAddress(addr.id)}
                                                                disabled={isSaving}
                                                                className="px-3 py-2 text-sm font-semibold text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
                                    Account Settings
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Bell className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                                                    Email Notifications
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    Receive updates about orders and promotions
                                                </p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#007B57]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007B57]"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Lock className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                                                    Change Password
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    Update your password regularly for security
                                                </p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold text-sm">
                                            Change
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl opacity-50">
                                        <div className="flex items-center gap-3">
                                            <Lock className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                                                    Two-Factor Authentication
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    Add an extra layer of security
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            disabled
                                            className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-sm cursor-not-allowed"
                                        >
                                            Enable
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={(e) => {
                        // Close modal if clicking on backdrop
                        if (e.target === e.currentTarget) {
                            closeAddressModal();
                        }
                    }}
                >
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                                </h3>
                                <button
                                    onClick={closeAddressModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={addressForm.firstName}
                                            onChange={handleAddressFormChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#007B57] focus:ring-0 transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={addressForm.lastName}
                                            onChange={handleAddressFormChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#007B57] focus:ring-0 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Address Line 1 *
                                    </label>
                                    <input
                                        type="text"
                                        name="address1"
                                        value={addressForm.address1}
                                        onChange={handleAddressFormChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#007B57] focus:ring-0 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Address Line 2
                                    </label>
                                    <input
                                        type="text"
                                        name="address2"
                                        value={addressForm.address2}
                                        onChange={handleAddressFormChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#007B57] focus:ring-0 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={addressForm.city}
                                            onChange={handleAddressFormChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#007B57] focus:ring-0 transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            State/Province *
                                        </label>
                                        <input
                                            type="text"
                                            name="province"
                                            value={addressForm.province}
                                            onChange={handleAddressFormChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#007B57] focus:ring-0 transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            ZIP Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="zip"
                                            value={addressForm.zip}
                                            onChange={handleAddressFormChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#007B57] focus:ring-0 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={addressForm.country}
                                        onChange={handleAddressFormChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#007B57] focus:ring-0 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={addressForm.phone}
                                        onChange={handleAddressFormChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#007B57] focus:ring-0 transition-all"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                                    <X className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                                    <p className="text-red-800 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleSaveAddress}
                                    disabled={isSaving}
                                    className="flex-1 px-6 py-3 bg-[#007B57] text-white rounded-xl hover:bg-[#009A7B] transition-all duration-200 shadow-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Address'
                                    )}
                                </button>
                                <button
                                    onClick={closeAddressModal}
                                    disabled={isSaving}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
                    onClick={(e) => {
                        // Close modal if clicking on backdrop
                        if (e.target === e.currentTarget) {
                            setShowLogoutConfirm(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
                        <div className="text-center">
                            {/* Icon */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                                <LogOut className="h-8 w-8 text-yellow-600" />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Confirm Logout
                            </h3>

                            {/* Message */}
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to log out of your account?
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelLogout}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                                >
                                    No, Stay
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="flex-1 px-6 py-3 bg-[#007B57] text-white rounded-xl hover:bg-[#009A7B] transition-all duration-200 shadow-md font-semibold"
                                >
                                    Yes, Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Success Modal */}
            {showLogoutSuccess && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideUp">
                        <div className="text-center">
                            {/* Success Icon with Animation */}
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4 animate-scaleIn">
                                <Check className="h-10 w-10 text-green-600" />
                            </div>

                            {/* Success Message */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Logged out successfully!
                            </h3>

                            <p className="text-gray-600">
                                Redirecting you to the homepage...
                            </p>

                            {/* Loading Spinner */}
                            <div className="mt-6">
                                <div className="flex justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007B57]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add custom animations */}
            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
        </div>
    );
}