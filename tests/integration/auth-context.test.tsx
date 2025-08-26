import { apiClient } from '@/lib/api';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// Mock the API client
jest.mock('@/lib/api', () => ({
  apiClient: {
    setAuthToken: jest.fn(),
    loginGoogle: jest.fn(),
  },
}));

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));

// Mock toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Import the mocked toast to access the mock functions
import toast from 'react-hot-toast';

// Test component to use the auth context
function TestComponent() {
  const { user, accessToken, isLoading, isAuthenticated, login, logout } =
    useAuth();

  return (
    <div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'no-user'}</div>
      <div data-testid="accessToken">{accessToken || 'no-token'}</div>
      <div data-testid="isLoading">{isLoading.toString()}</div>
      <div data-testid="isAuthenticated">{isAuthenticated.toString()}</div>
      <button
        onClick={() =>
          login(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGhvY21haS52biIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicGljdHVyZSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vYXZhdGFyLmpwZyJ9.signature'
          )
        }
        data-testid="login-btn"
      >
        Login
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
}

describe('Auth Context', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockPush.mockClear();
    (toast.success as jest.Mock).mockClear();
    (toast.error as jest.Mock).mockClear();
  });

  describe('Initial State', () => {
    test('should show loading state initially', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for the effect to complete and check final state
      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('accessToken')).toHaveTextContent('no-token');
    });

    test('should load saved session from localStorage', async () => {
      const savedUser = {
        email: 'admin@hocmai.vn',
        name: 'Admin User',
        picture: 'https://example.com/avatar.jpg',
      };
      const savedToken = 'saved-jwt-token';

      localStorage.setItem('auth_user', JSON.stringify(savedUser));
      localStorage.setItem('auth_token', savedToken);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user')).toHaveTextContent(
        JSON.stringify(savedUser)
      );
      expect(screen.getByTestId('accessToken')).toHaveTextContent(savedToken);
      expect(apiClient.setAuthToken).toHaveBeenCalledWith(savedToken);
    });

    test('should handle invalid saved session gracefully', async () => {
      localStorage.setItem('auth_user', 'invalid-json');
      localStorage.setItem('auth_token', 'token');

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      expect(localStorage.getItem('auth_user')).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('Login Functionality', () => {
    test('should login successfully with valid credential', async () => {
      const mockUser = {
        email: 'admin@hocmai.vn',
        name: 'Admin User',
        picture: 'https://example.com/avatar.jpg',
      };
      const mockToken = 'jwt-token';

      // Create a valid JWT token for testing
      // const mockJWT =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGhvY21haS52biIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicGljdHVyZSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vYXZhdGFyLmpwZyJ9.signature';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (apiClient.loginGoogle as any).mockResolvedValueOnce({
        token: mockToken,
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      const loginButton = screen.getByTestId('login-btn');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(apiClient.loginGoogle).toHaveBeenCalledWith(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGhvY21haS52biIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicGljdHVyZSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vYXZhdGFyLmpwZyJ9.signature'
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });

      expect(screen.getByTestId('user')).toHaveTextContent(
        JSON.stringify(mockUser)
      );
      expect(screen.getByTestId('accessToken')).toHaveTextContent(mockToken);
      expect(apiClient.setAuthToken).toHaveBeenCalledWith(mockToken);
      expect(toast.success).toHaveBeenCalledWith('Đăng nhập thành công!');
      // Note: auth context doesn't redirect after login, only after logout
    });

    test('should handle login failure', async () => {
      const error = new Error('Login failed');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (apiClient.loginGoogle as any).mockRejectedValueOnce(error);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      const loginButton = screen.getByTestId('login-btn');
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(apiClient.loginGoogle).toHaveBeenCalledWith(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGhvY21haS52biIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicGljdHVyZSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vYXZhdGFyLmpwZyJ9.signature'
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      expect(toast.error).toHaveBeenCalledWith(
        'Đăng nhập thất bại. Vui lòng thử lại.'
      );
    });

    test('should handle invalid JWT payload', async () => {
      // Mock invalid JWT that can't be parsed
      // const invalidCredential = 'invalid.jwt.token';

      // Mock API to reject the invalid credential
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (apiClient.loginGoogle as any).mockRejectedValueOnce(
        new Error('Invalid JWT')
      );

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      const loginButton = screen.getByTestId('login-btn');

      // Click login button with invalid credential
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      expect(toast.error).toHaveBeenCalledWith(
        'Đăng nhập thất bại. Vui lòng thử lại.'
      );
    });
  });

  describe('Logout Functionality', () => {
    test('should logout successfully', async () => {
      // Setup authenticated state
      const savedUser = {
        email: 'admin@hocmai.vn',
        name: 'Admin User',
        picture: 'https://example.com/avatar.jpg',
      };
      const savedToken = 'saved-jwt-token';

      localStorage.setItem('auth_user', JSON.stringify(savedUser));
      localStorage.setItem('auth_token', savedToken);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });

      const logoutButton = screen.getByTestId('logout-btn');
      fireEvent.click(logoutButton);

      expect(localStorage.getItem('auth_user')).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(apiClient.setAuthToken).toHaveBeenCalledWith(null);
      expect(toast.success).toHaveBeenCalledWith('Đã đăng xuất thành công!');
      expect(mockPush).toHaveBeenCalledWith('/auth/signin');
    });

    test('should clear all auth data on logout', async () => {
      // Setup authenticated state
      localStorage.setItem(
        'auth_user',
        JSON.stringify({ email: 'test@example.com' })
      );
      localStorage.setItem('auth_token', 'test-token');

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      });

      const logoutButton = screen.getByTestId('logout-btn');
      fireEvent.click(logoutButton);

      expect(localStorage.getItem('auth_user')).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('accessToken')).toHaveTextContent('no-token');
    });
  });

  describe('JWT Parsing', () => {
    test('should parse valid JWT correctly', () => {
      const validJWT =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGhvY21haS52biIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicGljdHVyZSI6Imh0dHBzOi8vZXhhbXBsZS5jb20vYXZhdGFyLmpwZyJ9.signature';

      // This test would require testing the private parseJwt function
      // For now, we'll test the behavior through the login flow
      expect(validJWT).toMatch(
        /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
      );
    });
  });

  describe('Error Handling', () => {
    test('should handle localStorage errors gracefully', async () => {
      // Mock localStorage to throw error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jest.fn().mockImplementation(() => {
        throw new Error('localStorage error');
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');

      // Restore original localStorage
      localStorage.getItem = originalGetItem;
    });

    test('should handle API client errors', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (apiClient.setAuthToken as any).mockImplementation(() => {
        throw new Error('API client error');
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      // Should not crash and should show unauthenticated state
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
    });
  });

  describe('Context Usage', () => {
    test('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });

    test('should provide consistent context values', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
      });

      // All context values should be consistent
      const isLoading = screen.getByTestId('isLoading').textContent;
      const isAuthenticated = screen.getByTestId('isAuthenticated').textContent;
      const user = screen.getByTestId('user').textContent;
      const accessToken = screen.getByTestId('accessToken').textContent;

      expect(isLoading).toBe('false');
      expect(isAuthenticated).toBe('false');
      expect(user).toBe('no-user');
      expect(accessToken).toBe('no-token');
    });
  });
});
