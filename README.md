# HOCMAI EMS Admin

Trang quản trị tra cứu tài khoản, sản phẩm và bài thi cho hệ thống EMS HOCMAI.

## 🚀 Tính năng chính

### 🔐 Xác thực và Bảo mật

- **Google Sign-In Client-side**: Chỉ chấp nhận tài khoản @hocmai.vn
- **Phân quyền**: Quản lý danh sách admin có quyền truy cập
- **Bảo vệ route**: Middleware bảo vệ tất cả trang cần authentication
- **Session Management**: Auto-restore session, secure token handling

### 👥 Tra cứu học sinh (`/students`)

- Tìm kiếm theo ID học sinh hoặc email với real-time search
- Xem chi tiết thông tin học sinh với layout riêng biệt
- Danh sách sản phẩm đã đăng ký (có phân trang)
- Lịch sử làm bài thi (có phân trang)
- Responsive design với mobile cards view và desktop table view

### 📦 Tra cứu sản phẩm (`/products`)

- Xem danh sách tất cả sản phẩm/phòng luyện (có phân trang)
- Tìm kiếm sản phẩm theo tên hoặc mã
- Chi tiết sản phẩm với danh sách học sinh đã đăng ký
- Tìm kiếm học sinh trong sản phẩm theo ID hoặc email
- **Xuất CSV** danh sách học sinh đã đăng ký sản phẩm

### 📝 Tra cứu đề thi (`/exams`)

- Chọn loại cuộc thi (TN THPT, HSA, TSA, IELTS, V-ACT, PEN 2025...)
- Nhập ID đề thi để tra cứu lịch sử làm bài
- Hiển thị thông tin: ID học sinh, tên, email, thời gian làm bài, điểm số
- Phân trang kết quả với search và filter
- **Xuất CSV** kết quả lịch sử làm bài

### ⚙️ Quản trị Admin (`/admin`)

- **CRUD hoàn chỉnh**: Thêm/sửa/xóa admin có quyền truy cập
- **Validation email**: Chỉ chấp nhận email có domain @hocmai.vn
- **Modal UI**: Forms thêm/sửa với validation
- **DataTable**: Hiển thị danh sách với action buttons
- **Dashboard**: Thống kê hệ thống, system health, recent activities

### 📱 Responsive Design

- **Mobile-first**: Tối ưu cho mọi kích thước màn hình
- **Adaptive UI**: Cards view trên mobile, table view trên desktop
- **Touch-friendly**: Buttons và controls phù hợp với mobile
- **Sidebar Navigation**: Responsive sidebar với mobile hamburger menu

## 🛠️ Công nghệ

- **Framework**: Next.js 15 với App Router
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4 với responsive utilities
- **Authentication**: Google Identity Services (Client-side OAuth)
- **UI Components**: Custom components với Class Variance Authority (CVA)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **HTTP Client**: Native fetch API với custom wrapper
- **Testing**: Jest + React Testing Library + Playwright E2E
- **Storybook**: Component development và documentation

## 📦 Cài đặt và chạy

### 1. **Clone và cài đặt dependencies:**

```bash
git clone <repository-url>
cd hocmai-ems-admin
npm install
```

### 2. **Cấu hình environment variables:**

Tạo file `.env.local` từ `env.example` và cập nhật các giá trị:

```bash
cp env.example .env.local
```

Cập nhật file `.env.local`:

```env
# Google OAuth Configuration (Client-side only)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here

# API Configuration
API_BASE_URL=https://apiemsdev.hocmai.net
```

**Lưu ý**: Chỉ cần Google Client ID vì project sử dụng client-side authentication.

### 3. **Chạy ứng dụng:**

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Testing
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:all      # All tests

# Storybook
npm run storybook     # Development
npm run build-storybook # Build static
```

### 4. **Truy cập ứng dụng:**

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## 🏗️ Cấu trúc project

```
src/
├── app/                    # App Router Pages
│   ├── admin/             # Quản trị admin với CRUD functionality
│   │   └── page.tsx       # Admin management với tabs UI
│   ├── auth/              # Authentication pages
│   │   ├── error/         # Auth error handling
│   │   └── signin/        # Google Sign-in page
│   ├── exams/             # Tra cứu đề thi
│   │   └── page.tsx       # Exam history lookup với CSV export
│   ├── products/          # Tra cứu sản phẩm
│   │   └── page.tsx       # Products list/detail với CSV export
│   ├── students/          # Tra cứu học sinh
│   │   └── page.tsx       # Students search với detail view
│   ├── layout.tsx         # Root layout với sidebar navigation
│   ├── page.tsx           # Home page (redirect to students)
│   └── providers.tsx      # Context providers
├── components/            # Reusable UI Components
│   ├── Button.tsx         # Button với variants (CVA)
│   ├── Card.tsx           # Card component
│   ├── DataTable.tsx      # Table với pagination & export
│   ├── Layout.tsx         # Main layout với responsive sidebar
│   ├── Modal.tsx          # Modal component
│   └── SearchBar.tsx      # Search input với loading states
├── lib/                   # Utilities và Business Logic
│   ├── api.ts            # HOCMAI API client với TypeScript
│   ├── auth-context.tsx  # Authentication context
│   └── utils.ts          # Utility functions (cn, etc.)
└── middleware.ts         # Route protection middleware

tests/                    # Testing
├── e2e/                  # Playwright E2E tests
├── integration/          # Jest integration tests
└── README.md            # Testing documentation

