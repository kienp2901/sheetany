'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from './api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export interface User {
  email?: string;
  name?: string;
  picture?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (credential: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Load saved session from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    const savedToken = localStorage.getItem('auth_token');

    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        setState({
          user,
          accessToken: savedToken,
          isLoading: false,
          isAuthenticated: true,
        });
        
        // Set cookie for middleware (in case it's missing)
        document.cookie = `auth_token=${savedToken}; path=/; max-age=86400; SameSite=Lax`;
        
        apiClient.setAuthToken(savedToken);
      } catch (error) {
        console.error('Error loading saved session:', error);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  function parseJwt(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("JWT parse error:", e);
      return null;
    }
  }

  const login = async (credential: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    console.log("credential: ", credential);
  
    try {
      // ✅ Decode JWT payload đúng cách
      const payload = parseJwt(credential);
      if (!payload) throw new Error("Invalid JWT payload");
  
      const user: User = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
  
      // Gọi API backend để đổi Google credential lấy token của hệ thống
      const loginResponse = await apiClient.loginGoogle(credential);
      const accessToken = loginResponse.token;
  
      // Lưu vào localStorage
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('auth_token', accessToken);
  
      // Set cookie cho middleware
      document.cookie = `auth_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
  
      // Set token cho API client
      apiClient.setAuthToken(accessToken);
  
      setState({
        user,
        accessToken,
        isLoading: false,
        isAuthenticated: true,
      });
  
      toast.success('Đăng nhập thành công!');
    } catch (error) {
      console.error('Login error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    
    // Remove cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    apiClient.setAuthToken(null);
    
    setState({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,
    });

    toast.success('Đã đăng xuất thành công!');
    
    // Redirect to signin page
    router.push('/auth/signin');
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
