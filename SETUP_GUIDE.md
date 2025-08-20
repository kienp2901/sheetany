# Hướng dẫn Setup HOCMAI EMS Admin

## 1. Cài đặt và chạy local

```bash
# Clone project và cài đặt dependencies
cd hocmai-ems-admin
npm install

# Tạo file environment
cp .env.example .env.local
```

## 2. Cấu hình Google OAuth

### Bước 1: Tạo Google OAuth App
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Kích hoạt Google+ API
4. Vào "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Chọn "Web application"
6. Thêm authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### Bước 2: Cấu hình .env.local
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
API_BASE_URL=https://apiemsdev.hocmai.net
```

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
1. User login bằng Google OAuth
2. System lấy Google access token
3. Gọi API `/hocmaiadmin/adminHocmaiManager/loginGoogle` với Google token
4. Nhận được HOCMAI auth token
5. Sử dụng token này cho tất cả API calls

## 5. Tính năng chính

### Tra cứu học sinh
- URL: `/students`
- Tìm kiếm theo ID hoặc email
- Xem sản phẩm đã đăng ký và lịch sử làm bài

### Tra cứu sản phẩm  
- URL: `/products`
- Xem danh sách sản phẩm
- Xem học sinh đã đăng ký sản phẩm
- Xuất CSV danh sách học sinh

### Tra cứu đề thi
- URL: `/exams`
- Tìm theo loại cuộc thi và ID đề
- Xem lịch sử làm bài của học sinh
- Xuất CSV kết quả

### Quản trị Admin
- URL: `/admin`
- CRUD admin có quyền truy cập
- Chỉ chấp nhận email @hocmai.vn

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
- `NEXTAUTH_URL`: URL của ứng dụng production
- `NEXTAUTH_SECRET`: Random secret key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `API_BASE_URL`: URL của HOCMAI API

## 7. Troubleshooting

### Lỗi authentication
- Kiểm tra Google OAuth config
- Đảm bảo redirect URI đúng
- Kiểm tra email có domain @hocmai.vn

### Lỗi API calls
- Kiểm tra API_BASE_URL
- Đảm bảo email đã được thêm vào whitelist HOCMAI
- Kiểm tra network requests trong DevTools

### Lỗi build
- Chạy `npm run lint` để kiểm tra lỗi code
- Chạy `npm run build` để test build locally

## 8. Support

Liên hệ team HOCMAI để:
- Thêm email vào whitelist API
- Cấu hình Google OAuth domain restriction
- Hỗ trợ API issues
