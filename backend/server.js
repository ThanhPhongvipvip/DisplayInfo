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

// Helper function to create endpoints
const createEndpoint = (path, query) => {
  app.get(path, async (req, res) => {
    try {
      const result = await pool.query(query);
      res.json({ status: 'success', data: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', message: `Lỗi truy xuất ${path}` });
    }
  });
};

createEndpoint('/api/roles', 'SELECT * FROM auth.roles ORDER BY id DESC LIMIT 50');
createEndpoint('/api/users', `
  SELECT u.*, r.name as role_name 
  FROM auth.users u 
  LEFT JOIN auth.roles r ON u.role_id = r.id 
  ORDER BY u.id DESC LIMIT 50
`);
createEndpoint('/api/categories', 'SELECT * FROM catalog.categories ORDER BY id DESC LIMIT 50');
createEndpoint('/api/products', `
  SELECT p.*, c.name as category_name 
  FROM catalog.products p 
  LEFT JOIN catalog.categories c ON p.category_id = c.id 
  ORDER BY p.id DESC LIMIT 50
`);
createEndpoint('/api/orders', `
  SELECT o.*, u.username 
  FROM sales.orders o 
  LEFT JOIN auth.users u ON o.user_id = u.id 
  ORDER BY o.id DESC LIMIT 50
`);
createEndpoint('/api/order-items', `
  SELECT oi.*, p.name as product_name 
  FROM sales.order_items oi 
  LEFT JOIN catalog.products p ON oi.product_id = p.id 
  ORDER BY oi.order_id DESC LIMIT 100
`);
createEndpoint('/api/stock-movements', `
  SELECT sm.*, p.name as product_name 
  FROM inventory.stock_movements sm 
  LEFT JOIN catalog.products p ON sm.product_id = p.id 
  ORDER BY sm.id DESC LIMIT 50
`);
createEndpoint('/api/audit-logs', `
  SELECT al.*, u.username 
  FROM audit.logs al 
  LEFT JOIN auth.users u ON al.user_id = u.id 
  ORDER BY al.id DESC LIMIT 50
`);

app.listen(port, () => {
  console.log(`Backend API đang chạy ở port ${port}`);
});
