const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Kết nối với PostgreSQL Database
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get('/api/status', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'success',
      message: 'Kết nối Backend (NodeJS) và Database (PostgreSQL) thành công!',
      db_time: result.rows[0].now
    });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ status: 'error', message: 'Lỗi kết nối database.' });
  }
});

// Thêm API endpoint để test query users từ database
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM auth.users LIMIT 10');
    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Lỗi truy xuất dữ liệu users, có thể table auth.users chưa được tạo hoặc database chưa được khởi tạo thành công.' });
  }
});

app.listen(port, () => {
  console.log(`Backend API đang chạy ở port ${port}`);
});

