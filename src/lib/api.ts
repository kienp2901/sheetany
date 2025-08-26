// API client for HOCMAI EMS

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiResponse<T> {
  status: boolean;
  data: T;
  total?: number;
  token?: string;
}

interface Student {
  idStudent: string;
  idOriginal: string;
  email: string;
  name: string;
}

interface Product {
  name: string;
  idProduct: number;
}

interface StudentProduct {
  timeFinish: string;
  timeStart: string;
  idPackage: number;
  idProduct: number;
  idHistoryPackage: number;
  product_name: string;
  list_active_source_ids: string[];
}

interface StudentHistory {
  idMockContest: number;
  timeStart: string;
  timeFinish: string;
  idHistoryContest: string;
  mockcontests: {
    name: string;
    contest_type: number;
    idMockContest: number;
  };
  products: {
    name: string;
    idProduct: number;
  };
  scoreMockContest: number;
}

interface StudentByProduct {
  timeFinish: string;
  timeStart: string;
  idProduct: number;
  name: string;
  status: string;
  idOriginal: string;
  email: string;
  product_name: string;
}

interface ExamHistory {
  idMockContest: number;
  timeStart: string;
  timeFinish: string;
  idHistoryContest: string;
  students: {
    email: string;
    idOriginal: string;
    name: string;
  };
  mockcontests: {
    name: string;
    contest_type: number;
    idMockContest: number;
  };
  scoreMockContest: number;
}

interface GroupedContestType {
  title: string;
  values: number[];
}

interface Admin {
  email: string;
  idAdminHocmaiManager: number;
  firstName?: string;
  lastName?: string;
}

class ApiClient {
  private authToken: string | null = null;

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async loginGoogle(token: string): Promise<{ token: string }> {
    const response = await this.makeRequest<unknown>(
      '/hocmaiadmin/adminHocmaiManager/loginGoogle',
      {
        method: 'POST',
        body: JSON.stringify({ token }),
      }
    );

    if (!response.token) {
      throw new Error('Login failed: token not found');
    }

    return { token: response.token };
  }

  // Admin Management
  async getAdmins(): Promise<Admin[]> {
    const response = await this.makeRequest<Admin[]>(
      '/hocmaiadmin/adminHocmaiManager'
    );
    return response.data;
  }

  async addAdmin(email: string): Promise<Admin> {
    const response = await this.makeRequest<Admin>(
      '/hocmaiadmin/adminHocmaiManager',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    );
    return response.data;
  }

