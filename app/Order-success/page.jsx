// app/order-success/page.jsx
import { Suspense } from 'react';
import OrderSuccessClient from './OrderSuccessClient';

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F0F4F1] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#007B57] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <OrderSuccessClient />
        </Suspense>
    );
}