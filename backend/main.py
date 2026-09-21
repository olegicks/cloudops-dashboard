import os
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psutil
import time
import sys

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

START_TIME = time.time()
APP_VERSION = os.getenv("APP_VERSION", "v0.0.0")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "demo-secret-123")

@app.get("/api/status")
def get_status():
    return {
        "status": "ONLINE",
        "version": APP_VERSION,
        "uptime_seconds": int(time.time() - START_TIME),
        "cpu_percent": psutil.cpu_percent(interval=0.1),
        "ram_mb": int(psutil.virtual_memory().used / (1024 * 1024)),
    }

@app.post("/api/simulate-failure")
def simulate_failure(authorization: str = Header(None)):
    if authorization != f"Bearer {ADMIN_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")
    sys.exit(1)