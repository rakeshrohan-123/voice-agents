from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ..db import get_db
from ..models.user import User
from ..models.client import Client
from ..models.agent import Agent
from ..schemas.auth import TokenResponse
from ..core.security import create_access_token

router = APIRouter()

@router.get("/me", response_model=TokenResponse)
async def read_current_user(user: User = Depends(lambda: None)):
    # Placeholder – actual auth handled via dependency injection in actual project
    raise HTTPException(status_code=401, detail="Not authenticated")

# Admin endpoint to list all users with agent count
@router.get("/users", response_model=list[dict])
async def list_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        "SELECT u.id, u.email, u.role, u.is_active, COUNT(a.id) AS agent_count "
        "FROM users u LEFT JOIN agents a ON a.owner_id = u.id GROUP BY u.id"
    )
    rows = result.fetchall()
    return [
        {
            "id": row[0],
            "email": row[1],
            "role": row[2],
            "is_active": row[3],
            "agent_count": row[4],
        }
        for row in rows
    ]
