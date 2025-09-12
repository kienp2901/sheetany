'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { apiClient } from './api';

export interface User {
  email?: string;
  name?: string;
  picture?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  googleCredential: string | null;
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
    googleCredential: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Load saved session from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    const savedToken = localStorage.getItem('auth_token');
    const savedGoogleCredential = localStorage.getItem('google_credential');

    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);

        // Check if token is expired
        const tokenPayload = parseJwt(savedToken);
        const isTokenExpired =
          tokenPayload && tokenPayload.exp
            ? Date.now() >= tokenPayload.exp * 1000
            : false;

        if (isTokenExpired) {
          console.warn('Token is expired, clearing session...');
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('google_credential');
          document.cookie =
            'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          setState((prev) => ({ ...prev, isLoading: false }));
          return;
        }

        setState({
          user,
          accessToken: savedToken,
          googleCredential: savedGoogleCredential,
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
        localStorage.removeItem('google_credential');
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Set up API client callbacks
  useEffect(() => {
    apiClient.setOnTokenExpired(async () => {
      console.warn('API detected token expiration, attempting refresh...');

      // Try to refresh token if we have Google credential
      if (state.googleCredential) {
        try {
          const refreshResponse = await apiClient.refreshToken(
            state.googleCredential
          );

          // Update stored token
          localStorage.setItem('auth_token', refreshResponse.token);
          document.cookie = `auth_token=${refreshResponse.token}; path=/; max-age=86400; SameSite=Lax`;

          setState((prev) => ({
            ...prev,
            accessToken: refreshResponse.token,
          }));

          toast.success('Phiên đăng nhập đã được làm mới');
          return;
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }

      // If refresh failed or no Google credential, logout
      console.warn('Token refresh failed, logging out...');
      logout(true);
    });

    apiClient.setOnTokenRefreshed((newToken: string) => {
      setState((prev) => ({
        ...prev,
        accessToken: newToken,
      }));
    });

    return () => {
      apiClient.setOnTokenExpired(null);
      apiClient.setOnTokenRefreshed(null);
    };
  }, [state.googleCredential, state.isAuthenticated]);

  // Check token expiration periodically
  useEffect(() => {
    if (!state.isAuthenticated || !state.accessToken) return;

    const checkTokenExpiration = async () => {
      const tokenPayload = parseJwt(state.accessToken!);
      const isTokenExpired =
        tokenPayload && tokenPayload.exp
          ? Date.now() >= tokenPayload.exp * 1000
          : false;

      if (isTokenExpired) {
        console.warn('Token expired during session, attempting refresh...');

        // Try to refresh token if we have Google credential
        if (state.googleCredential) {
          try {
            const refreshResponse = await apiClient.refreshToken(
              state.googleCredential
            );

            // Update stored token
            localStorage.setItem('auth_token', refreshResponse.token);
            document.cookie = `auth_token=${refreshResponse.token}; path=/; max-age=86400; SameSite=Lax`;

            setState((prev) => ({
              ...prev,
              accessToken: refreshResponse.token,
            }));

            toast.success('Phiên đăng nhập đã được làm mới');
            return;
          } catch (error) {
            console.error('Token refresh failed during periodic check:', error);
          }
        }

        // If refresh failed or no Google credential, logout
        console.warn(
          'Token refresh failed during periodic check, logging out...'
        );
        logout(true);
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.accessToken, state.googleCredential]);

  function parseJwt(token: string) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const base64Url = parts[1];
      if (!base64Url) {
        return null;
      }

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('JWT parse error:', e);
      return null;
    }
  }

  const login = async (credential: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    console.log('credential: ', credential);

    try {
      // ✅ Decode JWT payload đúng cách
      const payload = parseJwt(credential);
      if (!payload) throw new Error('Invalid JWT payload');

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
      localStorage.setItem('google_credential', credential);

      // Set cookie cho middleware
      document.cookie = `auth_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;

      // Set token cho API client
      apiClient.setAuthToken(accessToken);

      setState({
        user,
        accessToken,
        googleCredential: credential,
        isLoading: false,
        isAuthenticated: true,
      });

      toast.success('Đăng nhập thành công!');
    } catch (error) {
      console.error('Login error:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
      toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  const logout = (isTokenExpired = false) => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('google_credential');

    // Remove cookie
    document.cookie =
      'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    apiClient.setAuthToken(null);

    setState({
      user: null,
      accessToken: null,
      googleCredential: null,
      isLoading: false,
      isAuthenticated: false,
    });

    if (isTokenExpired) {
      // toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      router.push('/auth/signin');
    } else {
      toast.success('Đã đăng xuất thành công!');
      router.push('/auth/signin');
    }

    // Redirect to signin page
    router.push('/auth/signin');
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
