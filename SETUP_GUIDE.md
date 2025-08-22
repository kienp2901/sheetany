# Hướng dẫn Setup HOCMAI EMS Admin

## 1. Cài đặt và chạy local

```bash
# Clone project và cài đặt dependencies
cd your-project
npm install

# Tạo file environment
cp env.example .env.local
```

## 2. Cấu hình Google OAuth

### Bước 1: Tạo Google OAuth App
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Kích hoạt Google Identity Services API
4. Vào "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Chọn "Web application"
6. Thêm authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)

### Bước 2: Cấu hình .env.local
```env
# Google OAuth Configuration (Client-side only)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here

# API Configuration  
API_BASE_URL=https://apiemsdev.hocmai.net
```

**Lưu ý:** Project này sử dụng Google Sign-In JavaScript API (client-side) thay vì NextAuth.js, do đó chỉ cần Client ID.

## 3. Chạy ứng dụng

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## 4. Cấu hình API HOCMAI

### Thêm email vào whitelist
Liên hệ team HOCMAI để thêm email vào hệ thống API:
- Gửi email có domain `@hocmai.vn` để được thêm vào danh sách admin

### Flow authentication
1. User đăng nhập bằng Google Sign-In (client-side)
2. Nhận được Google ID token từ Google
3. Gọi API `/hocmaiadmin/adminHocmaiManager/loginGoogle` với Google token
4. Nhận được HOCMAI access token
5. Sử dụng HOCMAI token này cho tất cả API calls tiếp theo

## 5. Tính năng chính

### Tra cứu học sinh
- URL: `/students`
- Tìm kiếm theo ID học sinh hoặc email
- Xem chi tiết thông tin học sinh
- Xem sản phẩm đã đăng ký (có phân trang)
- Xem lịch sử làm bài thi (có phân trang)
- Responsive design với cards view trên mobile

### Tra cứu sản phẩm  
- URL: `/products`
- Xem danh sách tất cả sản phẩm/phòng luyện (có phân trang)
- Tìm kiếm sản phẩm theo tên hoặc mã
- Xem chi tiết sản phẩm và danh sách học sinh đã đăng ký
- Tìm kiếm học sinh trong sản phẩm theo ID hoặc email
- Xuất CSV danh sách học sinh đã đăng ký sản phẩm

### Tra cứu đề thi
- URL: `/exams`
- Chọn loại cuộc thi (TN THPT, HSA, TSA...)
- Nhập ID đề thi để tra cứu
- Xem lịch sử làm bài của tất cả học sinh (có phân trang)
- Hiển thị thông tin: ID học sinh, tên, email, thời gian làm bài, điểm số
- Xuất CSV kết quả lịch sử làm bài

### Quản trị Admin
- URL: `/admin`
- Thêm/sửa/xóa admin có quyền truy cập hệ thống
- Chỉ chấp nhận email có domain @hocmai.vn
- Giao diện tabs: Tổng quan, Quản lý quyền truy cập, Hệ thống
- Modal forms cho thêm/sửa admin với validation

## 6. Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Server
```bash
# Build
npm run build

# Start production server
npm start
```

### Environment Variables cho Production
Cần setup các biến môi trường:
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID (public, có thể expose)
- `API_BASE_URL`: URL của HOCMAI API (có thể để mặc định https://apiemsdev.hocmai.net)

## 7. Troubleshooting

### Lỗi authentication
- Kiểm tra Google Client ID trong .env.local
- Đảm bảo domain được thêm vào authorized JavaScript origins
- Kiểm tra email có domain @hocmai.vn
- Kiểm tra email đã được thêm vào whitelist HOCMAI API

### Lỗi API calls
- Kiểm tra API_BASE_URL
- Đảm bảo email đã được thêm vào whitelist HOCMAI
- Kiểm tra network requests trong DevTools

### Lỗi build
- Chạy `npm run lint` để kiểm tra lỗi code
- Chạy `npm run build` để test build locally

## 8. Cấu trúc Project

```
src/
├── app/                    # App Router Pages
│   ├── admin/             # Quản trị admin (/admin)
│   ├── auth/              # Authentication pages
│   │   ├── error/         # Auth error page
│   │   └── signin/        # Sign in page
│   ├── exams/             # Tra cứu đề thi (/exams)
│   ├── products/          # Tra cứu sản phẩm (/products)
│   ├── students/          # Tra cứu học sinh (/students)
│   ├── layout.tsx         # Root layout với sidebar navigation
│   └── page.tsx           # Home page (redirect to students)
├── components/            # Reusable UI Components
│   ├── Button.tsx         # Button component với variants
│   ├── DataTable.tsx      # Table với pagination và export
│   ├── Layout.tsx         # Main layout với responsive sidebar
│   ├── Modal.tsx          # Modal component
│   └── SearchBar.tsx      # Search input component
├── lib/                   # Utilities và API
│   ├── api.ts            # API client functions cho HOCMAI
│   ├── auth-context.tsx  # Auth context provider
│   └── utils.ts          # Utility functions
└── middleware.ts         # Route protection middleware
```

## 9. API Integration

### HOCMAI EMS API Endpoints
- **Base URL**: https://apiemsdev.hocmai.net
- **Authentication**: Bearer token từ Google OAuth

### Endpoints được sử dụng:
```
# Authentication
POST /hocmaiadmin/adminHocmaiManager/loginGoogle

# Admin Management  
GET    /hocmaiadmin/adminHocmaiManager
POST   /hocmaiadmin/adminHocmaiManager
PATCH  /hocmaiadmin/adminHocmaiManager/{id}
DELETE /hocmaiadmin/adminHocmaiManager/{id}

# Students
GET /hocmaiadmin/api/listStudent
GET /hocmaiadmin/student/productByStudent
GET /hocmaiadmin/student/historyByStudent

# Products
GET /hocmaiadmin/student/listProduct
GET /hocmaiadmin/student/studentByProduct
GET /hocmaiadmin/student/studentByProduct/csv

# Exams
GET /hocmaiadmin/student/historyByMockContest
GET /hocmaiadmin/student/historyByMockContest/csv
```

## 10. Support

Liên hệ team HOCMAI để:
- Thêm email vào whitelist API
- Cấu hình Google OAuth domain restriction  
- Hỗ trợ API issues
- Cấp quyền truy cập môi trường staging/production
