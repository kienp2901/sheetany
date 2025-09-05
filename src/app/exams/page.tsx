'use client';

import DataTable from '@/components/DataTable';
import Layout from '@/components/Layout';
import { apiClient, ExamHistory, GroupedContestType } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function ExamsPage() {
  const { accessToken } = useAuth();
  const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContestType, setSelectedContestType] = useState<string>(''); // Sử dụng string để lưu key của contest type
  const [mockContestId, setMockContestId] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [currentSearch, setCurrentSearch] = useState<{
    contestType: string;
    contestTypeValues: number[];
    mockContestId: number;
  } | null>(null);

  // Track if initial load has been done
  const initialLoadDone = useRef(false);

  // Gom nhóm contest types theo tên cuộc thi
  const groupedContestTypes: GroupedContestType[] = [
    { title: 'Select contest type', values: [] },
    { title: 'HSA exam', values: [0, 10, 17, 18] },
    { title: 'TSA exam', values: [1, 4, 9] },
    { title: 'IELTS practice', values: [2] },
    { title: 'IELTS exam', values: [3, 27] },
    { title: 'HMO ĐGNL', values: [5] },
    { title: 'Topclass', values: [6] },
    { title: 'V-ACT practice', values: [7] },
    { title: 'V-ACT exam', values: [8] },
    { title: 'Testsite Part', values: [11] },
    { title: 'Testsite Slide', values: [12] },
    { title: 'HMO Thiên Long', values: [13] },
    { title: 'Speakwell testsite', values: [14] },
    { title: 'PEN 2025 exam', values: [15] },
    { title: 'PEN 2025 practice', values: [16] },
    { title: 'Introduction Mock Tests 1&2 exam', values: [19] },
    {
      title:
        'Introduction Mock Test 3, Final Test; Foundation Mock Tests 1&2 exam',
      values: [21],
    },
    { title: 'Foundation Mock Test 3, Final Test exam', values: [23] },
    { title: 'Preparation Mock Tests 1 và 2 exam', values: [25] },
    { title: 'Exercise', values: [29] },
    { title: 'ICC Entry Test exam', values: [30, 31] },
  ];

  useEffect(() => {
    if (accessToken) {
      apiClient.setAuthToken(accessToken);
    }
  }, [accessToken]);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setIsInitialLoad(true);
    try {
      const result = await apiClient.getExamHistory(undefined, undefined, {
        limit: pagination.limit,
        page: pagination.page,
      });
      setExamHistory(result.data);
      setPagination((prev) => ({ ...prev, total: result.total }));
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Lỗi khi tải dữ liệu ban đầu');
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [pagination.limit, pagination.page]);

  useEffect(() => {
    if (accessToken && !initialLoadDone.current) {
      loadInitialData();
      initialLoadDone.current = true;
    }
  }, [accessToken, loadInitialData]);

  const loadExamHistory = async (
    contestTypeKey?: string,
    mockContestId?: number
  ) => {
    setLoading(true);
    try {
      let contestTypeValues: number[] | undefined;

      if (contestTypeKey && contestTypeKey !== '') {
        const selectedType = groupedContestTypes.find(
          (type) => type.title === contestTypeKey
        );
        contestTypeValues = selectedType?.values;
      }

      const result = await apiClient.getExamHistory(
        contestTypeValues,
        mockContestId,
        {
          limit: pagination.limit,
          page: 1, // Reset to first page when searching
        }
      );
      setExamHistory(result.data);
      setPagination((prev) => ({ ...prev, page: 1, total: result.total }));
      setCurrentSearch({
        contestType: contestTypeKey || '',
        contestTypeValues: contestTypeValues || [],
        mockContestId: mockContestId || 0,
      });
    } catch (error) {
      console.error('Error loading exam history:', error);
      toast.error('Lỗi khi tải lịch sử làm bài');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedContestType === '' && !mockContestId) {
      toast.error('Vui lòng chọn loại cuộc thi hoặc nhập ID đề thi');
      return;
    }

    loadExamHistory(
      selectedContestType,
      mockContestId ? parseInt(mockContestId) : undefined
    );
  };

  const handleExport = async () => {
    try {
      let contestTypeValues: number[] | undefined;
      let mockContestIdParam = currentSearch?.mockContestId;

      // nếu chưa search => export toàn bộ dữ liệu (không filter)
      if (!currentSearch) {
        contestTypeValues = undefined;
        mockContestIdParam = 0;
      } else {
        contestTypeValues = currentSearch.contestTypeValues;
      }

      const blob = await apiClient.exportExamHistory(
        contestTypeValues || 0,
        mockContestIdParam || 0
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = currentSearch
        ? `exam_history_${mockContestIdParam}.csv`
        : `exam_history_all.csv`;
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
    setPagination((prev) => ({ ...prev, page }));
    // Load data for the new page
    if (currentSearch) {
      loadExamHistory(currentSearch.contestType, currentSearch.mockContestId);
    } else {
      loadInitialData();
    }
  };

  const handleClearSearch = () => {
    setCurrentSearch(null);
    setSelectedContestType('');
    setMockContestId('');
    setPagination((prev) => ({ ...prev, page: 1 }));
    // Load initial data again
    loadInitialData();
  };

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
      key: 'contest_type',
      label: 'Loại cuộc thi',
      render: (_: unknown, row: ExamHistory) => {
        const contestType = row.mockcontests?.contest_type;
        if (contestType !== undefined) {
          const contestTypeInfo = groupedContestTypes.find((type) =>
            type.values.includes(contestType)
          );
          return contestTypeInfo
            ? contestTypeInfo.title
            : `Unknown (${contestType})`;
        }
        return '-';
      },
    },
    {
      key: 'timeStart',
      label: 'Thời gian bắt đầu',
      render: (value: unknown) =>
        new Date(value as string).toLocaleString('vi-VN'),
    },
    {
      key: 'timeFinish',
      label: 'Thời gian nộp',
      render: (value: unknown) =>
        new Date(value as string).toLocaleString('vi-VN'),
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
    { value: '', label: 'Select contest type' }, // new option
    ...groupedContestTypes.slice(1).map((type) => ({
      value: type.title,
      label: type.title,
    })),
  ];

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Page Header */}
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Tra cứu đề thi
          </h1>
          <p className="mt-1 sm:mt-2 text-sm text-gray-600">
            Tra cứu lịch sử làm bài theo ID đề thi và loại cuộc thi
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-2 sm:gap-4">
              <div>
                <label
                  htmlFor="contestType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Loại cuộc thi
                </label>
                <select
                  id="contestType"
                  value={selectedContestType}
                  onChange={(e) => setSelectedContestType(e.target.value)}
                  className="block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm text-gray-900 bg-white"
                >
                  {contestTypes.map((type) => (
                    <option
                      key={type.value}
                      value={type.value}
                      className="text-gray-900 bg-white"
                    >
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="mockContestId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ID Đề thi
                </label>
                <input
                  type="number"
                  id="mockContestId"
                  value={mockContestId}
                  onChange={(e) => setMockContestId(e.target.value)}
                  className="block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-sm text-gray-900 bg-white"
                  placeholder="Nhập ID đề thi..."
                />
              </div>
            </div>

            <div className="flex justify-center sm:justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 sm:px-4 sm:py-2 border border-transparent text-base sm:text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
                title="Tra cứu lịch sử làm bài"
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
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-semibold text-blue-900">
                Kết quả tra cứu
              </h2>
              <button
                onClick={handleClearSearch}
                className="px-3 py-1 text-sm text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors cursor-pointer"
                title="Xóa tìm kiếm"
              >
                Xóa tìm kiếm
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white p-3 rounded-md">
                <span className="font-medium text-blue-700 block sm:inline">
                  Loại cuộc thi:
                </span>
                <span className="text-gray-900 sm:ml-1">
                  {currentSearch.contestType}
                  {currentSearch.contestTypeValues.length > 0 && (
                    <span className="text-sm text-gray-500 block sm:inline sm:ml-2">
                      (IDs: {currentSearch.contestTypeValues.join(', ')})
                    </span>
                  )}
                </span>
              </div>
              <div className="bg-white p-3 rounded-md">
                <span className="font-medium text-blue-700 block sm:inline">
                  ID Đề thi:
                </span>
                <span className="text-gray-900 sm:ml-1">
                  {currentSearch.mockContestId}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        {examHistory.length > 0 || isInitialLoad ? (
          <DataTable<ExamHistory>
            columns={examColumns}
            data={examHistory}
            loading={loading}
            pagination={{
              ...pagination,
              onPageChange: handlePageChange,
            }}
            onExport={currentSearch ? handleExport : undefined}
            exportLabel="Xuất CSV"
          />
        ) : (
          !loading && (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-gray-500">
                {currentSearch
                  ? 'Không tìm thấy kết quả nào cho tìm kiếm này'
                  : 'Chưa có dữ liệu để hiển thị'}
              </p>
            </div>
          )
        )}
      </div>
    </Layout>
  );
}
