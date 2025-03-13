// app/index.js
import { useEffect } from 'react';
import { router } from 'expo-router';
import { isAuthenticated } from '@/utils/auth';

export default function IndexPage() {
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const authenticated = await isAuthenticated();
        if (authenticated) {
            router.replace('/(tabs)');
        } else {
            router.replace('/login');
        }
    };

    return null;
}