# HOCMAI EMS Admin

Trang quản trị tra cứu tài khoản, sản phẩm và bài thi cho hệ thống EMS HOCMAI.

## Tính năng

- **Đăng nhập Google OAuth**: Chỉ chấp nhận tài khoản @hocmai.vn
- **Tra cứu học sinh**: Tìm kiếm theo ID hoặc email, xem sản phẩm đã đăng ký và lịch sử làm bài
- **Tra cứu sản phẩm**: Xem danh sách sản phẩm và học sinh đã đăng ký, xuất CSV
- **Tra cứu đề thi**: Xem lịch sử làm bài theo ID đề thi, xuất CSV
- **Quản trị Admin**: CRUD admin có quyền truy cập hệ thống
- **Responsive**: Tối ưu cho cả desktop và mobile

## Công nghệ

- **Framework**: Next.js 14 với App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: NextAuth.js với Google OAuth
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Cài đặt và chạy

1. **Clone và cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Cấu hình environment variables:**
   Tạo file `.env.local` từ `.env.example` và cập nhật các giá trị:
   ```bash
   cp .env.example .env.local
   ```
   
   Cập nhật file `.env.local`:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   API_BASE_URL=https://apiemsdev.hocmai.net
   ```

3. **Chạy development server:**
   ```bash
   npm run dev
   ```

4. **Truy cập ứng dụng:**
   Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## Cấu trúc project

```
src/
├── app/                    # Pages (App Router)
│   ├── admin/             # Quản trị admin
│   ├── auth/              # Authentication pages
│   ├── exams/             # Tra cứu đề thi
│   ├── products/          # Tra cứu sản phẩm
│   ├── students/          # Tra cứu học sinh
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirect)
├── components/            # UI Components
│   ├── DataTable.tsx      # Table component với pagination
│   ├── Layout.tsx         # Main layout với sidebar
│   └── SearchBar.tsx      # Search component
├── lib/                   # Utilities
│   ├── api.ts            # API client functions
│   └── auth.ts           # NextAuth configuration
└── middleware.ts         # Route protection
```

## API Integration

Ứng dụng tích hợp với HOCMAI EMS API:
- Base URL: `https://apiemsdev.hocmai.net`
- Authentication: Bearer token từ Google OAuth
- Các endpoint chính:
  - `/hocmaiadmin/adminHocmaiManager/*` - Quản lý admin
  - `/hocmaiadmin/api/listStudent` - Danh sách học sinh
  - `/hocmaiadmin/student/*` - Thông tin học sinh, sản phẩm, lịch sử
  - CSV export endpoints

## Deployment

### Vercel (Recommended)
```bash
npx vercel --prod
```

### Manual Build
```bash
npm run build
npm start
```

## Lưu ý

- Chỉ tài khoản email @hocmai.vn mới được phép đăng nhập
- Cần cấu hình Google OAuth credentials
- API token được lấy tự động sau khi đăng nhập Google
- Tất cả API calls đều yêu cầu Authorization header

## Support

Liên hệ team HOCMAI để được hỗ trợ cấu hình Google OAuth và quyền truy cập API.