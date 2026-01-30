'use client';

import React, { useState } from 'react';
import { LogOut, Edit2, Heart, Package, MapPin, Lock, Bell, Check, Plus, Eye, User } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Plant Street',
        city: 'Green City',
        state: 'CA',
        zipCode: '12345',
    });

    const orders = [
        {
            id: '#ORD-001',
            date: '2024-01-20',
            total: '$74.00',
            status: 'Delivered',
            items: 'Money Tree Plant',
            image: '/images/White_arch.webp',
        },
        {
            id: '#ORD-002',
            date: '2024-01-15',
            total: '$120.50',
            status: 'Delivered',
            items: 'Pothos Plant, Snake Plant',
            image: '/images/White_arch.webp',
        },
        {
            id: '#ORD-003',
            date: '2024-01-10',
            total: '$89.99',
            status: 'Processing',
            items: 'Monstera Deliciosa',
            image: '/images/White_arch.webp',
        },
    ];

    const addresses = [
        {
            id: '1',
            type: 'Home',
            address: '123 Plant Street',
            city: 'Green City',
            state: 'CA',
            zipCode: '12345',
            isDefault: true,
        },
        {
            id: '2',
            type: 'Office',
            address: '456 Garden Avenue',
            city: 'Botanical Town',
            state: 'NY',
            zipCode: '67890',
            isDefault: false,
        },
    ];

    const savedItems = [
        { id: '1', name: 'Monstera Deliciosa', price: 75, image: '/images/White_arch.webp' },
        { id: '2', name: 'Rubber Tree', price: 65, image: '/images/White_arch.webp' },
        { id: '3', name: 'Fiddle Leaf Fig', price: 85, image: '/images/White_arch.webp' },
        { id: '4', name: 'Snake Plant', price: 45, image: '/images/White_arch.webp' },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = () => {
        setIsEditing(false);
        // API call would go here
    };

    const handleLogout = () => {
        // Clear user session and redirect to home
        window.location.href = '/';
    };

    const tabs = [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'orders', name: 'Orders', icon: Package },
        { id: 'addresses', name: 'Addresses', icon: MapPin },
        { id: 'wishlist', name: 'Wishlist', icon: Heart },
        { id: 'settings', name: 'Settings', icon: Lock },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {/* Header */}
                <div className="mb-8 lg:mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-2">
                                Welcome back, {userData.firstName}!
                            </h1>
                            <p className="text-base lg:text-lg text-gray-600">
                                Manage your account, orders, and preferences
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center px-6 py-3 bg-white border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-semibold shadow-sm"
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-6 bg-gradient-to-br from-green-600 to-teal-600">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <span className="text-3xl font-bold text-green-600">
                                        {userData.firstName[0]}{userData.lastName[0]}
                                    </span>
                                </div>
                                <h3 className="text-white text-center font-semibold text-lg">
                                    {userData.firstName} {userData.lastName}
                                </h3>
                                <p className="text-green-100 text-center text-sm mt-1">
                                    {userData.email}
                                </p>
                            </div>

                            <nav className="p-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 mb-1 ${activeTab === tab.id
                                                ? 'bg-green-50 text-green-700 font-semibold shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-green-600' : 'text-gray-400'}`} />
                                            {tab.name}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="p-6 lg:p-8">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                            Personal Information
                                        </h2>
                                        {!isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                            >
                                                <Edit2 className="w-4 h-4 mr-2" />
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <form className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={userData.firstName}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={userData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Street Address
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={userData.address}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        City
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={userData.city}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        State
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={userData.state}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        ZIP Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="zipCode"
                                                        value={userData.zipCode}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-4 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={handleSaveChanges}
                                                    className="flex-1 px-6 py-3.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(false)}
                                                    className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="p-5 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-100">
                                                    <p className="text-sm font-medium text-gray-600 mb-2">First Name</p>
                                                    <p className="text-lg font-semibold text-gray-900">{userData.firstName}</p>
                                                </div>
                                                <div className="p-5 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-100">
                                                    <p className="text-sm font-medium text-gray-600 mb-2">Last Name</p>
                                                    <p className="text-lg font-semibold text-gray-900">{userData.lastName}</p>
                                                </div>
                                                <div className="p-5 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-100">
                                                    <p className="text-sm font-medium text-gray-600 mb-2">Email</p>
                                                    <p className="text-lg font-semibold text-gray-900">{userData.email}</p>
                                                </div>
                                                <div className="p-5 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-100">
                                                    <p className="text-sm font-medium text-gray-600 mb-2">Phone</p>
                                                    <p className="text-lg font-semibold text-gray-900">{userData.phone}</p>
                                                </div>
                                                <div className="md:col-span-2 p-5 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-100">
                                                    <p className="text-sm font-medium text-gray-600 mb-2">Address</p>
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        {userData.address}, {userData.city}, {userData.state} {userData.zipCode}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Orders Tab */}
                            {activeTab === 'orders' && (
                                <div className="p-6 lg:p-8">
                                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">Order History</h2>
                                    <div className="space-y-4">
                                        {orders.map((order, index) => (
                                            <div
                                                key={order.id}
                                                className="group border-2 border-gray-100 rounded-2xl p-6 hover:border-green-200 hover:shadow-lg transition-all duration-300"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    {/* Order Image */}
                                                    <div className="w-full md:w-32 h-32 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl overflow-hidden flex-shrink-0">
                                                        <div className="w-full h-full flex items-center justify-center text-5xl">
                                                            🌿
                                                        </div>
                                                    </div>

                                                    {/* Order Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                                                            <div>
                                                                <p className="text-lg font-bold text-gray-900">{order.id}</p>
                                                                <p className="text-sm text-gray-500 mt-1">{order.date}</p>
                                                            </div>
                                                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${order.status === 'Delivered'
                                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                                                                }`}>
                                                                {order.status === 'Delivered' && <Check className="w-4 h-4 mr-1" />}
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700 mb-3">{order.items}</p>
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                            <p className="text-2xl font-bold text-green-600">{order.total}</p>
                                                            <button className="flex items-center justify-center px-5 py-2.5 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all duration-200 font-semibold border border-green-200 group-hover:bg-green-100">
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Addresses Tab */}
                            {activeTab === 'addresses' && (
                                <div className="p-6 lg:p-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Saved Addresses</h2>
                                        <button className="flex items-center justify-center px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md font-semibold">
                                            <Plus className="w-5 h-5 mr-2" />
                                            Add Address
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {addresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                className="relative border-2 border-gray-100 rounded-2xl p-6 hover:border-green-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                                            >
                                                {addr.isDefault && (
                                                    <span className="absolute top-4 right-4 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                                                        DEFAULT
                                                    </span>
                                                )}
                                                <div className="mb-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <MapPin className="w-5 h-5 text-green-600" />
                                                        <p className="text-xl font-bold text-gray-900">{addr.type}</p>
                                                    </div>
                                                    <p className="text-gray-700 mb-1">{addr.address}</p>
                                                    <p className="text-gray-600">
                                                        {addr.city}, {addr.state} {addr.zipCode}
                                                    </p>
                                                </div>
                                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                                    <button className="flex-1 py-2.5 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all duration-200 text-sm font-semibold border border-green-200">
                                                        Edit
                                                    </button>
                                                    <button className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 text-sm font-semibold border border-red-200">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Wishlist Tab */}
                            {activeTab === 'wishlist' && (
                                <div className="p-6 lg:p-8">
                                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">Saved Items</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {savedItems.map((item, index) => (
                                            <div
                                                key={item.id}
                                                className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <div className="relative h-56 bg-gradient-to-br from-green-100 to-teal-100 overflow-hidden">
                                                    <div className="w-full h-full flex items-center justify-center text-6xl">
                                                        🌿
                                                    </div>
                                                    <button className="absolute top-3 right-3 p-2.5 bg-white rounded-full shadow-lg hover:bg-red-50 transition-all duration-200 group">
                                                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                                    </button>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-2xl font-bold text-green-600 mb-4">${item.price}</p>
                                                    <button className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Settings Tab */}
                            {activeTab === 'settings' && (
                                <div className="p-6 lg:p-8">
                                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">Account Settings</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-2xl hover:border-green-200 transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-green-100 rounded-xl">
                                                    <Bell className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 mb-1">Email Notifications</p>
                                                    <p className="text-sm text-gray-600">Receive updates about orders and promotions</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-2xl hover:border-green-200 transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-100 rounded-xl">
                                                    <Lock className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 mb-1">Change Password</p>
                                                    <p className="text-sm text-gray-600">Update your password regularly for security</p>
                                                </div>
                                            </div>
                                            <button className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-200 font-semibold border border-blue-200">
                                                Change
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-2xl hover:border-green-200 transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-purple-100 rounded-xl">
                                                    <Lock className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 mb-1">Two-Factor Authentication</p>
                                                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}