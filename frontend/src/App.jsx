import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState({ 
    status: '🟡 CONNECTING...', 
    uptime_seconds: 0, 
    cpu_percent: 0, 
    ram_mb: 0, 
    version: '...' 
  })

  const API_URL = "http://68.210.228.88/api/status"

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/status`)
      if (!response.ok) throw new Error("Server down")
      const result = await response.json()
      setData(result)
    } catch (error) {
      setData(prev => ({ ...prev, status: '🔴 OFFLINE' }))
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 3000)
    return () => clearInterval(interval)
  }, [])

  const simulateFailure = async () => {
    try {
      setData(prev => ({ ...prev, status: '🔴 OFFLINE' }))
      await fetch(`${API_URL}/api/simulate-failure`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer demo-secret-123'
        }
      })
    } catch (error) {
      console.log("Server killed successfully")
    }
  }

  return (
    <div className="container">
      <h1>CloudOps Dashboard</h1>
      
      <div className="dashboard-card">
        <h2>System Status: 
          <span className={data.status === 'ONLINE' ? 'text-green' : 'text-red'}>
            {data.status === 'ONLINE' ? ' 🟢 ONLINE' : ` ${data.status}`}
          </span>
        </h2>
        <p><strong>Version:</strong> {data.version}</p>
        <p><strong>Uptime:</strong> {data.uptime_seconds} seconds</p>
        <p><strong>CPU Load:</strong> {data.cpu_percent}%</p>
        <p><strong>Memory Used:</strong> {data.ram_mb} MB</p>
      </div>

      <button onClick={simulateFailure} className="kill-btn">
        Simulate Failure 💀
      </button>
    </div>
  )
}

export default App