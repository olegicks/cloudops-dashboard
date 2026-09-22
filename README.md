# CloudOps Dashboard

CloudOps Dashboard is a small cloud infrastructure monitoring project built to demonstrate a practical DevOps workflow.

The application provides a web dashboard for monitoring a running service, checking its health, viewing deployment information and testing container recovery.

The backend runs in Docker on a Microsoft Azure Virtual Machine, while the frontend is deployed separately.

## Live Demo

https://cloudops-dashboard-wheat.vercel.app/

Open the dashboard and click **Simulate Failure** to test the container recovery mechanism.

## What it does

- Shows current CPU and RAM usage
- Displays application uptime and service status
- Shows deployment version and commit information
- Displays cloud and runtime information
- Provides an application health check
- Allows controlled failure simulation
- Uses Docker health checks
- Automatically restarts the container after a failure

## Technologies

### Frontend
- React
- Vite
- CSS

### Backend
- Python
- FastAPI
- Uvicorn
- psutil

### Infrastructure
- Docker
- Docker Compose
- Linux
- Microsoft Azure Virtual Machine

### Deployment
- GitHub
- Vercel
- Azure

## Architecture

```text
GitHub
   |
   v
React + FastAPI
   |
   v
Docker
   |
   v
Azure Virtual Machine
   |
   +-- FastAPI API
   +-- Health Check
   +-- Container Recovery
```

## Local setup

```bash
git clone https://github.com/olegicks/cloudops-dashboard.git
cd cloudops-dashboard

docker-compose up -d --build
```

The API is then available at:

```text
http://localhost:8000
```

Health check:

```text
http://localhost:8000/health
```

## Project structure

```text
cloudops-dashboard/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   └── public/
├── docker-compose.yml
└── README.md
```