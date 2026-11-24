import httpx
import os
import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from ..core.config import settings

router = APIRouter()


class OutboundCallRequest(BaseModel):
    to_number: str
    from_number: str = "+918064264461"
    agent_id: str = "agent_1"
    agent_name: Optional[str] = "Loan Recovery & EMI Collector (Hindi)"
    language_code: Optional[str] = "hi-IN"
    greeting: Optional[str] = None
    customer_name: Optional[str] = None
    custom_context: Optional[Dict] = None


def get_sarvam_creds():
    return {
        "api_key": os.getenv("SARVAM_API_KEY", settings.SARVAM_API_KEY),
        "org_id": os.getenv("SARVAM_ORG_ID", settings.SARVAM_ORG_ID),
        "workspace_id": os.getenv("SARVAM_WORKSPACE_ID", settings.SARVAM_WORKSPACE_ID),
        "app_id": os.getenv("SARVAM_DEFAULT_APP_ID", ""),
        "connection_id": os.getenv("SARVAM_CONNECTION_ID", ""),
    }


@router.post("/outbound-call")
async def trigger_outbound_call(req: OutboundCallRequest):
    """
    Triggers a REAL outbound phone call via Sarvam Samvaad API.
    The phone at `to_number` will ring from `+918064264461` (Sarvam Vobiz).
    The voice agent runs on our platform; Sarvam handles telephony carrier routing.

    Required env vars:
        SARVAM_API_KEY       - Samvaad workspace API key (sk_samvaad_...)
        SARVAM_ORG_ID        - Sarvam organization ID
        SARVAM_WORKSPACE_ID  - Sarvam workspace ID
        SARVAM_DEFAULT_APP_ID  - App ID from Samvaad dashboard
        SARVAM_CONNECTION_ID   - Connection ID from Samvaad dashboard
    """
    if not req.to_number:
        raise HTTPException(status_code=400, detail="Target phone number (to_number) is required")

    # Normalize phone number to E.164
    to_num = req.to_number.strip().replace(" ", "").replace("-", "")
    if not to_num.startswith("+"):
        to_num = "+91" + to_num if not to_num.startswith("91") else "+" + to_num

    from_num = req.from_number.strip().replace(" ", "").replace("-", "")

    creds = get_sarvam_creds()

    if not creds["api_key"]:
        raise HTTPException(status_code=500, detail="SARVAM_API_KEY not configured")
    if not creds["org_id"] or creds["org_id"] == "demo_org":
        raise HTTPException(status_code=500, detail="SARVAM_ORG_ID not configured")
    if not creds["workspace_id"] or creds["workspace_id"] == "demo_workspace":
        raise HTTPException(status_code=500, detail="SARVAM_WORKSPACE_ID not configured")
    if not creds["app_id"]:
        raise HTTPException(status_code=500, detail="SARVAM_DEFAULT_APP_ID not configured. Add it to .env from your Samvaad dashboard.")
    if not creds["connection_id"]:
        raise HTTPException(status_code=500, detail="SARVAM_CONNECTION_ID not configured. Add it to .env from your Samvaad dashboard.")

    # Build the Sarvam outbound call API URL
    outbound_url = (
        f"https://apps.sarvam.ai/api/outbounds/v1/orgs/{creds['org_id']}"
        f"/workspaces/{creds['workspace_id']}/outbounds"
    )

    # Sarvam Samvaad outbound call payload
    sarvam_payload = {
        "app_config": {
            "app_id": creds["app_id"],
            "app_version": 1,
            "connection_config": {
                "connection_id": creds["connection_id"],
                "agent_phone_number": from_num
            }
        },
        "user_config": {
            "user_phone_number": to_num
        }
    }

    sarvam_headers = {
        "X-API-Key": creds["api_key"],
        "Content-Type": "application/json"
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(outbound_url, json=sarvam_payload, headers=sarvam_headers)

            response_data = {}
            try:
                response_data = resp.json()
            except Exception:
                response_data = {"raw": resp.text}

            if resp.status_code not in (200, 201, 202):
                raise HTTPException(
                    status_code=resp.status_code,
                    detail={
                        "error": "Sarvam outbound call API failed",
                        "sarvam_status": resp.status_code,
                        "sarvam_response": response_data,
                        "hint": "Check your SARVAM_DEFAULT_APP_ID and SARVAM_CONNECTION_ID in .env"
                    }
                )

            # Call successfully dispatched — phone will ring!
            session_id = response_data.get("outbound_id") or response_data.get("id") or f"call_{int(time.time())}_{to_num[-4:]}"

            return {
                "status": "ringing",
                "session_id": session_id,
                "mode": "real_telephony",
                "to_number": to_num,
                "from_number": from_num,
                "agent": {
                    "id": req.agent_id,
                    "name": req.agent_name,
                    "language": req.language_code or "hi-IN",
                    "app_id": creds["app_id"],
                },
                "sarvam_response": response_data,
                "telephony": {
                    "carrier": "Sarvam Vobiz Telecom",
                    "trunk_status": "Outbound Dispatched",
                    "cli": from_num,
                    "target": to_num
                },
                "message": f"📞 Real call dispatched! {to_num} should ring momentarily from {from_num}."
            }

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Sarvam API timed out. Check your network and try again.")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Outbound call dispatch error: {str(e)}")


@router.get("/call-status/{session_id}")
async def get_call_status(session_id: str):
    """Check the live status of a dispatched outbound call."""
    creds = get_sarvam_creds()
    if not creds["api_key"] or not creds["org_id"] or not creds["workspace_id"]:
        raise HTTPException(status_code=500, detail="Sarvam credentials not configured")

    status_url = (
        f"https://apps.sarvam.ai/api/outbounds/v1/orgs/{creds['org_id']}"
        f"/workspaces/{creds['workspace_id']}/outbounds/{session_id}"
    )
    headers = {
        "X-API-Key": creds["api_key"],
        "Content-Type": "application/json"
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(status_url, headers=headers)
            if resp.status_code == 200:
                return resp.json()
            return {"session_id": session_id, "status": "unknown", "sarvam_status": resp.status_code}
    except Exception as e:
        return {"session_id": session_id, "status": "error", "detail": str(e)}
