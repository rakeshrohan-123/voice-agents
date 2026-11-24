import os
from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Core
    POSTGRES_USER: str = Field(default="postgres")
    POSTGRES_PASSWORD: str = Field(default="postgres")
    POSTGRES_DB: str = Field(default="voice_agents_db")
    POSTGRES_HOST: str = Field(default="localhost")
    POSTGRES_PORT: str = Field(default="5432")
    DATABASE_URL: Optional[str] = Field(default=None)

    # JWT
    SECRET_KEY: str = Field(default="supersecretjwtkey_12345")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # Sarvam
    SARVAM_API_KEY: str = Field(default="sk_kwsro1j5_HZdptYCXPCEsY2QOprPKFQti")
    SARVAM_ORG_ID: str = Field(default="demo_org")
    SARVAM_WORKSPACE_ID: str = Field(default="demo_workspace")
    WEBHOOK_SECRET: str = Field(default="demo_webhook_secret")

    # Razorpay
    RAZORPAY_KEY_ID: str = Field(default="rzp_test_voice_agents")
    RAZORPAY_KEY_SECRET: str = Field(default="secret_demo")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
