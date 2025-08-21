'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
// import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogOut, Search, Package, FileText, Settings, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Tra cứu học sinh', href: '/students', icon: Search },
    { name: 'Tra cứu sản phẩm', href: '/products', icon: Package },
    { name: 'Tra cứu đề thi', href: '/exams', icon: FileText },
    { name: 'Quản trị Admin', href: '/admin', icon: Settings },
  ];

  // Extract user info from auth context
  const userEmail = user?.email || '';
  const userName = user?.name || userEmail.split('@')[0] || 'Admin';
  const userImage = user?.picture;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Profile Section - Mobile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="relative">
              {userImage ? (
                // <Image
                //   className="h-12 w-12 rounded-full object-cover border-2 border-indigo-100"
                //   src={userImage}
                //   alt={userName}
                //   width={48}
                //   height={48}
                // />
                <img
                  className="h-12 w-12 rounded-full object-cover border-2 border-indigo-100"
                  src={userImage}
                  alt={userName}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-indigo-100">
                  <User className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
            
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{userName}</h3>
              <p className="text-xs text-gray-600 truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Mobile */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      isActive
                        ? 'text-indigo-600'
                        : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button - Mobile */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-80 bg-white shadow-lg border-r border-gray-200 flex-col fixed inset-y-0 left-0 z-30">
        {/* User Profile Section - Desktop */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col items-center space-y-4">
            {/* Avatar */}
            <div className="relative">
              {userImage ? (
                // <Image
                //   className="h-20 w-20 rounded-full object-cover border-4 border-indigo-100"
                //   src={userImage}
                //   alt={userName}
                //   width={80}
                //   height={80}
                // />
                <img
                  className="h-20 w-20 rounded-full object-cover border-4 border-indigo-100"
                  src={userImage}
                  alt={userName}
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-indigo-500 flex items-center justify-center border-4 border-indigo-100">
                  <User className="h-10 w-10 text-white" />
                </div>
              )}
            </div>
            
            {/* User Info */}
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">{userName}</h2>
              <p className="text-sm text-gray-600 break-all">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Desktop */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      isActive
                        ? 'text-indigo-600'
                        : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button - Desktop */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-80">
        {/* Mobile Header with Hamburger Menu */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-lg font-bold text-gray-900">HOCMAI EMS</h1>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              HOCMAI EMS Admin
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Hệ thống quản trị tra cứu HOCMAI
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
