'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import DataTable from '@/components/DataTable';
import { apiClient, Student, StudentProduct, StudentHistory } from '@/lib/api';
import toast from 'react-hot-toast';

export default function StudentsPage() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentProducts, setStudentProducts] = useState<StudentProduct[]>([]);
  const [studentHistory, setStudentHistory] = useState<StudentHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    if (session?.accessToken) {
      apiClient.setAuthToken(session.accessToken);
      // Load initial data
      loadStudents();
    }
  }, [session?.accessToken]);  // eslint-disable-line react-hooks/exhaustive-deps

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
    setLoadingProducts(true);
    setLoadingHistory(true);

    try {
      // Load student products
      const productsResult = await apiClient.getStudentProducts(student.idOriginal);
      setStudentProducts(productsResult.data);
      setLoadingProducts(false);

      // Load student history (both types)
      const historyResult = await apiClient.getStudentHistory(student.idOriginal, 0);
      setStudentHistory(historyResult.data);
      setLoadingHistory(false);
    } catch (error) {
      console.error('Error loading student details:', error);
      toast.error('Lỗi khi tải thông tin chi tiết học sinh');
      setLoadingProducts(false);
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
    if (session?.accessToken) {
      loadStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, session?.accessToken]);

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
          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
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
                    className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

        {/* Selected Student Details */}
        {selectedStudent && (
          <div className="space-y-4 sm:space-y-6">
            {/* Student Info Card */}
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200">
              <h2 className="text-lg sm:text-xl font-semibold text-blue-900 mb-3">
                Thông tin học sinh: {selectedStudent.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
                <div className="bg-white p-3 rounded-md">
                  <span className="font-medium text-blue-700 block">ID học sinh:</span>
                  <span className="text-gray-900">{selectedStudent.idOriginal}</span>
                </div>
                <div className="bg-white p-3 rounded-md">
                  <span className="font-medium text-blue-700 block">Email:</span>
                  <span className="text-gray-900 break-all">{selectedStudent.email}</span>
                </div>
                <div className="bg-white p-3 rounded-md sm:col-span-2 lg:col-span-1">
                  <span className="font-medium text-blue-700 block">Họ tên:</span>
                  <span className="text-gray-900">{selectedStudent.name}</span>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Sản phẩm đã đăng ký
              </h3>
              <DataTable<StudentProduct>
                columns={productColumns}
                data={studentProducts}
                loading={loadingProducts}
              />
            </div>

            {/* History Section */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Lịch sử làm bài
              </h3>
              <DataTable<StudentHistory>
                columns={historyColumns}
                data={studentHistory}
                loading={loadingHistory}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
