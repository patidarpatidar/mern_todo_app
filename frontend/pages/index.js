import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const router = useRouter();
  const { user, initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, []); 

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    } else {
     
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/login');
      }
    }
  }, [user, router]);

  return <div></div>;
}
