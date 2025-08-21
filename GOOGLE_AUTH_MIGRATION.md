# Hướng dẫn Migration từ NextAuth sang Client-side Google Authentication

## Những thay đổi đã thực hiện

### 1. Loại bỏ NextAuth
- ✅ Xóa `next-auth` và `@auth/prisma-adapter` dependencies
- ✅ Xóa `src/lib/auth.ts` (NextAuth config)
- ✅ Xóa `src/app/api/auth/[...nextauth]/route.ts`

### 2. Tạo Client-side Authentication
- ✅ Thêm `@types/google.accounts` dependency
- ✅ Tạo `src/lib/auth-context.tsx` - Custom AuthContext cho quản lý session
- ✅ Cập nhật `src/app/providers.tsx` - Sử dụng AuthProvider thay vì SessionProvider

### 3. Cập nhật Signin Page
- ✅ `src/app/auth/signin/page.tsx` - Sử dụng Google Identity Services
- ✅ Thêm Google Identity Services script
- ✅ Xử lý Google credential và gọi API backend

### 4. Cập nhật Protected Pages
- ✅ `src/app/students/page.tsx` - Sử dụng useAuth thay vì useSession
- ✅ `src/app/products/page.tsx` - Loại bỏ unused useSession import
- ✅ `src/app/admin/page.tsx` - Loại bỏ unused useSession import
- ✅ `src/app/exams/page.tsx` - Sử dụng useAuth thay vì useSession

### 5. Cập nhật Layout & Components
- ✅ `src/components/Layout.tsx` - Sử dụng useAuth và custom logout
- ✅ Cập nhật middleware để sử dụng custom authentication

### 6. Cập nhật API Client
- ✅ `src/lib/api.ts` - Cho phép setAuthToken nhận null

## Environment Variables cần thiết

Thêm vào `.env.local`:

```env
# Google OAuth Configuration (chỉ cần client_id cho client-side)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# API Configuration  
API_BASE_URL=https://apiemsdev.hocmai.net
```

**Lưu ý:** Không cần `GOOGLE_CLIENT_SECRET` nữa vì chúng ta sử dụng client-side authentication.

## Cách setup Google OAuth cho client-side

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project của bạn
3. Vào **APIs & Services > Credentials**
4. Chọn OAuth 2.0 Client ID đã tạo
5. Trong **Authorized JavaScript origins**, thêm:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
6. **Không cần** authorized redirect URIs cho client-side auth
7. Copy Client ID vào `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

## Flow hoạt động mới

1. ✅ User click "Đăng nhập bằng Google" 
2. ✅ Google Identity Services hiển thị popup/prompt
3. ✅ User chọn tài khoản Google và authorize
4. ✅ Nhận được `id_token` (JWT credential) từ Google
5. ✅ Gửi `id_token` lên API backend `/hocmaiadmin/adminHocmaiManager/loginGoogle`
6. ✅ Backend verify `id_token` và trả về auth token của hệ thống
7. ✅ Lưu session vào localStorage và cookie
8. ✅ Sử dụng auth token cho các API calls tiếp theo

## Ưu điểm của Client-side Authentication

- ✅ **Bảo mật hơn**: Không cần client_secret trên frontend
- ✅ **Đơn giản hơn**: Ít dependencies, ít code
- ✅ **Linh hoạt hơn**: Kiểm soát hoàn toàn flow authentication
- ✅ **Performance tốt hơn**: Ít server-side redirects
- ✅ **UX tốt hơn**: Google popup thay vì redirect

## Error Handling

- ✅ Hiển thị toast error nếu login thất bại
- ✅ Console log chi tiết lỗi để debug
- ✅ Redirect về signin page nếu không authenticated (middleware)
- ✅ Error page tại `/auth/error` cho các lỗi khác

## Session Management

- ✅ Session được lưu trong localStorage và sync với cookie
- ✅ Auto-restore session khi refresh page
- ✅ Logout clear cả localStorage và cookie
- ✅ Middleware kiểm tra authentication qua cookie

## Testing

Để test migration:

1. Xóa `.env.local` cũ và tạo mới với `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
2. `npm run dev`
3. Truy cập `http://localhost:3000/auth/signin`
4. Test Google login flow
5. Verify session persist sau khi refresh
6. Test logout functionality
7. Test protected routes redirect

## Migration hoàn tất! 🎉

Ứng dụng đã được chuyển đổi thành công từ NextAuth server-side sang Google client-side authentication.
