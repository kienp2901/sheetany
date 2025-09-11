'use client';

import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useState } from 'react';

interface Column<T = unknown> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T = unknown> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
  };
  onExport?: () => void;
  exportLabel?: string;
}

export default function DataTable<T = unknown>({
  columns,
  data,
  loading,
  pagination,
  onExport,
  exportLabel = 'Xuất CSV',
}: DataTableProps<T>) {
  const [pageInput, setPageInput] = useState('');
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.limit)
    : 1;

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput);
    if (page >= 1 && page <= totalPages && pagination) {
      pagination.onPageChange(page);
      setPageInput('');
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value);
    if (pagination?.onLimitChange) {
      pagination.onLimitChange(newLimit);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      {/* Header with export button */}
      {onExport && (
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
            <h3 className="text-lg font-medium text-gray-900">Kết quả</h3>
            <button
              onClick={onExport}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="w-4 h-4 mr-2" />
              {exportLabel}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 sm:px-6 py-12 text-center text-sm text-gray-500"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span>Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 sm:px-6 py-12 text-center text-sm text-gray-500"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-3 sm:px-6 py-4 text-sm text-gray-900"
                      style={{ minWidth: '120px' }}
                    >
                      <div
                        className="truncate max-w-xs sm:max-w-none"
                        title={
                          column.render
                            ? String(
                                column.render(
                                  (row as Record<string, unknown>)[column.key],
                                  row
                                )
                              )
                            : String(
                                (row as Record<string, unknown>)[column.key] ??
                                  ''
                              )
                        }
                      >
                        {column.render
                          ? column.render(
                              (row as Record<string, unknown>)[column.key],
                              row
                            )
                          : String(
                              (row as Record<string, unknown>)[column.key] ?? ''
                            )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          {/* Mobile Pagination */}
          <div className="flex flex-col space-y-3 sm:hidden">
            {/* Page info and limit selector */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700">
                Trang {pagination.page} / {totalPages}
              </p>
              {pagination.onLimitChange && (
                <div className="flex items-center space-x-2">
                  <label className="text-xs text-gray-700">Hiển thị:</label>
                  <select
                    value={pagination.limit}
                    onChange={handleLimitChange}
                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    suppressHydrationWarning
                  >
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              )}
            </div>

            {/* Page input and navigation */}
            <div className="flex items-center space-x-2">
              <form
                onSubmit={handlePageInputSubmit}
                className="flex items-center space-x-2"
              >
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInput}
                  onChange={handlePageInputChange}
                  placeholder="Trang"
                  className="w-16 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  suppressHydrationWarning
                />
                <button
                  type="submit"
                  className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  suppressHydrationWarning
                >
                  Đi
                </button>
              </form>

              <div className="flex space-x-1">
                <button
                  onClick={() => pagination.onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  title="Trang trước"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <button
                  onClick={() => pagination.onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= totalPages}
                  className="relative inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  title="Trang sau"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Pagination */}
          <div className="hidden sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-700">
                Hiển thị{' '}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{' '}
                đến{' '}
                <span className="font-medium">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}
                </span>{' '}
                trong tổng số{' '}
                <span className="font-medium">{pagination.total}</span> kết quả
              </p>

              {pagination.onLimitChange && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-700">Hiển thị:</label>
                  <select
                    value={pagination.limit}
                    onChange={handleLimitChange}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    suppressHydrationWarning
                  >
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Page input */}
              <form
                onSubmit={handlePageInputSubmit}
                className="flex items-center space-x-2"
              >
                <span className="text-sm text-gray-700">Đi đến trang:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInput}
                  onChange={handlePageInputChange}
                  placeholder="Trang"
                  className="w-20 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  suppressHydrationWarning
                />
                <button
                  type="submit"
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  suppressHydrationWarning
                >
                  Đi
                </button>
              </form>

              {/* Navigation buttons */}
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => pagination.onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  title="Trang trước"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  {pagination.page} / {totalPages}
                </span>
                <button
                  onClick={() => pagination.onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  title="Trang sau"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
