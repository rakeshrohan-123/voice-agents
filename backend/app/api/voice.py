import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..core.config import settings

router = APIRouter()

class TTSRequest(BaseModel):
    text: str
    language_code: str = "hi-IN"
    speaker: str = "priya"
    pace: float = 1.0

class ChatRequest(BaseModel):
    agent_id: str
    message: str
    language: str = "hi-IN"

@router.post("/tts")
async def generate_sarvam_tts(req: TTSRequest):
    """Generates live speech audio using Sarvam AI Bulbul:v3 API"""
    if not settings.SARVAM_API_KEY:
        raise HTTPException(status_code=400, detail="Sarvam API key is not configured")

    headers = {
        "API-Subscription-Key": settings.SARVAM_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "inputs": [req.text],
        "target_language_code": req.language_code,
        "speaker": req.speaker,
        "pitch": 0,
        "pace": req.pace,
        "loudness": 1.5,
        "speech_sample_rate": 8000,
        "enable_preprocessing": True,
        "model": "bulbul:v3"
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post("https://api.sarvam.ai/text-to-speech", json=payload, headers=headers)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail=resp.text)
            data = resp.json()
            audios = data.get("audios", [])
            if not audios:
                raise HTTPException(status_code=500, detail="No audio returned from Sarvam")
            return {"audio_base64": audios[0], "status": "success"}
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Sarvam API error: {str(e)}")

@router.post("/chat")
async def playground_chat(req: ChatRequest):
    """Simulates agent reasoning and generates native Sarvam voice response"""
    q = req.message.lower()
    
    # Contextual reasoning
    if "loan" in q or "emi" in q or "ha" in q or "yes" in q:
        reply = "नमस्ते! पुष्टि करने के लिए धन्यवाद। आपका 4,500 रुपये का ईएमआई बाकी है। क्या मैं आपके रजिस्टर्ड मोबाइल पर अभी पेमेंट लिंक भेज दूँ?"
        speaker = "priya"
        lang = "hi-IN"
    elif "tamil" in req.language.lower() or "வணக்கம்" in q:
        reply = "வணக்கம்! உங்கள் விவரங்கள் பதிவு செய்யப்பட்டுள்ளன. எங்கள் குழு விரைவில் உங்களை தொடர்பு கொள்ளும்."
        speaker = "gokul"
        lang = "ta-IN"
    else:
        reply = f"Thank you for contacting us. I have verified your account details with caller ID {req.agent_id}. How else can I assist you today?"
        speaker = "priya"
        lang = "en-IN"

    # Call Sarvam TTS
    tts_payload = {
        "inputs": [reply],
        "target_language_code": lang,
        "speaker": speaker,
        "pitch": 0,
        "pace": 1.0,
        "loudness": 1.5,
        "speech_sample_rate": 8000,
        "enable_preprocessing": True,
        "model": "bulbul:v3"
    }

    headers = {
        "API-Subscription-Key": settings.SARVAM_API_KEY,
        "Content-Type": "application/json"
    }

    audio_base64 = None
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post("https://api.sarvam.ai/text-to-speech", json=tts_payload, headers=headers)
            if resp.status_code == 200:
                audio_base64 = resp.json().get("audios", [None])[0]
    except Exception:
        pass

    return {
        "reply": reply,
        "speaker": speaker,
        "language": lang,
        "audio_base64": audio_base64
    }
