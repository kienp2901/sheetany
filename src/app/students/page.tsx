'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import DataTable from '@/components/DataTable';
import { apiClient, Student, StudentProduct, StudentHistory } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentsPage() {
  const { accessToken } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentProducts, setStudentProducts] = useState<StudentProduct[]>([]);
  const [studentHistory, setStudentHistory] = useState<StudentHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState<'normal' | 'topclass'>('normal');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [productsPagination, setProductsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [historyPagination, setHistoryPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    if (accessToken) {
      apiClient.setAuthToken(accessToken);
      // Load initial data
      loadStudents();
    }
  }, [accessToken]);  // eslint-disable-line react-hooks/exhaustive-deps

  const loadStudents = async (searchParams?: { idOriginal?: string; email?: string }) => {
    setLoading(true);
    try {
      const result = await apiClient.getStudents({
        ...searchParams,
        limit: pagination.limit,
        page: pagination.page,
      });
      setStudents(result.data);
      setPagination(prev => ({ ...prev, total: result.total }));
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Lỗi khi tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  };

  const loadStudentDetails = async (student: Student) => {
    setSelectedStudent(student);
    setShowDetail(true);
    setLoadingProducts(true);
    setLoadingHistory(true);
    setActiveHistoryTab('normal'); // Reset to normal tab when loading new student

    try {
      // Load student products
      const productsResult = await apiClient.getStudentProducts(
        student.idOriginal,
        {
          limit: productsPagination.limit,
          page: productsPagination.page,
        }
      );
      setStudentProducts(productsResult.data);
      setProductsPagination(prev => ({ ...prev, total: productsResult.total }));
      setLoadingProducts(false);

      // Load student history for normal exams (type = 0)
      const historyResult = await apiClient.getStudentHistory(
        student.idOriginal,
        0,
        {
          limit: historyPagination.limit,
          page: historyPagination.page,
        }
      );
      setStudentHistory(historyResult.data);
      setHistoryPagination(prev => ({ ...prev, total: historyResult.total }));
      setLoadingHistory(false);
    } catch (error) {
      console.error('Error loading student details:', error);
      toast.error('Lỗi khi tải thông tin chi tiết học sinh');
      setLoadingProducts(false);
      setLoadingHistory(false);
    }
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedStudent(null);
    setStudentProducts([]);
    setStudentHistory([]);
    setProductsPagination({ page: 1, limit: 10, total: 0 });
    setHistoryPagination({ page: 1, limit: 10, total: 0 });
    setActiveHistoryTab('normal');
  };

  const handleProductsPageChange = (page: number) => {
    setProductsPagination(prev => ({ ...prev, page }));
  };

  const handleHistoryPageChange = (page: number) => {
    setHistoryPagination(prev => ({ ...prev, page }));
  };

  const handleHistoryTabChange = (tab: 'normal' | 'topclass') => {
    if (tab === activeHistoryTab) return;
    
    setActiveHistoryTab(tab);
    setHistoryPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    setLoadingHistory(true);
    
    // Load history data for the selected tab
    if (selectedStudent) {
      const type = tab === 'normal' ? 0 : 1;
      loadHistoryData(type, 1);
    }
  };

  const loadHistoryData = async (type: 0 | 1, page: number) => {
    if (!selectedStudent) return;
    
    try {
      const historyResult = await apiClient.getStudentHistory(
        selectedStudent.idOriginal,
        type,
        {
          limit: historyPagination.limit,
          page: page,
        }
      );
      setStudentHistory(historyResult.data);
      setHistoryPagination(prev => ({ ...prev, total: historyResult.total }));
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Lỗi khi tải lịch sử làm bài');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSearch = (query: string) => {
    const searchParams: { idOriginal?: string; email?: string } = {};
    
    // Check if query is email or ID
    if (query.includes('@')) {
      searchParams.email = query;
    } else {
      searchParams.idOriginal = query;
    }

    loadStudents(searchParams);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  useEffect(() => {
    if (accessToken) {
      loadStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, accessToken]);

  // Load products when pagination changes
  useEffect(() => {
    if (selectedStudent && accessToken) {
      const loadProducts = async () => {
        setLoadingProducts(true);
        try {
          const productsResult = await apiClient.getStudentProducts(
            selectedStudent.idOriginal,
            {
              limit: productsPagination.limit,
              page: productsPagination.page,
            }
          );
          setStudentProducts(productsResult.data);
          setProductsPagination(prev => ({ ...prev, total: productsResult.total }));
        } catch (error) {
          console.error('Error loading products:', error);
          toast.error('Lỗi khi tải danh sách sản phẩm');
        } finally {
          setLoadingProducts(false);
        }
      };
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsPagination.page, selectedStudent?.idOriginal, accessToken]);

  // Load history when pagination changes
  useEffect(() => {
    if (selectedStudent && accessToken) {
      const type = activeHistoryTab === 'normal' ? 0 : 1;
      loadHistoryData(type, historyPagination.page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyPagination.page, selectedStudent?.idOriginal, accessToken, activeHistoryTab]);

  const studentColumns = [
    {
      key: 'idOriginal',
      label: 'ID Học sinh',
    },
    {
      key: 'name',
      label: 'Tên',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (_: unknown, row: Student) => (
        <button
          onClick={() => loadStudentDetails(row)}
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium cursor-pointer"
          title="Xem chi tiết học sinh"
        >
          Xem chi tiết
        </button>
      ),
    },
  ];

  const productColumns = [
    {
      key: 'product_name',
      label: 'Tên sản phẩm',
    },
    {
      key: 'timeStart',
      label: 'Thời gian bắt đầu',
      render: (value: unknown) => new Date(value as string).toLocaleDateString('vi-VN'),
    },
    {
      key: 'timeFinish',
      label: 'Thời gian kết thúc',
      render: (value: unknown) => new Date(value as string).toLocaleDateString('vi-VN'),
    },
    {
      key: 'idProduct',
      label: 'ID Sản phẩm',
    },
  ];

  const historyColumns = [
    {
      key: 'mockcontests.name',
      label: 'Tên đề thi',
      render: (_: unknown, row: StudentHistory) => row.mockcontests?.name || '-',
    },
    {
      key: 'products.name',
      label: 'Sản phẩm',
      render: (_: unknown, row: StudentHistory) => row.products?.name || '-',
    },
    {
      key: 'timeStart',
      label: 'Thời gian bắt đầu',
      render: (value: unknown) => new Date(value as string).toLocaleString('vi-VN'),
    },
    {
      key: 'timeFinish',
      label: 'Thời gian kết thúc',
      render: (value: unknown) => new Date(value as string).toLocaleString('vi-VN'),
    },
    {
      key: 'scoreMockContest',
      label: 'Điểm số',
    },
  ];

  const historyTabs = [
    { id: 'normal', name: 'Phòng luyện đề', type: 0 },
    { id: 'topclass', name: 'Phòng luyện Topclass', type: 1 }
  ];

  if (showDetail && selectedStudent) {
    return (
      <Layout>
        <div className="space-y-4 sm:space-y-6">
          {/* Back Button and Header */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToList}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
              title="Quay lại danh sách học sinh"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại danh sách
            </button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Chi tiết học sinh: {selectedStudent.name}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Thông tin chi tiết và lịch sử hoạt động
              </p>
            </div>
          </div>

          {/* Student Info Card */}
          <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-900 mb-4">
              Thông tin cơ bản
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <span className="font-medium text-blue-700 block mb-1">ID học sinh:</span>
                <span className="text-gray-900 text-lg">{selectedStudent.idOriginal}</span>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm">
                <span className="font-medium text-blue-700 block mb-1">Email:</span>
                <span className="text-gray-900 break-all">{selectedStudent.email}</span>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm sm:col-span-2 lg:col-span-1">
                <span className="font-medium text-blue-700 block mb-1">Họ tên:</span>
                <span className="text-gray-900 text-lg">{selectedStudent.name}</span>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sản phẩm đã đăng ký
            </h3>
            <DataTable<StudentProduct>
              columns={productColumns}
              data={studentProducts}
              loading={loadingProducts}
              pagination={{
                ...productsPagination,
                onPageChange: handleProductsPageChange,
              }}
            />
          </div>

          {/* History Section with Tabs */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Lịch sử làm bài
            </h3>
            
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="flex overflow-x-auto">
                {historyTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleHistoryTabChange(tab.id as 'normal' | 'topclass')}
                    className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                      activeHistoryTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    title={`Chuyển sang tab ${tab.name}`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <DataTable<StudentHistory>
              columns={historyColumns}
              data={studentHistory}
              loading={loadingHistory}
              pagination={{
                ...historyPagination,
                onPageChange: handleHistoryPageChange,
              }}
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tra cứu học sinh</h1>
          <p className="mt-1 sm:mt-2 text-sm text-gray-600">
            Tìm kiếm học sinh theo ID hoặc email để xem thông tin chi tiết
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <SearchBar
            placeholder="Nhập ID học sinh hoặc email..."
            onSearch={handleSearch}
            loading={loading}
          />
        </div>

        {/* Students Table/Cards */}
        <div className="space-y-4">
          {/* Mobile Cards View */}
          <div className="sm:hidden space-y-3">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : students.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                Không có dữ liệu học sinh
              </div>
            ) : (
              students.map((student, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">ID: {student.idOriginal}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 break-all">
                    <span className="font-medium">Email:</span> {student.email}
                  </div>
                  <button
                    onClick={() => loadStudentDetails(student)}
                    className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                    title="Xem chi tiết học sinh"
                  >
                    Xem chi tiết
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <DataTable<Student>
              columns={studentColumns}
              data={students}
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
