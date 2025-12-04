import { createContext, useContext, useState, useCallback } from 'react';
import Cookie from 'js-cookie';
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
          Cookie.set('token', response.token, { expires: 1 });
          Cookie.set('user', JSON.stringify(response.user), { expires: 1 });
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
    Cookie.remove('token');
    Cookie.remove('user');
    setUser(null);
    router.push('/login');
  }, [router]);

  const initializeAuth = useCallback(() => {
    const token = Cookie.get('token');
    const userCookie = Cookie.get('user');
    
    if (token && userCookie) {
      setUser(JSON.parse(userCookie));
    } else {
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
