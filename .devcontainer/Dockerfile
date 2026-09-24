FROM node:18-bookworm

# Cài đặt PostgreSQL và sudo
RUN apt-get update && apt-get install -y postgresql postgresql-contrib sudo

# Khởi tạo Database webapp_db & User admin
USER postgres
RUN /etc/init.d/postgresql start && \
    psql --command "CREATE USER admin WITH PASSWORD 'admin123';" && \
    psql --command "CREATE DATABASE webapp_db OWNER admin;"
USER root

# Cấp quyền cho sudo không cần pass (để a.sh có thể chạy service postgresql start)
RUN echo "ALL ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# Cài đặt concurrently để chạy nhiều process (backend/frontend)
RUN npm install -g concurrently
