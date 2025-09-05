'use client';

import { Button } from '@/components/Button';
import DataTable from '@/components/DataTable';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import { Admin, apiClient } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  AlertTriangle,
  Database,
  DollarSign,
  Edit,
  Package,
  Plus,
  // Activity,
  Settings,
  Shield,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'system'>(
    'users'
  );

  // Admin management state
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });

  // Track if initial load has been done
  const initialLoadDone = useRef(false);

  // Dummy statistics data
  const systemStats = {
    totalUsers: 15420,
    totalProducts: 48,
    totalExams: 1250,
    activeUsers: 8930,
    revenue: 125000000,
    growth: 12.5,
  };

  const recentActivities = [
    {
      id: 1,
      type: 'user_login',
      message: 'Người dùng admin@hocmai.vn đã đăng nhập',
      timestamp: '2024-01-15 10:30:00',
      status: 'success',
    },
    {
      id: 2,
      type: 'system_backup',
      message: 'Backup dữ liệu hệ thống hoàn tất',
      timestamp: '2024-01-15 09:00:00',
      status: 'success',
    },
    {
      id: 3,
      type: 'error',
      message: 'Lỗi kết nối database tạm thời',
      timestamp: '2024-01-15 08:45:00',
      status: 'error',
    },
    {
      id: 4,
      type: 'new_user',
      message: '25 người dùng mới đăng ký trong 24h qua',
      timestamp: '2024-01-15 08:00:00',
      status: 'info',
    },
  ];

  const systemHealth = [
    { name: 'Database', status: 'healthy', uptime: '99.9%' },
    { name: 'API Server', status: 'healthy', uptime: '99.8%' },
    { name: 'File Storage', status: 'warning', uptime: '98.5%' },
    { name: 'Email Service', status: 'healthy', uptime: '99.7%' },
  ];

  useEffect(() => {
    if (accessToken && !initialLoadDone.current) {
      apiClient.setAuthToken(accessToken);
      loadAdmins();
      initialLoadDone.current = true;
    }
  }, [accessToken]);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const adminsData = await apiClient.getAdmins();
      setAdmins(adminsData);
    } catch (error) {
      console.error('Error loading admins:', error);
      toast.error('Lỗi khi tải danh sách quản trị viên');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    if (!email.endsWith('@hocmai.vn')) {
      toast.error('Email phải thuộc domain @hocmai.vn');
      return false;
    }
    return true;
  };

  const handleAddAdmin = async () => {
    if (!validateEmail(formData.email)) return;

    try {
      await apiClient.addAdmin(formData.email);
      toast.success('Thêm quản trị viên thành công');
      setShowAddModal(false);
      setFormData({ email: '', firstName: '', lastName: '' });
      loadAdmins();
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Lỗi khi thêm quản trị viên');
    }
  };

  const handleEditAdmin = async () => {
    if (!selectedAdmin) return;
    if (formData.email && !validateEmail(formData.email)) return;

    try {
      await apiClient.updateAdmin(selectedAdmin.idAdminHocmaiManager, {
        ...(formData.email && { email: formData.email }),
        ...(formData.firstName && { firstName: formData.firstName }),
        ...(formData.lastName && { lastName: formData.lastName }),
      });
      toast.success('Cập nhật thông tin thành công');
      setShowEditModal(false);
      setSelectedAdmin(null);
      setFormData({ email: '', firstName: '', lastName: '' });
      loadAdmins();
    } catch (error) {
      console.error('Error updating admin:', error);
      toast.error('Lỗi khi cập nhật thông tin');
    }
  };

  const handleDeleteAdmin = async (admin: Admin) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa quản trị viên ${admin.email}?`)) {
      return;
    }

    try {
      await apiClient.deleteAdmin(admin.idAdminHocmaiManager);
      toast.success('Xóa quản trị viên thành công');
      loadAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast.error('Lỗi khi xóa quản trị viên');
    }
  };

  const openEditModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setFormData({
      email: admin.email,
      firstName: admin.firstName || '',
      lastName: admin.lastName || '',
    });
    setShowEditModal(true);
  };

  const adminTabs = [
    // { id: 'overview', name: 'Tổng quan', icon: Activity },
    { id: 'users', name: 'Quản lý quyền truy cập', icon: Users },
    // { id: 'system', name: 'Hệ thống', icon: Settings }
  ];

  const adminColumns = [
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'firstName',
      label: 'Họ',
      render: (value: unknown) => (value as string) || '-',
    },
    {
      key: 'lastName',
      label: 'Tên',
      render: (value: unknown) => (value as string) || '-',
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (_: unknown, row: Admin) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openEditModal(row)}
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium cursor-pointer"
            title={`Chỉnh sửa thông tin quản trị viên ${row.email}`}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteAdmin(row)}
            className="text-red-600 hover:text-red-900 text-sm font-medium cursor-pointer"
            title={`Xóa quản trị viên ${row.email}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
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
      color: 'bg-blue-500',
    },
    {
      name: 'Tổng sản phẩm',
      value: systemStats.totalProducts.toString(),
      change: '+3%',
      icon: Package,
      color: 'bg-green-500',
    },
    {
      name: 'Người dùng hoạt động',
      value: systemStats.activeUsers.toLocaleString(),
      change: '+8%',
      icon: UserCheck,
      color: 'bg-purple-500',
    },
    {
      name: 'Doanh thu tháng',
      value: formatCurrency(systemStats.revenue),
      change: `+${systemStats.growth}%`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Quản trị hệ thống
          </h1>
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
                <strong>Khu vực quản trị:</strong> Chỉ dành cho quản trị viên hệ
                thống. Vui lòng thận trọng khi thực hiện các thao tác.
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
                    onClick={() =>
                      setActiveTab(tab.id as 'overview' | 'users' | 'system')
                    }
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
                      <div
                        key={card.name}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div
                            className={`flex-shrink-0 p-3 rounded-md ${card.color}`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="ml-4 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-500 truncate">
                              {card.name}
                            </p>
                            <div className="flex items-center">
                              <p className="text-lg font-semibold text-gray-900">
                                {card.value}
                              </p>
                              <span className="ml-2 text-sm text-green-600">
                                {card.change}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Activities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Hoạt động gần đây
                  </h3>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.status)}`}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">
                              {activity.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {activity.timestamp}
                            </p>
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
                {/* Admin Access Info */}
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-900">
                        Quản lý quyền truy cập
                      </h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Chỉ email có domain @hocmai.vn mới được phép truy cập hệ
                        thống. Quản lý danh sách người dùng được phép đăng nhập
                        vào trang quản trị.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add Admin Button */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Danh sách quản trị viên ({admins.length})
                  </h3>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2"
                    title="Thêm quản trị viên mới vào hệ thống"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Thêm quản trị viên</span>
                  </Button>
                </div>

                {/* Admins Table */}
                <div className="bg-white rounded-lg shadow-sm">
                  <DataTable<Admin>
                    columns={adminColumns}
                    data={admins}
                    loading={loading}
                  />
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                {/* System Health */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Tình trạng hệ thống
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {systemHealth.map((service) => (
                      <div
                        key={service.name}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {service.name}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(service.status)}`}
                          >
                            {service.status === 'healthy'
                              ? 'Tốt'
                              : service.status === 'warning'
                                ? 'Cảnh báo'
                                : 'Lỗi'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Uptime: {service.uptime}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Tools */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Công cụ hệ thống
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors"
                      title="Thực hiện sao lưu toàn bộ dữ liệu hệ thống"
                    >
                      <Database className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                      <h4 className="text-sm font-medium text-gray-900">
                        Backup dữ liệu
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Sao lưu toàn bộ dữ liệu
                      </p>
                    </button>

                    <button
                      className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors"
                      title="Cài đặt và cấu hình hệ thống"
                    >
                      <Settings className="h-8 w-8 text-green-500 mx-auto mb-3" />
                      <h4 className="text-sm font-medium text-gray-900">
                        Cấu hình
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Cài đặt hệ thống
                      </p>
                    </button>

                    <button
                      className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors"
                      title="Xem nhật ký hoạt động và lỗi hệ thống"
                    >
                      <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                      <h4 className="text-sm font-medium text-gray-900">
                        Logs
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Xem nhật ký hệ thống
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Admin Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setFormData({ email: '', firstName: '', lastName: '' });
          }}
          title="Thêm quản trị viên mới"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="example@hocmai.vn"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Chỉ chấp nhận email có domain @hocmai.vn
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ email: '', firstName: '', lastName: '' });
                }}
                title="Hủy bỏ việc thêm quản trị viên"
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddAdmin}
                disabled={!formData.email}
                title="Thêm quản trị viên mới vào hệ thống"
              >
                Thêm quản trị viên
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit Admin Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAdmin(null);
            setFormData({ email: '', firstName: '', lastName: '' });
          }}
          title="Chỉnh sửa thông tin quản trị viên"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="edit-email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="edit-email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="example@hocmai.vn"
              />
            </div>

            <div>
              <label
                htmlFor="edit-firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Họ
              </label>
              <input
                type="text"
                id="edit-firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nhập họ..."
              />
            </div>

            <div>
              <label
                htmlFor="edit-lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tên
              </label>
              <input
                type="text"
                id="edit-lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nhập tên..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedAdmin(null);
                  setFormData({ email: '', firstName: '', lastName: '' });
                }}
                title="Hủy bỏ việc chỉnh sửa thông tin"
              >
                Hủy
              </Button>
              <Button
                onClick={handleEditAdmin}
                title="Cập nhật thông tin quản trị viên"
              >
                Cập nhật
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}
