import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import setupInterceptors from '../utils/interceptor';
import api from '../api';

interface AuthContextProps {
  isAuthenticated: () => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  

  const isAuthenticated = () => {
    return !!token;
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      window.location.href= '/'
    } catch (error) {
      console.error('Login error', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href="#/login"
  };

  useEffect(() => {
    setupInterceptors(logout)
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
