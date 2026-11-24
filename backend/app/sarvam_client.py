import httpx
from typing import List, Dict
from .core.config import settings

BASE_OUTBOUND = "https://apps.sarvam.ai/api/outbounds"
HEADERS = {"X-API-Key": settings.SARVAM_API_KEY}

async def start_outbound_call(agent_app_id: str, to_number: str, from_number: str = "",
                            custom_payload: Dict = None) -> Dict:
    """Trigger a single outbound call via Sarvam.
    Returns the JSON response from Sarvam.
    """
    payload = {
        "app_id": agent_app_id,
        "to_number": to_number,
        "from_number": from_number,
    }
    if custom_payload:
        payload.update(custom_payload)
    async with httpx.AsyncClient(headers=HEADERS, timeout=10) as client:
        resp = await client.post(f"{BASE_OUTBOUND}/v1/calls", json=payload)
        resp.raise_for_status()
        return resp.json()
