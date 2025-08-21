'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import DataTable from '@/components/DataTable';
import { Package, Calendar, DollarSign, Users } from 'lucide-react';

// Dummy Product interface (extend this based on actual API)
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  totalStudents: number;
  startDate: string;
  endDate: string;
  category: string;
  status: 'active' | 'inactive' | 'coming_soon';
}

// Dummy data for demonstration
const dummyProducts: Product[] = [
  {
    id: 'PRD001',
    name: 'Khóa học Toán THPT',
    description: 'Khóa học Toán học cấp 3 toàn diện',
    price: 2500000,
    totalStudents: 1250,
    startDate: '2024-01-15',
    endDate: '2024-12-15',
    category: 'THPT',
    status: 'active'
  },
  {
    id: 'PRD002',
    name: 'Luyện thi Đại học',
    description: 'Khóa luyện thi Đại học 2024',
    price: 3500000,
    totalStudents: 2100,
    startDate: '2024-02-01',
    endDate: '2024-06-30',
    category: 'Luyện thi',
    status: 'active'
  },
  {
    id: 'PRD003',
    name: 'Tiếng Anh giao tiếp',
    description: 'Khóa học Tiếng Anh giao tiếp cơ bản',
    price: 1800000,
    totalStudents: 850,
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    category: 'Ngoại ngữ',
    status: 'active'
  },
  {
    id: 'PRD004',
    name: 'Lập trình Python',
    description: 'Khóa học lập trình Python từ cơ bản đến nâng cao',
    price: 2200000,
    totalStudents: 450,
    startDate: '2024-04-15',
    endDate: '2024-10-15',
    category: 'CNTT',
    status: 'coming_soon'
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(dummyProducts);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'THPT', label: 'THPT' },
    { value: 'Luyện thi', label: 'Luyện thi' },
    { value: 'Ngoại ngữ', label: 'Ngoại ngữ' },
    { value: 'CNTT', label: 'CNTT' },
  ];

  const handleSearch = (query: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.id.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
      setLoading(false);
    }, 500);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === category));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'coming_soon':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang hoạt động';
      case 'inactive':
        return 'Ngưng hoạt động';
      case 'coming_soon':
        return 'Sắp ra mắt';
      default:
        return 'Không xác định';
    }
  };

  const productColumns = [
    {
      key: 'id',
      label: 'Mã sản phẩm',
    },
    {
      key: 'name',
      label: 'Tên sản phẩm',
    },
    {
      key: 'category',
      label: 'Danh mục',
    },
    {
      key: 'price',
      label: 'Giá',
      render: (value: unknown) => formatPrice(value as number),
    },
    {
      key: 'totalStudents',
      label: 'Số học sinh',
      render: (value: unknown) => (
        <span className="font-semibold">{(value as number).toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (value: unknown) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(value as string)}`}>
          {getStatusText(value as string)}
        </span>
      ),
    },
  ];

  // Statistics cards data
  const stats = [
    {
      name: 'Tổng sản phẩm',
      value: products.length.toString(),
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Đang hoạt động',
      value: products.filter(p => p.status === 'active').length.toString(),
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      name: 'Tổng học sinh',
      value: products.reduce((sum, p) => sum + p.totalStudents, 0).toLocaleString(),
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      name: 'Doanh thu trung bình',
      value: formatPrice(products.reduce((sum, p) => sum + p.price, 0) / products.length),
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tra cứu sản phẩm</h1>
          <p className="mt-1 sm:mt-2 text-sm text-gray-600">
            Quản lý và tra cứu thông tin các sản phẩm khóa học
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-md ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                    <p className="text-lg sm:text-xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm space-y-4">
          <SearchBar
            placeholder="Tìm kiếm sản phẩm theo tên, mô tả hoặc mã..."
            onSearch={handleSearch}
            loading={loading}
          />
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryFilter(category.value)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table/Cards */}
        <div className="space-y-4">
          {/* Mobile Cards View */}
          <div className="sm:hidden space-y-3">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                Không tìm thấy sản phẩm nào
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">Mã: {product.id}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                      {getStatusText(product.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Danh mục:</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá:</span>
                      <span className="font-medium text-green-600">{formatPrice(product.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Học sinh:</span>
                      <span className="font-medium">{product.totalStudents.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p className="line-clamp-2">{product.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <DataTable<Product>
              columns={productColumns}
              data={filteredProducts}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}