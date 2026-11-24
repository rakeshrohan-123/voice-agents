import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api import auth, voice, telephony

app = FastAPI(title="Voice Agents SaaS - Powered by Sarvam AI", version="0.1.0")

# CORS – allow origin from frontend
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(voice.router, prefix="/api/voice", tags=["voice"])
app.include_router(telephony.router, prefix="/api/telephony", tags=["telephony"])

@app.get("/")
async def root():
    return {
        "status": "online",
        "platform": "Sarvam Voice Agents SaaS",
        "sarvam_api_key_configured": bool(settings.SARVAM_API_KEY)
    }
