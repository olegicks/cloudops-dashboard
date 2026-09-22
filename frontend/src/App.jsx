import { useEffect, useState } from 'react'
import './App.css'

const empty = {
  status: 'CONNECTING', uptime_seconds: 0, cpu_percent: 0, ram_mb: 0,
  version: '...', hostname: '...', environment: '...',
  cloud_provider: '...', cloud_compute: '...', cloud_region: '...',
  deploy_commit: '...', deploy_time: '...'
}

export default function App() {
  const [data, setData] = useState(empty)
  const [events, setEvents] = useState([])

  const load = async () => {
    try {
      const r = await fetch('/api/status')
      if (!r.ok) throw new Error()
      const d = await r.json()
      if (data.status === 'OFFLINE') setEvents(e => ['System recovered', ...e])
      setData(d)
    } catch {
      setData(d => ({ ...d, status: 'OFFLINE' }))
    }
  }

  useEffect(() => {
    load()
    const t = setInterval(load, 3000)
    return () => clearInterval(t)
  }, [])

  const fail = async () => {
    setEvents(['Failure simulation triggered'])
    setData(d => ({ ...d, status: 'OFFLINE' }))
    try {
      await fetch('/api/simulate-failure', { method: 'POST' })
    } catch {}
  }

  const online = data.status === 'ONLINE'
  const state = online ? 'online' : data.status === 'OFFLINE' ? 'offline' : 'connecting'
  const uptime = `${Math.floor(data.uptime_seconds / 60)}m ${data.uptime_seconds % 60}s`

  return (
    <div className="layout">
      <aside>
        <div className="logo">
          <span>☁</span>
          <div><b>CloudOps</b><small>Infrastructure</small></div>
        </div>

        <div className="side-status">
          <i className={`dot ${state}`} />
          {online ? 'Operational' : data.status}
          <small>{data.version}</small>
        </div>
      </aside>

      <main>
        <header>
          <div>
            <small>INFRASTRUCTURE MONITORING</small>
            <h1>CloudOps</h1>
          </div>
          <span className="live">LIVE</span>
        </header>

        <section className={`status ${state}`}>
          <span className="status-icon">{online ? '✓' : '!'}</span>
          <div>
            <h2>{online ? 'System Online' : data.status === 'OFFLINE' ? 'System Offline' : 'Connecting'}</h2>
            <p>{online ? 'All services are running normally.' : 'Checking infrastructure health...'}</p>
          </div>
          <b>{online ? 'Healthy' : 'Checking'}</b>
        </section>

        <section className="metrics">
          <Metric title="CPU Usage" value={`${data.cpu_percent}%`} />
          <Metric title="RAM Usage" value={`${data.ram_mb} MB`} />
          <Metric title="Uptime" value={uptime} />
          <Metric title="Status" value={data.status} />
        </section>

        <section className="cards">
          <Card title="System Information">
            <Row label="Hostname" value={data.hostname} />
            <Row label="Version" value={data.version} />
            <Row label="Environment" value={data.environment} />
            <Row label="Deploy Commit" value={data.deploy_commit} />
            <Row label="Deploy Time" value={data.deploy_time} />
          </Card>

          <Card title="Cloud Environment">
            <Row label="Cloud Provider" value={data.cloud_provider} />
            <Row label="Compute" value={data.cloud_compute} />
            <Row label="Region" value={data.cloud_region} />
          </Card>

          <Card title="Operations">
            <p>Test automatic application recovery.</p>
            <button onClick={fail}>Simulate Failure</button>
          </Card>

          <Card title="Recovery">
            {events.length
              ? events.map((e, i) => <Row key={i} label="Event" value={e} />)
              : <p>No recovery events in this session.</p>}
          </Card>
        </section>
      </main>
    </div>
  )
}

function Metric({ title, value }) {
  return <article className="metric"><small>{title}</small><strong>{value}</strong></article>
}

function Card({ title, children }) {
  return <article className="card"><h2>{title}</h2>{children}</article>
}

function Row({ label, value }) {
  return <div className="row"><span>{label}</span><b>{value}</b></div>
}