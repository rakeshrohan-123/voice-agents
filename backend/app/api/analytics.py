import httpx
import os
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime, timedelta, timezone
from ..core.config import settings

router = APIRouter()

IST = timezone(timedelta(hours=5, minutes=30))


def get_analytics_base_url():
    org_id = os.getenv("SARVAM_ORG_ID", settings.SARVAM_ORG_ID)
    workspace_id = os.getenv("SARVAM_WORKSPACE_ID", settings.SARVAM_WORKSPACE_ID)
    app_id = os.getenv("SARVAM_DEFAULT_APP_ID", settings.SARVAM_DEFAULT_APP_ID)
    return f"https://apps.sarvam.ai/api/analytics/v1/{org_id}/{workspace_id}/{app_id}"


def get_api_key():
    return os.getenv("SARVAM_API_KEY", settings.SARVAM_API_KEY)


def analytics_headers():
    return {
        "X-API-Key": get_api_key(),
        "Content-Type": "application/json"
    }


@router.get("/call-logs")
async def get_call_logs(
    hours: int = Query(default=24, description="Fetch logs from last N hours"),
    limit: int = Query(default=50, le=200),
    include_transcript: bool = Query(default=True)
):
    """
    Fetches live call logs from Sarvam Analytics API.
    Returns interaction list with status, duration, transcript.
    """
    base_url = get_analytics_base_url()
    now = datetime.now(IST)
    start = now - timedelta(hours=hours)

    # Format as ISO 8601 with timezone
    start_str = start.strftime("%Y-%m-%dT%H:%M:%S+05:30")
    end_str = now.strftime("%Y-%m-%dT%H:%M:%S+05:30")

    params = {
        "start_datetime": start_str,
        "end_datetime": end_str,
        "limit": limit,
        "include_transcript": str(include_transcript).lower()
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(
                f"{base_url}/interactions",
                headers=analytics_headers(),
                params=params
            )
            if resp.status_code == 200:
                return resp.json()
            raise HTTPException(
                status_code=resp.status_code,
                detail={"error": "Sarvam Analytics API error", "response": resp.text}
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Analytics fetch error: {str(e)}")


@router.get("/call-logs/{interaction_id:path}/transcript")
async def get_call_transcript(interaction_id: str):
    """Fetch the full conversation transcript for a specific call."""
    base_url = get_analytics_base_url()
    # interaction_id format: YYYYMMDD/uuid — needs URL encoding of /
    encoded_id = interaction_id.replace("/", "%2F")
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(
                f"{base_url}/transcripts/{encoded_id}",
                headers=analytics_headers()
            )
            if resp.status_code == 200:
                return resp.json()
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


from fastapi.responses import StreamingResponse

@router.api_route("/call-logs/{interaction_id:path}/stream-recording", methods=["GET", "HEAD"])
async def stream_call_recording(interaction_id: str):
    """
    Proxy-stream call recording from Sarvam API so browser <audio> tag
    can play it without needing client-side API keys.
    """
    base_url = get_analytics_base_url()
    encoded_id = interaction_id.replace("/", "%2F")
    url = f"{base_url}/recordings/{encoded_id}"

    client = httpx.AsyncClient(timeout=30.0)
    try:
        req = client.build_request("GET", url, headers={"X-API-Key": get_api_key()})
        resp = await client.send(req, stream=True)
        if resp.status_code != 200:
            await resp.aclose()
            await client.aclose()
            raise HTTPException(status_code=resp.status_code, detail="Recording not available")

        async def audio_stream():
            try:
                async for chunk in resp.aiter_bytes():
                    yield chunk
            finally:
                await resp.aclose()
                await client.aclose()

        return StreamingResponse(
            audio_stream(),
            media_type=resp.headers.get("content-type", "audio/wav"),
            headers={
                "Accept-Ranges": "bytes",
                "Content-Disposition": f'inline; filename="call_{encoded_id}.wav"'
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        await client.aclose()
        raise HTTPException(status_code=502, detail=f"Failed to stream recording: {str(e)}")


@router.get("/call-logs/{interaction_id:path}/recording")
async def get_call_recording_url(interaction_id: str):
    """Returns proxy and direct recording URLs for playback in the dashboard."""
    base_url = get_analytics_base_url()
    encoded_id = interaction_id.replace("/", "%2F")
    return {
        "interaction_id": interaction_id,
        "proxy_stream_url": f"/api/analytics/call-logs/{interaction_id}/stream-recording",
        "sarvam_direct_url": f"{base_url}/recordings/{encoded_id}",
    }


@router.get("/call-status/{attempt_id}")
async def get_outbound_call_status(attempt_id: str):
    """Check live status of a dispatched outbound call by attempt_id."""
    org_id = os.getenv("SARVAM_ORG_ID", settings.SARVAM_ORG_ID)
    workspace_id = os.getenv("SARVAM_WORKSPACE_ID", settings.SARVAM_WORKSPACE_ID)

    status_url = (
        f"https://apps.sarvam.ai/api/outbounds/v1/orgs/{org_id}"
        f"/workspaces/{workspace_id}/outbounds/{attempt_id}"
    )
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(status_url, headers={
                "X-API-Key": get_api_key(),
                "Content-Type": "application/json"
            })
            if resp.status_code == 200:
                return resp.json()
            return {"attempt_id": attempt_id, "status": "unknown", "code": resp.status_code}
    except Exception as e:
        return {"attempt_id": attempt_id, "status": "error", "detail": str(e)}
