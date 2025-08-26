import { Button } from '@/components/Button';
import DataTable from '@/components/DataTable';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import SearchBar from '@/components/SearchBar';
import { fireEvent, render, screen } from '@testing-library/react';

// Mock the auth context
const mockUseAuth = {
  user: {
    email: 'kienpn@ctv.hocmai.vn',
    name: 'Admin User',
    picture: 'https://example.com/avatar.jpg',
  },
  logout: jest.fn(),
};

jest.mock('@/lib/auth-context', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/students',
}));

describe('Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Layout Component', () => {
    test('should render layout with user information', () => {
      render(
        <Layout>
          <div>Test content</div>
        </Layout>
      );

      expect(screen.getByText('HOCMAI EMS Admin')).toBeVisible();

      // Check that user email appears twice (mobile + desktop)
      const emailElements = screen.getAllByText('kienpn@ctv.hocmai.vn');
      expect(emailElements).toHaveLength(2);
      emailElements.forEach((email) => expect(email).toBeVisible());

      // Check that user name appears twice (mobile + desktop)
      const nameElements = screen.getAllByText('Admin User');
      expect(nameElements).toHaveLength(2);
      nameElements.forEach((name) => expect(name).toBeVisible());

      expect(screen.getByText('Test content')).toBeVisible();
    });

    test('should display navigation menu items', () => {
      render(
        <Layout>
          <div>Test content</div>
        </Layout>
      );

      // Check that all navigation items are visible (both mobile and desktop)
      const studentsLinks = screen.getAllByText('Tra cứu học sinh');
      const productsLinks = screen.getAllByText('Tra cứu sản phẩm');
      const examsLinks = screen.getAllByText('Tra cứu đề thi');
      const adminLinks = screen.getAllByText('Quản trị Admin');

      // Each navigation item should appear twice (mobile + desktop)
      expect(studentsLinks).toHaveLength(2);
      expect(productsLinks).toHaveLength(2);
      expect(examsLinks).toHaveLength(2);
      expect(adminLinks).toHaveLength(2);

      // Verify all are visible
      studentsLinks.forEach((link) => expect(link).toBeVisible());
      productsLinks.forEach((link) => expect(link).toBeVisible());
      examsLinks.forEach((link) => expect(link).toBeVisible());
      adminLinks.forEach((link) => expect(link).toBeVisible());
    });

    test('should handle logout when logout button is clicked', () => {
      render(
        <Layout>
          <div>Test content</div>
        </Layout>
      );

      const logoutButtons = screen.getAllByRole('button', {
        name: 'Đăng xuất',
      });
      expect(logoutButtons).toHaveLength(2); // One for mobile, one for desktop

      // Click the first logout button (mobile)
      fireEvent.click(logoutButtons[0]);

      expect(mockUseAuth.logout).toHaveBeenCalled();
    });

    test('should show active navigation state', () => {
      render(
        <Layout>
          <div>Test content</div>
        </Layout>
      );

      // Find the navigation links by looking for the specific text in the navigation area
      const studentsLinks = screen.getAllByRole('link', {
        name: /Tra cứu học sinh/,
      });

      // Both mobile and desktop navigation should have the active state
      expect(studentsLinks).toHaveLength(2);

      studentsLinks.forEach((link) => {
        expect(link).toHaveClass(/bg-indigo-50/);
        expect(link).toHaveClass(/text-indigo-700/);
      });
    });
  });

  describe('SearchBar Component', () => {
    const mockOnSearch = jest.fn();

    test('should render search input and button', () => {
      render(
        <SearchBar
          placeholder="Test placeholder"
          onSearch={mockOnSearch}
          loading={false}
        />
      );

      // Check that both mobile and desktop inputs exist
      const inputs = screen.getAllByPlaceholderText('Test placeholder');
      expect(inputs).toHaveLength(2);

      expect(
        screen.getByRole('button', { name: 'Tìm kiếm (Mobile)' })
      ).toBeVisible();
    });

    test('should call onSearch when form is submitted', () => {
      render(
        <SearchBar
          placeholder="Test placeholder"
          onSearch={mockOnSearch}
          loading={false}
        />
      );

      // Use the mobile input for testing
      const searchInputs = screen.getAllByPlaceholderText('Test placeholder');
      const searchInput = searchInputs[0]; // Mobile input
      const searchButton = screen.getByRole('button', {
        name: 'Tìm kiếm (Mobile)',
      });

      fireEvent.change(searchInput, { target: { value: 'test query' } });
      fireEvent.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    });

    test('should call onSearch when Enter key is pressed', () => {
      render(
        <SearchBar
          placeholder="Test placeholder"
          onSearch={mockOnSearch}
          loading={false}
        />
      );

      // Use the mobile input for testing
      const searchInputs = screen.getAllByPlaceholderText('Test placeholder');
      const searchInput = searchInputs[0]; // Mobile input
      fireEvent.change(searchInput, { target: { value: 'test query' } });
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

      expect(mockOnSearch).toHaveBeenCalledWith('test query');
    });

    test('should show loading state when loading is true', () => {
      render(
        <SearchBar
          placeholder="Test placeholder"
          onSearch={mockOnSearch}
          loading={true}
        />
      );

      // Check that loading text appears in both buttons
      const loadingButtons = screen.getAllByText('Đang tìm...');
      expect(loadingButtons).toHaveLength(2);

      // Check that both buttons are disabled
      expect(loadingButtons[0]).toBeDisabled();
      expect(loadingButtons[1]).toBeDisabled();

      // Check that both inputs are disabled
      const inputs = screen.getAllByPlaceholderText('Test placeholder');
      expect(inputs[0]).toBeDisabled();
      expect(inputs[1]).toBeDisabled();
    });

    test('should handle empty search query', () => {
      render(
        <SearchBar
          placeholder="Test placeholder"
          onSearch={mockOnSearch}
          loading={false}
        />
      );

      const searchButton = screen.getByRole('button', {
        name: 'Tìm kiếm (Mobile)',
      });
      fireEvent.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith('');
    });
  });

  describe('DataTable Component', () => {
    interface MockDataItem {
      id: number;
      name: string;
      email: string;
    }

    const mockColumns = [
      { key: 'name', label: 'Tên' },
      { key: 'email', label: 'Email' },
      {
        key: 'actions',
        label: 'Thao tác',
        render: (_: unknown, row: MockDataItem) => (
          <button data-testid={`action-${row.id}`}>Action {row.id}</button>
        ),
      },
    ];

    const mockData: MockDataItem[] = [
      { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com' },
      { id: 2, name: 'Trần Thị B', email: 'b@example.com' },
    ];

    test('should render table with data', () => {
      render(
        <DataTable columns={mockColumns} data={mockData} loading={false} />
      );

      expect(screen.getByText('Tên')).toBeVisible();
      expect(screen.getByText('Email')).toBeVisible();
      expect(screen.getByText('Thao tác')).toBeVisible();
      expect(screen.getByText('Nguyễn Văn A')).toBeVisible();
      expect(screen.getByText('a@example.com')).toBeVisible();
      expect(screen.getByText('Trần Thị B')).toBeVisible();
      expect(screen.getByText('b@example.com')).toBeVisible();
    });

    test('should render custom cell content using render function', () => {
      render(
        <DataTable columns={mockColumns} data={mockData} loading={false} />
      );

      expect(screen.getByTestId('action-1')).toBeVisible();
      expect(screen.getByTestId('action-2')).toBeVisible();
      expect(screen.getByText('Action 1')).toBeVisible();
      expect(screen.getByText('Action 2')).toBeVisible();
    });

    test('should show loading state', () => {
      render(
        <DataTable columns={mockColumns} data={mockData} loading={true} />
      );

      expect(screen.getByRole('table')).toBeVisible();
      // Look for loading spinner by class instead of test-id
      expect(screen.getByText('Đang tải...')).toBeVisible();
    });

    test('should show empty state when no data', () => {
      render(<DataTable columns={mockColumns} data={[]} loading={false} />);

      expect(screen.getByText('Không có dữ liệu')).toBeVisible();
    });

    test('should render pagination when provided', () => {
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 25,
        onPageChange: jest.fn(),
      };

      render(
        <DataTable
          columns={mockColumns}
          data={mockData}
          loading={false}
          pagination={mockPagination}
        />
      );

      expect(screen.getByText('Trang 1 / 3')).toBeVisible();
      // Check for pagination info text that spans multiple elements
      expect(screen.getByText(/Hiển thị/)).toBeVisible();
      expect(screen.getByText(/đến/)).toBeVisible();
      expect(screen.getByText(/trong tổng số/)).toBeVisible();
      expect(screen.getByText(/kết quả/)).toBeVisible();

      // Check for specific numbers in the pagination info
      const paginationInfo = screen.getByText(
        /Hiển thị.*đến.*trong tổng số.*kết quả/
      );
      expect(paginationInfo).toBeVisible();
      expect(paginationInfo.textContent).toContain('1');
      expect(paginationInfo.textContent).toContain('10');
      expect(paginationInfo.textContent).toContain('25');
    });

    test('should handle pagination navigation', () => {
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 25,
        onPageChange: jest.fn(),
      };

      render(
        <DataTable
          columns={mockColumns}
          data={mockData}
          loading={false}
          pagination={mockPagination}
        />
      );

      const nextButton = screen.getByRole('button', { name: 'Sau' });
      fireEvent.click(nextButton);

      expect(mockPagination.onPageChange).toHaveBeenCalledWith(2);
    });

    test('should render export button when onExport is provided', () => {
      const mockExport = jest.fn();

      render(
        <DataTable
          columns={mockColumns}
          data={mockData}
          loading={false}
          onExport={mockExport}
          exportLabel="Export CSV"
        />
      );

      const exportButton = screen.getByRole('button', { name: 'Export CSV' });
      expect(exportButton).toBeVisible();

      fireEvent.click(exportButton);
      expect(mockExport).toHaveBeenCalled();
    });
  });

  describe('Modal Component', () => {
    const mockOnClose = jest.fn();

    test('should render modal when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Modal content</div>
        </Modal>
      );

      expect(screen.getByText('Test Modal')).toBeVisible();
      expect(screen.getByText('Modal content')).toBeVisible();
    });

    test('should not render modal when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <div>Modal content</div>
        </Modal>
      );

      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
      expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });

    test('should call onClose when close button is clicked', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Modal content</div>
        </Modal>
      );

      const closeButton = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('should call onClose when backdrop is clicked', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Modal content</div>
        </Modal>
      );

      const backdrop = screen.getByTestId('modal-backdrop');
      fireEvent.click(backdrop);

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('should not call onClose when modal content is clicked', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>Modal content</div>
        </Modal>
      );

      const modalContent = screen.getByText('Modal content');
      fireEvent.click(modalContent);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Button Component', () => {
    test('should render button with default variant', () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeVisible();
      expect(button).toHaveClass(/bg-indigo-600/);
    });

    test('should render button with secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole('button', { name: 'Secondary' });
      expect(button).toBeVisible();
      expect(button).toHaveClass(/bg-gray-200/);
    });

    test('should render disabled button', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button', { name: 'Disabled' });
      expect(button).toBeDisabled();
      expect(button).toHaveClass(/opacity-50/);
    });

    test('should handle click events', () => {
      const mockOnClick = jest.fn();
      render(<Button onClick={mockOnClick}>Click me</Button>);

      const button = screen.getByRole('button', { name: 'Click me' });
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalled();
    });

    test('should apply custom className', () => {
      render(<Button className="custom-class">Custom</Button>);

      const button = screen.getByRole('button', { name: 'Custom' });
      expect(button).toHaveClass('custom-class');
    });

    test('should render button with different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button', { name: 'Small' })).toHaveClass(
        'px-3',
        'py-2',
        'text-sm'
      );

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button', { name: 'Large' })).toHaveClass(
        'px-6',
        'py-3',
        'text-lg'
      );
    });
  });
});
