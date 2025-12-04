import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const router = useRouter();
  const { user, initializeAuth } = useAuth();

  useEffect(() => {
    // Initialize auth from localStorage
    initializeAuth();
  }, []); // Only run once on mount

  useEffect(() => {
    // After user state is set, redirect
    if (user) {
      router.push('/dashboard');
    } else {
      // Check if we have a token but user isn't loaded yet (race condition)
      // This can happen if initializeAuth() hasn't completed or user wasn't found
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/login');
      }
    }
  }, [user, router]);

  return <div></div>;
}
