'use client';

import { useEffect } from 'react';
import { initializeDemoAccount } from '@/src/lib/auth';

export function Initializer() {
    useEffect(() => {
        // Initialize demo account on first load
        initializeDemoAccount();
    }, []);

    return null;
}
