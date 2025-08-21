'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Script from 'next/script';

declare global {
  interface Window {
    google: typeof google;
  }
}

export default function SignIn() {
  const router = useRouter();
  const { isAuthenticated, login, isLoading } = useAuth();

  // div chứa nút google
  const btnRef = useRef<HTMLDivElement | null>(null);
  // tránh init nhiều lần
  const initializedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/students');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleCredentialResponse = async (response: google.accounts.id.CredentialResponse) => {
    try {
      await login(response.credential);
      router.push('/students');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  // Hàm init + render button. Gọi lại được nhiều lần an toàn.
  const initGoogle = () => {
    if (!window.google || !btnRef.current) return;

    // (Re)initialize mỗi lần vào trang để đảm bảo callback mới nhất
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Xóa nội dung cũ rồi render lại nút
    btnRef.current.innerHTML = '';
    window.google.accounts.id.renderButton(btnRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      width: 280,
    });

    // Tùy chọn: hiển thị prompt chọn account nếu có session
    // window.google.accounts.id.prompt();

    initializedRef.current = true;
  };

  // 1) Khi component mount, nếu script đã có sẵn => init ngay
  useEffect(() => {
    initGoogle();

    // 2) Thêm cơ chế "đợi" script (nếu chưa sẵn) trong vài giây
    let tries = 0;
    const timer = setInterval(() => {
      if (initializedRef.current) {
        clearInterval(timer);
        return;
      }
      tries += 1;
      initGoogle();
      if (tries > 20) clearInterval(timer); // ~6s (20 * 300ms) là đủ
    }, 300);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Google Identity Services Script – chỉ load 1 lần cho cả app */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          // 3) Khi script báo đã load, thử init ngay (trường hợp lần đầu)
          initGoogle();
        }}
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
          {/* Logo/Brand Section */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 bg-indigo-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <svg
                className="h-8 w-8 sm:h-10 sm:w-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              HOCMAI EMS Admin
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Hệ thống quản trị tra cứu HOCMAI
            </p>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Chỉ dành cho nhân viên HOCMAI
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white py-6 px-4 sm:py-8 sm:px-6 shadow-xl rounded-lg space-y-6">
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Đăng nhập để tiếp tục
              </h3>
              <p className="text-sm text-gray-600">
                Sử dụng tài khoản Google để truy cập hệ thống
              </p>
            </div>

            {/* Google Sign-In button */}
            <div ref={btnRef} id="googleSignInDiv" className="flex justify-center"></div>

            <div className="border-t border-gray-200 pt-4">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-amber-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs sm:text-sm text-amber-700">
                      <strong>Lưu ý:</strong> Chỉ chấp nhận tài khoản có domain
                      @hocmai.vn
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              © 2024 HOCMAI. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
