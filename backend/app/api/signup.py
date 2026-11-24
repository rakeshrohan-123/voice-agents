from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ..db import get_db
from ..models.user import User
from ..models.client import Client
from ..schemas.auth import LoginRequest, TokenResponse
from ..core.security import hash_password, create_access_token
from ..core.config import settings

router = APIRouter()

@router.post('/signup', response_model=TokenResponse)
async def signup(email: str, password: str, client_name: str, db: AsyncSession = Depends(get_db)):
    # Check if user exists
    result = await db.execute('SELECT id FROM users WHERE email = :email', {'email': email})
    if result.first():
        raise HTTPException(status_code=400, detail='Email already registered')
    # Create client
    new_client = Client(name=client_name)
    db.add(new_client)
    await db.flush()  # get client.id
    # Create user linked to client (simplified relationship)
    new_user = User(email=email, password_hash=hash_password(password), role='client')
    # attach client via relationship if defined; for now we skip FK
    db.add(new_user)
    await db.commit()
    access_token = create_access_token(data={"sub": str(new_user.id), "role": new_user.role})
    return TokenResponse(access_token=access_token)
