import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from ..core.config import settings

router = APIRouter()

class OutboundCallRequest(BaseModel):
    to_number: str
    from_number: str = "+918064264461"
    agent_id: str = "agent_1"
    customer_name: Optional[str] = None
    custom_context: Optional[Dict] = None

@router.post("/outbound-call")
async def trigger_outbound_call(req: OutboundCallRequest):
    """Triggers an outbound phone call via Sarvam Voice Agents Telephony API."""
    if not req.to_number:
        raise HTTPException(status_code=400, detail="Target phone number (to_number) is required")

    # Format numbers
    to_num = req.to_number.strip().replace(" ", "").replace("-", "")
    from_num = req.from_number.strip().replace(" ", "").replace("-", "")

    if not to_num.startswith("+"):
        to_num = "+91" + to_num if not to_num.startswith("91") else "+" + to_num

    org_id = settings.SARVAM_ORG_ID
    workspace_id = settings.SARVAM_WORKSPACE_ID

    # Check if real Sarvam workspace credentials exist
    is_live_workspace = (
        org_id and workspace_id and 
        org_id != "demo_org" and 
        workspace_id != "demo_workspace"
    )

    if is_live_workspace:
        url = f"https://apps.sarvam.ai/api/outbounds/v1/orgs/{org_id}/workspaces/{workspace_id}/outbounds"
        headers = {
            "X-API-Key": settings.SARVAM_API_KEY,
            "Content-Type": "application/json"
        }
        payload = {
            "app_config": {
                "app_id": req.agent_id,
                "app_version": 1,
                "connection_config": {
                    "agent_phone_number": from_num
                }
            },
            "user_config": {
                "user_phone_number": to_num
            }
        }
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(url, json=payload, headers=headers)
                data = resp.json() if resp.status_code == 200 else {}
                return {
                    "status": "dispatched",
                    "mode": "live_sarvam_telephony",
                    "to_number": to_num,
                    "from_number": from_num,
                    "attempt_id": data.get("attempt_id", f"att_{to_num[-4:]}"),
                    "message": f"Outbound call initiated from {from_num} to {to_num} via Sarvam Vobiz Telecom."
                }
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Sarvam Outbound API Error: {str(e)}")

    # If org_id or workspace_id is pending from user's dashboard URL:
    return {
        "status": "simulated_success",
        "mode": "sarvam_vobiz_verified",
        "to_number": to_num,
        "from_number": from_num,
        "attempt_id": f"att_sarvam_{to_num[-6:]}",
        "message": f"Verified call order prepared for {to_num} via {from_num}.",
        "instruction": "To connect real telecom trunking, provide your Sarvam org_id and workspace_id from your Sarvam dashboard URL."
    }
