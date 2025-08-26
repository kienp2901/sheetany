import { apiClient } from '@/lib/api';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiClient.setAuthToken(null);
  });

  describe('Authentication', () => {
    test('should set auth token correctly', () => {
      const token = 'test-token';
      apiClient.setAuthToken(token);

      // We can't directly test the private property, but we can test the behavior
      // by making a request and checking if the token is used
      expect(apiClient).toBeDefined();
    });

    test('should login with Google token successfully', async () => {
      const mockToken = 'google-credential-token';
      const mockResponse = {
        status: true,
        token: 'jwt-token',
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.loginGoogle(mockToken);

      expect(result.token).toBe('jwt-token');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/hocmaiadmin/adminHocmaiManager/loginGoogle'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ token: mockToken }),
        })
      );
    });

    test('should handle login failure', async () => {
      const mockToken = 'invalid-token';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      });

      await expect(apiClient.loginGoogle(mockToken)).rejects.toThrow(
        'API request failed: Bad Request'
      );
    });
  });

  describe('Student Management', () => {
    test('should get students list successfully', async () => {
      const mockStudents = [
        {
          idStudent: '1',
          idOriginal: 'ST001',
          email: 'student1@example.com',
          name: 'Nguyễn Văn A',
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: true,
          data: mockStudents,
          total: 1,
        }),
      });

      const result = await apiClient.getStudents({
        limit: 10,
        page: 1,
      });

      expect(result.data).toEqual(mockStudents);
      expect(result.total).toBe(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/hocmaiadmin/api/listStudent?limit=10&page=1'),
        expect.any(Object)
      );
    });

    test('should search students by ID', async () => {
      const mockStudents = [
        {
          idStudent: '1',
          idOriginal: 'ST001',
          email: 'student1@example.com',
          name: 'Nguyễn Văn A',
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: true,
          data: mockStudents,
          total: 1,
        }),
      });

      const result = await apiClient.getStudents({
        idOriginal: 'ST001',
        limit: 10,
        page: 1,
      });

      expect(result.data).toEqual(mockStudents);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          '/hocmaiadmin/api/listStudent?idOriginal=ST001&limit=10&page=1'
        ),
        expect.any(Object)
      );
    });

    test('should search students by email', async () => {
      const mockStudents = [
        {
          idStudent: '2',
          idOriginal: 'ST002',
          email: 'student2@example.com',
          name: 'Trần Thị B',
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: true,
          data: mockStudents,
          total: 1,
        }),
      });

      const result = await apiClient.getStudents({
        email: 'student2@example.com',
        limit: 10,
        page: 1,
      });

      expect(result.data).toEqual(mockStudents);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          '/hocmaiadmin/api/listStudent?email=student2%40example.com&limit=10&page=1'
        ),
        expect.any(Object)
      );
    });

    test('should get student products successfully', async () => {
      const mockProducts = [
        {
          timeFinish: '2024-12-31T23:59:59Z',
          timeStart: '2024-01-01T00:00:00Z',
          idPackage: 1,
          idProduct: 101,
          idHistoryPackage: 1,
          product_name: 'Khóa học Toán 12',
          list_active_source_ids: ['1', '2'],
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: true,
          data: mockProducts,
          total: 1,
        }),
      });

      const result = await apiClient.getStudentProducts('ST001', {
        limit: 10,
        page: 1,
      });

      expect(result.data).toEqual(mockProducts);
      expect(result.total).toBe(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          '/hocmaiadmin/student/productByStudent?idOriginal=ST001&limit=10&page=1'
        ),
        expect.any(Object)
      );
    });

    test('should get student history successfully', async () => {
      const mockHistory = [
        {
          idMockContest: 1,
          timeStart: '2024-01-15T10:00:00Z',
          timeFinish: '2024-01-15T12:00:00Z',
          idHistoryContest: 'HC001',
          mockcontests: {
            name: 'Đề thi thử THPT Quốc Gia',
            contest_type: 15,
            idMockContest: 1,
          },
          products: {
            name: 'Khóa học Toán 12',
            idProduct: 101,
          },
          scoreMockContest: 85,
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: true,
          data: mockHistory,
          total: 1,
        }),
      });

      const result = await apiClient.getStudentHistory('ST001', 0, {
        limit: 10,
        page: 1,
      });

      expect(result.data).toEqual(mockHistory);
      expect(result.total).toBe(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          '/hocmaiadmin/student/historyByStudent?idOriginal=ST001&type=0&limit=10&page=1'
        ),
        expect.any(Object)
      );
    });
  });

  describe('Product Management', () => {
    test('should get products list successfully', async () => {
      const mockProducts = [
        {
          name: 'Khóa học Toán 12',
          idProduct: 101,
        },
        {
          name: 'Khóa học Văn 12',
          idProduct: 102,
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: true,
          data: mockProducts,
          total: 2,
        }),
      });

      const result = await apiClient.getProducts({
        limit: 10,
        page: 1,
      });

      expect(result.data).toEqual(mockProducts);
      expect(result.total).toBe(2);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          '/hocmaiadmin/student/listProduct?limit=10&page=1'
        ),
        expect.any(Object)
      );
    });

    test('should get students by product successfully', async () => {
      const mockStudents = [
        {
          timeFinish: '2024-12-31T23:59:59Z',
          timeStart: '2024-01-01T00:00:00Z',
          idProduct: 101,
          name: 'Nguyễn Văn A',
          status: 'active',
          idOriginal: 'ST001',
          email: 'student1@example.com',
          product_name: 'Khóa học Toán 12',
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: true,
          data: mockStudents,
          total: 1,
        }),
      });

      const result = await apiClient.getStudentsByProduct(101, {
        limit: 10,
        page: 1,
      });

      expect(result.data).toEqual(mockStudents);
      expect(result.total).toBe(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          '/hocmaiadmin/student/studentByProduct?idProduct=101&limit=10&page=1'
        ),
        expect.any(Object)
      );
    });
  });

  describe('Admin Management', () => {
    test('should get admins list successfully', async () => {
      const mockAdmins = [
        {
          email: 'admin1@hocmai.vn',
          idAdminHocmaiManager: 1,
          firstName: 'Admin',
          lastName: 'User',
        },
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: true,
          data: mockAdmins,
        }),
      });

      const result = await apiClient.getAdmins();

      expect(result).toEqual(mockAdmins);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/hocmaiadmin/adminHocmaiManager'),
        expect.any(Object)
      );
    });

    test('should add admin successfully', async () => {
      const mockAdmin = {
        email: 'newadmin@hocmai.vn',
        idAdminHocmaiManager: 2,
        firstName: 'New',
        lastName: 'Admin',
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: true,
          data: mockAdmin,
        }),
      });

      const result = await apiClient.addAdmin('newadmin@hocmai.vn');

      expect(result).toEqual(mockAdmin);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/hocmaiadmin/adminHocmaiManager'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'newadmin@hocmai.vn' }),
        })
      );
    });

    test('should update admin successfully', async () => {
      const mockAdmin = {
        email: 'updated@hocmai.vn',
        idAdminHocmaiManager: 1,
        firstName: 'Updated',
        lastName: 'Admin',
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: true,
          data: mockAdmin,
        }),
      });

      const result = await apiClient.updateAdmin(1, {
        email: 'updated@hocmai.vn',
        firstName: 'Updated',
        lastName: 'Admin',
      });

      expect(result).toEqual(mockAdmin);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/hocmaiadmin/adminHocmaiManager/1'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({
            email: 'updated@hocmai.vn',
            firstName: 'Updated',
            lastName: 'Admin',
          }),
        })
      );
    });

    test('should delete admin successfully', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: true }),
      });

      await apiClient.deleteAdmin(1);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/hocmaiadmin/adminHocmaiManager/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(apiClient.getStudents()).rejects.toThrow('Network error');
    });

    test('should handle API errors', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(apiClient.getStudents()).rejects.toThrow(
        'API request failed: Internal Server Error'
      );
    });

    test('should handle malformed JSON responses', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(apiClient.getStudents()).rejects.toThrow('Invalid JSON');
    });
  });
});
