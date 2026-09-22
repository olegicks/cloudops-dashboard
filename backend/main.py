from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psutil
import time
import os
import platform

app = FastAPI(title="CloudOps API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

START_TIME = time.time()

APP_VERSION = os.getenv("APP_VERSION", "v1.0.0")
ENVIRONMENT = os.getenv("ENVIRONMENT", "Production")
CLOUD_PROVIDER = os.getenv("CLOUD_PROVIDER", "Microsoft Azure")
CLOUD_COMPUTE = os.getenv("CLOUD_COMPUTE", "Azure Virtual Machine")
CLOUD_REGION = os.getenv("CLOUD_REGION", "Austria East")
DEPLOY_COMMIT = os.getenv("DEPLOY_COMMIT", "local")
DEPLOY_TIME = os.getenv("DEPLOY_TIME", "unknown")


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/api/status")
def get_status():
    return {
        "status": "ONLINE",
        "uptime_seconds": int(time.time() - START_TIME),
        "cpu_percent": psutil.cpu_percent(interval=0.1),
        "ram_mb": int(psutil.virtual_memory().used / (1024 * 1024)),

        "version": APP_VERSION,
        "hostname": platform.node(),
        "environment": ENVIRONMENT,

        "cloud_provider": CLOUD_PROVIDER,
        "cloud_compute": CLOUD_COMPUTE,
        "cloud_region": CLOUD_REGION,

        "deploy_commit": DEPLOY_COMMIT,
        "deploy_time": DEPLOY_TIME,
    }


@app.post("/api/simulate-failure")
def simulate_failure():
    os._exit(1)