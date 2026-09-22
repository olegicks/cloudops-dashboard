import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState({
    status: 'CONNECTING...',
    uptime_seconds: 0,
    cpu_percent: 0,
    ram_mb: 0,
    version: '...',
    hostname: '...',
    environment: '...'
  })

  const API_URL = ''

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/status`)

      if (!response.ok) {
        throw new Error('Server unavailable')
      }

      const result = await response.json()
      setData(result)
    } catch (error) {
      setData(prev => ({
        ...prev,
        status: 'OFFLINE'
      }))
    }
  }

  useEffect(() => {
    fetchStatus()

    const interval = setInterval(fetchStatus, 3000)

    return () => clearInterval(interval)
  }, [])

  const simulateFailure = async () => {
    setData(prev => ({
      ...prev,
      status: 'OFFLINE'
    }))

    try {
      await fetch(`${API_URL}/api/simulate-failure`, {
        method: 'POST'
      })
    } catch (error) {
      console.log('Server failure simulated')
    }
  }

  const getStatusClass = () => {
    if (data.status === 'ONLINE') return 'online'
    if (data.status === 'OFFLINE') return 'offline'
    return 'connecting'
  }

  const statusClass = getStatusClass()

  return (
    <main className="app">
      <div className="dashboard">

        <header className="header">
          <div>
            <div className="eyebrow">INFRASTRUCTURE MONITORING</div>
            <h1>CloudOps Dashboard</h1>
          </div>

          <div className="live-indicator">
            <span className="live-dot"></span>
            LIVE
          </div>
        </header>

        <section className="status-section">

          <div className="status-header">
            <span className="section-label">SYSTEM STATUS</span>

            <div className={`status ${statusClass}`}>
              <span className="status-dot"></span>
              {data.status}
            </div>
          </div>

          <div className="status-details">

            <div className="info-block">
              <span className="label">ENVIRONMENT</span>
              <span className="value">{data.environment}</span>
            </div>

            <div className="info-block">
              <span className="label">HOSTNAME</span>
              <span className="value">{data.hostname}</span>
            </div>

            <div className="info-block">
              <span className="label">VERSION</span>
              <span className="value">{data.version}</span>
            </div>

          </div>
        </section>

        <section className="metrics-section">

          <div className="section-label">SYSTEM METRICS</div>

          <div className="metrics-grid">

            <div className="metric-card">
              <span className="label">UPTIME</span>
              <span className="metric-value">
                {data.uptime_seconds}
                <span className="metric-unit">sec</span>
              </span>
            </div>

            <div className="metric-card">
              <span className="label">CPU LOAD</span>
              <span className="metric-value">
                {data.cpu_percent}
                <span className="metric-unit">%</span>
              </span>
            </div>

            <div className="metric-card">
              <span className="label">MEMORY USED</span>
              <span className="metric-value">
                {data.ram_mb}
                <span className="metric-unit">MB</span>
              </span>
            </div>

          </div>
        </section>

        <section className="actions-section">

          <div>
            <div className="section-label">OPERATIONS</div>

            <p className="action-description">
              Trigger a controlled application failure to test automatic recovery.
            </p>
          </div>

          <button
            onClick={simulateFailure}
            className="failure-button"
          >
            Simulate Failure
          </button>

        </section>

        <footer className="footer">
          <span>CLOUDOPS</span>
          <span>MONITORING / RECOVERY</span>
        </footer>

      </div>
    </main>
  )
}

export default App