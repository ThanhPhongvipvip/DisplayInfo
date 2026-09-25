
## Tổng quan
Đây là ứng dụng web thương mại điện tử Full-stack. Hệ thống cung cấp các chức năng như đăng nhập, xem danh sách sản phẩm, quản lý giỏ hàng và xem danh sách đơn hàng dành cho quyền Admin.

## Công nghệ sử dụng
- Frontend: ReactJS (Vite)
- Backend: Node.js (ExpressJS)
- Database: PostgreSQL

## Sơ đồ luồng hoạt động

Dưới đây là kiến trúc hệ thống và luồng dữ liệu chung của ứng dụng:

```mermaid
flowchart TD
    User[Người dùng] -->|Thao tác giao diện| UI[Frontend: ReactJS]
    UI -->|HTTP GET/POST API| API[Backend: Node.js]
    API -->|Truy vấn SQL| DB[(Database: PostgreSQL)]
    DB -.->|Trả về dữ liệu| API
    API -.->|Dữ liệu JSON| UI
    UI -.->|Cập nhật giao diện| User
```
# Demo Database

## Tổng quan
Đây là ứng dụng web thương mại điện tử Full-stack. Hệ thống cung cấp các chức năng như đăng nhập, xem danh sách sản phẩm, quản lý giỏ hàng và xem danh sách đơn hàng dành cho quyền Admin.

## Công nghệ sử dụng
- Frontend: ReactJS (Vite)
- Backend: Node.js (ExpressJS)
- Database: PostgreSQL

## Sơ đồ luồng hoạt động

Dưới đây là kiến trúc hệ thống và luồng dữ liệu chung của ứng dụng:

```mermaid
flowchart TD
    User[Người dùng] -->|Thao tác giao diện| UI[Frontend: ReactJS]
    UI -->|HTTP GET/POST API| API[Backend: Node.js]
    API -->|Truy vấn SQL| DB[(Database: PostgreSQL)]
    DB -.->|Trả về dữ liệu| API
    API -.->|Dữ liệu JSON| UI
    UI -.->|Cập nhật giao diện| User
```

Chi tiết luồng xử lý chức năng Thanh toán (Checkout) qua Transaction:

```mermaid
sequenceDiagram
    participant User as Người dùng
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Bấm nút Thanh toán (Checkout)
    Frontend->>Backend: POST /api/checkout (Chứa User ID, Giỏ hàng)
    Backend->>Database: Lệnh BEGIN (Bắt đầu Transaction)
    Backend->>Database: Tạo đơn hàng vào bảng sales.orders
    Backend->>Database: Thêm chi tiết vào bảng sales.order_items
    Backend->>Database: Trừ số lượng kho ở bảng catalog.products
    Backend->>Database: Ghi nhận xuất kho ở bảng inventory.stock_movements
    Backend->>Database: Lưu lịch sử thao tác ở bảng audit.logs
    Database-->>Backend: Xử lý các lệnh thành công
    Backend->>Database: Lệnh COMMIT (Lưu toàn bộ thay đổi)
    Backend-->>Frontend: Trả về trạng thái thành công
    Frontend-->>User: Hiển thị thông báo và dọn dẹp giỏ hàng
```

## Chức năng chính
- Xác thực người dùng (Đăng nhập)
- Phân quyền người dùng (User / Admin)
- Hiển thị danh sách sản phẩm và trạng thái tồn kho
- Quản lý giỏ hàng
- Thanh toán an toàn sử dụng SQL Transaction
- Bảng điều khiển quản lý đơn hàng cho Admin



## Chức năng chính
- Xác thực người dùng (Đăng nhập)
- Phân quyền người dùng (User / Admin)
- Hiển thị danh sách sản phẩm và trạng thái tồn kho
- Quản lý giỏ hàng
- Thanh toán an toàn sử dụng SQL Transaction
- Bảng điều khiển quản lý đơn hàng cho Admin

