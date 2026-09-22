import { useEffect, useState } from 'react'
import './App.css'

const API = ''

function App() {
  const [data, setData] = useState({
    status: 'CONNECTING',
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
    deploy_time: '...',
  })

  const [events, setEvents] = useState([])

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API}/api/status`)

      if (!res.ok) throw new Error()

      const result = await res.json()

      if (data.status === 'OFFLINE') {
        setEvents((e) => ['System back online', ...e])
      }

      setData(result)
    } catch {
      setData((d) => ({
        ...d,
        status: 'OFFLINE',
      }))
    }
  }

  useEffect(() => {
    fetchStatus()

    const timer = setInterval(fetchStatus, 3000)

    return () => clearInterval(timer)
  }, [])

  const simulateFailure = async () => {
    setEvents(['Failure simulation triggered'])
    setData((d) => ({
      ...d,
      status: 'OFFLINE',
    }))

    try {
      await fetch(`${API}/api/simulate-failure`, {
        method: 'POST',
      })
    } catch {}
  }

  const online = data.status === 'ONLINE'

  const status =
    online
      ? 'online'
      : data.status === 'OFFLINE'
        ? 'offline'
        : 'connecting'

  const uptime = `${Math.floor(data.uptime_seconds / 60)}m ${
    data.uptime_seconds % 60
  }s`

  return (
    <div className="layout">

      <aside>
        <div className="logo">
          <div>☁</div>

          <section>
            <b>CloudOps</b>
            <small>Dashboard</small>
          </section>
        </div>

        <footer>
          <span className={`dot ${status}`} />
          {online ? 'All systems operational' : data.status}

          <small>{data.version}</small>
        </footer>
      </aside>

      <main>

        <header>
          <div>
            <small>INFRASTRUCTURE MONITORING</small>

            <h1>CloudOps Dashboard</h1>

            <p>
              Monitor your infrastructure in real time.
            </p>
          </div>

          <div className="time">
            LIVE MONITORING
          </div>
        </header>

        <section className={`status ${status}`}>
          <div className="status-icon">
            {online ? '✓' : '!'}
          </div>

          <div>
            <h2>
              {online
                ? 'System Online'
                : data.status === 'OFFLINE'
                  ? 'System Offline'
                  : 'Connecting'}
            </h2>

            <p>
              {online
                ? 'All services are running normally.'
                : 'Checking infrastructure health...'}
            </p>
          </div>

          <strong>
            {online ? 'Healthy' : 'Checking'}
          </strong>
        </section>

        <section className="metrics">

          <Metric
            title="CPU Usage"
            value={`${data.cpu_percent}%`}
          />

          <Metric
            title="RAM Usage"
            value={`${data.ram_mb} MB`}
          />

          <Metric
            title="Uptime"
            value={uptime}
          />

          <Metric
            title="Status"
            value={data.status}
          />

        </section>

        <section className="cards">

          <Card title="System Information">

            <Row
              label="Hostname"
              value={data.hostname}
            />

            <Row
              label="Version"
              value={data.version}
            />

            <Row
              label="Environment"
              value={data.environment}
            />

            <Row
              label="Deploy Commit"
              value={data.deploy_commit}
            />

            <Row
              label="Deploy Time"
              value={data.deploy_time}
            />

          </Card>

          <Card title="Cloud Environment">

            <Row
              label="Cloud Provider"
              value={data.cloud_provider}
            />

            <Row
              label="Compute"
              value={data.cloud_compute}
            />

            <Row
              label="Region"
              value={data.cloud_region}
            />

          </Card>

          <Card title="Operations">

            <p>
              Test automatic application recovery.
            </p>

            <button onClick={simulateFailure}>
              Simulate Failure
            </button>

          </Card>

          <Card title="Recovery">

            {events.length > 0 ? (
              events.map((event, index) => (
                <Row
                  key={index}
                  label="Event"
                  value={event}
                />
              ))
            ) : (
              <p>
                No recovery events in this session.
              </p>
            )}

          </Card>

        </section>

        <div className="bottom">
          <span>
            Reliable infrastructure, clearly monitored.
          </span>

          <span>
            BUILD · MONITOR · IMPROVE
          </span>
        </div>

      </main>
    </div>
  )
}

function Metric({ title, value }) {
  return (
    <article className="metric">
      <small>{title}</small>
      <strong>{value}</strong>
    </article>
  )
}

function Card({ title, children }) {
  return (
    <article className="card">
      <h2>{title}</h2>
      {children}
    </article>
  )
}

function Row({ label, value }) {
  return (
    <div className="row">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  )
}

export default App