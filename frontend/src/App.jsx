import { useState, useEffect } from 'react'

function App() {
  const [statusData, setStatusData] = useState(null)
  const [usersData, setUsersData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Gọi API để kiểm tra trạng thái (fallback url về localhost nếu biến môi trường bị lỗi)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    // 1. Fetch trạng thái kết nối DB
    fetch(`${apiUrl}/api/status`)
      .then(res => res.json())
      .then(data => setStatusData(data))
      .catch(err => setError(err.toString()));

    // 2. Fetch danh sách users mẫu từ DB
    fetch(`${apiUrl}/api/users`)
      .then(res => res.json())
      .then(data => setUsersData(data))
      .catch(err => console.error("Could not fetch users:", err));
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Hệ Thống Web App (Docker)</h1>
      <h2>Frontend (ReactJS) ⚡ Backend (NodeJS) ⚡ Database (PostgreSQL)</h2>
      
      <div style={{ marginTop: '2rem', padding: '1.5rem`', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h3>🔌 Trạng thái kết nối:</h3>
        {error ? (
          <p style={{ color: '#dc3545' }}><strong>Lỗi:</strong> {error}</p>
        ) : statusData ? (
          <div>
            <p style={{ color: statusData.status === 'success' ? '#198754' : '#dc3545' }}>
              <strong>{statusData.message}</strong>
            </p>
            <p><strong>Thời gian Database hiện tại:</strong> {new Date(statusData.db_time).toLocaleString()}</p>
          </div>
        ) : (
          <p>Đang tải dữ liệu trạng thái kết nối từ Backend API...</p>
        )}
      </div>

      {usersData && usersData.status === 'success' && (
        <div style={{ marginTop: '2rem' }}>
          <h3>👥 Dữ liệu mẫu (Bảng auth.users):</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#e9ecef', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>ID</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Username</th>
                <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6' }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {usersData.data.map(user => (
                <tr key={user.id || user.username} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '0.75rem' }}>{user.id}</td>
                  <td style={{ padding: '0.75rem' }}>{user.username}</td>
                  <td style={{ padding: '0.75rem' }}>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App

