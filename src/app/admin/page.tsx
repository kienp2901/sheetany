'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  Users, 
  Package, 
  FileText, 
  TrendingUp, 
  Calendar,
  DollarSign,
  UserCheck,
  Activity,
  Settings,
  Shield,
  Database,
  AlertTriangle
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'system'>('overview');

  // Dummy statistics data
  const systemStats = {
    totalUsers: 15420,
    totalProducts: 48,
    totalExams: 1250,
    activeUsers: 8930,
    revenue: 125000000,
    growth: 12.5
  };

  const recentActivities = [
    {
      id: 1,
      type: 'user_login',
      message: 'Người dùng admin@hocmai.vn đã đăng nhập',
      timestamp: '2024-01-15 10:30:00',
      status: 'success'
    },
    {
      id: 2,
      type: 'system_backup',
      message: 'Backup dữ liệu hệ thống hoàn tất',
      timestamp: '2024-01-15 09:00:00',
      status: 'success'
    },
    {
      id: 3,
      type: 'error',
      message: 'Lỗi kết nối database tạm thời',
      timestamp: '2024-01-15 08:45:00',
      status: 'error'
    },
    {
      id: 4,
      type: 'new_user',
      message: '25 người dùng mới đăng ký trong 24h qua',
      timestamp: '2024-01-15 08:00:00',
      status: 'info'
    }
  ];

  const systemHealth = [
    { name: 'Database', status: 'healthy', uptime: '99.9%' },
    { name: 'API Server', status: 'healthy', uptime: '99.8%' },
    { name: 'File Storage', status: 'warning', uptime: '98.5%' },
    { name: 'Email Service', status: 'healthy', uptime: '99.7%' }
  ];

  const adminTabs = [
    { id: 'overview', name: 'Tổng quan', icon: Activity },
    { id: 'users', name: 'Quản lý người dùng', icon: Users },
    { id: 'system', name: 'Hệ thống', icon: Settings }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const overviewCards = [
    {
      name: 'Tổng người dùng',
      value: systemStats.totalUsers.toLocaleString(),
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Tổng sản phẩm',
      value: systemStats.totalProducts.toString(),
      change: '+3%',
      icon: Package,
      color: 'bg-green-500'
    },
    {
      name: 'Người dùng hoạt động',
      value: systemStats.activeUsers.toLocaleString(),
      change: '+8%',
      icon: UserCheck,
      color: 'bg-purple-500'
    },
    {
      name: 'Doanh thu tháng',
      value: formatCurrency(systemStats.revenue),
      change: `+${systemStats.growth}%`,
      icon: DollarSign,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Quản trị hệ thống</h1>
          <p className="mt-1 sm:mt-2 text-sm text-gray-600">
            Theo dõi và quản lý toàn bộ hệ thống HOCMAI EMS
          </p>
        </div>

        {/* Admin Access Warning */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <strong>Khu vực quản trị:</strong> Chỉ dành cho quản trị viên hệ thống. 
                Vui lòng thận trọng khi thực hiện các thao tác.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {overviewCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div key={card.name} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 p-3 rounded-md ${card.color}`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="ml-4 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-500 truncate">{card.name}</p>
                            <div className="flex items-center">
                              <p className="text-lg font-semibold text-gray-900">{card.value}</p>
                              <span className="ml-2 text-sm text-green-600">{card.change}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Activities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.status)}`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Quản lý người dùng</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Tính năng đang được phát triển
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Phân quyền</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Quản lý quyền truy cập hệ thống
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <Activity className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Hoạt động</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Theo dõi hoạt động người dùng
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                {/* System Health */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tình trạng hệ thống</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {systemHealth.map((service) => (
                      <div key={service.name} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{service.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(service.status)}`}>
                            {service.status === 'healthy' ? 'Tốt' : 
                             service.status === 'warning' ? 'Cảnh báo' : 'Lỗi'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Uptime: {service.uptime}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Tools */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Công cụ hệ thống</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors">
                      <Database className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                      <h4 className="text-sm font-medium text-gray-900">Backup dữ liệu</h4>
                      <p className="text-xs text-gray-600 mt-1">Sao lưu toàn bộ dữ liệu</p>
                    </button>
                    
                    <button className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors">
                      <Settings className="h-8 w-8 text-green-500 mx-auto mb-3" />
                      <h4 className="text-sm font-medium text-gray-900">Cấu hình</h4>
                      <p className="text-xs text-gray-600 mt-1">Cài đặt hệ thống</p>
                    </button>
                    
                    <button className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors">
                      <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                      <h4 className="text-sm font-medium text-gray-900">Logs</h4>
                      <p className="text-xs text-gray-600 mt-1">Xem nhật ký hệ thống</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}