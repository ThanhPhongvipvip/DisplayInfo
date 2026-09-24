import { useState, useEffect } from 'react'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Users', url: '/api/users' },
  { id: 'roles', label: 'Roles', url: '/api/roles' },
  { id: 'categories', label: 'Categories', url: '/api/categories' },
  { id: 'products', label: 'Products', url: '/api/products' },
  { id: 'orders', label: 'Orders', url: '/api/orders' },
  { id: 'orderItems', label: 'Order Items', url: '/api/order-items' },
  { id: 'stock', label: 'Stock Movements', url: '/api/stock-movements' },
  { id: 'audit', label: 'Audit Logs', url: '/api/audit-logs' }
]

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [statusData, setStatusData] = useState(null)
  const [tabData, setTabData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    fetch(`${apiUrl}/api/status`)
      .then(res => res.json())
      .then(data => setStatusData(data))
      .catch(err => setError(err.toString()))
  }, [])

  useEffect(() => {
    const tabInfo = TABS.find(t => t.id === activeTab)
    if (tabInfo && tabInfo.url) {
      setLoading(true)
      fetch(`${apiUrl}${tabInfo.url}`)
        .then(res => res.json())
        .then(data => {
          setTabData(prev => ({ ...prev, [activeTab]: data.data }))
          setLoading(false)
        })
        .catch(err => {
          console.error(`Error fetching ${activeTab}:`, err)
          setLoading(false)
        })
    }
  }, [activeTab])

  const renderTable = (data) => {
    if (!data || data.length === 0) return <p>Không có dữ liệu.</p>
    const columns = Object.keys(data[0])
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left' }}>
              {columns.map(col => (
                <th key={col} style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', textTransform: 'capitalize' }}>
                  {col.replace('_', ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #dee2e6' }}>
                {columns.map(col => (
                  <td key={col} style={{ padding: '0.75rem' }}>
                    {typeof row[col] === 'boolean' 
                      ? (row[col] ? 'Yes' : 'No') 
                      : (row[col] === null ? 'N/A' : row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#343a40', color: 'white', padding: '1rem' }}>
        <h2 style={{ color: '#fff', borderBottom: '1px solid #4f5962', paddingBottom: '1rem' }}>Web Admin</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {TABS.map(tab => (
            <li key={tab.id} style={{ marginBottom: '0.5rem' }}>
              <button
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: activeTab === tab.id ? '#0d6efd' : 'transparent',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal'
                }}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', backgroundColor: '#f8f9fa' }}>
        {activeTab === 'dashboard' ? (
          <div>
            <h1>Dashboard</h1>
            <p>Chào mừng bạn đến với trang quản trị cơ sở dữ liệu Login App.</p>
            
            <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)' }}>
              <h3>🔌 Trạng thái kết nối hệ thống:</h3>
              {error ? (
                <p style={{ color: '#dc3545' }}><strong>Lỗi:</strong> {error}</p>
              ) : statusData ? (
                <div>
                  <p style={{ color: statusData.status === 'success' ? '#198754' : '#dc3545', fontSize: '1.1rem' }}>
                    <strong>{statusData.message}</strong>
                  </p>
                  <p><strong>Thời gian Database hiện tại:</strong> {new Date(statusData.db_time).toLocaleString()}</p>
                </div>
              ) : (
                <p>Đang tải dữ liệu trạng thái kết nối từ Backend API...</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h1>{TABS.find(t => t.id === activeTab)?.label} Data</h1>
            {loading ? (
              <p>Đang tải dữ liệu...</p>
            ) : (
              <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)' }}>
                {renderTable(tabData[activeTab])}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
