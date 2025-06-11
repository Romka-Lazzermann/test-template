'use client'

import { useEffect } from 'react';
export default function UnloadTracker({ impression_id }: { impression_id: string }) {
    useEffect(() => {
        const handleUnload = () => {
            if (impression_id) {
                const data = JSON.stringify({ impression_id: impression_id });
                const blob = new Blob([data], { type: 'application/json' });
                navigator.sendBeacon(`${process.env.NEXT_PUBLIC_SITE_DOMAIN}/api/impression/clicked`, blob);
            }
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, []);

    return null;
}