'use client';

import React, { useState } from 'react';
import { LogOut, Edit2, Heart, Package, MapPin, Lock, Bell } from 'lucide-react';
import Link from 'next/link';
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
        },
        {
            id: '#ORD-002',
            date: '2024-01-15',
            total: '$120.50',
            status: 'Delivered',
            items: 'Pothos Plant, Snake Plant',
        },
        {
            id: '#ORD-003',
            date: '2024-01-10',
            total: '$89.99',
            status: 'Processing',
            items: 'Monstera Deliciosa',
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

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">My Account</h1>
                            <p className="text-gray-600 mt-2">Manage your profile and orders</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold"
                        >
                            <LogOut className="w-5 h-5 mr-2" />
                            Sign Out
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                        <div className="flex overflow-x-auto border-b border-gray-200">
                            {[
                                { id: 'profile', name: 'Profile', icon: '👤' },
                                { id: 'orders', name: 'Orders', icon: '📦' },
                                { id: 'addresses', name: 'Addresses', icon: '📍' },
                                { id: 'wishlist', name: 'Wishlist', icon: '❤️' },
                                { id: 'settings', name: 'Settings', icon: '⚙️' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-6 py-4 font-semibold transition whitespace-nowrap ${activeTab === tab.id
                                        ? 'text-teal-600 border-b-2 border-teal-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.name}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-8">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                                        {!isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition"
                                            >
                                                <Edit2 className="w-4 h-4 mr-2" />
                                                Edit
                                            </button>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <form className="space-y-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={userData.firstName}
                                                    onChange={handleInputChange}
                                                    placeholder="First Name"
                                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={userData.lastName}
                                                    onChange={handleInputChange}
                                                    placeholder="Last Name"
                                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                            </div>

                                            <input
                                                type="email"
                                                name="email"
                                                value={userData.email}
                                                onChange={handleInputChange}
                                                placeholder="Email"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />

                                            <input
                                                type="tel"
                                                name="phone"
                                                value={userData.phone}
                                                onChange={handleInputChange}
                                                placeholder="Phone"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />

                                            <input
                                                type="text"
                                                name="address"
                                                value={userData.address}
                                                onChange={handleInputChange}
                                                placeholder="Address"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />

                                            <div className="grid grid-cols-3 gap-6">
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={userData.city}
                                                    onChange={handleInputChange}
                                                    placeholder="City"
                                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={userData.state}
                                                    onChange={handleInputChange}
                                                    placeholder="State"
                                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    value={userData.zipCode}
                                                    onChange={handleInputChange}
                                                    placeholder="ZIP Code"
                                                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={handleSaveChanges}
                                                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition font-semibold"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">First Name</p>
                                                <p className="font-semibold text-gray-900">{userData.firstName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Last Name</p>
                                                <p className="font-semibold text-gray-900">{userData.lastName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Email</p>
                                                <p className="font-semibold text-gray-900">{userData.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Phone</p>
                                                <p className="font-semibold text-gray-900">{userData.phone}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-sm text-gray-600 mb-1">Address</p>
                                                <p className="font-semibold text-gray-900">
                                                    {userData.address}, {userData.city}, {userData.state} {userData.zipCode}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Orders Tab */}
                            {activeTab === 'orders' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                    <div>
                                                        <p className="font-bold text-gray-900">{order.id}</p>
                                                        <p className="text-sm text-gray-600">{order.date}</p>
                                                        <p className="text-sm text-gray-700 mt-2">{order.items}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-teal-600">{order.total}</p>
                                                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'Delivered'
                                                            ? 'bg-green-100 text-green-600'
                                                            : 'bg-blue-100 text-blue-600'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <button className="text-teal-600 hover:text-teal-700 font-semibold">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Addresses Tab */}
                            {activeTab === 'addresses' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                                        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
                                            + Add Address
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {addresses.map((addr) => (
                                            <div key={addr.id} className="border border-gray-200 rounded-lg p-6 relative">
                                                {addr.isDefault && (
                                                    <span className="absolute top-2 right-2 bg-teal-100 text-teal-600 px-3 py-1 rounded-full text-xs font-semibold">
                                                        Default
                                                    </span>
                                                )}
                                                <p className="font-bold text-gray-900 mb-3">{addr.type}</p>
                                                <p className="text-gray-600 text-sm mb-1">{addr.address}</p>
                                                <p className="text-gray-600 text-sm">
                                                    {addr.city}, {addr.state} {addr.zipCode}
                                                </p>
                                                <div className="mt-4 flex gap-3">
                                                    <button className="text-teal-600 hover:text-teal-700 text-sm font-semibold">Edit</button>
                                                    <button className="text-red-600 hover:text-red-700 text-sm font-semibold">Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Wishlist Tab */}
                            {activeTab === 'wishlist' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Items</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {savedItems.map((item) => (
                                            <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden">
                                                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                                    <p className="text-teal-600 font-bold mt-2">${item.price}</p>
                                                    <button className="w-full mt-4 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition">
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
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center">
                                                <Bell className="w-5 h-5 text-gray-600 mr-3" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">Email Notifications</p>
                                                    <p className="text-sm text-gray-600">Receive updates about orders and promotions</p>
                                                </div>
                                            </div>
                                            <input type="checkbox" defaultChecked className="w-5 h-5" />
                                        </div>

                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center">
                                                <Lock className="w-5 h-5 text-gray-600 mr-3" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">Change Password</p>
                                                    <p className="text-sm text-gray-600">Update your password regularly for security</p>
                                                </div>
                                            </div>
                                            <button className="text-teal-600 hover:text-teal-700 font-semibold">Change</button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center">
                                                <MapPin className="w-5 h-5 text-gray-600 mr-3" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                                                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                                                </div>
                                            </div>
                                            <input type="checkbox" className="w-5 h-5" />
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
