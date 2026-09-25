# Hướng dẫn Cài đặt và Phát triển

## Giới thiệu
Tài liệu này cung cấp hướng dẫn cách thiết lập, chạy và phát triển dự án TechStore.

## Yêu cầu môi trường
- Docker và Docker Compose
- VS Code cài đặt sẵn tiện ích mở rộng DevContainers

## Hướng dẫn Khởi chạy

### 1. Chạy bằng DevContainers (Khuyên dùng)
Dự án này đã được cấu hình sẵn môi trường DevContainer. Môi trường này sẽ tự động khởi tạo cơ sở dữ liệu PostgreSQL và môi trường Node.js.
- Mở thư mục dự án bằng phần mềm VS Code.
- Khi có thông báo hiện lên, chọn "Reopen in Container".
- Hệ thống sẽ tự động khởi chạy toàn bộ dịch vụ.

### 2. Chạy thủ công
Nếu bạn không sử dụng DevContainers, sử dụng " ./docker.sh "

## Cấu trúc Dự án

### Thư mục Backend
Mã nguồn nằm trong thư mục `/backend`.
- Tệp `server.js`: File chính của ứng dụng Express. Chứa logic thiết lập API và cấu hình kết nối CSDL.
- Danh sách API:
  - `POST /api/login`: Kiểm tra thông tin đăng nhập và trả về dữ liệu người dùng.
  - `GET /api/products`: Lấy toàn bộ danh sách sản phẩm và tên danh mục tương ứng.
  - `POST /api/checkout`: Xử lý đặt hàng. Sử dụng Transaction để đảm bảo tính nhất quán của dữ liệu.
  - `GET /api/orders`: API dành riêng cho Admin để xem tất cả đơn hàng đã được đặt trên hệ thống.

### Thư mục Frontend
Mã nguồn nằm trong thư mục `/frontend`.
- Tệp `src/App.jsx`: Component chính chứa giao diện và logic quản lý state của toàn bộ ứng dụng.
- Quản lý State: Sử dụng các hook (useState, useEffect) để lưu trữ phiên đăng nhập của user, danh sách sản phẩm, giỏ hàng, và danh sách đặt hàng.

### Kiến trúc Cơ sở dữ liệu (Database Schemas)
Hệ thống phân chia rõ ràng các bảng vào nhiều schema khác nhau để dễ quản lý:
- Schema `auth`: Quản lý người dùng (`users`) và quyền hạn (`roles`).
- Schema `catalog`: Quản lý danh mục (`categories`) và sản phẩm (`products`).
- Schema `sales`: Quản lý đơn đặt hàng (`orders`) và chi tiết đơn (`order_items`).
- Schema `inventory`: Lưu lại lịch sử biến động kho hàng (`stock_movements`).
- Schema `audit`: Lưu vết các thao tác quan trọng trên hệ thống (`logs`).

## Tài khoản Thử nghiệm
Bạn có thể sử dụng các tài khoản có sẵn dưới đây để đăng nhập vào hệ thống:
- Tài khoản (Username): phong / phongvu / thanhphong 
- Mật khẩu (Password): 123456

## Lưu ý cho Lập trình viên
- Backend sử dụng thư viện `pg` (node-postgres) để tạo Connection Pool. Điều này giúp hệ thống quản lý kết nối hiệu quả khi có nhiều luồng dữ liệu.
- Cổng kết nối API được cấu hình bằng biến môi trường `VITE_API_URL` phía Frontend. Nếu backend đổi cổng, cần cập nhật lại giá trị này để Frontend kết nối chính xác.

