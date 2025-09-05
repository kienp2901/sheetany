'use client';

import DataTable from '@/components/DataTable';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import { apiClient, Product, StudentByProduct } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const { accessToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productStudents, setProductStudents] = useState<StudentByProduct[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [studentsPagination, setStudentsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Track if initial load has been done
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (accessToken && !initialLoadDone.current) {
      apiClient.setAuthToken(accessToken);
      loadProducts();
      initialLoadDone.current = true;
    }
  }, [accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (accessToken && pagination.page > 1 && initialLoadDone.current) {
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  // Load students when pagination changes for product detail
  useEffect(() => {
    if (selectedProduct && accessToken && studentsPagination.page > 1) {
      loadProductStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentsPagination.page]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await apiClient.getProducts({
        limit: pagination.limit,
        page: pagination.page,
      });
      setProducts(result.data);
      setFilteredProducts(result.data);
      setPagination((prev) => ({ ...prev, total: result.total }));
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const loadProductStudents = async (searchParams?: {
    idOriginal?: string;
    email?: string;
  }) => {
    if (!selectedProduct) return;

    setLoadingStudents(true);
    try {
      const result = await apiClient.getStudentsByProduct(
        selectedProduct.idProduct,
        {
          ...searchParams,
          limit: studentsPagination.limit,
          page: studentsPagination.page,
        }
      );
      setProductStudents(result.data);
      setStudentsPagination((prev) => ({ ...prev, total: result.total }));
    } catch (error) {
      console.error('Error loading product students:', error);
      toast.error('Lỗi khi tải danh sách học sinh');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleSearch = (query: string) => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.idProduct.toString().includes(query)
    );
    setFilteredProducts(filtered);
  };

  const handleStudentSearch = (query: string) => {
    const searchParams: { idOriginal?: string; email?: string } = {};

    // Check if query is email or ID
    if (query.includes('@')) {
      searchParams.email = query;
    } else if (query.trim()) {
      searchParams.idOriginal = query;
    }

    loadProductStudents(searchParams);
  };

  const handleProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowDetail(true);
    setProductStudents([]);
    setStudentsPagination({ page: 1, limit: 10, total: 0 });
    loadProductStudents();
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedProduct(null);
    setProductStudents([]);
    setStudentsPagination({ page: 1, limit: 10, total: 0 });
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleStudentsPageChange = (page: number) => {
    setStudentsPagination((prev) => ({ ...prev, page }));
  };

  const handleExportStudents = async () => {
    if (!selectedProduct) return;

    try {
      const blob = await apiClient.exportStudentsByProduct(
        selectedProduct.idProduct
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `students_product_${selectedProduct.idProduct}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Xuất file CSV thành công');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Lỗi khi xuất file CSV');
    }
  };

  const productColumns = [
    {
      key: 'idProduct',
      label: 'Mã sản phẩm',
    },
    {
      key: 'name',
      label: 'Tên sản phẩm',
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (_: unknown, row: Product) => (
        <button
          onClick={() => handleProductDetails(row)}
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium cursor-pointer"
          title="Xem chi tiết sản phẩm"
        >
          Xem chi tiết
        </button>
      ),
    },
  ];

  const studentColumns = [
    {
      key: 'idOriginal',
      label: 'ID học sinh',
    },
    {
      key: 'name',
      label: 'Tên học sinh',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'status',
      label: 'Trạng thái',
    },
    {
      key: 'timeStart',
      label: 'Ngày bắt đầu',
      render: (value: unknown) =>
        new Date(value as string).toLocaleDateString('vi-VN'),
    },
    {
      key: 'timeFinish',
      label: 'Ngày kết thúc',
      render: (value: unknown) =>
        new Date(value as string).toLocaleDateString('vi-VN'),
    },
  ];

  if (showDetail && selectedProduct) {
    return (
      <Layout>
        <div className="space-y-4 sm:space-y-6">
          {/* Back Button and Header */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToList}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
              title="Quay lại danh sách sản phẩm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách
            </button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Chi tiết sản phẩm: {selectedProduct.name}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Danh sách học sinh đã đăng ký sản phẩm này
              </p>
            </div>
          </div>

          {/* Product Info Card */}
          <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-900 mb-4">
              Thông tin sản phẩm
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <span className="font-medium text-blue-700 block mb-1">
                  ID sản phẩm:
                </span>
                <span className="text-gray-900 text-lg">
                  {selectedProduct.idProduct}
                </span>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <span className="font-medium text-blue-700 block mb-1">
                  Tên sản phẩm:
                </span>
                <span className="text-gray-900 text-lg">
                  {selectedProduct.name}
                </span>
              </div>
            </div>
          </div>

          {/* Search Section for Students */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tìm kiếm học sinh
            </h3>
            <SearchBar
              placeholder="Nhập ID học sinh hoặc email để tìm kiếm..."
              onSearch={handleStudentSearch}
              loading={loadingStudents}
            />
          </div>

          {/* Students Table */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Danh sách học sinh đã đăng ký (
              {studentsPagination.total.toLocaleString()})
            </h3>
            <DataTable<StudentByProduct>
              columns={studentColumns}
              data={productStudents}
              loading={loadingStudents}
              pagination={{
                ...studentsPagination,
                onPageChange: handleStudentsPageChange,
              }}
              onExport={handleExportStudents}
              exportLabel="Xuất CSV"
            />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Tra cứu sản phẩm
          </h1>
          <p className="mt-1 sm:mt-2 text-sm text-gray-600">
            Quản lý và tra cứu thông tin các sản phẩm khóa học
          </p>
        </div>

        {/* Statistics Cards */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        </div> */}

        {/* Search Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <SearchBar
            placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
            onSearch={handleSearch}
            loading={loading}
          />
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
                <div
                  key={product.idProduct}
                  className="bg-white rounded-lg shadow-sm p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        Mã: {product.idProduct}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleProductDetails(product)}
                    className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                    title="Xem chi tiết sản phẩm"
                  >
                    Xem chi tiết
                  </button>
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
              pagination={{
                ...pagination,
                onPageChange: handlePageChange,
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
