// app/track-order/page.jsx
import { Suspense } from 'react';
import OrderTracking from '../track-order/Ordertracking';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OrderTracking />
        </Suspense>
    );
}