import React from 'react';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  usePathname() {
    return '/students';
  },
}));

// Mock Next.js Script component
jest.mock('next/script', () => {
  return function MockScript({ onLoad }: { onLoad?: () => void }) {
    React.useEffect(() => {
      if (onLoad) {
        onLoad();
      }
    }, [onLoad]);
    return null;
  };
});

// Mock toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn(),
}));

// Mock Google OAuth
Object.defineProperty(window, 'google', {
  writable: true,
  value: {
    accounts: {
      id: {
        initialize: jest.fn(),
        renderButton: jest.fn(),
        prompt: jest.fn(),
      },
    },
  },
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
