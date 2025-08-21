'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import Layout from '@/components/Layout';
import DataTable from '@/components/DataTable';
import { apiClient, ExamHistory } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ExamsPage() {
  const { accessToken } = useAuth();
  const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [contestType, setContestType] = useState(15);
  const [mockContestId, setMockContestId] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [currentSearch, setCurrentSearch] = useState<{
    contestType: number;
    mockContestId: number;
  } | null>(null);

  useEffect(() => {
    if (accessToken) {
      apiClient.setAuthToken(accessToken);
    }
  }, [accessToken]);

  const loadExamHistory = async (contestType: number, mockContestId: number) => {
    setLoading(true);
    try {
      const result = await apiClient.getExamHistory(contestType, mockContestId, {
        limit: pagination.limit,
        page: pagination.page,
      });
      setExamHistory(result.data);
      setPagination(prev => ({ ...prev, total: result.total }));
      setCurrentSearch({ contestType, mockContestId });
    } catch (error) {
      console.error('Error loading exam history:', error);
      toast.error('Lỗi khi tải lịch sử làm bài');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockContestId) {
      toast.error('Vui lòng nhập ID đề thi');
      return;
    }
    
    setPagination(prev => ({ ...prev, page: 1 }));
    loadExamHistory(contestType, parseInt(mockContestId));
  };

  const handleExport = async () => {
    if (!currentSearch) return;
    
    try {
      const blob = await apiClient.exportExamHistory(
        currentSearch.contestType,
        currentSearch.mockContestId
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `exam_history_${currentSearch.mockContestId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Xuất file CSV thành công');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Lỗi khi xuất file CSV');
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  useEffect(() => {
    if (currentSearch && accessToken) {
      loadExamHistory(currentSearch.contestType, currentSearch.mockContestId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, currentSearch, accessToken]);

  const examColumns = [
    {
      key: 'students.idOriginal',
      label: 'ID Học sinh',
      render: (_: unknown, row: ExamHistory) => row.students?.idOriginal || '-',
    },
    {
      key: 'students.name',
      label: 'Tên học sinh',
      render: (_: unknown, row: ExamHistory) => row.students?.name || '-',
    },
    {
      key: 'students.email',
      label: 'Email',
      render: (_: unknown, row: ExamHistory) => row.students?.email || '-',
    },
    {
      key: 'idMockContest',
      label: 'ID Đề thi',
    },
    {
      key: 'mockcontests.name',
      label: 'Tên đề thi',
      render: (_: unknown, row: ExamHistory) => row.mockcontests?.name || '-',
    },
    {
      key: 'timeStart',
      label: 'Thời gian bắt đầu',
      render: (value: unknown) => new Date(value as string).toLocaleString('vi-VN'),
    },
    {
      key: 'timeFinish',
      label: 'Thời gian nộp',
      render: (value: unknown) => new Date(value as string).toLocaleString('vi-VN'),
    },
    {
      key: 'scoreMockContest',
      label: 'Điểm số',
      render: (value: unknown) => (
        <span className="font-semibold">{value as number}</span>
      ),
    },
  ];

  const contestTypes = [
    { value: 15, label: 'TN THPT' },
    { value: 1, label: 'HSA' },
    { value: 2, label: 'TSA' },
    // Add more contest types as needed
  ];

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tra cứu đề thi</h1>
          <p className="mt-1 sm:mt-2 text-sm text-gray-600">
            Tra cứu lịch sử làm bài theo ID đề thi và loại cuộc thi
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-2 sm:gap-4">
              <div>
                <label htmlFor="contestType" className="block text-sm font-medium text-gray-700 mb-2">
                  Loại cuộc thi
                </label>
                <select
                  id="contestType"
                  value={contestType}
                  onChange={(e) => setContestType(parseInt(e.target.value))}
                  className="block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm"
                >
                  {contestTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="mockContestId" className="block text-sm font-medium text-gray-700 mb-2">
                  ID Đề thi
                </label>
                <input
                  type="number"
                  id="mockContestId"
                  value={mockContestId}
                  onChange={(e) => setMockContestId(e.target.value)}
                  className="block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm"
                  placeholder="Nhập ID đề thi..."
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-center sm:justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 sm:px-4 sm:py-2 border border-transparent text-base sm:text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang tìm...
                  </>
                ) : (
                  'Tra cứu'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Search Results Info */}
        {currentSearch && (
          <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Kết quả tra cứu
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white p-3 rounded-md">
                <span className="font-medium text-blue-700 block sm:inline">Loại cuộc thi:</span>
                <span className="text-gray-900 sm:ml-1">
                  {contestTypes.find(t => t.value === currentSearch.contestType)?.label}
                </span>
              </div>
              <div className="bg-white p-3 rounded-md">
                <span className="font-medium text-blue-700 block sm:inline">ID Đề thi:</span>
                <span className="text-gray-900 sm:ml-1">{currentSearch.mockContestId}</span>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        {examHistory.length > 0 && (
          <DataTable<ExamHistory>
            columns={examColumns}
            data={examHistory}
            loading={loading}
            pagination={{
              ...pagination,
              onPageChange: handlePageChange,
            }}
            onExport={handleExport}
            exportLabel="Xuất CSV"
          />
        )}
      </div>
    </Layout>
  );
}
