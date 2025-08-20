**Tên dự án:** Trang quản trị tra cứu tài khoản, sản phẩm và bài thi

## **1\. Mục tiêu dự án**

Xây dựng một trang quản trị nội bộ nhằm giúp các bộ phận chuyên môn tra cứu nhanh chóng thông tin liên quan đến EMS, phòng luyện HOCMAI. Các yêu cầu tra cứu thông tin:

* Người dùng (theo **`user_id`)**

* Sản phẩm (phòng luyện, đề thi)

* Lịch sử làm bài của học sinh

* Xuất dữ liệu CSV phục vụ cho phân tích và chăm sóc học sinh

## **2\. Phạm vi dự án**

### **2.1 Tính năng chính**

#### **2.1.1 Tra cứu theo User ID (Học sinh)**

Cho phép nhập **`user_id`** của hệ thống HOCMAI để tra cứu:

* Danh sách **phòng luyện (sản phẩm trên EMS)** mà học sinh đã đăng ký

  * Tên sản phẩm

  * Thời gian bắt đầu – thời gian kết thúc sử dụng

* Lịch sử làm bài thi trong các phòng luyện đề/Topclass:

  * ID đề  
  * Tên đề  
  * Thời gian bắt đầu làm – thời gian nộp  
  * Tên sản phẩm  
  * Số điểm 

#### **![][image1]**

![][image2]

#### 

#### **2.1.2 Tra cứu theo Sản phẩm**

* List toàn bộ sản phẩm/phòng luyện có trong hệ thống

* Khi bấm vào từng sản phẩm sẽ hiển thị:

  * Danh sách `user_id` đã đăng ký sản phẩm

  * Trạng thái: còn hạn / hết hạn

  * Thời gian bắt đầu – kết thúc sử dụng

* Tìm kiếm được theo `user_id` hoặc `email`

* Có thể **xuất CSV**:

  * Cột gồm: **`user_id`, `id, email, tên user,id sản phẩm`, `tên sản phẩm`, `thời gian bắt đầu`, `thời gian kết thúc`**

`![][image3]`

`![][image4]`

#### **2.1.3 Tra cứu theo Đề thi**

* Cho phép chọn theo `cuộc thi` (ví dụ: HSA, TSA…) và nhập `ID đề thi`

* Hiển thị danh sách học sinh đã làm đề đó:

  * `User_id`  
  * `Tên người dùng`  
  * `Email`  
  * `ID đề thi`  
  * Thời gian bắt đầu làm bài  
  * Thời gian nộp  
  * Tên đề thi  
  * Điểm số 

![][image5]

* Có thể **xuất CSV** dữ liệu

#### **2.1.4 Quản trị quyền truy cập**

* Hỗ trợ đăng nhập bằng **SSO Gmail của HOCMAI**

* Role: `Admin` có thể cấu hình thêm email HOCMAI được phép truy cập trang

  * Chỉ chấp nhận domain `@hocmai.vn`

  * Giao diện thêm/sửa/xoá email truy cập