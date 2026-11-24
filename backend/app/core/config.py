import os
from pydantic import BaseSettings, Field

class Settings(BaseSettings):
    # Core
    POSTGRES_USER: str = Field(..., env="POSTGRES_USER")
    POSTGRES_PASSWORD: str = Field(..., env="POSTGRES_PASSWORD")
    POSTGRES_DB: str = Field(..., env="POSTGRES_DB")
    POSTGRES_HOST: str = Field(default="db", env="POSTGRES_HOST")
    POSTGRES_PORT: str = Field(default="5432", env="POSTGRES_PORT")
    DATABASE_URL: str = None

    # JWT
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # Sarvam
    SARVAM_API_KEY: str = Field(..., env="SARVAM_API_KEY")
    SARVAM_ORG_ID: str = Field(..., env="SARVAM_ORG_ID")
    SARVAM_WORKSPACE_ID: str = Field(..., env="SARVAM_WORKSPACE_ID")
    WEBHOOK_SECRET: str = Field(..., env="WEBHOOK_SECRET")

    # Razorpay
    RAZORPAY_KEY_ID: str = Field(..., env="RAZORPAY_KEY_ID")
    RAZORPAY_KEY_SECRET: str = Field(..., env="RAZORPAY_KEY_SECRET")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    def __post_init__(self):
        # Build DB URL if not provided
        if not self.DATABASE_URL:
            self.DATABASE_URL = (
                f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@"
                f"{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
            )

settings = Settings()
