import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const router = useRouter();
  const { initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
    
    // Redirect based on auth status
    const token = Cookie.get('token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router, initializeAuth]);

  return <div></div>;
}
