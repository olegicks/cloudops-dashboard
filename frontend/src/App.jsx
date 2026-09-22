import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState({
    status: 'CONNECTING...',
    uptime_seconds: 0,
    cpu_percent: 0,
    ram_mb: 0,
    version: '...',
    hostname: '...',
    environment: '...',
    cloud_provider: '...',
    cloud_compute: '...',
    cloud_region: '...',
    deploy_commit: '...',
    deploy_time: '...'
  })

  const [recoveryEvents, setRecoveryEvents] = useState([])

  const wasOffline = useRef(false)

  const API_URL = ''

  const addRecoveryEvent = (message) => {
    setRecoveryEvents(prev => [
      ...prev,
      {
        message,
        time: new Date().toLocaleTimeString()
      }
    ])
  }

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/status`)

      if (!response.ok) {
        throw new Error('Server unavailable')
      }

      const result = await response.json()

      if (wasOffline.current) {
        addRecoveryEvent('Health check passed')
        addRecoveryEvent('System back online')
        wasOffline.current = false
      }

      setData(result)

    } catch (error) {
      setData(prev => ({
        ...prev,
        status: 'OFFLINE'
      }))

      wasOffline.current = true
    }
  }

  useEffect(() => {
    fetchStatus()

    const interval = setInterval(fetchStatus, 3000)

    return () => clearInterval(interval)
  }, [])

  const simulateFailure = async () => {
    setRecoveryEvents([])

    addRecoveryEvent('Failure simulation triggered')

    setData(prev => ({
      ...prev,
      status: 'OFFLINE'
    }))

    try {
      await fetch(`${API_URL}/api/simulate-failure`, {
        method: 'POST'
      })
    } catch (error) {
      addRecoveryEvent('Application process stopped')
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
            <div className="eyebrow">
              INFRASTRUCTURE MONITORING
            </div>

            <h1>CloudOps Dashboard</h1>
          </div>

          <div className="live-indicator">
            <span className="live-dot"></span>
            LIVE
          </div>
        </header>

        {/* STATUS */}

        <section className="section">

          <div className="section-heading">
            <span className="section-label">
              SYSTEM STATUS
            </span>

            <div className={`status ${statusClass}`}>
              <span className="status-dot"></span>
              {data.status}
            </div>
          </div>

          <div className="info-grid">

            <div className="info-block">
              <span className="label">ENVIRONMENT</span>
              <span className="value">
                {data.environment}
              </span>
            </div>

            <div className="info-block">
              <span className="label">HOSTNAME</span>
              <span className="value">
                {data.hostname}
              </span>
            </div>

            <div className="info-block">
              <span className="label">VERSION</span>
              <span className="value">
                {data.version}
              </span>
            </div>

          </div>

        </section>

        {/* METRICS */}

        <section className="section">

          <div className="section-label section-title">
            SYSTEM METRICS
          </div>

          <div className="metrics-grid">

            <div className="metric">
              <span className="label">UPTIME</span>

              <strong>
                {data.uptime_seconds}
                <small> sec</small>
              </strong>
            </div>

            <div className="metric">
              <span className="label">CPU LOAD</span>

              <strong>
                {data.cpu_percent}
                <small> %</small>
              </strong>
            </div>

            <div className="metric">
              <span className="label">MEMORY</span>

              <strong>
                {data.ram_mb}
                <small> MB</small>
              </strong>
            </div>

          </div>

        </section>

        {/* INFRASTRUCTURE */}

        <section className="section">

          <div className="section-label section-title">
            INFRASTRUCTURE
          </div>

          <div className="info-grid">

            <div className="info-block">
              <span className="label">
                CLOUD PROVIDER
              </span>

              <span className="value">
                {data.cloud_provider}
              </span>
            </div>

            <div className="info-block">
              <span className="label">
                COMPUTE
              </span>

              <span className="value">
                {data.cloud_compute}
              </span>
            </div>

            <div className="info-block">
              <span className="label">
                REGION
              </span>

              <span className="value">
                {data.cloud_region}
              </span>
            </div>

          </div>

        </section>

        {/* DEPLOYMENT */}

        <section className="section">

          <div className="section-label section-title">
            DEPLOYMENT
          </div>

          <div className="deployment">

            <div>
              <span className="label">
                VERSION
              </span>

              <strong>
                {data.version}
              </strong>
            </div>

            <div>
              <span className="label">
                COMMIT
              </span>

              <strong>
                {data.deploy_commit}
              </strong>
            </div>

            <div>
              <span className="label">
                DEPLOYED
              </span>

              <strong>
                {data.deploy_time}
              </strong>
            </div>

          </div>

        </section>

        {/* RECOVERY */}

        <section className="section">

          <div className="section-label section-title">
            RECOVERY
          </div>

          <div className="recovery">

            {recoveryEvents.length === 0 ? (
              <div className="empty-state">
                No recovery events recorded.
              </div>
            ) : (
              recoveryEvents.map((event, index) => (
                <div
                  className="recovery-event"
                  key={`${event.time}-${index}`}
                >
                  <span className="recovery-dot"></span>

                  <span className="recovery-message">
                    {event.message}
                  </span>

                  <span className="recovery-time">
                    {event.time}
                  </span>
                </div>
              ))
            )}

          </div>

        </section>

        {/* OPERATIONS */}

        <section className="operations">

          <div>
            <div className="section-label">
              OPERATIONS
            </div>

            <p>
              Trigger a controlled application failure
              to test automatic recovery.
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