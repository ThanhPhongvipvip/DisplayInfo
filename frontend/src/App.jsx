import { useState, useEffect } from 'react'

function App() {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  
  const [orders, setOrders] = useState([])
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    if (user) {
      fetchProducts();
      if (user.role_name === 'ADMIN') {
        fetchOrders();
      }
    }
  }, [user])

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/products`);
      const data = await res.json();
      if (data.status === 'success') setProducts(data.data);
    } catch (err) {
      console.error(err);
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/orders`);
      const data = await res.json();
      if (data.status === 'success') setOrders(data.data);
    } catch (err) {
      console.error(err);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setUser(data.data);
      } else {
        setLoginError(data.message);
      }
    } catch (err) {
      setLoginError('Connection error. Please try again later.');
    }
  }

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.cartQuantity >= product.quantity) {
          alert('Insufficient stock.');
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item);
      }
      if (product.quantity <= 0) {
        alert('Product is out of stock.');
        return prev;
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const checkout = async () => {
    if (cart.length === 0) return;
    try {
      const res = await fetch(`${apiUrl}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, items: cart })
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert('Order placed successfully.');
        setCart([]);
        setShowCart(false);
        fetchProducts(); 
        if (user.role_name === 'ADMIN') fetchOrders();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Checkout failed due to server error.');
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.cartQuantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.cartQuantity, 0);

  // === RENDER LOGIN ===
  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f5f7', fontFamily: '"Inter", "Segoe UI", sans-serif' }}>
        <div style={{ padding: '2.5rem', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '380px' }}>
          <h2 style={{ textAlign: 'center', color: '#111827', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Welcome Back</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem', marginBottom: '2rem' }}>Please sign in to your account</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>Username</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', transition: 'border-color 0.15s ease-in-out' }}
                autoFocus
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', transition: 'border-color 0.15s ease-in-out' }}
                required
              />
            </div>
            {loginError && <p style={{ color: '#ef4444', margin: 0, fontSize: '0.875rem', textAlign: 'center' }}>{loginError}</p>}
            <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '1rem', marginTop: '0.5rem', transition: 'background-color 0.15s ease-in-out' }}>
              Sign In
            </button>
          </form>
          <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center' }}>
            Test accounts: phong/nam/an | Password: 123456
          </div>
        </div>
      </div>
    )
  }

  // === RENDER E-COMMERCE ===
  return (
    <div style={{ fontFamily: '"Inter", "Segoe UI", sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#ffffff', padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb' }}>
        <h1 style={{ margin: 0, color: '#111827', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>TechStore</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>
            Signed in as <strong style={{ color: '#111827' }}>{user.username}</strong> <span style={{ color: '#9ca3af' }}>({user.role_name})</span>
          </span>
          <button 
            onClick={() => setShowCart(true)}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', color: '#111827', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem', transition: 'all 0.15s ease-in-out' }}
          >
            Cart ({cartItemCount})
          </button>
          <button 
            onClick={() => { setUser(null); setUsername(''); setPassword(''); setCart([]); setShowCart(false); }}
            style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.15s ease-in-out' }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Admin Section */}
        {user.role_name === 'ADMIN' && (
          <div style={{ marginBottom: '3rem', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginTop: 0, fontSize: '1.125rem', color: '#111827', marginBottom: '1.5rem' }}>Recent Orders</h2>
            {orders.length === 0 ? <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No orders found.</p> : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Order ID</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Customer</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Date</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 500, textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '1rem', color: '#111827', fontWeight: 500 }}>#{o.id}</td>
                        <td style={{ padding: '1rem', color: '#4b5563' }}>{o.username}</td>
                        <td style={{ padding: '1rem', color: '#4b5563' }}>{new Date(o.order_date).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: '#f3f4f6', color: '#374151', fontSize: '0.75rem', fontWeight: 500 }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: '#111827', fontWeight: 500, textAlign: 'right' }}>{Number(o.total).toLocaleString()} ₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <h2 style={{ fontSize: '1.5rem', color: '#111827', marginBottom: '2rem', fontWeight: 600 }}>Featured Products</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {products.map(p => (
            <div key={p.id} style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s ease-in-out' }}>
              <div style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{p.category_name}</div>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', color: '#111827', fontWeight: 500 }}>{p.name}</h3>
              <div style={{ flex: 1 }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                <div style={{ color: '#111827', fontWeight: 600, fontSize: '1.25rem' }}>{Number(p.price).toLocaleString()} ₫</div>
                <div style={{ fontSize: '0.875rem', color: p.quantity > 0 ? '#059669' : '#dc2626', fontWeight: 500 }}>
                  {p.quantity > 0 ? `In Stock (${p.quantity})` : 'Out of Stock'}
                </div>
              </div>
              <button 
                onClick={() => addToCart(p)}
                disabled={p.quantity <= 0}
                style={{ 
                  width: '100%', padding: '0.75rem', 
                  backgroundColor: p.quantity > 0 ? '#111827' : '#e5e7eb', 
                  color: p.quantity > 0 ? '#ffffff' : '#9ca3af', 
                  border: 'none', borderRadius: '6px', 
                  cursor: p.quantity > 0 ? 'pointer' : 'not-allowed', 
                  fontWeight: 500, transition: 'background-color 0.15s' 
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Drawer Overlay */}
      {showCart && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(17, 24, 39, 0.4)', zIndex: 50, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(2px)' }}>
          <div style={{ width: '400px', backgroundColor: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 15px rgba(0,0,0,0.05)' }}>
            
            {/* Cart Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#111827', fontWeight: 600 }}>Your Cart</h2>
              <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>
            
            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: '#111827', fontWeight: 500 }}>{item.name}</h4>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                        {Number(item.price).toLocaleString()} ₫ <span style={{ padding: '0 0.5rem' }}>×</span> {item.cartQuantity}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>{(item.price * item.cartQuantity).toLocaleString()} ₫</span>
                      <button onClick={() => removeFromCart(item.id)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, textDecoration: 'underline' }}>Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div style={{ padding: '2rem', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1.5rem' }}>
                  <span>Total</span>
                  <span>{cartTotal.toLocaleString()} ₫</span>
                </div>
                <button 
                  onClick={checkout}
                  style={{ width: '100%', padding: '0.875rem', backgroundColor: '#111827', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', transition: 'background-color 0.15s' }}
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
