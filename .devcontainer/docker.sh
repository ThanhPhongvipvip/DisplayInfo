#!/bin/bash

# Lấy đường dẫn gốc của project (thư mục Login)
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Build Docker Image ==="
docker build -t login-webapp "$PROJECT_ROOT/.devcontainer"

echo "=== Run Docker Container ==="
docker run -it --rm \
  -p 3000:3000 \
  -p 5000:5000 \
  -p 5433:5432 \
  -v "$PROJECT_ROOT:/workspace" \
  -w /workspace \
  login-webapp \
  bash -c '
echo "=== Khởi động PostgreSQL ==="
sudo service postgresql start

echo "=== Nạp dữ liệu SQL (nếu có) ==="
# Kiểm tra nếu DB đã có bảng chưa, nếu chưa thì nạp SQL
PGPASSWORD=admin123 psql -U admin -d webapp_db -h localhost -c "\d" | grep -q "No relations found"
if [ $? -ne 0 ]; then
    echo "Nạp các file SQL từ thư mục database..."
    PGPASSWORD=admin123 psql -U admin -d webapp_db -h localhost -f "database/01_Schema.sql" || true
    PGPASSWORD=admin123 psql -U admin -d webapp_db -h localhost -f "database/02_CreateTable.sql" || true
    PGPASSWORD=admin123 psql -U admin -d webapp_db -h localhost -f "database/03_ InsertData.sql" || true
    PGPASSWORD=admin123 psql -U admin -d webapp_db -h localhost -f "database/04_CreateRole.sql" || true
fi

echo "=== Cài đặt thư viện Backend ==="
cd backend && npm install && cd ..

echo "=== Cài đặt thư viện Frontend ==="
cd frontend && npm install && cd ..

echo "=== Bắt đầu chạy Project ==="
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=admin
export DB_PASSWORD=admin123
export DB_NAME=webapp_db

# Sử dụng concurrently để chạy song song Backend (cổng 5000) và Frontend (cổng 3000)
concurrently --kill-others \
  "cd backend && npm start" \
  "cd frontend && npm run dev"
'