  async updateAdmin(
    id: number,
    data: { email?: string; firstName?: string; lastName?: string }
  ): Promise<Admin> {
    const response = await this.makeRequest<Admin>(
      `/hocmaiadmin/adminHocmaiManager/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
    return response.data;
  }

  async deleteAdmin(id: number): Promise<void> {
    await this.makeRequest(`/hocmaiadmin/adminHocmaiManager/${id}`, {
      method: 'DELETE',
    });
  }

  // Student Management
  async getStudents(params?: {
    idOriginal?: string;
    email?: string;
    limit?: number;
    page?: number;
  }): Promise<{ data: Student[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.idOriginal) queryParams.append('idOriginal', params.idOriginal);
    if (params?.email) queryParams.append('email', params.email);
    queryParams.append('limit', (params?.limit || 10).toString());
    queryParams.append('page', (params?.page || 1).toString());

    const response = await this.makeRequest<Student[]>(
      `/hocmaiadmin/api/listStudent?${queryParams.toString()}`
    );
    return { data: response.data, total: response.total || 0 };
  }

  async getStudentProducts(
    idOriginal: string,
    params?: { limit?: number; page?: number }
  ): Promise<{ data: StudentProduct[]; total: number }> {
    const queryParams = new URLSearchParams();
    queryParams.append('idOriginal', idOriginal);
    queryParams.append('limit', (params?.limit || 10).toString());
    queryParams.append('page', (params?.page || 1).toString());

    const response = await this.makeRequest<StudentProduct[]>(
      `/hocmaiadmin/student/productByStudent?${queryParams.toString()}`
    );
    return { data: response.data, total: response.total || 0 };
  }

  async getStudentHistory(
    idOriginal: string,
    type: 0 | 1,
    params?: { limit?: number; page?: number }
  ): Promise<{ data: StudentHistory[]; total: number }> {
    const queryParams = new URLSearchParams();
    queryParams.append('idOriginal', idOriginal);
    queryParams.append('type', type.toString());
    queryParams.append('limit', (params?.limit || 10).toString());
    queryParams.append('page', (params?.page || 1).toString());

    const response = await this.makeRequest<StudentHistory[]>(
      `/hocmaiadmin/student/historyByStudent?${queryParams.toString()}`
    );
    return { data: response.data, total: response.total || 0 };
  }

  // Product Management
  async getProducts(params?: {
    limit?: number;
    page?: number;
  }): Promise<{ data: Product[]; total: number }> {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', (params?.limit || 10).toString());
    queryParams.append('page', (params?.page || 1).toString());

    const response = await this.makeRequest<Product[]>(
      `/hocmaiadmin/student/listProduct?${queryParams.toString()}`
    );
    return { data: response.data, total: response.total || 0 };
  }

  async getStudentsByProduct(
    idProduct: number,
    params?: {
      idOriginal?: string;
      email?: string;
      limit?: number;
      page?: number;
    }
  ): Promise<{ data: StudentByProduct[]; total: number }> {
    const queryParams = new URLSearchParams();
    queryParams.append('idProduct', idProduct.toString());
    if (params?.idOriginal) queryParams.append('idOriginal', params.idOriginal);
    if (params?.email) queryParams.append('email', params.email);
    queryParams.append('limit', (params?.limit || 10).toString());
    queryParams.append('page', (params?.page || 1).toString());

    const response = await this.makeRequest<StudentByProduct[]>(
      `/hocmaiadmin/student/studentByProduct?${queryParams.toString()}`
    );
    return { data: response.data, total: response.total || 0 };
  }

  async exportStudentsByProduct(
    idProduct: number,
    params?: { idOriginal?: string; email?: string }
  ): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.append('idProduct', idProduct.toString());
    if (params?.idOriginal) queryParams.append('idOriginal', params.idOriginal);
    if (params?.email) queryParams.append('email', params.email);

    const url = `${API_BASE_URL}/hocmaiadmin/student/studentByProduct/csv?${queryParams.toString()}`;
    const response = await fetch(url, {
      headers: {
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Exam Management
  async getExamHistory(
    contestType?: number | number[],
    idMockContest?: number,
    params?: { limit?: number; page?: number }
  ): Promise<{ data: ExamHistory[]; total: number }> {
    const queryParams = new URLSearchParams();

    // Xử lý contestType - có thể là số đơn hoặc mảng số
    if (contestType) {
      if (Array.isArray(contestType)) {
        // Nếu là mảng, join các giá trị bằng dấu phẩy
        queryParams.append('contest_type', contestType.join(','));
      } else if (contestType > 0) {
        // Nếu là số đơn và > 0
        queryParams.append('contest_type', contestType.toString());
      }
    }

    if (idMockContest && idMockContest > 0) {
      queryParams.append('idMockContest', idMockContest.toString());
    }

    queryParams.append('limit', (params?.limit || 10).toString());
    queryParams.append('page', (params?.page || 1).toString());

    const response = await this.makeRequest<ExamHistory[]>(
      `/hocmaiadmin/student/historyByMockContest?${queryParams.toString()}`
    );
    return { data: response.data, total: response.total || 0 };
  }

  async exportExamHistory(
    contestType: number | number[],
    idMockContest: number
  ): Promise<Blob> {
    const queryParams = new URLSearchParams();

    // Xử lý contestType cho export
    if (Array.isArray(contestType)) {
      queryParams.append('contest_type', contestType.join(','));
    } else {
      queryParams.append('contest_type', contestType.toString());
    }

    queryParams.append('idMockContest', idMockContest.toString());

    const url = `${API_BASE_URL}/hocmaiadmin/student/historyByMockContest/csv?${queryParams.toString()}`;
    const response = await fetch(url, {
      headers: {
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }
}

export const apiClient = new ApiClient();

export type {
  Admin,
  ApiResponse,
  ExamHistory,
  GroupedContestType,
  Product,
  Student,
  StudentByProduct,
  StudentHistory,
  StudentProduct,
};
