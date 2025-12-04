import { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = useCallback(
    async (username, password) => {
      setLoading(true);
      try {
        const { login: loginAPI } = await import('../utils/api');
        const response = await loginAPI(username, password);
        
        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          setUser(response.user);
          setLoading(false);
          return { success: true };
        }
      } catch (error) {
        setLoading(false);
        return { success: false, error: error.response?.data?.message || 'Login failed' };
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  }, [router]);

  const initializeAuth = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      const userCookie = localStorage.getItem('user');

      if (token && userCookie) {
        setUser(JSON.parse(userCookie));
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, initializeAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