stories/                  # Storybook
├── assets/              # Story assets
├── Button.stories.ts    # Button stories
├── Card.stories.ts      # Card stories
└── Configure.mdx        # Storybook configuration
```

## 🔌 API Integration

### HOCMAI EMS API

- **Base URL**: `https://apiemsdev.hocmai.net`
- **Authentication**: Bearer token từ Google ID token exchange
- **Flow**: Google Sign-In → Get ID token → Exchange for HOCMAI token → API calls

### Endpoints được sử dụng:

#### Authentication

- `POST /hocmaiadmin/adminHocmaiManager/loginGoogle` - Exchange Google token

#### Admin Management (CRUD)

- `GET /hocmaiadmin/adminHocmaiManager` - List admins
- `POST /hocmaiadmin/adminHocmaiManager` - Add admin
- `PATCH /hocmaiadmin/adminHocmaiManager/{id}` - Update admin
- `DELETE /hocmaiadmin/adminHocmaiManager/{id}` - Delete admin

#### Students

- `GET /hocmaiadmin/student/listStudent` - Search students
- `GET /hocmaiadmin/student/productByStudent` - Student's products
- `GET /hocmaiadmin/student/historyByStudent` - Student's exam history

#### Products

- `GET /hocmaiadmin/student/listProduct` - List all products
- `GET /hocmaiadmin/student/studentByProduct` - Students in product
- `GET /hocmaiadmin/student/studentByProduct/csv` - **CSV Export**

#### Exams

- `GET /hocmaiadmin/student/historyByMockContest` - Exam history by contest
- `GET /hocmaiadmin/student/historyByMockContest/csv` - **CSV Export**

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
npx vercel --prod
```

### Manual Build

```bash
npm run build
npm start
```

## ✨ Tính năng nổi bật

### 🎯 User Experience

- **Single Page Navigation**: Chuyển đổi giữa list và detail view không reload
- **Real-time Search**: Tìm kiếm với debounce và loading states
- **Pagination**: Phân trang thông minh với state management
- **CSV Export**: Xuất dữ liệu với file name tự động
- **Error Handling**: Thông báo lỗi chi tiết với React Hot Toast
- **Loading States**: Skeleton loading và progress indicators

### 🛡️ Security & Performance

- **Route Protection**: Middleware bảo vệ tất cả protected routes
- **Token Management**: Auto refresh và error handling
- **Email Validation**: Domain restriction cho @hocmai.vn
- **Type Safety**: Full TypeScript coverage
- **Code Splitting**: Lazy loading và dynamic imports

### 📱 Responsive Design

- **Mobile-first**: Optimized cho mobile experience
- **Adaptive Layouts**: Cards trên mobile, tables trên desktop
- **Touch-friendly**: Large tap targets và gestures
- **Performance**: Lazy loading và code splitting
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)

## 🧪 Testing

### Unit & Integration Tests

```bash
npm run test              # Jest tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### E2E Tests

```bash
npm run test:e2e          # Playwright tests
npm run test:e2e:ui       # UI mode
npm run test:e2e:headed   # Headed mode
npm run test:e2e:debug    # Debug mode
```

### Storybook

```bash
npm run storybook         # Development
npm run build-storybook   # Build static
```

## 📚 Tài liệu chi tiết

- 📖 [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Hướng dẫn setup chi tiết
- 📱 [RESPONSIVE_GUIDE.md](./RESPONSIVE_GUIDE.md) - Responsive design guide
- 🔐 [GOOGLE_AUTH_MIGRATION.md](./GOOGLE_AUTH_MIGRATION.md) - Migration từ NextAuth
- 🧪 [tests/README.md](./tests/README.md) - Testing documentation

## ⚠️ Lưu ý quan trọng

- ✅ **Email whitelist**: Chỉ email @hocmai.vn được phép đăng nhập
- ✅ **Google OAuth**: Cần cấu hình Client ID trong Google Console
- ✅ **API Access**: Cần được team HOCMAI thêm vào whitelist
- ✅ **Environment**: Sử dụng staging API cho development
- ✅ **Testing**: Có đầy đủ test coverage cho tất cả components

## 🆘 Support và Hỗ trợ

**Liên hệ team HOCMAI để:**

- 📧 Thêm email vào whitelist API
- 🔑 Cấu hình Google OAuth domain restriction
- 🐛 Hỗ trợ API issues và debugging
- 🚀 Cấp quyền truy cập môi trường production
- 📋 Hướng dẫn setup và deployment

**Tài liệu kỹ thuật:**

- 📖 [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Hướng dẫn setup chi tiết
- 🏗️ Architecture diagram và API documentation
- 🧪 Testing guidelines và best practices
- 📱 Responsive design patterns

## 📈 Roadmap

### Phase 1 (Completed ✅)

- [x] Google OAuth client-side authentication
- [x] Students search and management
- [x] Products search and management
- [x] Exams search and history
- [x] Admin CRUD operations
- [x] Responsive design implementation
- [x] CSV export functionality
- [x] Comprehensive testing suite
- [x] Storybook component library
- [x] TypeScript migration

### Phase 2 (Planned 🚧)

- [ ] Advanced filtering and search
- [ ] Bulk operations
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] User activity logging
- [ ] API rate limiting
- [ ] Performance monitoring

### Phase 3 (Future 🔮)

- [ ] PWA support
- [ ] Offline functionality
- [ ] Advanced reporting
- [ ] Integration with other HOCMAI systems
- [ ] Mobile app development
