'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, StatsCard } from '@/components/Card';
import Modal, { ConfirmationModal, ModalBody, ModalFooter } from '@/components/Modal';
import SearchBar from '@/components/SearchBar';
import DataTable from '@/components/DataTable';
import { 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign,
  Search,
  Download,
  Settings,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

// Dummy data for demo
const demoData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
];

export default function DemoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = (query: string) => {
    setSearchLoading(true);
    setTimeout(() => {
      setSearchLoading(false);
      console.log('Search query:', query);
    }, 1000);
  };

  const tableColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Tên' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Vai trò' },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value: unknown) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value as string}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: () => (
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Component Demo
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Showcase tất cả component responsive trong ứng dụng
          </p>
        </div>

        {/* Stats Cards Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Stats Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Tổng người dùng"
              value="1,234"
              change="+12%"
              changeType="positive"
              icon={Users}
            />
            <StatsCard
              title="Sản phẩm"
              value="56"
              change="+3%"
              changeType="positive"
              icon={Package}
            />
            <StatsCard
              title="Tăng trưởng"
              value="23%"
              change="-2%"
              changeType="negative"
              icon={TrendingUp}
            />
            <StatsCard
              title="Doanh thu"
              value="$12,345"
              change="+8%"
              changeType="positive"
              icon={DollarSign}
            />
          </div>
        </section>

        {/* Buttons Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Buttons</h2>
          <Card>
            <CardHeader>
              <CardTitle>Button Variants & Sizes</CardTitle>
              <CardDescription>
                Tất cả các variant và size của button component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Button Variants */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Variants</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="default">Default</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Sizes</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>

              {/* Responsive Buttons */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Responsive</h3>
                <div className="space-y-2">
                  <Button fullWidth>Full Width</Button>
                  <Button responsive>Responsive (Full on mobile, auto on desktop)</Button>
                </div>
              </div>

              {/* Loading State */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Loading State</h3>
                <Button loading>Loading...</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Search Bar Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Bar</h2>
          <Card>
            <CardHeader>
              <CardTitle>Responsive Search</CardTitle>
              <CardDescription>
                Search bar responsive với layout khác nhau cho mobile và desktop
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SearchBar
                placeholder="Tìm kiếm bất cứ thứ gì..."
                onSearch={handleSearch}
                loading={searchLoading}
              />
            </CardContent>
          </Card>
        </section>

        {/* Data Table Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Table</h2>
          <DataTable
            columns={tableColumns}
            data={demoData}
            onExport={() => console.log('Export clicked')}
            exportLabel="Xuất Excel"
          />
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>
                  Card đơn giản với header và content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Đây là nội dung của card. Card này sẽ responsive và 
                  hiển thị tốt trên tất cả các thiết bị.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Card với Icon
                </CardTitle>
                <CardDescription>
                  Card có icon trong title
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cài đặt:</span>
                    <span className="text-sm font-medium">Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Trạng thái:</span>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>
                  Card với buttons và interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Card này có các button để tương tác với modal.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => setIsModalOpen(true)}
                    responsive
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Mở Modal
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => setIsConfirmModalOpen(true)}
                    responsive
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Modal Examples */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Demo Modal"
          size="md"
        >
          <ModalBody>
            <p className="text-sm text-gray-600 mb-4">
              Đây là một modal demo. Modal này responsive và sẽ hiển thị tốt 
              trên tất cả các thiết bị.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Nhập tên..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Nhập email..."
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Lưu
            </Button>
          </ModalFooter>
        </Modal>

        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={() => {
            console.log('Confirmed!');
            setIsConfirmModalOpen(false);
          }}
          title="Xác nhận xóa"
          message="Bạn có chắc chắn muốn xóa item này? Hành động này không thể hoàn tác."
          confirmText="Xóa"
          cancelText="Hủy"
          variant="danger"
        />
      </div>
    </Layout>
  );
}
