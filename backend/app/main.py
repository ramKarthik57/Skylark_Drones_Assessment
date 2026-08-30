import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router

app = FastAPI(
    title="Skylark Drones — Executive Intelligence Agent API",
    description="Executive-level BI Agent querying Monday.com Deals and Work Orders boards with data normalization, deterministic analytics, and AI reasoning.",
    version="1.1.0"
)

# Configure Production CORS Governance
allowed_origins = [
    "https://skylark-executive-intelligence-ramkarthik.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Skylark Drones BI Agent API",
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
