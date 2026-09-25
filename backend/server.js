const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Login API
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ status: 'error', message: 'Vui lòng nhập đầy đủ username và password' });
  }
  
  try {
    const result = await pool.query(`
      SELECT u.*, r.name as role_name 
      FROM auth.users u 
      LEFT JOIN auth.roles r ON u.role_id = r.id 
      WHERE u.username = $1
    `, [username]);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (user.password === password) {
        // Remove password from response
        delete user.password;
        res.json({ status: 'success', data: user });
      } else {
        res.status(401).json({ status: 'error', message: 'Mật khẩu không chính xác' });
      }
    } else {
      res.status(401).json({ status: 'error', message: 'Tài khoản không tồn tại' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Lỗi server' });
  }
});

// Register API
app.post('/api/register', async (req, res) => {
  const { username, password, email, phone } = req.body;
  if (!username || !password || !email || !phone) {
    return res.status(400).json({ status: 'error', message: 'Vui lòng nhập đầy đủ thông tin' });
  }

  try {
    // Check if user already exists
    const userExist = await pool.query('SELECT id FROM auth.users WHERE username = $1', [username]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Tên đăng nhập đã tồn tại' });
    }

    // Insert new user with role_id = 3 (CUSTOMER)
    const result = await pool.query(`
      INSERT INTO auth.users (username, password, role_id) 
      VALUES ($1, $2, 3) 
      RETURNING id, username
    `, [username, password]);

    res.json({ status: 'success', message: 'Đăng ký thành công', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Lỗi server khi đăng ký' });
  }
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM catalog.products p 
      LEFT JOIN catalog.categories c ON p.category_id = c.id 
      ORDER BY p.id ASC
    `);
    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Lỗi lấy sản phẩm' });
  }
});

// Checkout API
app.post('/api/checkout', async (req, res) => {
  const { userId, items } = req.body;
  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ status: 'error', message: 'Dữ liệu không hợp lệ' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Create order
    const orderResult = await client.query(`
      INSERT INTO sales.orders (user_id, status) 
      VALUES ($1, 'PENDING') RETURNING id
    `, [userId]);
    const orderId = orderResult.rows[0].id;

    // Create order items and update stock
    for (const item of items) {
      // Add order item
      await client.query(`
        INSERT INTO sales.order_items (order_id, product_id, quantity, price) 
        VALUES ($1, $2, $3, $4)
      `, [orderId, item.id, item.cartQuantity, item.price]);

      // Deduct quantity from products table
      await client.query(`
        UPDATE catalog.products 
        SET quantity = quantity - $1 
        WHERE id = $2
      `, [item.cartQuantity, item.id]);

      // Add stock movement (OUT)
      await client.query(`
        INSERT INTO inventory.stock_movements (product_id, quantity, movement_type) 
        VALUES ($1, $2, 'OUT')
      `, [item.id, item.cartQuantity]);
    }

    // Log action
    await client.query(`
      INSERT INTO audit.logs (user_id, action, description) 
      VALUES ($1, 'CHECKOUT', $2)
    `, [userId, `Checked out order #${orderId}`]);

    await client.query('COMMIT');
    res.json({ status: 'success', message: 'Đặt hàng thành công!', orderId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Checkout error:', err);
    res.status(500).json({ status: 'error', message: 'Lỗi khi thanh toán' });
  } finally {
    client.release();
  }
});

// Admin stats
app.get('/api/orders', async (req, res) => {
  const result = await pool.query(`
    SELECT o.id, u.username, o.order_date, o.status, SUM(oi.quantity * oi.price) as total
    FROM sales.orders o
    JOIN auth.users u ON o.user_id = u.id
    JOIN sales.order_items oi ON o.id = oi.order_id
    GROUP BY o.id, u.username
    ORDER BY o.id DESC
  `);
  res.json({ status: 'success', data: result.rows });
});

app.listen(port, () => {
  console.log(`Backend API đang chạy ở port ${port}`);
});
