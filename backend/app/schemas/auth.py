from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = Field(default="bearer")

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str
